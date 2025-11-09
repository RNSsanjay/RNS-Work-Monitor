from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.core.security import get_current_active_user, require_role, get_password_hash
from app.core.database import get_collection
from app.models.user import UserResponse, UserUpdate, ShiftUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    current_user: dict = Depends(require_role(["admin", "manager"]))
):
    """Get all users (admin) or managed users (manager)"""
    users_collection = get_collection("users")
    
    if current_user["role"] == "admin":
        cursor = users_collection.find({})
    else:  # manager
        cursor = users_collection.find({
            "$or": [
                {"manager_id": str(current_user["_id"])},
                {"_id": current_user["_id"]}
            ]
        })
    
    users = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        users.append(UserResponse(**user))
    
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get user by ID"""
    users_collection = get_collection("users")
    
    # Check permissions
    if current_user["role"] == "employee" and str(current_user["_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Manager can only see their employees
    if current_user["role"] == "manager":
        if user.get("manager_id") != str(current_user["_id"]) and str(user["_id"]) != str(current_user["_id"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    
    user["id"] = str(user["_id"])
    return UserResponse(**user)

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: dict = Depends(require_role(["admin", "manager"]))
):
    """Update user"""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Manager can only update their employees
    if current_user["role"] == "manager":
        if user.get("manager_id") != str(current_user["_id"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password"] = get_password_hash(update_data["password"])
    
    if update_data:
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    return UserResponse(**updated_user)

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_role(["admin"]))
):
    """Delete user (admin only)"""
    users_collection = get_collection("users")
    
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User deleted successfully"}

@router.put("/{user_id}/shift", response_model=UserResponse)
async def update_shift(
    user_id: str,
    shift: ShiftUpdate,
    current_user: dict = Depends(require_role(["admin", "manager"]))
):
    """Update employee shift timings"""
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate shift times
    try:
        from datetime import datetime
        datetime.strptime(shift.shift_start, "%H:%M")
        datetime.strptime(shift.shift_end, "%H:%M")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid time format. Use HH:MM (24-hour format)"
        )
    
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "shift_start": shift.shift_start,
            "shift_end": shift.shift_end
        }}
    )
    
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    updated_user["id"] = str(updated_user["_id"])
    return UserResponse(**updated_user)
