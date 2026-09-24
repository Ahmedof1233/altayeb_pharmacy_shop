import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/client/ProductCard';
import { 
  ChevronRight, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Star, 
  Zap, 
  Tag, 
  Percent, 
  Gift, 
  Share2, 
  Info,
  Check
} from 'lucide-react';

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    brandsInfo, 
    calculateOfferPricing, 
    addToCart, 
    setSelectedProductForOrder,
    cart
  } = useApp();

  // Find product by id (supports string or number id)
  const product = products.find(p => String(p.id) === String(productId));

  // Default quantity for 2-piece deals is 2, else 1
  const defaultQty = (product?.offerType === 'second_piece_96' || product?.offerType === 'two_for_96') ? 2 : 1;
  const [quantity, setQuantity] = useState(defaultQty);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Reset quantity when product ID changes
  useEffect(() => {
    if (product) {
      const init = (product.offerType === 'second_piece_96' || product.offerType === 'two_for_96') ? 2 : 1;
      setQuantity(init);
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center" dir="rtl">
        <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Tag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black font-tajawal text-gray-800 mb-2">
          المنتج غير موجود أو تم نقله
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          لم نتمكن من العثور على المنتج المطلوب. تصفح باقي عروض وتخفيضات اليوم الوطني.
        </p>
        <Link
          to="/"
          className="inline-block bg-saudi-700 hover:bg-saudi-800 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors"
        >
          العودة للمتجر الرئيسي
        </Link>
      </div>
    );
  }

  const brandMeta = brandsInfo[product.brand?.toLowerCase()] || { nameAr: product.brand };
  const pricing = calculateOfferPricing(product, quantity);

  // Check how many are currently in cart
  const cartItem = cart.find(c => String(c.product.id) === String(product.id));
  const inCartCount = cartItem ? cartItem.quantity : 0;

  // Find similar products from same brand or other products
  const similarProducts = products
    .filter(p => String(p.id) !== String(product.id) && (p.brand?.toLowerCase() === product.brand?.toLowerCase() || !product.brand))
    .slice(0, 4);

  // Fallback similar if same brand has fewer
  const otherProducts = similarProducts.length < 4
    ? [
        ...similarProducts,
        ...products.filter(p => String(p.id) !== String(product.id) && !similarProducts.some(sp => sp.id === p.id))
      ].slice(0, 4)
    : similarProducts;

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleFastOrder = () => {
    setSelectedProductForOrder({
      ...product,
      initialQty: quantity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16" dir="rtl">
      {/* Breadcrumbs Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-saudi-700 transition-colors font-medium">
              الرئيسية
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-180 flex-shrink-0" />
            <Link 
              to={`/brand/${product.brand}`} 
              className="hover:text-saudi-700 transition-colors font-medium"
            >
              {brandMeta.nameAr || product.brand}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-180 flex-shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.nameAr || product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8 lg:p-10 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
            
            {/* Right Column: Large Product Image & Badges */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-md bg-gradient-to-b from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner group">
                {/* Offer Ribbon */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full shadow-md ${pricing.badgeColor}`}>
                    {product.offerType === 'buy_1_get_1' ? (
                      <Gift className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-gold-300" />
                    )}
                    <span>{pricing.badgeText}</span>
                  </span>
                </div>

                {/* Brand Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-md border border-gray-200 text-saudi-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {brandMeta.nameAr || product.brand}
                  </span>
                </div>

                {/* Main Product Image */}
                <img
                  src={product.image || '/images/altayeb_logo.webp'}
                  alt={product.nameAr || product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              {/* Guarantees / Trust Badges */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-5">
                <div className="bg-saudi-50/60 border border-saudi-100 rounded-2xl p-2.5 text-center">
                  <ShieldCheck className="w-5 h-5 text-saudi-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-saudi-900 block">أصلي 100%</span>
                  <span className="text-[9px] text-gray-500">ضمان صيدلية الطيب</span>
                </div>
                <div className="bg-saudi-50/60 border border-saudi-100 rounded-2xl p-2.5 text-center">
                  <Truck className="w-5 h-5 text-saudi-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-saudi-900 block">شحن مبرد وسريع</span>
                  <span className="text-[9px] text-gray-500">لكافة مناطق المملكة</span>
                </div>
                <div className="bg-saudi-50/60 border border-saudi-100 rounded-2xl p-2.5 text-center">
                  <RotateCcw className="w-5 h-5 text-saudi-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-saudi-900 block">دفع عند الاستلام</span>
                  <span className="text-[9px] text-gray-500">متوفر بكل سهولة</span>
                </div>
              </div>
            </div>

            {/* Left Column: Product Info & Purchase Logic */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand Link & National Day Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    to={`/brand/${product.brand}`}
                    className="text-xs font-bold text-saudi-700 hover:text-saudi-800 bg-saudi-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    ماركة {brandMeta.nameAr || product.brand}
                  </Link>
                  <span className="text-xs text-gold-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>عروض اليوم الوطني 96</span>
                  </span>
                </div>

                {/* Main Titles */}
                <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-gray-900 leading-snug mb-1">
                  {product.nameAr || product.name}
                </h1>
                {product.nameAr && product.name !== product.nameAr && (
                  <p className="text-sm text-gray-400 font-sans mb-3">
                    {product.name}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">4.9 / 5</span>
                  <span className="text-xs text-gray-400">· تقييمات العملاء الموثقة</span>
                </div>

                {/* Dynamic Price Box */}
                <div className="bg-gradient-to-br from-saudi-50/80 via-emerald-50/40 to-white rounded-3xl p-5 border border-saudi-200/70 mb-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-saudi-200/50">
                    <div>
                      <span className="text-xs text-gray-500 block mb-0.5">السعر الأصلي للحبة:</span>
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        {(parseFloat(product.price) * quantity).toFixed(2)} ر.س
                      </span>
                    </div>

                    <div className="text-right sm:text-left">
                      <span className="text-xs text-saudi-900 font-bold block mb-0.5">
                        إجمالي المبلغ بالعرض ({quantity} قطع):
                      </span>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-3xl font-black text-saudi-700 font-tajawal">
                          {pricing.total}
                        </span>
                        <span className="text-sm font-bold text-saudi-800">ريال سعودي</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">شامل الضريبة 15%</span>
                    </div>
                  </div>

                  {/* Savings & Offer Note */}
                  <div className="pt-3">
                    <p className="text-xs font-bold text-saudi-800">
                      💡 {pricing.summaryText}
                    </p>
                    {parseFloat(pricing.savings) > 0 && (
                      <div className="mt-2 bg-emerald-100/70 text-emerald-800 text-xs font-bold py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>أنت توفر {pricing.savings} ر.س في هذا الطلب!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    الكمية المطلوبة:
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {/* Stepper */}
                    <div className="inline-flex items-center bg-white border border-gray-300 rounded-2xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        title="تقليل الكمية"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 sm:w-12 text-center font-black text-sm sm:text-base text-gray-900 font-tajawal">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        title="زيادة الكمية"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick shortcuts */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setQuantity(1)}
                        className={`text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl border transition-all ${
                          quantity === 1 
                            ? 'bg-saudi-700 text-white border-saudi-700' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        1 قطعة
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuantity(2)}
                        className={`text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl border transition-all flex items-center gap-1 ${
                          quantity === 2 
                            ? 'bg-saudi-700 text-white border-saudi-700' 
                            : 'bg-gold-50 text-gold-900 border-gold-300 hover:bg-gold-100'
                        }`}
                      >
                        <span>2 قطعة</span>
                        <span className="text-[10px] bg-gold-400 text-saudi-950 px-1 rounded font-black">أفضل عرض</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuantity(4)}
                        className={`text-xs font-bold py-2 px-2.5 sm:px-3 rounded-xl border transition-all ${
                          quantity === 4 
                            ? 'bg-saudi-700 text-white border-saudi-700' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        4 قطع
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-200 active:scale-[0.98] ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-saudi-700 hover:bg-saudi-800 text-white'
                    }`}
                    id="product-page-add-to-cart-btn"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-5 h-5 animate-in zoom-in" />
                        <span>تمت الإضافة للسلة بنجاح ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 text-gold-300" />
                        <span>
                          {inCartCount > 0 
                            ? `أضف للسلة (${inCartCount} في السلة حالياً)` 
                            : 'أضف إلى السلة'}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Fast Instant Order */}
                  <button
                    onClick={handleFastOrder}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-saudi-950 font-black py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 active:scale-[0.98]"
                    id="product-page-instant-buy-btn"
                  >
                    <Zap className="w-5 h-5 text-saudi-950 fill-current" />
                    <span>اطلب الآن فوراً ({pricing.total} ر.س)</span>
                  </button>
                </div>
              </div>

              {/* Tabs for Description, Usage, and Shipping */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3 sm:gap-4 border-b border-gray-200 mb-4 overflow-x-auto scrollbar-none whitespace-nowrap pb-0.5">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === 'description'
                        ? 'border-saudi-700 text-saudi-800'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    تفاصيل ومميزات المنتج
                  </button>
                  <button
                    onClick={() => setActiveTab('usage')}
                    className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === 'usage'
                        ? 'border-saudi-700 text-saudi-800'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    طريقة الاستخدام
                  </button>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === 'shipping'
                        ? 'border-saudi-700 text-saudi-800'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    الشحن والضمان
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed min-h-[90px]">
                  {activeTab === 'description' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <p>
                        {product.description || 'منتج عالي الجودة ومعتمد طبياً من كبرى الشركات العالمية، يوفر أفضل نتائج العناية الفائقة والمتكاملة بالبشرة والشعر.'}
                      </p>
                      <ul className="list-disc list-inside text-xs text-gray-500 space-y-1 pt-1">
                        <li>تركيبة متطورة ومناسبة للاستخدام اليومي</li>
                        <li>تم اختباره تحت إشراف أطباء الجلدية والخبراء</li>
                        <li>شامل لعروض وتخفيضات اليوم الوطني 96 الاستثنائية</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === 'usage' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <p>
                        يوضع على بشرة أو شعر رطب مع التدليك بلطف في حركات دائرية لمدة 1-2 دقيقة، ثم يشطف جيداً بالماء الفاتر.
                      </p>
                      <p className="text-xs text-saudi-800 font-bold">
                        ينصح باستخدامه بانتظام مرتين يومياً (صباحاً ومساءً) للحصول على أفضل النتائج.
                      </p>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <p>
                        🚚 <strong>التوصيل:</strong> شحن سريع لجميع مدن ومناطق المملكة العربية السعودية عبر سيارات شحن مبردة ومخصصة للمستحضرات الطبية.
                      </p>
                      <p>
                        🛡️ <strong>الضمان:</strong> منتجات أصلية 100% مستوردة ومخزنة وفق أعلى معايير هيئة الغذاء والدواء السعودية.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Similar / Related Products Section */}
        {otherProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-saudi-700 bg-saudi-50 px-2.5 py-1 rounded-full mb-1 inline-block">
                  ماركات مختارة
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-tajawal text-gray-900">
                  منتجات مشابهة قد تنال إعجابك
                </h3>
              </div>

              <Link
                to={`/brand/${product.brand}`}
                className="text-xs sm:text-sm font-bold text-saudi-700 hover:text-saudi-900 transition-colors flex items-center gap-1"
              >
                <span>عرض المزيد من {brandMeta.nameAr || product.brand}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.map(sim => (
                <ProductCard key={sim.id} product={sim} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
