import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Sparkles, Tag, Percent, Gift, Zap, Check, ChevronLeft } from 'lucide-react';

export default function ProductCard({ product }) {
  const { calculateOfferPricing, setSelectedProductForOrder, brandsInfo, addToCart, cart } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const pricing1 = calculateOfferPricing(product, 1);
  const pricing2 = calculateOfferPricing(product, 2);
  const brandMeta = brandsInfo[product.brand.toLowerCase()] || { nameAr: product.brand };

  const cartItem = cart.find(c => String(c.product.id) === String(product.id));
  const inCartCount = cartItem ? cartItem.quantity : 0;

  const defaultQty = (product.offerType === 'second_piece_96' || product.offerType === 'two_for_96') ? 2 : 1;

  const handleAddToCart = () => {
    addToCart(product, defaultQty, true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleOrderClick = () => {
    setSelectedProductForOrder({
      ...product,
      initialQty: defaultQty,
      pricing1,
      pricing2
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-saudi-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Ribbon / Offer Badge */}
      <div className="absolute top-3 left-3 z-10 max-w-[70%]">
        <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full shadow-md ${pricing1.badgeColor}`}>
          {product.offerType === 'buy_1_get_1' ? (
            <Gift className="w-3.5 h-3.5" />
          ) : product.offerType === 'second_piece_96' || product.offerType === 'two_for_96' ? (
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
          ) : (
            <Percent className="w-3.5 h-3.5" />
          )}
          <span className="truncate">{pricing1.badgeText}</span>
        </span>
      </div>

      {/* Brand Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-block bg-white/90 backdrop-blur-md border border-gray-200 text-saudi-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          {brandMeta.nameAr || product.brand}
        </span>
      </div>

      {/* Product Image Wrap (Links to Product Page) */}
      <Link 
        to={`/product/${product.id}`}
        className="relative w-full h-56 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6 overflow-hidden cursor-pointer"
        title="عرض تفاصيل المنتج"
      >
        <img
          src={product.image || '/images/altayeb_logo.webp'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-md"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80';
          }}
        />
      </Link>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-gray-50">
        <div>
          {/* Product Name (Links to Product Page) */}
          <Link to={`/product/${product.id}`} className="block group/title">
            <h3 className="font-tajawal font-bold text-base sm:text-lg text-gray-900 group-hover/title:text-saudi-700 transition-colors line-clamp-2 leading-snug mb-1">
              {product.nameAr || product.name}
            </h3>
          </Link>

          {product.nameAr && product.name !== product.nameAr && (
            <p className="text-xs text-gray-400 font-sans line-clamp-1 mb-2">
              {product.name}
            </p>
          )}

          {product.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quick link to details */}
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-saudi-700 hover:text-saudi-900 transition-colors mb-3"
          >
            <span>عرض تفاصيل المنتج والكميات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
          {/* Price Breakdown Box */}
          <div className="bg-saudi-50/70 rounded-xl p-3 mb-4 border border-saudi-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>السعر الأصلي للحبة:</span>
              <span className="line-through font-semibold text-gray-400">{product.price} ر.س</span>
            </div>

            {/* Specialized Deal Highlight */}
            {product.offerType === 'second_piece_96' && (
              <div className="pt-1 border-t border-saudi-200/60">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-saudi-900">سعر الحبتين بالعرض:</span>
                  <div>
                    <span className="text-lg font-black text-saudi-700 font-tajawal">{pricing2.total}</span>
                    <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 rounded px-2 py-0.5 mt-1 border border-emerald-200/60">
                  الحبة الثانية بـ {(parseFloat(product.price) * 0.04).toFixed(2)} ر.س فقط!
                </div>
              </div>
            )}

            {product.offerType === 'two_for_96' && (
              <div className="pt-1 border-t border-saudi-200/60">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-saudi-900">سعر الحبتين معاً:</span>
                  <div>
                    <span className="text-xl font-black text-saudi-700 font-tajawal">96.00</span>
                    <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                  </div>
                </div>
                <div className="text-[11px] text-amber-800 font-bold bg-amber-50 rounded px-2 py-0.5 mt-1 border border-amber-200/60">
                  وفر {(parseFloat(product.price) * 2 - 96).toFixed(2)} ر.س عند أخذ حبتين!
                </div>
              </div>
            )}

            {product.offerType === 'buy_1_get_1' && (
              <div className="pt-1 border-t border-saudi-200/60">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-saudi-900">سعر الحبتين (1+1):</span>
                  <div>
                    <span className="text-lg font-black text-saudi-700 font-tajawal">{product.price}</span>
                    <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                  </div>
                </div>
                <div className="text-[11px] text-purple-700 font-bold bg-purple-50 rounded px-2 py-0.5 mt-1 border border-purple-200/60">
                  تدفع حبة وتحصل على الثانية مجاناً!
                </div>
              </div>
            )}

            {(product.offerType === 'percentage' || product.offerType === 'fixed_96' || !product.offerType) && (
              <div className="flex items-baseline justify-between pt-1 border-t border-saudi-200/50">
                <span className="text-xs font-bold text-saudi-900">سعر العرض الوطني:</span>
                <div className="text-left">
                  <span className="text-xl sm:text-2xl font-black text-saudi-700 font-tajawal">
                    {pricing1.total}
                  </span>
                  <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                </div>
              </div>
            )}

            <div className="text-[10px] text-gray-400 text-left mt-1">
              شامل ضريبة القيمة المضافة 15%
            </div>
          </div>

          {/* Action Buttons: Add to Cart + Direct Order */}
          <div className="space-y-2">
            {/* Primary Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-saudi-700 hover:bg-saudi-800 text-white'
              }`}
              id={`add-to-cart-btn-${product.id}`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in" />
                  <span>تمت الإضافة للسلة ✓</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-gold-300" />
                  <span>
                    {inCartCount > 0 
                      ? `أضف المزيد للسلة (${inCartCount} في السلة)` 
                      : 'أضف إلى السلة'}
                  </span>
                </>
              )}
            </button>

            {/* Direct Instant Order Button */}
            <button
              onClick={handleOrderClick}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gold-50 text-gray-700 hover:text-saudi-900 border border-gray-200 hover:border-gold-300 font-bold text-xs py-2 px-3 rounded-xl transition-all duration-200"
              id={`direct-order-btn-${product.id}`}
              title="طلب هذا المنتج فوراً بدون الذهاب للسلة"
            >
              <Zap className="w-3.5 h-3.5 text-gold-600" />
              <span>شراء فوري الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
