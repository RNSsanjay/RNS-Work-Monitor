import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Calendar as CalendarIcon, BarChart3, Clock, Shield, TrendingUp, Activity } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth } from 'date-fns';

function AdminHome() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarData = async () => {
    const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd');

    try {
      const response = await adminAPI.getCalendarData(start, end);
      setCalendarData(response.data);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card-gradient from-purple-500 via-pink-500 to-red-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
              <Shield size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-1">Admin Dashboard</h1>
              <p className="text-purple-100 text-lg font-medium">System overview and management</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-5 py-3 rounded-xl backdrop-blur-sm">
              <BarChart3 size={24} className="text-white" />
              <div className="text-white">
                <p className="text-xs font-medium opacity-90">Total Users</p>
                <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-gradient from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">Total Users</p>
                <p className="text-4xl font-extrabold text-white">{stats.total_users}</p>
                <p className="text-blue-200 text-xs mt-2 font-medium">All system users</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <Users size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-gradient from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-semibold mb-1">Employees</p>
                <p className="text-4xl font-extrabold text-white">{stats.total_employees}</p>
                <p className="text-green-200 text-xs mt-2 font-medium">Active employees</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <Users size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-gradient from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">Managers</p>
                <p className="text-4xl font-extrabold text-white">{stats.total_managers}</p>
                <p className="text-purple-200 text-xs mt-2 font-medium">Team leaders</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <Shield size={40} className="text-white" />
              </div>
            </div>
          </div>

          <div className="card-gradient from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">Active Today</p>
                <p className="text-4xl font-extrabold text-white">{stats.active_sessions_today}</p>
                <p className="text-orange-200 text-xs mt-2 font-medium">Current sessions</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                <Activity size={40} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <Link
            to="/admin"
            className="pb-3 px-6 font-bold border-b-4 border-purple-600 text-purple-600 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Overview</span>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>All Users</span>
            </div>
          </Link>
          <Link
            to="/admin/calendar"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <CalendarIcon size={20} />
              <span>Calendar</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Users className="text-purple-600" size={28} />
          <span>Recent Users</span>
        </h2>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-6 font-semibold text-gray-900">{user.full_name}</td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AllUsers() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const role = filter === 'all' ? null : filter;
      const response = await adminAPI.getAllUsers(role);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <Link
            to="/admin"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Overview</span>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="pb-3 px-6 font-bold border-b-4 border-purple-600 text-purple-600 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>All Users</span>
            </div>
          </Link>
          <Link
            to="/admin/calendar"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <CalendarIcon size={20} />
              <span>Calendar</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-3">
            <Users className="text-purple-600" size={36} />
            <span>All Users</span>
          </h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white ${
                      user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      user.role === 'manager' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                      'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                  {user.shift_start && user.shift_end && (
                    <p className="text-xs text-gray-500 font-semibold flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{user.shift_start} - {user.shift_end}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarView() {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workHoursData, setWorkHoursData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkHours();
  }, [selectedDate]);

  const fetchWorkHours = async () => {
    setLoading(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const response = await adminAPI.getAllWorkHours(dateStr);
      setWorkHoursData(response.data);
    } catch (error) {
      toast.error('Failed to fetch work hours');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex space-x-2 border-b-2 border-gray-200">
          <Link
            to="/admin"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Overview</span>
            </div>
          </Link>
          <Link
            to="/admin/users"
            className="pb-3 px-6 font-bold border-b-4 border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Users size={20} />
              <span>All Users</span>
            </div>
          </Link>
          <Link
            to="/admin/calendar"
            className="pb-3 px-6 font-bold border-b-4 border-purple-600 text-purple-600 -mb-[2px] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <CalendarIcon size={20} />
              <span>Calendar</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="card">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center space-x-3">
          <CalendarIcon className="text-purple-600" size={36} />
          <span>Calendar View</span>
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-200 hover:border-purple-300 transition-all">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full border-0 rounded-xl"
            />
          </div>

          {/* Work Hours for Selected Date */}
          <div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-4 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">
                {format(selectedDate, 'MMMM dd, yyyy')}
              </h2>
              <p className="text-purple-100 font-medium">
                {workHoursData.length} employee{workHoursData.length !== 1 ? 's' : ''} worked
              </p>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading work hours...</p>
              </div>
            ) : workHoursData.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border-2 border-gray-200">
                <CalendarIcon size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No work hours recorded</p>
                <p className="text-gray-500 text-sm mt-2">for this date</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {workHoursData.map((data, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white ${
                          data.role === 'manager' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                          'bg-gradient-to-br from-green-500 to-emerald-600'
                        }`}>
                          {data.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{data.user_name}</h3>
                          <p className={`text-xs font-bold uppercase ${
                            data.role === 'manager' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {data.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-purple-600">
                          {data.total_active_hours}
                        </p>
                        <p className="text-xs text-gray-600 font-semibold">hours</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 font-semibold">
                        <Activity size={16} className="text-purple-600" />
                        <span>{data.sessions_count} session{data.sessions_count !== 1 ? 's' : ''}</span>
                      </div>
                      {data.shift_start && data.shift_end && (
                        <p className="text-xs text-gray-500 font-semibold flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{data.shift_start} - {data.shift_end}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/users" element={<AllUsers />} />
      <Route path="/calendar" element={<CalendarView />} />
    </Routes>
  );
}
