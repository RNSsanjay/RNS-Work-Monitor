import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'manager': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'employee': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-white border-opacity-20 shadow-lg animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Work Hours Monitor
                </h1>
                <p className="text-xs text-gray-600 font-medium">Track, Monitor & Analyze</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-md border border-gray-200">
                <div className={`${getRoleBadgeColor(user?.role)} p-2 rounded-lg`}>
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user?.full_name}</p>
                  <p className="text-xs font-semibold text-gray-600 capitalize flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${getRoleBadgeColor(user?.role)} mr-1`}></span>
                    {user?.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 animate-slide-down bg-white bg-opacity-95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md border border-gray-200">
                <div className={`${getRoleBadgeColor(user?.role)} p-2 rounded-lg`}>
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user?.full_name}</p>
                  <p className="text-xs font-semibold text-gray-600 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-md font-semibold"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium">© 2024 Work Hours Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
