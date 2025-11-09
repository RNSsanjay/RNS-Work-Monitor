import { Routes, Route } from 'react-router-dom';
import CameraMonitor from '../components/CameraMonitor';
import { Clock } from 'lucide-react';

function EmployeeHome() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Clock size={32} className="text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="text-gray-600">Monitor your work hours</p>
          </div>
        </div>
      </div>

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
