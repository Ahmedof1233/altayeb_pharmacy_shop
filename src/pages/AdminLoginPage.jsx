import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, User, Key, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAdminLoggedIn } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(username, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saudi-950 via-saudi-900 to-saudi-950 flex flex-col justify-center items-center p-4" dir="rtl">
      {/* Return to store link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs text-saudi-200">
        <Link to="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى متجر اليوم الوطني</span>
        </Link>
        <span className="font-bold text-gold-400">اليوم الوطني 96 🇸🇦</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Top celebratory accent */}
        <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-saudi-700 via-gold-400 to-saudi-700"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-saudi-50 text-saudi-700 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-saudi-200 shadow-sm">
            <Lock className="w-8 h-8 text-saudi-700" />
          </div>
          <h2 className="text-2xl font-black font-tajawal text-gray-900">
            لوحة تحكم صيدلية الطيب
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            تسجيل دخول مسؤول النظام لإدارة المنتجات والطلبات
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 pr-10 text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all font-mono"
                id="admin-username-input"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 pr-10 text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all font-mono"
                id="admin-password-input"
              />
              <Key className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-saudi-700 hover:bg-saudi-800 active:bg-saudi-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 mt-2 text-sm"
            id="admin-login-submit-btn"
          >
            دخول لوحة التحكم
          </button>
        </form>
      </div>
    </div>
  );
}
