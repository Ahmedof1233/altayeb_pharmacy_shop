import React from 'react';
import { Truck, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export default function FeaturesBanner() {
  const features = [
    {
      icon: <Award className="w-6 h-6 text-saudi-700" />,
      title: "منتجات أصلية 100%",
      desc: "مستوردة مباشرة من الوكلاء المعتمدين وفواتير ضريبية نظامية"
    },
    {
      icon: <Truck className="w-6 h-6 text-saudi-700" />,
      title: "شحن مبرد وسريع",
      desc: "سيارات مجهزة لنقل الأدوية ومستحضرات التجميل لجميع مدن المملكة"
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-saudi-700" />,
      title: "استشارة صيدلانية مجانية",
      desc: "فريق صيدلي متكامل متاح للإجابة على جميع استفساراتكم"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-saudi-700" />,
      title: "صيدلية مرخصة رسمياً",
      desc: "مسجلة لدى هيئة الغذاء والدواء ووزارة الصحة السعودية"
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-saudi-200 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-saudi-50 flex items-center justify-center flex-shrink-0 border border-saudi-100">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
