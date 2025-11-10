import { Routes, Route } from 'react-router-dom';
import CameraMonitor from '../components/CameraMonitor';
import { Clock, Activity, TrendingUp } from 'lucide-react';

function EmployeeHome() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card-gradient from-green-500 via-emerald-500 to-teal-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
              <Clock size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-1">Employee Dashboard</h1>
              <p className="text-green-100 text-lg font-medium">Track your productive work hours</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-5 py-3 rounded-xl backdrop-blur-sm">
              <Activity size={24} className="text-white" />
              <div className="text-white">
                <p className="text-xs font-medium opacity-90">Status</p>
                <p className="text-lg font-bold">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
              <Clock size={24} className="text-blue-600" />
            </div>
            <span className="badge badge-primary">Today</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">Work Hours</h3>
          <p className="text-3xl font-extrabold text-gray-900">0:00</p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
              <Activity size={24} className="text-green-600" />
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">Sessions</h3>
          <p className="text-3xl font-extrabold text-gray-900">0</p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <span className="badge badge-info">Week</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">This Week</h3>
          <p className="text-3xl font-extrabold text-gray-900">0:00</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">How It Works</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Start a monitoring session to begin tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Your camera will detect your face and eye movements</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-600">✓</span>
                <span>Time is counted when eyes are detected for 5 consecutive minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Camera Monitor */}
      <CameraMonitor />
    </div>
  );
}

export default function EmployeeDashboard() {
  return (
    <Routes>
      <Route path="/" element={<EmployeeHome />} />
    </Routes>
  );
}
