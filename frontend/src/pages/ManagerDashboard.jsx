import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Clock, UserPlus, Calendar as CalendarIcon, TrendingUp, Activity, BarChart } from 'lucide-react';
import { managerAPI } from '../services/api';
import { toast } from 'react-toastify';
import CameraMonitor from '../components/CameraMonitor';

function ManagerHome() {
  const location = useLocation();
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card-gradient from-blue-500 via-cyan-500 to-teal-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
              <Users size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-1">Manager Dashboard</h1>
              <p className="text-blue-100 text-lg font-medium">Oversee your team's productivity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <Link
            to="/manager"
            className={`pb-3 px-6 font-bold transition-all duration-300 ${
              location.pathname === '/manager'
                ? 'border-b-4 border-blue-600 text-blue-600 -mb-[2px]'
                : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-300 -mb-[2px]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>Team Overview</span>
            </div>
          </Link>
          <Link
            to="/manager/my-hours"
            className={`pb-3 px-6 font-bold transition-all duration-300 ${
              location.pathname === '/manager/my-hours'
                ? 'border-b-4 border-blue-600 text-blue-600 -mb-[2px]'
                : 'text-gray-600 hover:text-blue-600 hover:border-b-4 hover:border-blue-300 -mb-[2px]'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <span>My Hours</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
            <span className="badge badge-primary">Total</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">Team Members</h3>
          <p className="text-3xl font-extrabold text-gray-900">{employees.length}</p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
              <Activity size={24} className="text-green-600" />
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">Active Today</h3>
          <p className="text-3xl font-extrabold text-gray-900">0</p>
        </div>

        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl">
              <BarChart size={24} className="text-purple-600" />
            </div>
            <span className="badge badge-info">Average</span>
          </div>
          <h3 className="text-gray-600 text-sm font-semibold mb-1">Avg Hours/Day</h3>
          <p className="text-3xl font-extrabold text-gray-900">0.0</p>
        </div>
      </div>

      {/* Employees List */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Users className="text-blue-600" size={28} />
          <span>Your Team</span>
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No employees assigned yet</p>
            <p className="text-gray-500 text-sm mt-2">Contact your administrator to assign team members</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => setSelectedEmployee(employee.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedEmployee === employee.id
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl scale-105'
                    : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    selectedEmployee === employee.id
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  }`}>
                    {employee.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${
                      selectedEmployee === employee.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {employee.full_name}
                    </h3>
                    <p className={`text-sm ${
                      selectedEmployee === employee.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {employee.email}
                    </p>
                  </div>
                </div>
                {employee.shift_start && employee.shift_end && (
                  <div className={`flex items-center space-x-2 text-xs font-semibold ${
                    selectedEmployee === employee.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock size={14} />
                    <span>Shift: {employee.shift_start} - {employee.shift_end}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee Work Hours */}
      {selectedEmployee && (
        <div className="card animate-scale-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <CalendarIcon className="text-blue-600" size={28} />
              <span>Work Hours Details</span>
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input max-w-xs"
            />
          </div>

          {workHoursData && (
            <div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl mb-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-1">Total Active Hours</p>
                    <p className="text-5xl font-extrabold">
                      {workHoursData.total_active_hours} <span className="text-2xl">hrs</span>
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                    <TrendingUp size={40} />
                  </div>
                </div>
                {workHoursData.shift_start && workHoursData.shift_end && (
                  <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                    <p className="text-blue-100 text-sm font-semibold">
                      Scheduled Shift: {workHoursData.shift_start} - {workHoursData.shift_end}
                    </p>
                  </div>
                )}
              </div>

              {workHoursData.sessions && workHoursData.sessions.length > 0 ? (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center space-x-2">
                    <Activity size={24} className="text-blue-600" />
                    <span>Work Sessions</span>
                  </h3>
                  <div className="space-y-3">
                    {workHoursData.sessions.map((session) => (
                      <div key={session.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Clock size={18} className="text-blue-600" />
                              <p className="text-base font-bold text-gray-900">
                                {new Date(session.start_time).toLocaleTimeString()}
                                {session.end_time && ` - ${new Date(session.end_time).toLocaleTimeString()}`}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 font-semibold ml-7">
                              Active Time: <span className="text-blue-600">{Math.round(session.total_active_time / 60)} minutes</span>
                            </p>
                          </div>
                          <span className={`px-4 py-2 text-xs font-bold rounded-full uppercase ${
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
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200">
                  <CalendarIcon size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg font-semibold">No sessions for this date</p>
                </div>
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
    <div className="space-y-6 animate-fade-in">
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-xl">
            <Clock size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">My Work Hours</h1>
            <p className="text-gray-600 text-lg font-medium">Track your own work hours and productivity</p>
          </div>
        </div>
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
