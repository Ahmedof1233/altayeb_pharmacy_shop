import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowLeft, CheckCircle2, X } from 'lucide-react';

export default function CartToast() {
  const { cartToast, setCartToast, setIsCartOpen } = useApp();

  if (!cartToast) return null;

  const handleOpenCart = () => {
    setCartToast(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div 
        className="bg-saudi-900 text-white rounded-2xl p-4 shadow-2xl border border-saudi-700/60 flex items-center justify-between gap-4 backdrop-blur-md"
        dir="rtl"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
            {cartToast.image ? (
              <img 
                src={cartToast.image} 
                alt="" 
                className="w-8 h-8 object-contain rounded-lg" 
              />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gold-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تمت الإضافة للسلة بنجاح</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs">
              {cartToast.productName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleOpenCart}
            className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-saudi-950 font-black text-xs py-2 px-3 sm:px-4 rounded-xl shadow-md transition-colors"
          >
            <span>عرض السلة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setCartToast(null)}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
