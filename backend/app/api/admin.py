from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.core.security import require_role
from app.core.database import get_collection
from app.models.user import UserResponse
from app.models.work_session import WorkSessionStats
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    role: Optional[str] = None,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Get all users in the system"""
    users_collection = get_collection("users")
    
    query = {}
    if role:
        query["role"] = role
    
    cursor = users_collection.find(query)
    
    users = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        users.append(UserResponse(**user))
    
    return users

@router.get("/work-hours")
async def get_all_work_hours(
    date: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Get work hours for all users or specific user"""
    sessions_collection = get_collection("work_sessions")
    users_collection = get_collection("users")
    
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
    
    start_of_day = target_date.replace(hour=0, minute=0, second=0)
    end_of_day = target_date.replace(hour=23, minute=59, second=59)
    
    # Build query
    query = {
        "start_time": {
            "$gte": start_of_day,
            "$lte": end_of_day
        }
    }
    
    if user_id:
        query["user_id"] = user_id
    
    # Get all sessions for the day
    cursor = sessions_collection.find(query)
    
    # Group by user
    user_sessions = {}
    async for session in cursor:
        uid = session["user_id"]
        if uid not in user_sessions:
            user_sessions[uid] = []
        session["id"] = str(session["_id"])
        user_sessions[uid].append(session)
    
    # Build response
    result = []
    for uid, sessions in user_sessions.items():
        user = await users_collection.find_one({"_id": ObjectId(uid)})
        if not user:
            continue
        
        total_active_seconds = sum(s.get("total_active_time", 0) for s in sessions)
        
        result.append({
            "user_id": uid,
            "user_name": user["full_name"],
            "role": user["role"],
            "date": date,
            "total_active_hours": round(total_active_seconds / 3600, 2),
            "shift_start": user.get("shift_start"),
            "shift_end": user.get("shift_end"),
            "sessions_count": len(sessions),
            "sessions": sessions
        })
    
    return result

@router.get("/calendar")
async def get_calendar_data(
    start_date: str = Query(..., description="Start date in YYYY-MM-DD format"),
    end_date: str = Query(..., description="End date in YYYY-MM-DD format"),
    user_id: Optional[str] = None,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Get work hours data for calendar view"""
    sessions_collection = get_collection("work_sessions")
    users_collection = get_collection("users")
    
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Build query
    query = {
        "start_time": {
            "$gte": start.replace(hour=0, minute=0, second=0),
            "$lte": end.replace(hour=23, minute=59, second=59)
        }
    }
    
    if user_id:
        query["user_id"] = user_id
    
    cursor = sessions_collection.find(query)
    
    # Group by date and user
    calendar_data = {}
    async for session in cursor:
        session_date = session["start_time"].strftime("%Y-%m-%d")
        uid = session["user_id"]
        
        key = f"{session_date}_{uid}"
        if key not in calendar_data:
            calendar_data[key] = {
                "date": session_date,
                "user_id": uid,
                "total_active_seconds": 0,
                "sessions": []
            }
        
        calendar_data[key]["total_active_seconds"] += session.get("total_active_time", 0)
        calendar_data[key]["sessions"].append({
            "id": str(session["_id"]),
            "start_time": session["start_time"],
            "end_time": session.get("end_time"),
            "status": session["status"]
        })
    
    # Enhance with user info
    result = []
    for key, data in calendar_data.items():
        user = await users_collection.find_one({"_id": ObjectId(data["user_id"])})
        if user:
            result.append({
                "date": data["date"],
                "user_id": data["user_id"],
                "user_name": user["full_name"],
                "role": user["role"],
                "total_hours": round(data["total_active_seconds"] / 3600, 2),
                "sessions": data["sessions"]
            })
    
    return result

@router.get("/statistics")
async def get_statistics(
    current_user: dict = Depends(require_role(["admin"]))
):
    """Get overall system statistics"""
    users_collection = get_collection("users")
    sessions_collection = get_collection("work_sessions")
    
    # Count users by role
    total_users = await users_collection.count_documents({})
    total_admins = await users_collection.count_documents({"role": "admin"})
    total_managers = await users_collection.count_documents({"role": "manager"})
    total_employees = await users_collection.count_documents({"role": "employee"})
    
    # Today's stats
    today = datetime.utcnow().replace(hour=0, minute=0, second=0)
    active_sessions = await sessions_collection.count_documents({
        "status": "active",
        "start_time": {"$gte": today}
    })
    
    completed_sessions = await sessions_collection.count_documents({
        "status": "completed",
        "start_time": {"$gte": today}
    })
    
    return {
        "total_users": total_users,
        "total_admins": total_admins,
        "total_managers": total_managers,
        "total_employees": total_employees,
        "active_sessions_today": active_sessions,
        "completed_sessions_today": completed_sessions
    }
