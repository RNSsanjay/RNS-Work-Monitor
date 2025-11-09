import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, Play, Square, Eye, EyeOff, Clock } from 'lucide-react';
import { sessionAPI, faceAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function CameraMonitor() {
  const webcamRef = useRef(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [detectionData, setDetectionData] = useState({
    face_detected: false,
    eyes_detected: false,
    confidence: 0,
  });
  const [monitoringStatus, setMonitoringStatus] = useState({
    active_time: 0,
    current_window_time: 0,
  });
  const [annotatedFrame, setAnnotatedFrame] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    checkActiveSession();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkActiveSession = async () => {
    try {
      const response = await sessionAPI.getActiveSession();
      if (response.data) {
        setActiveSession(response.data);
        setIsMonitoring(true);
        startFrameCapture();
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    }
  };

  const startSession = async () => {
    try {
      const response = await sessionAPI.startSession();
      setActiveSession(response.data);
      setIsMonitoring(true);
      startFrameCapture();
      toast.success('Monitoring started!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start session');
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      await sessionAPI.endSession(activeSession.id);
      setIsMonitoring(false);
      setActiveSession(null);
      stopFrameCapture();
      toast.success('Session ended!');
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const startFrameCapture = () => {
    // Capture frame every 2 seconds
    intervalRef.current = setInterval(() => {
      captureAndProcessFrame();
    }, 2000);
  };

  const stopFrameCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const captureAndProcessFrame = async () => {
    if (!webcamRef.current) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // Convert base64 to blob
      const blob = await fetch(imageSrc).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      const response = await faceAPI.processFrame(formData);
      
      setDetectionData({
        face_detected: response.data.face_detected,
        eyes_detected: response.data.eyes_detected,
        confidence: response.data.confidence,
      });

      if (response.data.monitoring_status) {
        setMonitoringStatus(response.data.monitoring_status);
      }

      if (response.data.annotated_frame) {
        setAnnotatedFrame(`data:image/jpeg;base64,${response.data.annotated_frame}`);
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Camera Monitor</h2>
          <div className="flex space-x-3">
            {!isMonitoring ? (
              <button
                onClick={startSession}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start Monitoring</span>
              </button>
            ) : (
              <button
                onClick={endSession}
                className="btn btn-danger flex items-center space-x-2"
              >
                <Square size={20} />
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Status</span>
              {isMonitoring ? (
                <Camera className="text-green-500" size={20} />
              ) : (
                <CameraOff className="text-gray-400" size={20} />
              )}
            </div>
            <p className="text-lg font-semibold">
              {isMonitoring ? 'Monitoring' : 'Inactive'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Face</span>
              <div className={`w-3 h-3 rounded-full ${detectionData.face_detected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-lg font-semibold">
              {detectionData.face_detected ? 'Detected' : 'Not Found'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Eyes</span>
              {detectionData.eyes_detected ? (
                <Eye className="text-green-500" size={20} />
              ) : (
                <EyeOff className="text-red-500" size={20} />
              )}
            </div>
            <p className="text-lg font-semibold">
              {detectionData.eyes_detected ? 'Detected' : 'Not Found'}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Time</span>
              <Clock className="text-primary-500" size={20} />
            </div>
            <p className="text-lg font-semibold">
              {formatTime(monitoringStatus.active_time)}
            </p>
          </div>
        </div>

        {/* Eye Detection Window Progress */}
        {isMonitoring && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current Detection Window</span>
              <span>{Math.floor(monitoringStatus.current_window_time / 60)} / 5 minutes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((monitoringStatus.current_window_time / 300) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Eyes must be detected for 5 consecutive minutes to count as active time
            </p>
          </div>
        )}
      </div>

      {/* Camera Feed */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Live Feed</h3>
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {annotatedFrame ? (
            <img
              src={annotatedFrame}
              alt="Annotated feed"
              className="w-full h-full object-contain"
            />
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-contain"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user',
              }}
            />
          )}
          {!isMonitoring && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <CameraOff size={48} className="mx-auto mb-2" />
                <p>Start monitoring to activate camera</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Note:</strong> The camera will automatically detect your face and eyes. 
            Your work time is tracked based on continuous eye detection for 5-minute intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
