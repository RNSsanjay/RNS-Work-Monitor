from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, time
from enum import Enum

class SessionStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class WorkSessionCreate(BaseModel):
    user_id: str
    start_time: datetime

class WorkSessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    status: Optional[SessionStatus] = None
    total_active_time: Optional[int] = None  # in seconds
    
class EyeDetectionLog(BaseModel):
    timestamp: datetime
    eyes_detected: bool
    duration: int  # seconds

class WorkSessionResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: SessionStatus
    total_active_time: int  # in seconds
    eye_detection_logs: List[EyeDetectionLog] = []
    shift_start: Optional[str] = None
    shift_end: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class WorkSessionStats(BaseModel):
    user_id: str
    user_name: str
    date: str
    total_work_hours: float
    total_active_hours: float
    shift_start: Optional[str] = None
    shift_end: Optional[str] = None
    sessions: List[WorkSessionResponse] = []

class FaceDetectionData(BaseModel):
    face_detected: bool
    eyes_detected: bool
    timestamp: datetime
    confidence: float = 0.0

class MonitoringStatus(BaseModel):
    is_monitoring: bool
    current_session_id: Optional[str] = None
    active_time: int  # seconds
    last_eye_detection: Optional[datetime] = None
