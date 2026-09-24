import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  Phone, 
  User, 
  MapPin, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Gift,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderModal() {
  const { 
    selectedProductForOrder, 
    setSelectedProductForOrder, 
    isCheckoutOpen, 
    setIsCheckoutOpen,
    cartItemsWithPricing,
    cartTotal,
    cartSavings,
    cartCount,
    clearCart,
    addOrder, 
    calculateOfferPricing 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [singleQty, setSingleQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(null);
  const countdownTimerRef = useRef(null);

  const isCartCheckout = !selectedProductForOrder && isCheckoutOpen;
  const isSingleCheckout = !!selectedProductForOrder;

  // Initialize quantity when selectedProductForOrder changes
  useEffect(() => {
    if (selectedProductForOrder) {
      setSingleQty(selectedProductForOrder.initialQty || 1);
      setCompletedOrder(null);
      setErrorMessage('');
      setAutoRedirectCountdown(null);
    }
  }, [selectedProductForOrder]);

  // Clean up countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Handle auto redirect timer when order completes
  useEffect(() => {
    if (completedOrder) {
      let timeLeft = 6;
      setAutoRedirectCountdown(timeLeft);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      countdownTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          clearInterval(countdownTimerRef.current);
          handleCloseAndReturnToStore();
        } else {
          setAutoRedirectCountdown(timeLeft);
        }
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [completedOrder]);

  if (!isSingleCheckout && !isCartCheckout) return null;

  // Calculate pricing for single product checkout
  const singlePricing = isSingleCheckout 
    ? calculateOfferPricing(selectedProductForOrder, singleQty)
    : null;

  // Final summary to display
  const totalToPay = isCartCheckout ? cartTotal : singlePricing?.total;
  const totalSavings = isCartCheckout ? cartSavings : singlePricing?.savings;

  const handleCloseAndReturnToStore = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setSelectedProductForOrder(null);
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setSingleQty(1);
    setErrorMessage('');
    setAutoRedirectCountdown(null);

    // Smoothly scroll to the store products if on home page
    const offersEl = document.getElementById('national-day-offers');
    if (offersEl) {
      offersEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('يرجى إدخال رقم الجوال للتواصل');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('يرجى إدخال عنوان التوصيل بالتفصيل (المدينة - الحي - الشارع)');
      return;
    }

    setIsSubmitting(true);

    try {
      let order = null;

      if (isCartCheckout) {
        // Multi-item cart order
        order = await addOrder({
          customerName: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim(),
          items: cartItemsWithPricing
        });

        // Clear cart after successful checkout
        clearCart();
      } else {
        // Single product instant order
        order = await addOrder({
          customerName: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim(),
          quantity: singleQty,
          product: {
            id: selectedProductForOrder.id,
            name: selectedProductForOrder.nameAr || selectedProductForOrder.name,
            price: selectedProductForOrder.price,
            discount: selectedProductForOrder.discount,
            offerType: selectedProductForOrder.offerType,
            bundlePrice: selectedProductForOrder.bundlePrice,
            offerPrice: selectedProductForOrder.offerPrice,
            finalPrice: singlePricing.unitDisplayPrice,
            image: selectedProductForOrder.image || ''
          }
        });
      }

      setIsSubmitting(false);
      setCompletedOrder(order);

      // Trigger celebratory confetti for Saudi National Day order!
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#006C35', '#D4AF37', '#ffffff', '#22c55e']
        });
      } catch (err) {
        console.log('Confetti effect error:', err);
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      setIsSubmitting(false);
      setErrorMessage('حدث خطأ غير متوقع أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto my-auto animate-in fade-in zoom-in-95 duration-200 scrollbar-thin"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={handleCloseAndReturnToStore}
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          id="close-order-modal-btn"
          title="إغلاق والعودة"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* ========================================================= */
          /* Success Screen - Clean, Reassuring & Returns to Store */
          /* ========================================================= */
          <div className="text-center py-3">
            <div className="w-16 h-16 bg-saudi-100 text-saudi-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-saudi-200 shadow-sm animate-bounce">
              <CheckCircle className="w-9 h-9 text-saudi-700" />
            </div>

            <span className="inline-block bg-saudi-50 text-saudi-800 text-xs font-bold px-3 py-1 rounded-full mb-1.5 border border-saudi-200">
              🇸🇦 تم استلام وتأكيد طلبك بنجاح!
            </span>

            <h3 className="text-2xl font-black font-tajawal text-gray-900 mb-1.5">
              شكراً لاختيارك صيدلية الطيب
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-3 max-w-sm mx-auto leading-relaxed">
              رقم طلبك المميز هو{' '}
              <strong className="text-saudi-800 font-black font-mono text-sm sm:text-base bg-saudi-50 px-2.5 py-0.5 rounded-lg border border-saudi-200">
                {completedOrder.orderNumber}
              </strong>
              . سيتم التواصل معك هاتفياً أو عبر واتساب لتأكيد الشحن والتوصيل فوراً.
            </p>

            {/* Savings Callout */}
            {parseFloat(completedOrder.savings || 0) > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 rounded-2xl p-2.5 mb-3 text-xs font-bold flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>مبروك! وفرت في هذا العرض الوطني {completedOrder.savings} ريال سعودي!</span>
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-4 text-right mb-4 border border-gray-200/80 text-xs sm:text-sm space-y-2">
              {/* Items List */}
              <div className="border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-700 block mb-1.5">المنتجات المطلوبة:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {completedOrder.items && completedOrder.items.length > 0 ? (
                    completedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded-xl border border-gray-100">
                        <div className="flex-1 min-w-0 pr-1">
                          <p className="font-bold text-gray-900 truncate">{it.name}</p>
                          <span className="text-[10px] text-gray-500">
                            الكمية: {it.quantity} × {it.unitPrice || it.price} ر.س
                          </span>
                        </div>
                        <span className="font-black text-saudi-700 font-tajawal text-xs flex-shrink-0">
                          {it.total} ر.س
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-gray-600">
                      <span>المنتج:</span>
                      <span className="font-bold text-gray-900">{completedOrder.product?.name || 'طلب صيدلية الطيب'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="flex justify-between text-gray-600 text-xs">
                <span>اسم العميل:</span>
                <span className="font-bold text-gray-900">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>رقم الجوال:</span>
                <span className="font-bold text-gray-900 font-mono">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>عنوان التوصيل:</span>
                <span className="font-bold text-gray-900 truncate max-w-[200px]">{completedOrder.address}</span>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                <span className="font-bold text-saudi-900">المجموع النهائي (شامل الضريبة):</span>
                <span className="font-black text-saudi-700 text-base font-tajawal">
                  {completedOrder.totalAmount} ر.س
                </span>
              </div>
            </div>

            {/* Auto Redirect Countdown Notice */}
            {autoRedirectCountdown !== null && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-3 bg-gray-100/70 py-1.5 px-3 rounded-xl max-w-xs mx-auto">
                <Clock className="w-3.5 h-3.5 text-saudi-700 animate-spin" />
                <span>سيتم إعادتك للمتجر تلقائياً خلال</span>
                <strong className="text-saudi-800 font-black font-mono">{autoRedirectCountdown}</strong>
                <span>ثوانٍ...</span>
              </div>
            )}

            {/* Return to Store Button */}
            <button
              onClick={handleCloseAndReturnToStore}
              className="w-full inline-flex items-center justify-center gap-2 bg-saudi-700 hover:bg-saudi-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-colors text-sm"
              id="return-to-store-btn"
            >
              <span>العودة للمتجر ومتابعة التسوق</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* Order Checkout Form */
          /* ========================================================= */
          <div>
            {/* Header */}
            <div className="text-right mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 bg-saudi-50 px-2.5 py-1 rounded-full mb-1 border border-saudi-200">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>عروض اليوم الوطني 96 🇸🇦</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
                {isCartCheckout ? 'إتمام طلب سلة المشتريات' : 'إكمال طلب الشراء'}
              </h3>
              <p className="text-xs text-gray-500">
                أدخل بيانات التوصيل وسيتم تجهيز وشحن طلبك فوراً بأسعار وتخفيضات اليوم الوطني
              </p>
            </div>

            {/* Selected Products Preview Card */}
            {isSingleCheckout ? (
              /* Single Product Preview */
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-xl p-1 flex-shrink-0 flex items-center justify-center border border-gray-200">
                    <img
                      src={selectedProductForOrder.image || '/images/altayeb_logo.webp'}
                      alt={selectedProductForOrder.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                      {selectedProductForOrder.nameAr || selectedProductForOrder.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${singlePricing.badgeColor}`}>
                        {singlePricing.badgeText}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {(parseFloat(selectedProductForOrder.price) * singleQty).toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setSingleQty(q => Math.max(1, q - 1))}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{singleQty}</span>
                    <button
                      type="button"
                      onClick={() => setSingleQty(q => q + 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Offer Summary */}
                <div className="mt-2 pt-2 border-t border-gray-200/60 text-xs">
                  <p className="text-saudi-800 font-bold text-[11px]">
                    {singlePricing.summaryText}
                  </p>
                  {parseFloat(singlePricing.savings) > 0 && (
                    <p className="text-emerald-700 font-bold mt-0.5 text-[11px]">
                      🎉 وفرت {singlePricing.savings} ر.س في هذا العرض!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Cart Items Preview */
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-gray-800">
                    محتويات السلة ({cartCount} قطع):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      // AppContext's isCartOpen can be reopened if desired
                    }}
                    className="text-[11px] text-saudi-700 font-bold hover:underline"
                  >
                    تعديل السلة
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {cartItemsWithPricing.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={item.product.image || '/images/altayeb_logo.webp'} 
                          alt="" 
                          className="w-7 h-7 object-contain rounded" 
                        />
                        <span className="font-bold text-gray-800 truncate max-w-[170px] sm:max-w-[210px]">
                          {item.product.nameAr || item.product.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ×{item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-saudi-800 font-tajawal">
                        {item.pricing.total} ر.س
                      </span>
                    </div>
                  ))}
                </div>
                {parseFloat(cartSavings) > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200/60 text-[11px] text-emerald-700 font-bold">
                    🎉 إجمالي التوفير في السلة: {cartSavings} ر.س
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبد الله محمد الشمري"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 pr-9 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:border-saudi-600 outline-none transition-all placeholder:text-gray-400"
                    id="order-name-input"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 pr-9 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-saudi-600 focus:border-saudi-600 outline-none transition-all placeholder:text-gray-400"
                    id="order-phone-input"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  عنوان التوصيل (المدينة والحي والشارع) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    required
                    placeholder="مثال: الرياض - حي النرجس - شارع عثمان بن عفان"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 pr-9 text-xs sm:text-sm focus:ring-2 focus:ring-saudi-600 focus:border-saudi-600 outline-none transition-all placeholder:text-gray-400"
                    id="order-address-input"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Total Summary Callout */}
              <div className="bg-saudi-50/70 border border-saudi-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-600 block">إجمالي المبلغ المطلوب:</span>
                  <span className="text-[10px] text-gray-500">شامل الضريبة 15% · الدفع عند الاستلام متاح</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-saudi-700 font-tajawal">
                    {totalToPay}
                  </span>
                  <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-saudi-800 to-saudi-700 hover:from-saudi-900 hover:to-saudi-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 text-sm"
                id="submit-order-form-btn"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل وتأكيد الطلب...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-gold-300" />
                    <span>تأكيد الطلب الآن ({totalToPay} ر.س)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
