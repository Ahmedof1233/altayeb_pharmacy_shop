import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/client/ProductCard';
import OrderModal from '../components/client/OrderModal';
import { ArrowRight, Sparkles, ChevronLeft, ShieldCheck, Tag } from 'lucide-react';

export default function BrandPage() {
  const { brandName } = useParams();
  const { products, brandsInfo } = useApp();

  const brandKey = brandName?.toLowerCase() || '';
  const brandMeta = brandsInfo[brandKey] || {
    id: brandKey,
    nameAr: brandKey.toUpperCase(),
    nameEn: brandKey,
    badge: 'عروض حصرية',
    tagline: 'تخفيضات اليوم الوطني السعودي 96',
    color: 'from-saudi-800 to-saudi-900',
    icon: '✨'
  };

  // Filter products by brand
  const brandProducts = products.filter(
    p => p.brand.toLowerCase() === brandKey
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between" dir="rtl">
      <div>
        {/* Brand Header Banner */}
        <section className={`relative bg-gradient-to-r ${brandMeta.color || 'from-saudi-900 to-saudi-800'} text-white py-12 sm:py-16 overflow-hidden`}>
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gold-400 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-saudi-200/80 mb-6 font-medium">
              <Link to="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>ماركات اليوم الوطني</span>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-white font-bold">{brandMeta.nameAr}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-300 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{brandMeta.badge} · اليوم الوطني 96 🇸🇦</span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{brandMeta.icon}</span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-tajawal text-white">
                    منتجات {brandMeta.nameAr}
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-saudi-100/90 max-w-xl leading-relaxed">
                  {brandMeta.tagline}
                </p>
              </div>

              {/* Stat card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center min-w-[200px]">
                <span className="text-xs text-saudi-200 block mb-1">المنتجات المشمولة بالعرض</span>
                <span className="text-3xl sm:text-4xl font-black text-gold-300 font-tajawal">
                  {brandProducts.length}
                </span>
                <span className="text-xs text-white/80 block mt-1 font-medium">
                  منتج أصلي 100%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
                عروض وتخفيضات {brandMeta.nameAr}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                اضغط على "اطلب الآن" لإتمام طلبك بأسعار اليوم الوطني
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-saudi-700 hover:text-saudi-800 transition-colors"
            >
              <span>الرجوع لكافة العروض</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of brand products */}
          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brandProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                لا توجد منتجات مسجلة لهذه الماركة حالياً
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                يمكن لإدارة الصيدلية إضافة منتجات لهذه الماركة من خلال لوحة التحكم
              </p>
              <Link
                to="/"
                className="inline-block bg-saudi-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-saudi-800 transition-colors"
              >
                تصفح باقي الماركات
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Order Modal */}
      <OrderModal />
    </div>
  );
}
