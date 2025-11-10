import { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, Play, Square, Eye, EyeOff, Clock, Zap, AlertCircle } from 'lucide-react';
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
      toast.success('Monitoring started! 🎉');
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
      toast.success('Session ended successfully! ✓');
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const startFrameCapture = () => {
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

  const getProgressPercentage = () => {
    return Math.min((monitoringStatus.current_window_time / 300) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="card animate-scale-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Camera Monitor</h2>
            <p className="text-gray-600 font-medium">Real-time face and eye detection</p>
          </div>
          <div className="flex space-x-3">
            {!isMonitoring ? (
              <button
                onClick={startSession}
                className="btn btn-success flex items-center space-x-2 shadow-lg"
              >
                <Play size={22} />
                <span>Start Monitoring</span>
              </button>
            ) : (
              <button
                onClick={endSession}
                className="btn btn-danger flex items-center space-x-2 shadow-lg"
              >
                <Square size={22} />
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-5 rounded-2xl transition-all duration-300 ${
            isMonitoring 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300' 
              : 'bg-gray-50 border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">Status</span>
              <div className={`p-2 rounded-xl ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}>
                {isMonitoring ? (
                  <Camera className="text-white" size={20} />
                ) : (
                  <CameraOff className="text-white" size={20} />
                )}
              </div>
            </div>
            <p className={`text-xl font-extrabold ${isMonitoring ? 'text-green-700' : 'text-gray-600'}`}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </p>
          </div>

          <div className={`p-5 rounded-2xl transition-all duration-300 ${
            detectionData.face_detected 
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300' 
              : 'bg-gray-50 border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">Face</span>
              <div className={`w-4 h-4 rounded-full ${detectionData.face_detected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <p className={`text-xl font-extrabold ${detectionData.face_detected ? 'text-blue-700' : 'text-gray-600'}`}>
              {detectionData.face_detected ? 'Detected' : 'Not Found'}
            </p>
          </div>

          <div className={`p-5 rounded-2xl transition-all duration-300 ${
            detectionData.eyes_detected 
              ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300' 
              : 'bg-gray-50 border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">Eyes</span>
              <div className={`p-2 rounded-xl ${detectionData.eyes_detected ? 'bg-purple-500' : 'bg-gray-400'}`}>
                {detectionData.eyes_detected ? (
                  <Eye className="text-white" size={20} />
                ) : (
                  <EyeOff className="text-white" size={20} />
                )}
              </div>
            </div>
            <p className={`text-xl font-extrabold ${detectionData.eyes_detected ? 'text-purple-700' : 'text-gray-600'}`}>
              {detectionData.eyes_detected ? 'Detected' : 'Not Found'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-700">Active Time</span>
              <div className="p-2 rounded-xl bg-orange-500">
                <Clock className="text-white" size={20} />
              </div>
            </div>
            <p className="text-xl font-extrabold text-orange-700">
              {formatTime(monitoringStatus.active_time)}
            </p>
          </div>
        </div>

        {/* Eye Detection Window Progress */}
        {isMonitoring && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Detection Window Progress</h3>
                  <p className="text-sm text-gray-600">
                    {Math.floor(monitoringStatus.current_window_time / 60)} / 5 minutes
                  </p>
                </div>
              </div>
              <span className="badge badge-primary text-lg px-4 py-2">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-3 flex items-center space-x-2">
              <AlertCircle size={14} />
              <span>Eyes must be detected for 5 consecutive minutes to count as active time</span>
            </p>
          </div>
        )}
      </div>

      {/* Camera Feed */}
      <div className="card animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Live Camera Feed</h3>
          {isMonitoring && (
            <div className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm font-bold">RECORDING</span>
            </div>
          )}
        </div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden aspect-video shadow-2xl border-4 border-gray-700">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
              <div className="text-center text-white p-8">
                <CameraOff size={64} className="mx-auto mb-4 text-gray-400" />
                <p className="text-xl font-bold mb-2">Camera Inactive</p>
                <p className="text-gray-400">Start monitoring to activate camera</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 font-medium">
            <strong className="text-blue-700">💡 Note:</strong> The camera automatically detects your face and eyes. 
            Your work time is tracked based on continuous eye detection for 5-minute intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
