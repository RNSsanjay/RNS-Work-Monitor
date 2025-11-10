import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(formData);
    
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">Sign in to track your work hours</p>
        </div>

        {/* Login Card */}
        <div className="card animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                />
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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
                  <LogIn size={22} />
                  <span>Sign In</span>
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
              <span className="px-4 bg-white text-gray-500 font-semibold">New here?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link 
            to="/register" 
            className="block text-center py-3 px-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
          >
            <span className="text-gray-700 group-hover:text-blue-700 font-semibold flex items-center justify-center space-x-2">
              <span>Create new account</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-md">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-semibold text-gray-700">Fast Track</p>
          </div>
          <div className="p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-md">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs font-semibold text-gray-700">Secure</p>
          </div>
          <div className="p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-xl shadow-md">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs font-semibold text-gray-700">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
