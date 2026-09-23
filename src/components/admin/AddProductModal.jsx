import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Sparkles, Image as ImageIcon, Tag, DollarSign, Percent, Gift } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose }) {
  const { addProduct, calculateOfferPricing, categories } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    price: '',
    offerType: 'second_piece_96', // 'second_piece_96' | 'two_for_96' | 'buy_1_get_1' | 'fixed_96' | 'percentage'
    discount: '50',
    bundlePrice: '96',
    offerPrice: '96',
    brand: categories?.[0]?.slug || 'bioderma',
    image: '',
    description: ''
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Calculate live preview
  const previewPricing1 = calculateOfferPricing(formData, 1);
  const previewPricing2 = calculateOfferPricing(formData, 2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم المنتج');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('يرجى إدخال سعر صحيح للمنتج');
      return;
    }
    if (!formData.brand) {
      setError('يرجى اختيار القسم / الماركة');
      return;
    }

    // Default image if left blank
    const imageToUse = formData.image.trim() || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80';

    let displayDiscount = `${formData.discount}%`;
    if (formData.offerType === 'second_piece_96') displayDiscount = '96% على الحبة الثانية';
    if (formData.offerType === 'two_for_96') displayDiscount = 'الحبتين بـ 96 ر.س';
    if (formData.offerType === 'buy_1_get_1') displayDiscount = '1+1 مجاناً';
    if (formData.offerType === 'fixed_96') displayDiscount = `بـ ${formData.offerPrice || 96} ر.س فقط`;

    addProduct({
      name: formData.name.trim(),
      nameAr: formData.nameAr.trim() || formData.name.trim(),
      price: formData.price,
      offerType: formData.offerType,
      discount: displayDiscount,
      bundlePrice: formData.bundlePrice,
      offerPrice: formData.offerPrice,
      brand: formData.brand.toLowerCase(),
      image: imageToUse,
      description: formData.description.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-right mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 bg-saudi-50 px-2.5 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>تخصيص عروض اليوم الوطني 96 🇸🇦</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
            إضافة منتج وتحديد نوع العرض
          </h3>
          <p className="text-xs text-gray-500">
            يمكنك تخصيص العرض (خصم 96% على الحبة الثانية، أو الحبتين بـ 96، أو 1+1، أو نسبة مئوية)
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {/* Offer Type Selection (Featured Promo Mechanism) */}
          <div className="bg-saudi-50/70 p-3.5 rounded-2xl border border-saudi-200/80">
            <label className="block text-xs font-black text-saudi-900 mb-1.5 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-gold-600" />
              <span>اختر آلية ونوع العرض لليوم الوطني <span className="text-red-500">*</span></span>
            </label>
            <select
              value={formData.offerType}
              onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
              className="w-full bg-white border border-saudi-300 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-bold text-gray-800 focus:ring-2 focus:ring-saudi-600 outline-none"
              id="admin-offer-type-select"
            >
              <option value="second_piece_96">🇸🇦 الحبة الثانية بخصم 96% (عرض اليوم الوطني الأقوى)</option>
              <option value="two_for_96">🇸🇦 الحبتين بـ 96 ريال فقط (عرض البكج الوطني)</option>
              <option value="buy_1_get_1">🎁 اشتري 1 واحصل على 1 مجاناً (1+1)</option>
              <option value="fixed_96">🇸🇦 سعر موحد بـ 96 ريال للحبة</option>
              <option value="percentage">🏷️ نسبة خصم مئوية مباشرة (% خصم)</option>
            </select>

            {/* Explanation Helper */}
            <p className="text-[11px] text-saudi-800 font-semibold mt-2">
              {formData.offerType === 'second_piece_96' && '✨ العميل يدفع سعر الحبة الأولى كامل، والحبة الثانية يدفع فقط 4% من قيمتها!'}
              {formData.offerType === 'two_for_96' && '✨ عند طلب حبتين من المنتج يدفع العميل 96 ريالاً فقط بدلاً من السعر الإجمالي!'}
              {formData.offerType === 'buy_1_get_1' && '✨ كل حبة يشتريها العميل يحصل معها على حبة مجانية بالكامل!'}
              {formData.offerType === 'fixed_96' && '✨ يتم بيع الحبة بسعر مقطوع 96 ر.س بمناسبة اليوم الوطني 96.'}
              {formData.offerType === 'percentage' && '✨ خصم مباشر بنسبة مئوية محددة من السعر الأصلي.'}
            </p>
          </div>

          {/* Product Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الاسم بالإنجليزية (Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Bioderma Sebium Gel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                id="admin-product-name-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الاسم بالعربية
              </label>
              <input
                type="text"
                placeholder="بيوديرما سيبيوم جل"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                id="admin-product-name-ar-input"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                السعر الأصلي للحبة (ر.س) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                id="admin-product-price-input"
              />
            </div>

            {formData.offerType === 'percentage' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  نسبة الخصم % <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none"
                >
                  <option value="10">10%</option>
                  <option value="20">20%</option>
                  <option value="30">30%</option>
                  <option value="40">40%</option>
                  <option value="50">50%</option>
                  <option value="60">60%</option>
                  <option value="70">70%</option>
                  <option value="80">80%</option>
                </select>
              </div>
            )}

            {formData.offerType === 'two_for_96' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  سعر الحبتين بالعرض (ر.س)
                </label>
                <input
                  type="number"
                  value={formData.bundlePrice}
                  onChange={(e) => setFormData({ ...formData, bundlePrice: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono"
                />
              </div>
            )}

            {formData.offerType === 'fixed_96' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  سعر العرض المقطوع (ر.س)
                </label>
                <input
                  type="number"
                  value={formData.offerPrice}
                  onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs sm:text-sm font-mono"
                />
              </div>
            )}
          </div>

          {/* Real-time calculated price preview */}
          {formData.price && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-950 font-bold">
                <span>المعاينة المباشرة لحساب العرض:</span>
                <span className="text-emerald-700 font-black font-tajawal text-sm">{previewPricing2.badgeText}</span>
              </div>
              <p className="text-emerald-800">{previewPricing2.summaryText}</p>
              <div className="flex justify-between pt-1 border-t border-emerald-200/60 font-semibold text-emerald-900">
                <span>إجمالي سعر حبتين: <strong>{previewPricing2.total} ر.س</strong></span>
                <span>قيمة التوفير: <strong className="text-emerald-700">{previewPricing2.savings} ر.س</strong></span>
              </div>
            </div>
          )}

          {/* Brand / Category Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              القسم / الماركة (Category / Brand) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
              id="admin-product-brand-select"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon || '🏷️'} {cat.nameAr} ({cat.slug})
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              رابط الصورة (Image URL)
            </label>
            <input
              type="text"
              placeholder="مثال: /images/sebium_gel_200.webp أو رابط خارجي"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
              id="admin-product-image-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              وصف مختصر للمنتج
            </label>
            <textarea
              rows={2}
              placeholder="اكتب وصفاً جذاباً يبرز فوائد المنتج..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-saudi-700 hover:bg-saudi-800 text-white text-xs font-bold shadow-md transition-colors inline-flex items-center gap-1.5"
              id="admin-save-product-btn"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المنتج بالعرض</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
