import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function calculateOfferPricing(product, quantity = 1) {
  if (!product) return { total: '0.00', unitDisplayPrice: '0.00', badgeText: '', savings: '0.00' };

  const origPrice = parseFloat(product.price) || 0;
  const qty = parseInt(quantity, 10) || 1;
  const offerType = product.offerType || 'percentage';

  let total = 0;
  let originalTotal = origPrice * qty;
  let badgeText = 'خصم خاص';
  let badgeColor = 'bg-red-600 text-white';
  let summaryText = '';
  let unitDisplayPrice = origPrice;

  switch (offerType) {
    case 'second_piece_96': {
      badgeText = '🇸🇦 الحبة الثانية بخصم 96%';
      badgeColor = 'bg-gradient-to-r from-saudi-800 via-saudi-700 to-emerald-800 text-white border border-gold-400 shadow-md';
      // Pairs of 2: 1st piece is 100%, 2nd piece is 4% (96% discount)
      const pairs = Math.floor(qty / 2);
      const remainder = qty % 2;
      const pairCost = origPrice + (origPrice * 0.04);
      total = (pairs * pairCost) + (remainder * origPrice);
      unitDisplayPrice = (pairCost / 2).toFixed(2);
      summaryText = `الحبة الأولى بـ ${origPrice} ر.س + الحبة الثانية بـ ${(origPrice * 0.04).toFixed(2)} ر.س فقط! (وفرت 96% على الثانية)`;
      break;
    }

    case 'two_for_96': {
      badgeText = '🇸🇦 الحبتين بـ 96 ر.س';
      badgeColor = 'bg-gradient-to-r from-gold-600 via-amber-600 to-amber-700 text-white shadow-md border border-white/20';
      const bundlePrice = parseFloat(product.bundlePrice) || 96;
      const pairs = Math.floor(qty / 2);
      const remainder = qty % 2;
      total = (pairs * bundlePrice) + (remainder * origPrice);
      unitDisplayPrice = (bundlePrice / 2).toFixed(2);
      summaryText = `عرض اليوم الوطني: كل حبتين بسعر ${bundlePrice} ر.س بدلاً من ${(origPrice * 2).toFixed(2)} ر.س!`;
      break;
    }

    case 'buy_1_get_1': {
      badgeText = '🎁 1 + 1 مجاناً';
      badgeColor = 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md';
      // Buy 1 get 1 free
      const payableCount = Math.ceil(qty / 2);
      total = payableCount * origPrice;
      unitDisplayPrice = (origPrice / 2).toFixed(2);
      summaryText = `احصل على حبة مجاناً مع كل حبة تشتريها!`;
      break;
    }

    case 'fixed_96': {
      const fixed = parseFloat(product.offerPrice) || 96;
      badgeText = `🇸🇦 بـ ${fixed} ر.س فقط`;
      badgeColor = 'bg-gradient-to-r from-saudi-900 to-saudi-800 text-gold-300 font-black border border-gold-500/50 shadow-md';
      total = qty * fixed;
      unitDisplayPrice = fixed.toFixed(2);
      summaryText = `سعر موحد بمناسبة اليوم الوطني 96: ${fixed} ر.س فقط`;
      break;
    }

    case 'percentage':
    default: {
      const discountNum = parseFloat(String(product.discount || '50').replace('%', '')) || 50;
      badgeText = `خصم ${discountNum}%`;
      badgeColor = 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md';
      const discountedUnit = origPrice * (1 - discountNum / 100);
      total = qty * discountedUnit;
      unitDisplayPrice = discountedUnit.toFixed(2);
      summaryText = `خصم ${discountNum}% على السعر الأصلي`;
      break;
    }
  }

  const savings = Math.max(0, originalTotal - total).toFixed(2);

  return {
    badgeText,
    badgeColor,
    unitDisplayPrice,
    total: total.toFixed(2),
    originalTotal: originalTotal.toFixed(2),
    savings,
    summaryText,
    offerType
  };
}

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Bioderma Sebium Moussant Gel 200Ml",
    nameAr: "بيوديرما سيبيوم جل رغوي منقي للبشرة 200 مل",
    price: "103",
    discount: "96% على الحبة الثانية",
    offerType: "second_piece_96",
    brand: "bioderma",
    image: "/images/sebium_gel_200.webp",
    description: "غسول رغوي لطيف للبشرة المختلطة والدهنية ينظف بعمق ويقلل الإفرازات الدهنية دون جفاف."
  },
  {
    id: 2,
    name: "Qv Moisturising Cream 500 Gm",
    nameAr: "كريم كيو في المرطب للبشرة الجافة 500 جم",
    price: "160",
    discount: "الحبتين بـ 96 ر.س",
    offerType: "two_for_96",
    bundlePrice: "96",
    brand: "qv",
    image: "https://images.unsplash.com/photo-1608248597359-5613531b46a2?auto=format&fit=crop&w=600&q=80",
    description: "كريم ترطيب مكثف غني بحمض السكوالين لحماية وترطيب البشرة الجافة والحساسة لمدة 24 ساعة."
  },
  {
    id: 3,
    name: "Pert Plus Hair Shampoo Ginger",
    nameAr: "شامبو بيرت بلس بخلاصة الزنجبيل للشعر 400 مل",
    price: "14.28",
    discount: "70%",
    offerType: "percentage",
    brand: "haircare",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
    description: "شامبو مستوحى من الوصفات التقليدية الغني بخلاصة الزنجبيل لتقوية ألياف الشعر ومنع التساقط."
  },
  {
    id: 4,
    name: "Bioderma Sebium Pore Refiner 30ml",
    nameAr: "بيوديرما سيبيوم بور ريفاينر لتقليص المسام 30 مل",
    price: "99",
    discount: "1+1 مجاناً",
    offerType: "buy_1_get_1",
    brand: "bioderma",
    image: "/images/sebium_pore_refiner.webp",
    description: "مصحح المسام الواسعة للبشرة الدهنية والمختلطة يوحد ملمس البشرة ويعطي لمسة غير لامعة."
  },
  {
    id: 5,
    name: "Bioderma Sensibio Gel Moussant 200ml",
    nameAr: "بيوديرما سنسيبيو جل رغوي مهدئ للبشرة الحساسة 200 مل",
    price: "109",
    discount: "بـ 96 ر.س فقط",
    offerType: "fixed_96",
    offerPrice: "96",
    brand: "bioderma",
    image: "/images/sensibo_gel.webp",
    description: "غسول مهدئ للبشرة الحساسة يرطب وينظف بلطف ويحمي الحاجز الطبيعي للجلد."
  },
  {
    id: 6,
    name: "Bioderma Atoderm Cream Ultra 500ml",
    nameAr: "بيوديرما أتوديرم كريم الترطيب الفائق 500 مل",
    price: "145",
    discount: "50%",
    offerType: "percentage",
    brand: "bioderma",
    image: "/images/atoderm_500.webp",
    description: "عناية يومية فائقة الترطيب للبشرة الجافة إلى الجافة جداً مناسب لجميع أفراد الأسرة."
  },
  {
    id: 7,
    name: "Bioderma Photoderm Max Aquafluide SPF50+",
    nameAr: "واقي شمس بيوديرما فوتوديرم ماكس اكوافلويد 40 مل",
    price: "125",
    discount: "96% على الحبة الثانية",
    offerType: "second_piece_96",
    brand: "bioderma",
    image: "/images/photoderm_max.webp",
    description: "حماية قصوى من أشعة الشمس مع لمسة جافة خالية من اللمعان ومقاومة للماء."
  },
  {
    id: 8,
    name: "Bioderma Pigmentbio Daily Care SPF50+ 50ml",
    nameAr: "بيوديرما بيجمنت بيو دايلي كير لتفتيح التصبغات 50 مل",
    price: "165",
    discount: "50%",
    offerType: "percentage",
    brand: "bioderma",
    image: "/images/pigmentbio_daily.webp",
    description: "عناية نهارية موحدة للون البشرة مع حماية من الأشعة فوق البنفسجية لتقليل التصبغات والبقع الداكنة."
  }
];

export const INITIAL_CATEGORIES = [
  {
    id: "bioderma",
    slug: "bioderma",
    nameAr: "بيوديرما الفرنسية",
    nameEn: "Bioderma Paris",
    badge: "خصم 50%",
    tagline: "أفضل مستحضرات العناية الطبية الجلدية الموصى بها من أطباء فرنسا",
    color: "from-blue-600 to-emerald-700",
    icon: "🔬"
  },
  {
    id: "qv",
    slug: "qv",
    nameAr: "كيو في",
    nameEn: "QV Skincare",
    badge: "خصم 50%",
    tagline: "الترطيب الطبي الأكثر أماناً للبشرة الحساسة والجافة",
    color: "from-teal-600 to-cyan-800",
    icon: "💧"
  },
  {
    id: "haircare",
    slug: "haircare",
    nameAr: "العناية بالشعر (بيرت بلس)",
    nameEn: "Pert Plus & Hair Care",
    badge: "خصم حارق 70%",
    tagline: "شامبوهات ومستحضرات طبيعية لشعر قوي وناعم بأسعار لا تقاوم",
    color: "from-amber-600 to-emerald-800",
    icon: "✨"
  }
];

export function AppProvider({ children }) {
  // Categories state with localStorage persistence
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('altayeb_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from localStorage:', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Products state with localStorage persistence
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('altayeb_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state with localStorage persistence
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('altayeb_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading orders from localStorage:', e);
    }
    return [];
  });

  // Admin auth state (persisted)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('altayeb_admin_auth') === 'true';
  });

  // Active modal product for ordering
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);

  // Sync categories to localStorage
  useEffect(() => {
    localStorage.setItem('altayeb_categories', JSON.stringify(categories));
  }, [categories]);

  // Sync products to localStorage
  useEffect(() => {
    localStorage.setItem('altayeb_products', JSON.stringify(products));
  }, [products]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('altayeb_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync admin auth
  useEffect(() => {
    localStorage.setItem('altayeb_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Derived brandsInfo dictionary from categories for O(1) lookups
  const brandsInfo = categories.reduce((acc, cat) => {
    acc[cat.slug.toLowerCase()] = cat;
    return acc;
  }, {});

  // Category Actions
  const addCategory = (categoryData) => {
    const slug = (categoryData.slug || categoryData.nameEn || categoryData.nameAr)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    const newCategory = {
      id: slug,
      slug: slug,
      nameAr: categoryData.nameAr.trim(),
      nameEn: categoryData.nameEn?.trim() || categoryData.nameAr.trim(),
      badge: categoryData.badge || 'خصم 50%',
      tagline: categoryData.tagline || 'عروض وتخفيضات اليوم الوطني 96',
      color: categoryData.color || 'from-saudi-800 to-emerald-900',
      icon: categoryData.icon || '✨'
    };

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const deleteCategory = (slug) => {
    setCategories(prev => prev.filter(c => c.slug.toLowerCase() !== slug.toLowerCase()));
  };

  const updateCategory = (slug, updatedFields) => {
    setCategories(prev => prev.map(c => 
      c.slug.toLowerCase() === slug.toLowerCase() ? { ...c, ...updatedFields } : c
    ));
  };

  // Helper to calculate discounted price
  const calculateFinalPrice = (priceStr, discountStr) => {
    const price = parseFloat(priceStr) || 0;
    const discount = parseFloat(discountStr?.replace('%', '')) || 0;
    const final = price * (1 - discount / 100);
    return Math.max(0, final).toFixed(2);
  };

  // Add Product
  const addProduct = (newProduct) => {
    const id = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
    const productWithId = {
      ...newProduct,
      id,
      price: String(newProduct.price),
      offerType: newProduct.offerType || 'percentage',
      discount: newProduct.discount || '50%'
    };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  // Update Product
  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  // Delete Product
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Add Order
  const addOrder = (orderData) => {
    const newOrderId = `SA96-${Math.floor(100000 + Math.random() * 900000)}`;
    const pricing = calculateOfferPricing(orderData.product, orderData.quantity || 1);

    const newOrder = {
      id: newOrderId,
      orderNumber: newOrderId,
      customerName: orderData.customerName,
      phone: orderData.phone,
      address: orderData.address,
      product: orderData.product,
      quantity: orderData.quantity || 1,
      totalAmount: pricing.total,
      savings: pricing.savings,
      offerSummary: pricing.summaryText,
      notes: orderData.notes || '',
      status: 'جديد',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Delete Order
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // Auth mock
  const login = (username, password) => {
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة (استخدم: admin / admin)' };
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
        products,
        orders,
        isAdminLoggedIn,
        selectedProductForOrder,
        setSelectedProductForOrder,
        calculateFinalPrice,
        calculateOfferPricing,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        login,
        logout,
        brandsInfo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
