import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  // Saudi pharmacy WhatsApp number
  const rawNumber = '966551234567';
  const defaultMessage = 'مرحباً صيدلية الطيب 🇸🇦، أود الاستفسار عن عروض اليوم الوطني 96 والمنتجات المتاحة.';
  const waUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 group animate-in fade-in zoom-in-95 duration-300" dir="ltr">
      {/* WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#128C7E] to-[#25D366] hover:from-[#075E54] hover:to-[#128C7E] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        aria-label="تواصل معنا عبر واتساب"
        id="floating-whatsapp-btn"
      >
        {/* Animated Ripple Waves */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
        <span className="absolute -inset-2 rounded-full bg-[#25D366] opacity-15 animate-pulse pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <svg 
          className="w-6 h-6 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform group-hover:rotate-6" 
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.697c1.002.599 1.763.847 2.806.847h.002c3.182 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.77-5.77-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.697.073-2.127-.518-1.574-.652-2.582-2.257-2.661-2.362-.077-.105-.638-.85-.638-1.621 0-.77.404-1.15.548-1.306.144-.155.313-.195.418-.195.104 0 .209.001.299.006.096.005.223-.036.35.268.13.313.444 1.082.483 1.161.04.08.066.173.013.28-.053.107-.079.173-.158.266-.078.093-.166.208-.236.279-.08.08-.163.167-.07.327.093.16.413.682.887 1.103.61.542 1.124.71 1.284.79.16.08.254.07.35-.04.095-.11.408-.475.518-.638.109-.163.22-.136.368-.082.15.054.952.449 1.115.53.164.082.273.123.313.19.04.068.04.394-.104.799z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.442 5.178L2 22l4.981-1.399C8.423 21.493 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.063c-1.637 0-3.165-.487-4.453-1.325l-.319-.208-2.964.832.833-2.912-.224-.337C4.013 14.808 3.5 13.438 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.563-8.5 8.563z" />
        </svg>
      </a>

      {/* Interactive Tooltip bubble */}
      {showTooltip && (
        <div 
          className="hidden sm:flex items-center gap-2 bg-white text-gray-900 py-2 px-3.5 rounded-2xl shadow-xl border border-gray-200 text-xs font-bold font-tajawal animate-in slide-in-from-left-4 duration-300"
          dir="rtl"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>تواصل معنا عبر واتساب للمساعدة</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition-colors mr-1"
            title="إخفاء"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
