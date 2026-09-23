import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { categories, isAdminLoggedIn } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      {/* Saudi National Day Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-saudi-900 via-saudi-700 to-saudi-800 text-white text-xs sm:text-sm py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-gold-500 text-saudi-950 font-black text-[11px] px-2 py-0.5 rounded-full shadow-sm">
              🇸🇦 96
            </span>
            <span className="hidden sm:inline">عروض اليوم الوطني السعودي 96</span>
            <span className="text-gold-300 font-bold">خصومات تصل إلى 70% حتى 30 سبتمبر!</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-saudi-100">
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              منتجات أصلية ومضمونة 100%
            </span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full font-bold text-gold-300">
              توصيل لجميع مناطق المملكة 🇸🇦
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/images/altayeb_logo.webp"
                alt="صيدلية الطيب"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-12 w-12 bg-saudi-700 text-white rounded-xl items-center justify-center font-black text-xl shadow-md">
                ط
              </div>
            </div>
            
            <div className="border-r-2 border-saudi-700 pr-3">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-saudi-800 tracking-tight font-tajawal">
                  صيدلية الطيب
                </h1>
                <span className="bg-saudi-100 text-saudi-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-saudi-300">
                  معتمدة
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                عروض اليوم الوطني 96 · نحلم ونحقق
              </p>
            </div>
          </Link>

          {/* Center Dynamic Categories Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                location.pathname === '/'
                  ? 'text-saudi-700 bg-saudi-50'
                  : 'text-gray-700 hover:text-saudi-700 hover:bg-gray-50'
              }`}
            >
              الرئيسية
            </Link>

            {categories.map((cat) => {
              const isActive = location.pathname === `/brand/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  to={`/brand/${cat.slug}`}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'text-saudi-700 bg-saudi-50 shadow-sm'
                      : 'text-gray-700 hover:text-saudi-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.nameAr}</span>
                  {cat.badge && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-full font-black">
                      {cat.badge.replace('خصم ', '')}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Customer CTA (Hidden Admin portal unless already logged in) */}
          <div className="flex items-center gap-3">
            {isAdminLoggedIn ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 bg-saudi-800 hover:bg-saudi-900 text-gold-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-gold-500/30 shadow-sm transition-all"
                id="admin-dashboard-nav-btn"
                title="أنت مسجل كمدير نظام"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-gold-400" />
                <span>لوحة الإدارة</span>
              </Link>
            ) : (
              <a
                href="#national-day-offers"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('national-day-offers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/#national-day-offers';
                }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-saudi-950 text-xs sm:text-sm font-black px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>عروض اليوم الوطني</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Categories Horizontal Bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50/90 border-t border-gray-100 overflow-x-auto scrollbar-none">
        <Link
          to="/"
          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
            location.pathname === '/' ? 'bg-saudi-700 text-white' : 'text-gray-600 bg-white border border-gray-200'
          }`}
        >
          الرئيسية
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/brand/${cat.slug}`}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
              location.pathname === `/brand/${cat.slug}`
                ? 'bg-saudi-700 text-white'
                : 'text-gray-600 bg-white border border-gray-200'
            }`}
          >
            <span>{cat.icon || '🏷️'}</span>
            <span>{cat.nameAr}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
