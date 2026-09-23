import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Tag, Layers, ExternalLink, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoriesManager() {
  const { categories, addCategory, deleteCategory, products } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    badge: 'خصم 50%',
    icon: '✨',
    tagline: ''
  });
  const [error, setError] = useState('');

  const getProductCount = (slug) => {
    return products.filter(p => p.brand.toLowerCase() === slug.toLowerCase()).length;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nameAr.trim()) {
      setError('يرجى إدخال اسم القسم بالعربية');
      return;
    }

    const slug = (formData.nameEn || formData.nameAr)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    if (categories.some(c => c.slug.toLowerCase() === slug.toLowerCase())) {
      setError('هذا المعرف أو الرابط موجود مسبقاً، يرجى اختيار اسم مختلف');
      return;
    }

    addCategory({
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim() || formData.nameAr.trim(),
      slug: slug,
      badge: formData.badge.trim() || 'خصم 50%',
      icon: formData.icon || '✨',
      tagline: formData.tagline.trim() || `عروض وتخفيضات ${formData.nameAr} بمناسبة اليوم الوطني 96`
    });

    setIsAddModalOpen(false);
    setFormData({ nameAr: '', nameEn: '', badge: 'خصم 50%', icon: '✨', tagline: '' });
  };

  const handleDelete = (slug, nameAr) => {
    const count = getProductCount(slug);
    const msg = count > 0
      ? `تحذير: يوجد ${count} منتج مرتبط بهذا القسم ("${nameAr}"). هل أنت متأكد من حذف القسم؟`
      : `هل أنت متأكد من حذف قسم "${nameAr}"؟`;

    if (window.confirm(msg)) {
      deleteCategory(slug);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base font-tajawal">
            إدارة أقسام وتصنيفات المتجر (Categories)
          </h3>
          <p className="text-xs text-gray-500">
            أي قسم تضيفه هنا يظهر مباشرة في الشريط العلوي (Navbar) وفي الصفحة الرئيسية ويتاح لإضافة منتجات جديدة تحته
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-saudi-700 hover:bg-saudi-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-colors"
          id="admin-add-category-btn"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم / تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm" dir="rtl">
            <thead className="bg-gray-50 text-gray-600 font-bold text-[11px] sm:text-xs border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4">الأيقونة</th>
                <th className="py-3.5 px-4">اسم القسم (بالعربية)</th>
                <th className="py-3.5 px-4">المعرف الإنجليزي (Slug)</th>
                <th className="py-3.5 px-4">شارة الخصم</th>
                <th className="py-3.5 px-4">عدد المنتجات</th>
                <th className="py-3.5 px-4">رابط القسم بالمتجر</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const count = getProductCount(cat.slug);

                return (
                  <tr key={cat.slug} className="hover:bg-gray-50/70 transition-colors">
                    {/* Icon */}
                    <td className="py-3.5 px-4 text-2xl">
                      {cat.icon || '🏷️'}
                    </td>

                    {/* Name Ar & Tagline */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{cat.nameAr}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{cat.tagline}</p>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600">
                      {cat.slug}
                    </td>

                    {/* Badge */}
                    <td className="py-3.5 px-4">
                      <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    </td>

                    {/* Count */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-saudi-800">{count}</span> منتج
                    </td>

                    {/* Store Link */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/brand/${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-saudi-700 hover:text-saudi-900 font-bold"
                      >
                        <span>معاينة القسم</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(cat.slug, cat.nameAr)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-right mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 bg-saudi-50 px-2.5 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>أقسام المتجر</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
                إضافة قسم / تصنيف جديد
              </h3>
              <p className="text-xs text-gray-500">
                سيظهر هذا القسم فوراً في القائمة العلوية (Navbar) والصفحة الرئيسية
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-right">
              {/* Name Arabic */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم القسم بالعربية <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سيرافي (CeraVe) أو العناية بالبشرة"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
                  id="category-name-ar-input"
                />
              </div>

              {/* Name English / Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  المعرف الإنجليزي للرابط (Slug)
                </label>
                <input
                  type="text"
                  placeholder="مثال: cerave أو skincare"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
                  id="category-slug-input"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  سيستخدم في الرابط: /brand/cerave
                </p>
              </div>

              {/* Icon & Badge Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    أيقونة القسم (Emoji)
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
                  >
                    <option value="🧴">🧴 مستحضرات وعناية</option>
                    <option value="🔬">🔬 طب جلدي ومختبرات</option>
                    <option value="💧">💧 ترطيب ونقاء</option>
                    <option value="✨">✨ عروض مميزة</option>
                    <option value="🌿">🌿 أعشاب طبيعية</option>
                    <option value="💊">💊 مكملات وفيتامينات</option>
                    <option value="👶">👶 عناية بالأطفال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    شارة الخصم (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: خصم 50%"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  وصف مختصر للقسم
                </label>
                <textarea
                  rows={2}
                  placeholder="وصف تسويقي يظهر أعلى صفحة هذا القسم..."
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-saudi-700 hover:bg-saudi-800 text-white text-xs font-bold shadow-md transition-colors inline-flex items-center gap-1.5"
                  id="admin-save-category-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>حفظ وإضافة القسم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
