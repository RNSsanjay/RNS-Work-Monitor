from datetime import datetime, timedelta
from typing import Dict, Optional
from app.core.database import get_collection
from app.services.face_recognition import face_service
from bson import ObjectId

class MonitoringService:
    def __init__(self):
        # Store active monitoring sessions in memory
        self.active_sessions: Dict[str, dict] = {}
        # Track eye detection windows
        self.eye_detection_windows: Dict[str, list] = {}
        self.eye_detection_threshold = 5 * 60  # 5 minutes in seconds
    
    async def start_monitoring(self, user_id: str, session_id: str):
        """Start monitoring for a user"""
        self.active_sessions[user_id] = {
            "session_id": session_id,
            "start_time": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "active_seconds": 0,
            "eye_detection_start": None,
            "consecutive_eye_detection": 0
        }
        self.eye_detection_windows[user_id] = []
    
    def stop_monitoring(self, user_id: str):
        """Stop monitoring for a user"""
        if user_id in self.active_sessions:
            del self.active_sessions[user_id]
        if user_id in self.eye_detection_windows:
            del self.eye_detection_windows[user_id]
    
    async def process_detection(
        self, 
        user_id: str, 
        face_detected: bool, 
        eyes_detected: bool
    ) -> dict:
        """
        Process face and eye detection
        Returns updated monitoring status
        """
        if user_id not in self.active_sessions:
            return {"error": "No active session"}
        
        session = self.active_sessions[user_id]
        current_time = datetime.utcnow()
        
        # Update based on eye detection
        if eyes_detected:
            if session["eye_detection_start"] is None:
                session["eye_detection_start"] = current_time
                session["consecutive_eye_detection"] = 1
            else:
                # Calculate time since last detection
                time_diff = (current_time - session["last_activity"]).total_seconds()
                if time_diff <= 10:  # Allow 10 second gap
                    session["consecutive_eye_detection"] += time_diff
                else:
                    # Reset if gap too long
                    session["eye_detection_start"] = current_time
                    session["consecutive_eye_detection"] = 1
            
            session["last_activity"] = current_time
            
            # If we've reached 5 minutes of eye detection, add to active time
            if session["consecutive_eye_detection"] >= self.eye_detection_threshold:
                session["active_seconds"] += self.eye_detection_threshold
                # Reset the window
                session["eye_detection_start"] = current_time
                session["consecutive_eye_detection"] = 0
                
                # Log this detection window
                await self._log_eye_detection(user_id, session["session_id"], True, self.eye_detection_threshold)
        else:
            # Eyes not detected, reset counter
            if session["eye_detection_start"] is not None:
                # Log incomplete detection
                partial_time = (current_time - session["eye_detection_start"]).total_seconds()
                if partial_time > 60:  # Only log if more than 1 minute
                    await self._log_eye_detection(user_id, session["session_id"], False, int(partial_time))
            
            session["eye_detection_start"] = None
            session["consecutive_eye_detection"] = 0
        
        return {
            "is_monitoring": True,
            "active_time": session["active_seconds"],
            "current_window_time": session["consecutive_eye_detection"],
            "eyes_detected": eyes_detected,
            "face_detected": face_detected,
            "last_activity": session["last_activity"]
        }
    
    async def _log_eye_detection(
        self, 
        user_id: str, 
        session_id: str, 
        completed: bool, 
        duration: int
    ):
        """Log eye detection window to database"""
        sessions_collection = get_collection("work_sessions")
        
        log_entry = {
            "timestamp": datetime.utcnow(),
            "eyes_detected": completed,
            "duration": duration
        }
        
        await sessions_collection.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$push": {"eye_detection_logs": log_entry},
                "$set": {"total_active_time": self.active_sessions[user_id]["active_seconds"]}
            }
        )
    
    def get_session_status(self, user_id: str) -> Optional[dict]:
        """Get current monitoring status for user"""
        if user_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[user_id]
        return {
            "is_monitoring": True,
            "session_id": session["session_id"],
            "active_time": session["active_seconds"],
            "current_window_time": session["consecutive_eye_detection"],
            "last_activity": session["last_activity"]
        }
    
    async def get_shift_info(self, user_id: str) -> Optional[dict]:
        """Get shift timing for user"""
        users_collection = get_collection("users")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if user and "shift_start" in user and "shift_end" in user:
            return {
                "shift_start": user["shift_start"],
                "shift_end": user["shift_end"]
            }
        return None
    
    def should_auto_start(self, shift_start: str) -> bool:
        """Check if current time matches shift start"""
        from datetime import datetime
        current_time = datetime.now().strftime("%H:%M")
        # Allow 15 minute window
        return current_time >= shift_start and current_time <= self._add_minutes(shift_start, 15)
    
    def _add_minutes(self, time_str: str, minutes: int) -> str:
        """Add minutes to time string"""
        from datetime import datetime, timedelta
        time_obj = datetime.strptime(time_str, "%H:%M")
        new_time = time_obj + timedelta(minutes=minutes)
        return new_time.strftime("%H:%M")

# Global instance
monitoring_service = MonitoringService()
