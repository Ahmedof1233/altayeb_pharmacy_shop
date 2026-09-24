import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, User, Key, ArrowRight, ShieldCheck, AlertCircle, Mail, CheckCircle2, Cloud, HelpCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, resetPassword, isAdminLoggedIn, isFirebaseConfigured } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ error: '', success: '', loading: false });

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء محاولة تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetStatus({ error: '', success: '', loading: true });
    const res = await resetPassword(resetEmail);

    if (res.success) {
      setResetStatus({ error: '', success: res.message, loading: false });
    } else {
      setResetStatus({ error: res.message, success: '', loading: false });
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

        {/* Database Status Tag */}
        <div className="flex justify-center mb-4">
          {isFirebaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              قاعدة بيانات سحابية متصلة (Firebase) 🟢
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              الوضع التجريبي المحلي 🟡 (جاهز للربط مع Firebase)
            </span>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-6">
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
              {isFirebaseConfigured ? 'البريد الإلكتروني أو اسم المستخدم' : 'اسم المستخدم'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isFirebaseConfigured ? 'admin@altayeb.com أو admin' : 'admin'}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 pr-10 text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all font-mono"
                id="admin-username-input"
              />
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700">
                كلمة المرور
              </label>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsForgotModalOpen(true);
                }}
                className="text-[11px] text-saudi-700 hover:text-saudi-900 font-semibold transition-colors"
                id="forgot-password-link"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
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
            disabled={loading}
            className="w-full bg-saudi-700 hover:bg-saudi-800 active:bg-saudi-900 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 mt-2 text-sm flex items-center justify-center gap-2"
            id="admin-login-submit-btn"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>دخول لوحة التحكم</span>
            )}
          </button>
        </form>

        {/* Helper callout for default credentials if in fallback mode */}
        {!isFirebaseConfigured && (
          <div className="mt-6 p-3 bg-saudi-50/60 rounded-xl border border-saudi-100 text-[11px] text-saudi-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-saudi-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">بيانات الدخول الافتراضية للوضع المحلي:</span>
              <span>المستخدم: <strong className="font-mono">admin</strong> | الباسورد: <strong className="font-mono">Altayeb@2026</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-saudi-50 text-saudi-700 rounded-2xl flex items-center justify-center mx-auto mb-2.5 border border-saudi-100 shadow-sm">
                <Mail className="w-6 h-6 text-saudi-700" />
              </div>
              <h3 className="text-lg font-black text-gray-900">استعادة كلمة المرور</h3>
              <p className="text-xs text-gray-500 mt-1">
                أدخل البريد الإلكتروني لمسؤول النظام لإرسال رابط إعادة التعيين
              </p>
            </div>

            {resetStatus.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{resetStatus.error}</span>
              </div>
            )}

            {resetStatus.success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{resetStatus.success}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@altayebpharmacy.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 pr-10 text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all font-mono"
                    id="admin-reset-email-input"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={resetStatus.loading}
                  className="flex-1 bg-saudi-700 hover:bg-saudi-800 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                  id="send-reset-btn"
                >
                  {resetStatus.loading ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>إرسال الرابط</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setResetStatus({ error: '', success: '', loading: false });
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                  id="close-reset-modal-btn"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
