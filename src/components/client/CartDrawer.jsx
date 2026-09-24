import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartItemsWithPricing, 
    cartTotal, 
    cartOriginalTotal, 
    cartSavings, 
    cartCount, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    setIsCheckoutOpen,
    setSelectedProductForOrder
  } = useApp();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setSelectedProductForOrder(null); // Indicates cart checkout
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10" dir="rtl">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-saudi-900 to-saudi-800 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h2 className="font-tajawal font-black text-lg text-white flex items-center gap-2">
                  <span>سلة المشتريات</span>
                  {cartCount > 0 && (
                    <span className="bg-gold-500 text-saudi-950 text-xs font-black px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-saudi-200">
                  عروض وتخفيضات اليوم الوطني 96
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-saudi-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              id="close-cart-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
            {cartItemsWithPricing.length > 0 ? (
              <div className="space-y-4">
                {cartItemsWithPricing.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex gap-3.5 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center border border-gray-200">
                      <img
                        src={item.product.image || '/images/altayeb_logo.webp'}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2">
                            {item.product.nameAr || item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                            title="حذف المنتج من السلة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Offer badge */}
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.pricing.badgeColor}`}>
                            {item.pricing.badgeText}
                          </span>
                        </div>
                      </div>

                      {/* Pricing and Stepper */}
                      <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-gray-200/50">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-0.5 shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-left">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="font-black text-sm text-saudi-700 font-tajawal">
                              {item.pricing.total}
                            </span>
                            <span className="text-[10px] font-bold text-saudi-800">ر.س</span>
                          </div>
                          {parseFloat(item.pricing.savings) > 0 && (
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              وفرت {item.pricing.savings} ر.س
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>تفريغ السلة بالكامل</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty Cart State */
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-saudi-50 text-saudi-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-saudi-100">
                  <ShoppingBag className="w-10 h-10 text-saudi-600" />
                </div>
                <h3 className="font-tajawal font-bold text-lg text-gray-900 mb-1">
                  سلة المشتريات فارغة
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                  لم تقم بإضافة أي منتجات للسلة بعد. استكشف أقوى عروض اليوم الوطني 96 وأضف منتجاتك المفضلة!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-saudi-700 hover:bg-saudi-800 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-colors"
                >
                  استعراض عروض اليوم الوطني
                </button>
              </div>
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {cartItemsWithPricing.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
              {/* Savings callout banner */}
              {parseFloat(cartSavings) > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 rounded-xl p-2.5 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>وفرت بعروض اليوم الوطني:</span>
                  </span>
                  <span className="font-black text-sm">{cartSavings} ر.س</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>المجموع الأصلي ({cartCount} قطع):</span>
                  <span className="line-through">{cartOriginalTotal} ر.س</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-sm pt-1 border-t border-gray-200">
                  <span>المبلغ النهائي المطلوب:</span>
                  <div className="text-left">
                    <span className="text-xl font-black text-saudi-700 font-tajawal">
                      {cartTotal}
                    </span>
                    <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 block text-left">
                  شامل ضريبة القيمة المضافة 15% · الدفع عند الاستلام متاح
                </span>
              </div>

              {/* Checkout All CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-saudi-800 to-saudi-700 hover:from-saudi-900 hover:to-saudi-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200"
                id="checkout-cart-btn"
              >
                <ShoppingBag className="w-4 h-4 text-gold-300" />
                <span>إتمام الشراء الآن ({cartTotal} ر.س)</span>
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-800 py-1.5 transition-colors"
              >
                متابعة التسوق وإضافة منتجات أخرى
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
