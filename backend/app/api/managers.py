from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.security import get_current_active_user, require_role
from app.core.database import get_collection
from app.models.user import UserResponse, UserCreate, ShiftUpdate
from app.models.work_session import WorkSessionStats
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/employees", response_model=List[UserResponse])
async def get_managed_employees(
    current_user: dict = Depends(require_role(["manager"]))
):
    """Get all employees managed by this manager"""
    users_collection = get_collection("users")
    
    cursor = users_collection.find({
        "manager_id": str(current_user["_id"]),
        "role": "employee"
    })
    
    employees = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        employees.append(UserResponse(**user))
    
    return employees

@router.post("/employees", response_model=UserResponse)
async def create_employee(
    employee: UserCreate,
    current_user: dict = Depends(require_role(["manager"]))
):
    """Create a new employee under this manager"""
    from app.core.security import get_password_hash
    
    users_collection = get_collection("users")
    
    # Check if user exists
    existing_user = await users_collection.find_one({"email": employee.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Force role to be employee
    employee_dict = employee.dict()
    employee_dict["role"] = "employee"
    employee_dict["password"] = get_password_hash(employee_dict["password"])
    employee_dict["is_active"] = True
    employee_dict["created_at"] = datetime.utcnow()
    employee_dict["manager_id"] = str(current_user["_id"])
    
    result = await users_collection.insert_one(employee_dict)
    
    created_employee = await users_collection.find_one({"_id": result.inserted_id})
    created_employee["id"] = str(created_employee["_id"])
    
    return UserResponse(**created_employee)

@router.get("/work-hours")
async def get_manager_work_hours(
    date: str = None,
    current_user: dict = Depends(require_role(["manager"]))
):
    """Get manager's own work hours"""
    sessions_collection = get_collection("work_sessions")
    
    # Default to today
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Parse date
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Get sessions for the day
    start_of_day = target_date.replace(hour=0, minute=0, second=0)
    end_of_day = target_date.replace(hour=23, minute=59, second=59)
    
    cursor = sessions_collection.find({
        "user_id": str(current_user["_id"]),
        "start_time": {
            "$gte": start_of_day,
            "$lte": end_of_day
        }
    })
    
    sessions = []
    total_active_seconds = 0
    
    async for session in cursor:
        session["id"] = str(session["_id"])
        total_active_seconds += session.get("total_active_time", 0)
        sessions.append(session)
    
    return {
        "date": date,
        "user_id": str(current_user["_id"]),
        "user_name": current_user["full_name"],
        "total_active_hours": round(total_active_seconds / 3600, 2),
        "sessions": sessions
    }

@router.get("/employees/{employee_id}/work-hours")
async def get_employee_work_hours(
    employee_id: str,
    date: str = None,
    current_user: dict = Depends(require_role(["manager"]))
):
    """Get work hours for a specific employee"""
    users_collection = get_collection("users")
    sessions_collection = get_collection("work_sessions")
    
    # Verify employee belongs to this manager
    employee = await users_collection.find_one({"_id": ObjectId(employee_id)})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    if employee.get("manager_id") != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your employee"
        )
    
    # Default to today
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")
    
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Get sessions
    start_of_day = target_date.replace(hour=0, minute=0, second=0)
    end_of_day = target_date.replace(hour=23, minute=59, second=59)
    
    cursor = sessions_collection.find({
        "user_id": employee_id,
        "start_time": {
            "$gte": start_of_day,
            "$lte": end_of_day
        }
    })
    
    sessions = []
    total_active_seconds = 0
    
    async for session in cursor:
        session["id"] = str(session["_id"])
        total_active_seconds += session.get("total_active_time", 0)
        sessions.append(session)
    
    return {
        "date": date,
        "user_id": employee_id,
        "user_name": employee["full_name"],
        "total_active_hours": round(total_active_seconds / 3600, 2),
        "shift_start": employee.get("shift_start"),
        "shift_end": employee.get("shift_end"),
        "sessions": sessions
    }
