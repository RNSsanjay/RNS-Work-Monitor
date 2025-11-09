import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Clock, UserPlus, Calendar as CalendarIcon } from 'lucide-react';
import { managerAPI } from '../services/api';
import { toast } from 'react-toastify';
import CameraMonitor from '../components/CameraMonitor';

function ManagerHome() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [workHoursData, setWorkHoursData] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeWorkHours();
    }
  }, [selectedEmployee, selectedDate]);

  const fetchEmployees = async () => {
    try {
      const response = await managerAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeWorkHours = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await managerAPI.getEmployeeWorkHours(selectedEmployee, selectedDate);
      setWorkHoursData(response.data);
    } catch (error) {
      toast.error('Failed to fetch work hours');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users size={32} className="text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">Manage your team</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <Link
            to="/manager"
            className="pb-2 px-4 border-b-2 border-primary-600 text-primary-600 font-medium"
          >
            Employees
          </Link>
          <Link
            to="/manager/my-hours"
            className="pb-2 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
          >
            My Hours
          </Link>
        </div>
      </div>

      {/* Employees List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Employees</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No employees assigned yet</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => setSelectedEmployee(employee.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedEmployee === employee.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{employee.full_name}</h3>
                <p className="text-sm text-gray-600">{employee.email}</p>
                {employee.shift_start && employee.shift_end && (
                  <p className="text-xs text-gray-500 mt-2">
                    Shift: {employee.shift_start} - {employee.shift_end}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee Work Hours */}
      {selectedEmployee && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Work Hours</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input max-w-xs"
            />
          </div>

          {workHoursData && (
            <div>
              <div className="bg-primary-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Total Active Hours</p>
                <p className="text-3xl font-bold text-primary-600">
                  {workHoursData.total_active_hours} hrs
                </p>
                {workHoursData.shift_start && workHoursData.shift_end && (
                  <p className="text-sm text-gray-600 mt-2">
                    Shift: {workHoursData.shift_start} - {workHoursData.shift_end}
                  </p>
                )}
              </div>

              {workHoursData.sessions && workHoursData.sessions.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Sessions</h3>
                  {workHoursData.sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(session.start_time).toLocaleTimeString()}
                            {session.end_time && ` - ${new Date(session.end_time).toLocaleTimeString()}`}
                          </p>
                          <p className="text-xs text-gray-600">
                            Active: {Math.round(session.total_active_time / 60)} minutes
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No sessions for this date</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MyHours() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Work Hours</h1>
        <p className="text-gray-600 mb-6">Track your own work hours</p>
      </div>
      <CameraMonitor />
    </div>
  );
}

export default function ManagerDashboard() {
  return (
    <Routes>
      <Route path="/" element={<ManagerHome />} />
      <Route path="/my-hours" element={<MyHours />} />
    </Routes>
  );
}
