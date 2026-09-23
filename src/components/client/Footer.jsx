import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-saudi-950 text-white pt-14 pb-8 border-t border-saudi-900" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/images/altayeb_logo.webp"
                alt="صيدلية الطيب"
                className="h-10 w-auto object-contain brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-2xl font-black font-tajawal text-white">
                صيدلية الطيب
              </span>
            </div>
            <p className="text-xs sm:text-sm text-saudi-100/70 max-w-md leading-relaxed">
              صيدليتكم الموثوقة بالمملكة العربية السعودية. نسعد بتقديم أرقى منتجات العناية بالبشرة والشعر والصحة العامة بأسعار حصرية وتخفيضات استثنائية احتفالاً باليوم الوطني 96.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-gold-300 font-bold">
              <span>🇸🇦 نحلم ونحقق · اليوم الوطني السعودي 96</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-tajawal font-bold text-sm text-white mb-3">ماركات العرض</h4>
            <ul className="space-y-2 text-xs text-saudi-100/80">
              <li>
                <Link to="/brand/bioderma" className="hover:text-gold-300 transition-colors">
                  عروض بيوديرما الفرنسية (خصم 50%)
                </Link>
              </li>
              <li>
                <Link to="/brand/qv" className="hover:text-gold-300 transition-colors">
                  عروض كيو في الطبية (خصم 50%)
                </Link>
              </li>
              <li>
                <Link to="/brand/haircare" className="hover:text-gold-300 transition-colors">
                  عروض بيرت بلس والعناية بالشعر (خصم 70%)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1 mt-2 text-gold-400 font-bold">
                  🔒 لوحة تحكم الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Reassurance */}
          <div>
            <h4 className="font-tajawal font-bold text-sm text-white mb-3">ضمان صيدلية الطيب</h4>
            <div className="space-y-2 text-xs text-saudi-100/80">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>جميع الأسعار شاملة الضريبة 15%</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>شحن وتوصيل مبرد وآمن</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>إمكانية الدفع عند الاستلام</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-saudi-200/60 gap-4">
          <p>© {new Date().getFullYear()} صيدلية الطيب. جميع الحقوق محفوظة - المملكة العربية السعودية 🇸🇦</p>
          <p className="flex items-center gap-1">
            صُمم خصيصاً لموسم اليوم الوطني السعودي 96
          </p>
        </div>
      </div>
    </footer>
  );
}
