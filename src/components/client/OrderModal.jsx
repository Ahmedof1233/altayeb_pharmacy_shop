import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, ShieldCheck, Truck, Phone, User, MapPin, Plus, Minus, ShoppingBag, Sparkles, Tag, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderModal() {
  const { selectedProductForOrder, setSelectedProductForOrder, addOrder, calculateOfferPricing } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Update initial quantity when selectedProductForOrder changes
  useEffect(() => {
    if (selectedProductForOrder) {
      setQuantity(selectedProductForOrder.initialQty || 1);
      setCompletedOrder(null);
      setErrorMessage('');
    }
  }, [selectedProductForOrder]);

  if (!selectedProductForOrder) return null;

  // Calculate dynamic pricing based on custom offer type
  const pricing = calculateOfferPricing(selectedProductForOrder, quantity);

  const handleClose = () => {
    setSelectedProductForOrder(null);
    setCompletedOrder(null);
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setQuantity(1);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('يرجى إدخال رقم الجوال');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('يرجى إدخال عنوان التوصيل بالتفصيل');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = addOrder({
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        quantity,
        product: {
          id: selectedProductForOrder.id,
          name: selectedProductForOrder.nameAr || selectedProductForOrder.name,
          price: selectedProductForOrder.price,
          discount: selectedProductForOrder.discount,
          offerType: selectedProductForOrder.offerType,
          bundlePrice: selectedProductForOrder.bundlePrice,
          offerPrice: selectedProductForOrder.offerPrice,
          finalPrice: pricing.unitDisplayPrice
        }
      });

      setIsSubmitting(false);
      setCompletedOrder(order);

      // Trigger celebratory confetti for Saudi National Day order!
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#006C35', '#D4AF37', '#ffffff', '#22c55e']
        });
      } catch (err) {
        console.log(err);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          id="close-order-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-saudi-100 text-saudi-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-saudi-200">
              <CheckCircle className="w-10 h-10 text-saudi-700" />
            </div>

            <span className="inline-block bg-saudi-50 text-saudi-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              🇸🇦 تم استلام طلبك بنجاح!
            </span>

            <h3 className="text-2xl font-black font-tajawal text-gray-900 mb-2">
              شكراً لاختيارك صيدلية الطيب
            </h3>

            <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
              رقم طلبك هو{' '}
              <strong className="text-saudi-800 font-black font-mono text-base bg-gray-100 px-2 py-0.5 rounded">
                {completedOrder.orderNumber}
              </strong>
              . سيتم التواصل معك هاتفياً أو عبر واتساب لتأكيد الشحن والتوصيل.
            </p>

            {/* Savings Callout */}
            {parseFloat(completedOrder.savings) > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3 mb-4 text-xs font-bold flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>مبروك! وفرت في هذا العرض الوطني {completedOrder.savings} ريال سعودي!</span>
              </div>
            )}

            {/* Receipt Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 text-right mb-6 border border-gray-200/70 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>المنتج:</span>
                <span className="font-bold text-gray-900">{completedOrder.product.name}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>الكمية:</span>
                <span className="font-bold text-gray-900">{completedOrder.quantity} قطعة</span>
              </div>
              {completedOrder.offerSummary && (
                <div className="flex justify-between text-saudi-700 font-semibold text-[11px] bg-saudi-50 p-1.5 rounded">
                  <span>العرض المطبق:</span>
                  <span>{completedOrder.offerSummary}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>اسم العميل:</span>
                <span className="font-bold text-gray-900">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>رقم التواصل:</span>
                <span className="font-bold text-gray-900 font-mono">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>العنوان:</span>
                <span className="font-bold text-gray-900">{completedOrder.address}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                <span className="font-bold text-saudi-900">المجموع النهائي (شامل الضريبة):</span>
                <span className="font-black text-saudi-700 text-base">{completedOrder.totalAmount} ر.س</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-saudi-700 hover:bg-saudi-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors"
              id="finish-order-btn"
            >
              متابعة التسوق واستعراض المزيد
            </button>
          </div>
        ) : (
          /* Order Form */
          <div>
            {/* Header */}
            <div className="text-right mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-saudi-700 bg-saudi-50 px-2.5 py-1 rounded-full mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>عروض اليوم الوطني 96 🇸🇦</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
                إكمال طلب الشراء
              </h3>
              <p className="text-xs text-gray-500">
                أدخل بياناتك وسيتم تجهيز طلبك فوراً بأسعار اليوم الوطني
              </p>
            </div>

            {/* Selected Product Summary Card */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-xl p-1 flex-shrink-0 flex items-center justify-center border border-gray-200">
                  <img
                    src={selectedProductForOrder.image}
                    alt={selectedProductForOrder.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">
                    {selectedProductForOrder.nameAr || selectedProductForOrder.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                      {pricing.badgeText}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {(parseFloat(selectedProductForOrder.price) * quantity).toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Offer Calculation Details */}
              <div className="mt-2.5 pt-2 border-t border-gray-200/60 text-xs">
                <p className="text-saudi-800 font-bold">
                  {pricing.summaryText}
                </p>
                {parseFloat(pricing.savings) > 0 && (
                  <p className="text-emerald-700 font-bold mt-0.5">
                    🎉 وفرت {pricing.savings} ر.س في هذا الطلب!
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs mb-4">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
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

              {/* Total Summary */}
              <div className="bg-saudi-50/70 border border-saudi-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-600 block">إجمالي المبلغ المطلوب:</span>
                  <span className="text-[10px] text-gray-500">شامل الضريبة 15% · الدفع عند الاستلام متاح</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-saudi-700 font-tajawal">
                    {pricing.total}
                  </span>
                  <span className="text-xs font-bold text-saudi-800 mr-1">ر.س</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-saudi-800 to-saudi-700 hover:from-saudi-900 hover:to-saudi-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
                id="submit-order-form-btn"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل الطلب...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-gold-300" />
                    <span>تأكيد الطلب الآن ({pricing.total} ر.س)</span>
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
