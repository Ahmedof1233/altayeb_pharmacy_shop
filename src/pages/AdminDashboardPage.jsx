import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import ProductsTable from '../components/admin/ProductsTable';
import OrdersTable from '../components/admin/OrdersTable';
import CategoriesManager from '../components/admin/CategoriesManager';
import { ShoppingBag, DollarSign, Package, Clock, ShieldCheck, Layers, Key, X, CheckCircle, AlertCircle, Cloud, Database, RefreshCw, UploadCloud } from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    isAdminLoggedIn, 
    products, 
    orders, 
    categories, 
    adminCredentials, 
    updateAdminPassword,
    isFirebaseConfigured,
    currentAdminUser,
    seedData
  } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('categories'); // default to categories or products

  // Seeder state
  const [seedStatus, setSeedStatus] = useState({ loading: false, message: '', error: '' });

  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newUsername: adminCredentials?.username || 'admin',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '' });

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0).toFixed(2);
  const newOrdersCount = orders.filter(o => o.status === 'جديد').length;

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus({ error: '', success: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ error: 'كلمة المرور الجديدة وتأكيدها غير متطابقين', success: '' });
      return;
    }

    const res = updateAdminPassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.newUsername
    );

    if (res.success) {
      setPasswordStatus({ error: '', success: res.message });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordStatus({ error: '', success: '' });
        setPasswordForm({
          currentPassword: '',
          newUsername: passwordForm.newUsername,
          newPassword: '',
          confirmPassword: ''
        });
      }, 1500);
    } else {
      setPasswordStatus({ error: res.message, success: '' });
    }
  };

  const handleSeed = async () => {
    setSeedStatus({ loading: true, message: '', error: '' });
    const res = await seedData();
    if (res.success) {
      setSeedStatus({ loading: false, message: res.message, error: '' });
    } else {
      setSeedStatus({ loading: false, message: '', error: res.message });
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'categories':
        return {
          title: 'إدارة الأقسام والتصنيفات (Categories)',
          desc: 'إضافة وإدارة أقسام المتجر التي تظهر في الشريط العلوي والصفحة الرئيسية'
        };
      case 'products':
        return {
          title: 'إدارة كتالوج المنتجات',
          desc: 'عرض وتعديل وإضافة منتجات عروض اليوم الوطني 96 وربطها بالتصنيفات'
        };
      case 'orders':
        return {
          title: 'إدارة طلبات العملاء',
          desc: 'متابعة الطلبات الواردة وتحديث حالات الشحن والتوصيل ومراسلة العملاء'
        };
      default:
        return { title: 'لوحة التحكم', desc: '' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saudi-100 text-saudi-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-saudi-700" />
              <span>لوحة التحكم الرئيسية · صيدلية الطيب 🇸🇦</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-gray-900">
              {headerInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {headerInfo.desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Change Password Button */}
            <button
              onClick={() => {
                setPasswordForm({
                  currentPassword: '',
                  newUsername: adminCredentials?.username || 'admin',
                  newPassword: '',
                  confirmPassword: ''
                });
                setPasswordStatus({ error: '', success: '' });
                setIsPasswordModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
              id="admin-change-password-btn"
            >
              <Key className="w-3.5 h-3.5 text-saudi-700" />
              <span>تغيير كلمة المرور</span>
            </button>

            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-saudi-100 text-saudi-800 flex items-center justify-center font-bold text-xs">
                م
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-900 block">{adminCredentials?.username || 'مدير النظام'}</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  سحابي متصل (Firebase)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-right mb-6">
                <div className="w-12 h-12 bg-saudi-50 text-saudi-700 rounded-xl flex items-center justify-center mb-3 border border-saudi-200">
                  <Key className="w-6 h-6 text-saudi-700" />
                </div>
                <h3 className="text-xl font-black font-tajawal text-gray-900">
                  تغيير بيانات الدخول وكلمة المرور
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  قم بتعيين كلمة مرور سرية جديدة للوحة التحكم لحماية بيانات الصيدلية
                </p>
              </div>

              {passwordStatus.error && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordStatus.error}</span>
                </div>
              )}

              {passwordStatus.success && (
                <div className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-3 text-xs mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordStatus.success}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-right">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    اسم المستخدم (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={passwordForm.newUsername}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    كلمة المرور الحالية <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="أدخل كلمة المرور الحالية"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    كلمة المرور الجديدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="اختر كلمة مرور سرية جديدة"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="أعد كتابة كلمة المرور الجديدة"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-saudi-700 hover:bg-saudi-800 text-white text-xs font-bold shadow-md transition-colors"
                    id="admin-save-password-btn"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Categories */}
          <div 
            onClick={() => setActiveTab('categories')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'categories' ? 'bg-saudi-50/60 border-saudi-400 shadow-md' : 'bg-white border-gray-200/80 shadow-sm hover:border-saudi-300'
            } flex items-center justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">الأقسام والتصنيفات</span>
              <span className="text-2xl font-black text-gray-900 font-tajawal">{categories.length}</span>
              <span className="text-[11px] text-saudi-700 font-bold block mt-0.5">قسم نشط بالمتجر</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-saudi-100 text-saudi-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Total Products */}
          <div 
            onClick={() => setActiveTab('products')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'products' ? 'bg-purple-50/60 border-purple-400 shadow-md' : 'bg-white border-gray-200/80 shadow-sm hover:border-purple-300'
            } flex items-center justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">المنتجات النشطة</span>
              <span className="text-2xl font-black text-gray-900 font-tajawal">{products.length}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">منتج بالعرض</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Total Orders */}
          <div 
            onClick={() => setActiveTab('orders')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'orders' ? 'bg-blue-50/60 border-blue-400 shadow-md' : 'bg-white border-gray-200/80 shadow-sm hover:border-blue-300'
            } flex items-center justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">إجمالي الطلبات</span>
              <span className="text-2xl font-black text-gray-900 font-tajawal">{orders.length}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                {newOrdersCount > 0 ? `${newOrdersCount} جديد` : 'طلب وارد'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">إجمالي المبيعات</span>
              <span className="text-2xl font-black text-saudi-700 font-tajawal">{totalRevenue}</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">ريال سعودي</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dynamic View: Categories, Products, or Orders */}
        {activeTab === 'categories' && <CategoriesManager />}
        {activeTab === 'products' && <ProductsTable />}
        {activeTab === 'orders' && <OrdersTable />}
      </main>
    </div>
  );
}
