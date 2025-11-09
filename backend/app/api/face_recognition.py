from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from app.core.security import get_current_active_user
from app.core.database import get_collection
from app.services.face_recognition import face_service
from app.services.monitoring import monitoring_service
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/register-face")
async def register_face(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Register face for user"""
    import os
    
    # Save uploaded file temporarily
    file_path = f"uploads/temp/{current_user['_id']}.jpg"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    # Encode face
    encoding = face_service.encode_face(file_path)
    
    if encoding is None:
        os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No face detected in image"
        )
    
    # Save encoding
    face_service.save_face_encoding(str(current_user["_id"]), encoding)
    
    # Save face image
    final_path = f"uploads/faces/{current_user['_id']}.jpg"
    os.rename(file_path, final_path)
    
    # Update user record
    users_collection = get_collection("users")
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"face_registered": True, "face_image": final_path}}
    )
    
    return {"message": "Face registered successfully", "face_image": final_path}

@router.post("/detect")
async def detect_face_and_eyes(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Detect face and eyes in uploaded image"""
    # Read image
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image"
        )
    
    # Detect face and eyes
    face_detected, eyes_detected, confidence = face_service.detect_face_and_eyes(frame)
    
    # Process detection for monitoring
    if monitoring_service.get_session_status(str(current_user["_id"])):
        status_update = await monitoring_service.process_detection(
            str(current_user["_id"]),
            face_detected,
            eyes_detected
        )
    else:
        status_update = None
    
    return {
        "face_detected": face_detected,
        "eyes_detected": eyes_detected,
        "confidence": confidence,
        "timestamp": datetime.utcnow(),
        "monitoring_status": status_update
    }

@router.post("/verify")
async def verify_face(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Verify if face in image matches registered face"""
    # Check if user has registered face
    users_collection = get_collection("users")
    user = await users_collection.find_one({"_id": current_user["_id"]})
    
    if not user.get("face_registered"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No face registered for this user"
        )
    
    # Read image
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image"
        )
    
    # Verify face
    is_match = face_service.verify_face(frame, str(current_user["_id"]))
    
    return {
        "is_match": is_match,
        "timestamp": datetime.utcnow()
    }

@router.post("/process-frame")
async def process_video_frame(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """
    Process a video frame for face/eye detection and update monitoring
    This endpoint is called continuously from the frontend
    """
    # Read frame
    content = await file.read()
    nparr = np.frombuffer(content, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid frame"
        )
    
    # Detect face and eyes
    face_detected, eyes_detected, confidence = face_service.detect_face_and_eyes(frame)
    
    # Update monitoring if session is active
    monitoring_status = None
    session_status = monitoring_service.get_session_status(str(current_user["_id"]))
    
    if session_status:
        monitoring_status = await monitoring_service.process_detection(
            str(current_user["_id"]),
            face_detected,
            eyes_detected
        )
    
    # Draw detection boxes for visualization
    annotated_frame = face_service.draw_detection_boxes(frame.copy())
    
    # Convert frame to base64 for sending back
    _, buffer = cv2.imencode('.jpg', annotated_frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return {
        "face_detected": face_detected,
        "eyes_detected": eyes_detected,
        "confidence": confidence,
        "timestamp": datetime.utcnow().isoformat(),
        "monitoring_status": monitoring_status,
        "annotated_frame": frame_base64
    }

@router.get("/check-registration")
async def check_face_registration(
    current_user: dict = Depends(get_current_active_user)
):
    """Check if user has registered their face"""
    users_collection = get_collection("users")
    user = await users_collection.find_one({"_id": current_user["_id"]})
    
    return {
        "face_registered": user.get("face_registered", False),
        "face_image": user.get("face_image")
    }
