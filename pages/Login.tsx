
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, ShieldCheck, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
    } else {
      // Redirection is handled by the useEffect above when user state updates
    }
  };

  const handleDemoLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(false);
    // Automatically attempt login for demo convenience
    const success = login(u, p);
    if (!success) setError(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-4 rounded-3xl text-white mb-6 shadow-xl shadow-blue-100">
            <Clock size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Attendance Portal</h1>
          <p className="text-gray-500 font-medium">Attendance Tracking Management System</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border transition-all outline-none focus:ring-4 focus:ring-blue-100 ${
                    error ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-semibold px-1">Invalid username or password.</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100">
            <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => handleDemoLogin('Kavin', '1234')}
                className="cursor-pointer p-4 rounded-2xl bg-blue-50 border border-blue-100 group hover:bg-blue-600 hover:border-blue-600 transition-all"
              >
                <UserIcon className="text-blue-600 mb-2 group-hover:text-white" size={20} />
                <p className="text-xs font-black text-blue-900 group-hover:text-white">EMPLOYEE</p>
                <p className="text-xs font-medium text-blue-600 group-hover:text-blue-100">User: Kavin</p>
                <p className="text-xs font-medium text-blue-600 group-hover:text-blue-100">Pass: 1234</p>
              </div>
              <div 
                onClick={() => handleDemoLogin('Admin', '1234')}
                className="cursor-pointer p-4 rounded-2xl bg-indigo-50 border border-indigo-100 group hover:bg-indigo-600 hover:border-indigo-600 transition-all"
              >
                <ShieldCheck className="text-indigo-600 mb-2 group-hover:text-white" size={20} />
                <p className="text-xs font-black text-indigo-900 group-hover:text-white">ADMIN</p>
                <p className="text-xs font-medium text-indigo-600 group-hover:text-indigo-100">User: Admin</p>
                <p className="text-xs font-medium text-indigo-600 group-hover:text-indigo-100">Pass: 1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
