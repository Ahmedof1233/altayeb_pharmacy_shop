import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Tag, ChevronLeft } from 'lucide-react';

export default function BrandCarousel() {
  const { products, categories } = useApp();

  // Get product count for each brand/category
  const getProductCount = (categorySlug) => {
    return products.filter(p => p.brand.toLowerCase() === categorySlug.toLowerCase()).length;
  };

  return (
    <section id="brands-section" className="py-14 sm:py-20 bg-gray-50/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saudi-100 text-saudi-800 text-xs font-bold mb-3 border border-saudi-200">
            <Tag className="w-3.5 h-3.5 text-saudi-700" />
            <span>أقسام وماركات اليوم الوطني المشاركة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-tajawal text-gray-900 mb-3">
            اختر القسم وتصفح عروضه الحصرية 🇸🇦
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            عروض اليوم الوطني 96 متوفرة على كافة الأقسام والماركات بخصومات تصل حتى 70%
          </p>
        </div>

        {/* Categories / Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((brand) => {
            const count = getProductCount(brand.slug);

            return (
              <Link
                key={brand.slug}
                to={`/brand/${brand.slug}`}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-200/80 hover:border-saudi-500 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Corner Ribbon / Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:scale-110 transition-transform">
                    {brand.icon}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>{brand.badge}</span>
                  </div>
                </div>

                {/* Brand Info */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900 group-hover:text-saudi-700 transition-colors">
                      {brand.nameAr}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400 font-sans">
                      {brand.nameEn}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {brand.tagline}
                  </p>
                </div>

                {/* Footer with Count & Spoke Link Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">
                    متوفر <strong className="text-saudi-700 font-bold">{count}</strong> منتج بالعرض
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold text-saudi-700 group-hover:text-saudi-800 group-hover:translate-x-[-4px] transition-all">
                    <span>تصفح المنتجات</span>
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>

                {/* Bottom subtle accent line */}
                <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-saudi-700 via-gold-400 to-saudi-700 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
