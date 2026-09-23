import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Package, ShoppingCart, Layers, Store, LogOut, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const { products, orders, categories, logout } = useApp();

  const newOrdersCount = orders.filter(o => o.status === 'جديد').length;

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col justify-between h-screen sticky top-0" dir="rtl">
      <div>
        {/* Brand / Logo header */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/altayeb_logo.webp"
              alt="صيدلية الطيب"
              className="h-10 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 className="font-tajawal font-black text-gray-900 text-lg leading-tight">
                صيدلية الطيب
              </h2>
              <span className="text-[11px] text-saudi-700 font-bold block">
                لوحة الإدارة · اليوم الوطني 🇸🇦
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-bold text-gray-400 px-3 py-2">
            القوائم الرئيسية
          </div>

          {/* Categories Tab */}
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-saudi-700 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-saudi-700'
            }`}
            id="admin-tab-categories"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5" />
              <span>الأقسام والتصنيفات</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'categories'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {categories.length}
            </span>
          </button>

          {/* Products Tab */}
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-saudi-700 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-saudi-700'
            }`}
            id="admin-tab-products"
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5" />
              <span>المنتجات</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'products'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Orders Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-saudi-700 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-saudi-700'
            }`}
            id="admin-tab-orders"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5" />
              <span>الطلبات</span>
            </div>
            <div className="flex items-center gap-1.5">
              {newOrdersCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {newOrdersCount} جديد
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {orders.length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Footer Navigation: Back to Store + Logout */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-saudi-700" />
            <span>عرض المتجر للعملاء</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          id="admin-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
