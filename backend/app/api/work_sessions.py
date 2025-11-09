from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.core.security import get_current_active_user
from app.core.database import get_collection
from app.models.work_session import (
    WorkSessionCreate, 
    WorkSessionResponse, 
    SessionStatus,
    MonitoringStatus
)
from app.services.monitoring import monitoring_service
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/start", response_model=WorkSessionResponse)
async def start_work_session(
    current_user: dict = Depends(get_current_active_user)
):
    """Start a new work session"""
    sessions_collection = get_collection("work_sessions")
    
    # Check if there's already an active session
    existing_session = await sessions_collection.find_one({
        "user_id": str(current_user["_id"]),
        "status": {"$in": ["active", "paused"]}
    })
    
    if existing_session:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Active session already exists"
        )
    
    # Create new session
    session_data = {
        "user_id": str(current_user["_id"]),
        "user_name": current_user["full_name"],
        "start_time": datetime.utcnow(),
        "end_time": None,
        "status": "active",
        "total_active_time": 0,
        "eye_detection_logs": [],
        "shift_start": current_user.get("shift_start"),
        "shift_end": current_user.get("shift_end"),
        "created_at": datetime.utcnow()
    }
    
    result = await sessions_collection.insert_one(session_data)
    session_id = str(result.inserted_id)
    
    # Start monitoring
    await monitoring_service.start_monitoring(str(current_user["_id"]), session_id)
    
    # Get created session
    created_session = await sessions_collection.find_one({"_id": result.inserted_id})
    created_session["id"] = str(created_session["_id"])
    
    return WorkSessionResponse(**created_session)

@router.post("/end/{session_id}")
async def end_work_session(
    session_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """End a work session"""
    sessions_collection = get_collection("work_sessions")
    
    session = await sessions_collection.find_one({"_id": ObjectId(session_id)})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your session"
        )
    
    if session["status"] == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session already completed"
        )
    
    # Stop monitoring
    monitoring_service.stop_monitoring(str(current_user["_id"]))
    
    # Update session
    await sessions_collection.update_one(
        {"_id": ObjectId(session_id)},
        {
            "$set": {
                "end_time": datetime.utcnow(),
                "status": "completed"
            }
        }
    )
    
    return {"message": "Session ended successfully"}

@router.get("/active", response_model=Optional[WorkSessionResponse])
async def get_active_session(
    current_user: dict = Depends(get_current_active_user)
):
    """Get active work session for current user"""
    sessions_collection = get_collection("work_sessions")
    
    session = await sessions_collection.find_one({
        "user_id": str(current_user["_id"]),
        "status": "active"
    })
    
    if not session:
        return None
    
    session["id"] = str(session["_id"])
    return WorkSessionResponse(**session)

@router.get("/status", response_model=Optional[MonitoringStatus])
async def get_monitoring_status(
    current_user: dict = Depends(get_current_active_user)
):
    """Get current monitoring status"""
    status = monitoring_service.get_session_status(str(current_user["_id"]))
    
    if not status:
        return None
    
    return MonitoringStatus(**status)

@router.get("/history")
async def get_session_history(
    days: int = 7,
    current_user: dict = Depends(get_current_active_user)
):
    """Get work session history"""
    sessions_collection = get_collection("work_sessions")
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    cursor = sessions_collection.find({
        "user_id": str(current_user["_id"]),
        "start_time": {"$gte": start_date}
    }).sort("start_time", -1)
    
    sessions = []
    async for session in cursor:
        session["id"] = str(session["_id"])
        sessions.append(session)
    
    return sessions

@router.get("/{session_id}", response_model=WorkSessionResponse)
async def get_session(
    session_id: str,
    current_user: dict = Depends(get_current_active_user)
):
    """Get specific work session"""
    sessions_collection = get_collection("work_sessions")
    
    session = await sessions_collection.find_one({"_id": ObjectId(session_id)})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Check permissions
    if current_user["role"] == "employee":
        if session["user_id"] != str(current_user["_id"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not your session"
            )
    elif current_user["role"] == "manager":
        # Check if session belongs to their employee
        users_collection = get_collection("users")
        session_user = await users_collection.find_one({"_id": ObjectId(session["user_id"])})
        if session_user and session_user.get("manager_id") != str(current_user["_id"]) and session["user_id"] != str(current_user["_id"]):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this session"
            )
    
    session["id"] = str(session["_id"])
    return WorkSessionResponse(**session)
