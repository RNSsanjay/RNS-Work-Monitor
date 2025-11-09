import cv2
import numpy as np
from typing import Tuple, Optional
import os
# import face_recognition  # Optional - requires dlib which can be complex on Windows

class FaceRecognitionService:
    def __init__(self):
        # Load Haar Cascades for face and eye detection
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.eye_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_eye.xml'
        )
        self.face_encodings_dir = "uploads/faces"
        os.makedirs(self.face_encodings_dir, exist_ok=True)
    
    def detect_face_and_eyes(self, frame: np.ndarray) -> Tuple[bool, bool, float]:
        """
        Detect face and eyes in frame
        Returns: (face_detected, eyes_detected, confidence)
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        face_detected = len(faces) > 0
        eyes_detected = False
        confidence = 0.0
        
        if face_detected:
            confidence = 0.8  # Base confidence for face detection
            
            # Check for eyes in each face
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y+h, x:x+w]
                eyes = self.eye_cascade.detectMultiScale(
                    roi_gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(20, 20)
                )
                
                if len(eyes) >= 2:  # At least 2 eyes detected
                    eyes_detected = True
                    confidence = 0.95
                    break
        
        return face_detected, eyes_detected, confidence
    
    def encode_face(self, image_path: str) -> Optional[np.ndarray]:
        """
        Encode face from image for recognition
        Note: Basic implementation without face_recognition library
        """
        try:
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(30, 30))
            
            if len(faces) > 0:
                # Return the face region as a simple "encoding"
                x, y, w, h = faces[0]
                face_region = image[y:y+h, x:x+w]
                # Resize to standard size for comparison
                face_region = cv2.resize(face_region, (128, 128))
                return face_region.flatten()
            return None
        except Exception as e:
            print(f"Error encoding face: {e}")
            return None
    
    def save_face_encoding(self, user_id: str, encoding: np.ndarray):
        """
        Save face encoding for a user
        """
        encoding_path = os.path.join(self.face_encodings_dir, f"{user_id}.npy")
        np.save(encoding_path, encoding)
    
    def load_face_encoding(self, user_id: str) -> Optional[np.ndarray]:
        """
        Load face encoding for a user
        """
        encoding_path = os.path.join(self.face_encodings_dir, f"{user_id}.npy")
        if os.path.exists(encoding_path):
            return np.load(encoding_path)
        return None
    
    def verify_face(self, frame: np.ndarray, user_id: str, tolerance: float = 0.6) -> bool:
        """
        Verify if the face in frame matches the stored encoding for user
        Note: Simplified implementation using OpenCV template matching
        """
        try:
            # Get stored encoding
            stored_encoding = self.load_face_encoding(user_id)
            if stored_encoding is None:
                return False
            
            # Detect face in current frame
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(30, 30))
            
            if len(faces) == 0:
                return False
            
            # Get the first detected face
            x, y, w, h = faces[0]
            face_region = frame[y:y+h, x:x+w]
            face_region = cv2.resize(face_region, (128, 128))
            current_encoding = face_region.flatten()
            
            # Simple comparison using correlation
            stored_shape = stored_encoding.shape[0]
            current_shape = current_encoding.shape[0]
            
            if stored_shape != current_shape:
                return False
            
            # Compute similarity (simplified)
            correlation = np.corrcoef(stored_encoding, current_encoding)[0, 1]
            return correlation > (1 - tolerance)
            
        except Exception as e:
            print(f"Error verifying face: {e}")
            return False
    
    def process_video_frame(self, frame_bytes: bytes) -> np.ndarray:
        """
        Convert bytes to frame
        """
        nparr = np.frombuffer(frame_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return frame
    
    def draw_detection_boxes(self, frame: np.ndarray) -> np.ndarray:
        """
        Draw detection boxes on frame for visualization
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(30, 30))
        
        for (x, y, w, h) in faces:
            # Draw face rectangle
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            
            # Detect eyes in face region
            roi_gray = gray[y:y+h, x:x+w]
            eyes = self.eye_cascade.detectMultiScale(roi_gray, 1.1, 5, minSize=(20, 20))
            
            for (ex, ey, ew, eh) in eyes:
                cv2.rectangle(
                    frame, 
                    (x+ex, y+ey), 
                    (x+ex+ew, y+ey+eh), 
                    (255, 0, 0), 
                    2
                )
        
        return frame

# Global instance
face_service = FaceRecognitionService()
