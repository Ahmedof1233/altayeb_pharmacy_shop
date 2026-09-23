import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import ProductsTable from '../components/admin/ProductsTable';
import OrdersTable from '../components/admin/OrdersTable';
import CategoriesManager from '../components/admin/CategoriesManager';
import { ShoppingBag, DollarSign, Package, Clock, ShieldCheck, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdminLoggedIn, products, orders, categories } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('categories'); // default to categories or products

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0).toFixed(2);
  const newOrdersCount = orders.filter(o => o.status === 'جديد').length;

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
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-saudi-100 text-saudi-800 flex items-center justify-center font-bold text-xs">
                م
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-900 block">مدير النظام</span>
                <span className="text-[10px] text-emerald-600 font-semibold">متصل الآن</span>
              </div>
            </div>
          </div>
        </div>

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
