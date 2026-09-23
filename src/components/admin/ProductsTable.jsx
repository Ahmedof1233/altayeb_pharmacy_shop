import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Search, ExternalLink, Tag } from 'lucide-react';
import AddProductModal from './AddProductModal';

export default function ProductsTable() {
  const { products, deleteProduct, calculateFinalPrice, calculateOfferPricing, categories, brandsInfo } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesBrand = brandFilter === 'all' || p.brand.toLowerCase() === brandFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query));
    return matchesBrand && matchesQuery;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج: "${name}"؟`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        {/* Search & Brand Filter */}
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="بحث بالاسم أو الماركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 pr-9 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all placeholder:text-gray-400"
              id="admin-search-products-input"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </div>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-gray-700 outline-none focus:ring-2 focus:ring-saudi-600"
          >
            <option value="all">جميع الأقسام والماركات</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-saudi-700 hover:bg-saudi-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
          id="admin-open-add-product-btn"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-600 font-bold text-[11px] sm:text-xs border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">الصورة</th>
                <th className="py-3.5 px-4">اسم المنتج</th>
                <th className="py-3.5 px-4">الماركة</th>
                <th className="py-3.5 px-4">السعر الأصلي</th>
                <th className="py-3.5 px-4">الخصم</th>
                <th className="py-3.5 px-4">سعر العرض</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, idx) => {
                  const pricing1 = calculateOfferPricing(p, 1);
                  const pricing2 = calculateOfferPricing(p, 2);
                  const brandMeta = brandsInfo[p.brand.toLowerCase()];

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-gray-400 text-xs">
                        {idx + 1}
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            src={p.image || '/images/altayeb_logo.webp'}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-gray-900 leading-tight">
                          {p.nameAr || p.name}
                        </p>
                        {p.nameAr && p.name !== p.nameAr && (
                          <p className="text-[11px] text-gray-400 font-sans truncate">
                            {p.name}
                          </p>
                        )}
                      </td>

                      {/* Brand */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block bg-saudi-50 text-saudi-800 border border-saudi-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {brandMeta?.nameAr || p.brand}
                        </span>
                      </td>

                      {/* Original Price */}
                      <td className="py-3.5 px-4 text-gray-500 font-mono">
                        {p.price} ر.س
                      </td>

                      {/* Offer Type & Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${pricing1.badgeColor}`}>
                          {pricing1.badgeText}
                        </span>
                      </td>

                      {/* Final Price / Deal details */}
                      <td className="py-3.5 px-4">
                        {p.offerType === 'second_piece_96' ? (
                          <div>
                            <span className="font-black text-saudi-700 font-tajawal text-sm block">
                              {pricing2.total} ر.س <span className="text-[10px] text-gray-500 font-normal">(للحبتين)</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold block">
                              الحبة 2 بـ {(parseFloat(p.price) * 0.04).toFixed(2)} ر.س
                            </span>
                          </div>
                        ) : p.offerType === 'two_for_96' ? (
                          <div>
                            <span className="font-black text-saudi-700 font-tajawal text-sm block">
                              96.00 ر.س <span className="text-[10px] text-gray-500 font-normal">(للحبتين)</span>
                            </span>
                          </div>
                        ) : p.offerType === 'buy_1_get_1' ? (
                          <div>
                            <span className="font-black text-saudi-700 font-tajawal text-sm block">
                              {p.price} ر.س <span className="text-[10px] text-purple-700 font-bold">(حبتين)</span>
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-saudi-700 font-tajawal text-sm sm:text-base">
                            {pricing1.total} ر.س
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(p.id, p.nameAr || p.name)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-400">
                    لا توجد منتجات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
