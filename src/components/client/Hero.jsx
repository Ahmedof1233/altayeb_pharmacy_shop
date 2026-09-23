import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, CheckCircle2, ChevronDown, ArrowDown } from 'lucide-react';

export default function Hero() {
  // Countdown to September 30 at 12:00 Midnight (23:59:59)
  const calculateTimeLeft = () => {
    const currentYear = new Date().getFullYear();
    // September 30 at 23:59:59 (Month is 8 in 0-indexed JS Date)
    const targetDate = new Date(currentYear, 8, 30, 23, 59, 59).getTime();
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToOffers = () => {
    const elem = document.getElementById('national-day-offers');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBrands = () => {
    const elem = document.getElementById('brands-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-saudi-900 via-saudi-800 to-saudi-900 text-white pt-10 pb-16 sm:py-20 lg:py-24">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-400 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-saudi-400 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-gold-500 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* National Day Celebration Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-300 text-xs sm:text-sm font-bold mb-6 animate-pulse-subtle shadow-lg">
          <span className="text-lg">🇸🇦</span>
          <span>نحلم ونحقق · احتفالات اليوم الوطني السعودي 96</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
          <span className="text-white">صيدلية الطيب</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-tajawal tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          أقوى عروض وتخفيضات{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
            اليوم الوطني 96
            <svg className="absolute -bottom-2 w-full text-gold-400/50" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.5C40 2 160 2 199 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <br className="hidden sm:inline" />
          على أشهر الماركات الطبية العالمية
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-saudi-100/90 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
          وفّر حتى <strong className="text-gold-300 font-extrabold text-xl">70%</strong> على منتجات العناية بالبشرة والشعر الأصلية 100% مع ضمان الجودة والتوصيل السريع لجميع أنحاء المملكة.
        </p>

        {/* Countdown Box */}
        <div className="max-w-md mx-auto bg-saudi-950/60 backdrop-blur-md border border-gold-500/30 rounded-2xl p-4 mb-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gold-300 font-bold mb-3">
            <Clock className="w-4 h-4" />
            <span>ينتهي العرض يوم 30 سبتمبر (الساعة 12:00 منتصف الليل) 🇸🇦</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="block text-xl sm:text-2xl font-black text-white font-tajawal">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-saudi-200">أيام</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="block text-xl sm:text-2xl font-black text-white font-tajawal">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-saudi-200">ساعات</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="block text-xl sm:text-2xl font-black text-white font-tajawal">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-saudi-200">دقائق</span>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="block text-xl sm:text-2xl font-black text-gold-400 font-tajawal">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-saudi-200">ثوانٍ</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={scrollToOffers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-saudi-950 font-black text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            id="hero-view-offers-btn"
          >
            <span>استعراض عروض اليوم الوطني</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <button
            onClick={scrollToBrands}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
            id="hero-explore-brands-btn"
          >
            <span>الماركات المشاركة بالعرض</span>
            <Sparkles className="w-4 h-4 text-gold-300" />
          </button>
        </div>

        {/* Quick Highlights / Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-saudi-100 font-semibold">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>منتجات طبية مرخصة وأصلية 100%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>الأسعار شاملة ضريبة القيمة المضافة 15%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>الدفع عند الاستلام متاح</span>
          </div>
        </div>
      </div>
    </section>
  );
}
