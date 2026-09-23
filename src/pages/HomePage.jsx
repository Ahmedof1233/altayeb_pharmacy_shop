import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../components/client/Hero';
import FeaturesBanner from '../components/client/FeaturesBanner';
import BrandCarousel from '../components/client/BrandCarousel';
import ProductCard from '../components/client/ProductCard';
import OrderModal from '../components/client/OrderModal';
import { Search, Sparkles, Filter, Percent } from 'lucide-react';

export default function HomePage() {
  const { products, categories, brandsInfo } = useApp();
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products by brand and search query
  const filteredProducts = products.filter(p => {
    const matchesBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query || 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query));
    return matchesBrand && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Hero Section */}
      <Hero />

      {/* Features Banner */}
      <FeaturesBanner />

      {/* Hub & Spoke: Brand Carousel */}
      <BrandCarousel />

      {/* Offers Section */}
      <section id="national-day-offers" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saudi-100 text-saudi-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>كتالوج العروض الحصرية 🇸🇦</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-tajawal text-gray-900">
              جميع عروض وتخفيضات اليوم الوطني
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              اختر منتجك المفضل واضغط على "اطلب الآن" للاستفادة من خصم العرض فوراً
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="ابحث عن اسم المنتج أو الماركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 pr-10 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:border-saudi-600 outline-none transition-all placeholder:text-gray-400 shadow-sm"
              id="product-search-input"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          </div>
        </div>

        {/* Brand / Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedBrand === 'all'
                ? 'bg-saudi-700 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            كل العروض ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.brand.toLowerCase() === cat.slug.toLowerCase()).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedBrand(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedBrand === cat.slug
                    ? 'bg-saudi-700 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{cat.nameAr}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedBrand === cat.slug ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">لم يتم العثور على منتجات</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              جرب البحث بكلمات أخرى أو اختر ماركة مختلفة من القائمة أعلاه
            </p>
            <button
              onClick={() => { setSelectedBrand('all'); setSearchQuery(''); }}
              className="bg-saudi-700 text-white text-xs font-bold py-2 px-5 rounded-xl hover:bg-saudi-800 transition-colors"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}
      </section>

      {/* Floating/Triggered Order Modal */}
      <OrderModal />
    </div>
  );
}
