import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, Calendar as CalendarIcon, BarChart3, Clock } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 size={32} className="text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System overview and management</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats.total_users}</p>
              </div>
              <Users size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Employees</p>
                <p className="text-3xl font-bold">{stats.total_employees}</p>
              </div>
              <Users size={40} className="text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Managers</p>
                <p className="text-3xl font-bold">{stats.total_managers}</p>
              </div>
              <Users size={40} className="text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Today</p>
                <p className="text-3xl font-bold">{stats.active_sessions_today}</p>
              </div>
              <Clock size={40} className="text-orange-200" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="card">
        <div className="flex space-x-4 border-b border-gray-200 pb-2">
          <Link
            to="/admin"
            className="px-4 py-2 border-b-2 border-primary-600 text-primary-600 font-medium"
          >
            Overview
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
          >
            All Users
          </Link>
          <Link
            to="/admin/calendar"
            className="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
          >
            Calendar View
          </Link>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">{user.full_name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
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
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
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
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 capitalize">
                    {user.role}
                  </span>
                </div>
                {user.shift_start && user.shift_end && (
                  <p className="text-xs text-gray-500 mt-2">
                    Shift: {user.shift_start} - {user.shift_end}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarView() {
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
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar View</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full border-0 rounded-lg shadow-md"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Work Hours for {format(selectedDate, 'MMMM dd, yyyy')}
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : workHoursData.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No work hours recorded for this date</p>
            ) : (
              <div className="space-y-3">
                {workHoursData.map((data, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{data.user_name}</h3>
                        <p className="text-xs text-gray-600 capitalize">{data.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {data.total_active_hours} hrs
                        </p>
                        <p className="text-xs text-gray-600">
                          {data.sessions_count} session{data.sessions_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {data.shift_start && data.shift_end && (
                      <p className="text-xs text-gray-500">
                        Shift: {data.shift_start} - {data.shift_end}
                      </p>
                    )}
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
