import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag } from 'lucide-react';

export default function FloatingCartButton() {
  const { cartCount, cartTotal, setIsCartOpen, isCartOpen } = useApp();

  if (cartCount === 0 || isCartOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-in fade-in zoom-in-95 duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className="group relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-saudi-800 to-saudi-700 hover:from-saudi-900 hover:to-saudi-800 text-white font-bold py-2.5 px-3 sm:py-3 sm:px-5 rounded-2xl shadow-xl hover:shadow-2xl border border-gold-400/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        dir="rtl"
        id="floating-cart-btn"
        title="عرض سلة المشتريات"
      >
        {/* Animated Ping Ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-gold-500"></span>
        </span>

        {/* Cart Icon & Count Badge */}
        <div className="relative">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gold-300 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -left-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        </div>

        <div className="text-right">
          <span className="hidden sm:block text-[11px] text-saudi-100 font-medium">سلة المشتريات</span>
          <span className="block text-xs sm:text-sm font-black text-gold-300 font-tajawal">
            {cartTotal} ر.س
          </span>
        </div>
      </button>
    </div>
  );
}
