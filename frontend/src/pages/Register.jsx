import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, Sparkles, ArrowRight, Shield } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    role: 'employee',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await register(formData);
    
    if (success) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roleColors = {
    employee: 'from-green-500 to-emerald-500',
    manager: 'from-blue-500 to-cyan-500',
    admin: 'from-purple-500 to-pink-500',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-2xl w-full relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Join Our Team
            </span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">Create your account and start tracking</p>
        </div>

        {/* Register Card */}
        <div className="card animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="label flex items-center space-x-2">
                  <Mail size={18} className="text-blue-600" />
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-12 hover:border-blue-400 focus:scale-[1.02] transition-transform"
                    placeholder="you@example.com"
                    required
                  />
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="label flex items-center space-x-2">
                  <User size={18} className="text-blue-600" />
                  <span>Username</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input pl-12 hover:border-blue-400 focus:scale-[1.02] transition-transform"
                    placeholder="johndoe"
                    required
                  />
                  <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="label flex items-center space-x-2">
                <User size={18} className="text-blue-600" />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input pl-12 hover:border-blue-400 focus:scale-[1.02] transition-transform"
                  placeholder="John Doe"
                  required
                />
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="label flex items-center space-x-2">
                <Shield size={18} className="text-blue-600" />
                <span>Select Your Role</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['employee', 'manager', 'admin'].map((role) => (
                  <label
                    key={role}
                    className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.role === role
                        ? `bg-gradient-to-br ${roleColors[role]} border-transparent text-white shadow-lg scale-105`
                        : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold capitalize">{role}</span>
                    {formData.role === role && (
                      <span className="absolute -top-2 -right-2 bg-white text-green-600 rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label flex items-center space-x-2">
                <Lock size={18} className="text-blue-600" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-12 hover:border-blue-400 focus:scale-[1.02] transition-transform"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center space-x-2 text-lg group"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
              ) : (
                <>
                  <UserPlus size={22} />
                  <span>Create Account</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            to="/login" 
            className="block text-center py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
          >
            <span className="text-gray-700 group-hover:text-blue-700 font-semibold flex items-center justify-center space-x-2">
              <span>Sign in instead</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
