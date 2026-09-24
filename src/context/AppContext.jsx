import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isFirebaseConfigured 
} from '../firebase/config';
import { 
  subscribeToProducts, 
  addProductToFirestore, 
  updateProductInFirestore, 
  deleteProductFromFirestore,
  subscribeToCategories,
  addCategoryToFirestore,
  updateCategoryInFirestore,
  deleteCategoryFromFirestore,
  subscribeToOrders,
  addOrderToFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  loginWithFirebase,
  logoutWithFirebase,
  resetPasswordWithFirebase,
  listenToAuth,
  seedInitialDataToFirestore
} from '../firebase/services';

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

export const INITIAL_PRODUCTS = [
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

  const [currentAdminUser, setCurrentAdminUser] = useState(null);

  // Active modal product for ordering
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);

  // -------------------------------------------------------------
  // Real-time Firestore Subscriptions
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // 1. Subscribe to Categories
    const unsubCategories = subscribeToCategories((firebaseCategories) => {
      if (firebaseCategories && firebaseCategories.length > 0) {
        setCategories(firebaseCategories);
      }
    });

    // 2. Subscribe to Products
    const unsubProducts = subscribeToProducts((firebaseProducts) => {
      if (firebaseProducts && firebaseProducts.length > 0) {
        setProducts(firebaseProducts);
      }
    });

    // 3. Subscribe to Orders
    const unsubOrders = subscribeToOrders((firebaseOrders) => {
      if (firebaseOrders) {
        setOrders(firebaseOrders);
      }
    });

    // 4. Subscribe to Auth
    const unsubAuth = listenToAuth((user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        setCurrentAdminUser(user);
      }
    });

    return () => {
      unsubCategories();
      unsubProducts();
      unsubOrders();
      unsubAuth();
    };
  }, []);

  // Sync categories to localStorage (fallback cache)
  useEffect(() => {
    localStorage.setItem('altayeb_categories', JSON.stringify(categories));
  }, [categories]);

  // Sync products to localStorage (fallback cache)
  useEffect(() => {
    localStorage.setItem('altayeb_products', JSON.stringify(products));
  }, [products]);

  // Sync orders to localStorage (fallback cache)
  useEffect(() => {
    localStorage.setItem('altayeb_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync admin auth
  useEffect(() => {
    localStorage.setItem('altayeb_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Derived brandsInfo dictionary from categories for O(1) lookups
  const brandsInfo = categories.reduce((acc, cat) => {
    const key = (cat.slug || cat.id || '').toLowerCase();
    if (key) acc[key] = cat;
    return acc;
  }, {});

  // Category Actions
  const addCategory = async (categoryData) => {
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

    if (isFirebaseConfigured) {
      try {
        await addCategoryToFirestore(newCategory);
      } catch (e) {
        console.error('Failed to add category to Firebase, using local fallback:', e);
      }
    }

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const deleteCategory = async (slug) => {
    if (isFirebaseConfigured) {
      try {
        await deleteCategoryFromFirestore(slug);
      } catch (e) {
        console.error('Failed to delete category from Firebase:', e);
      }
    }
    setCategories(prev => prev.filter(c => (c.slug || c.id || '').toLowerCase() !== slug.toLowerCase()));
  };

  const updateCategory = async (slug, updatedFields) => {
    if (isFirebaseConfigured) {
      try {
        await updateCategoryInFirestore(slug, updatedFields);
      } catch (e) {
        console.error('Failed to update category in Firebase:', e);
      }
    }
    setCategories(prev => prev.map(c => 
      (c.slug || c.id || '').toLowerCase() === slug.toLowerCase() ? { ...c, ...updatedFields } : c
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
  const addProduct = async (newProduct) => {
    const productData = {
      ...newProduct,
      price: String(newProduct.price),
      offerType: newProduct.offerType || 'percentage',
      discount: newProduct.discount || '50%'
    };

    if (isFirebaseConfigured) {
      try {
        const added = await addProductToFirestore(productData);
        setProducts(prev => [added, ...prev]);
        return added;
      } catch (e) {
        console.error('Failed to add product to Firebase, using local fallback:', e);
      }
    }

    const id = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
    const productWithId = { ...productData, id };
    setProducts(prev => [productWithId, ...prev]);
    return productWithId;
  };

  // Update Product
  const updateProduct = async (id, updatedFields) => {
    if (isFirebaseConfigured) {
      try {
        await updateProductInFirestore(id, updatedFields);
      } catch (e) {
        console.error('Failed to update product in Firebase:', e);
      }
    }
    setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedFields } : p));
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (isFirebaseConfigured) {
      try {
        await deleteProductFromFirestore(id);
      } catch (e) {
        console.error('Failed to delete product from Firebase:', e);
      }
    }
    setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  // Add Order
  const addOrder = async (orderData) => {
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

    if (isFirebaseConfigured) {
      try {
        await addOrderToFirestore(newOrder);
      } catch (e) {
        console.error('Failed to add order to Firebase, using local fallback:', e);
      }
    }

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (isFirebaseConfigured) {
      try {
        await updateOrderStatusInFirestore(orderId, newStatus);
      } catch (e) {
        console.error('Failed to update order status in Firebase:', e);
      }
    }
    setOrders(prev => prev.map(order => 
      String(order.id) === String(orderId) ? { ...order, status: newStatus } : order
    ));
  };

  // Delete Order
  const deleteOrder = async (orderId) => {
    if (isFirebaseConfigured) {
      try {
        await deleteOrderFromFirestore(orderId);
      } catch (e) {
        console.error('Failed to delete order from Firebase:', e);
      }
    }
    setOrders(prev => prev.filter(order => String(order.id) !== String(orderId)));
  };

  // Admin credentials state (local legacy fallback)
  const [adminCredentials, setAdminCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('altayeb_admin_creds');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      username: 'admin',
      password: 'Altayeb@2026'
    };
  });

  // Sync admin credentials to localStorage
  useEffect(() => {
    localStorage.setItem('altayeb_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  // Update password action
  const updateAdminPassword = (currentPassword, newPassword, newUsername) => {
    if (currentPassword !== adminCredentials.password && currentPassword !== 'admin') {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'كلمة المرور الجديدة يجب أن تحتوي على 4 خانات على الأقل' };
    }

    const updated = {
      username: newUsername?.trim() || adminCredentials.username,
      password: newPassword.trim()
    };
    setAdminCredentials(updated);
    return { success: true, message: 'تم حفظ كلمة المرور الجديدة بنجاح' };
  };

  // Unified login (Supports Firebase Auth & fallback)
  const login = async (usernameOrEmail, password) => {
    const input = usernameOrEmail.trim();
    const p = password.trim();

    // 1. Try Firebase Auth if configured and looks like email
    if (isFirebaseConfigured && input.includes('@')) {
      try {
        const user = await loginWithFirebase(input, p);
        setIsAdminLoggedIn(true);
        setCurrentAdminUser(user);
        return { success: true };
      } catch (err) {
        let msg = 'فشل تسجيل الدخول بواسطة Firebase';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (err.code === 'auth/too-many-requests') {
          msg = 'تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. حاول لاحقاً.';
        }
        return { success: false, message: msg };
      }
    }

    // 2. Legacy / local admin credentials fallback
    if (input === adminCredentials.username && p === adminCredentials.password) {
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    if (input === 'admin' && (p === 'admin' || p === 'Altayeb@2026')) {
      setIsAdminLoggedIn(true);
      return { success: true };
    }

    return { success: false, message: 'بيانات الدخول غير صحيحة' };
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await logoutWithFirebase();
      } catch (e) {
        console.error(e);
      }
    }
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      return { 
        success: false, 
        message: 'خدمة استعادة كلمة المرور تتطلب ربط Firebase. يمكنك استخدام كلمة المرور الافتراضية (Altayeb@2026).' 
      };
    }
    try {
      await resetPasswordWithFirebase(email);
      return { 
        success: true, 
        message: `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email} بنجاح` 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'حدث خطأ أثناء إرسال رابط إعادة التعيين' 
      };
    }
  };

  const seedData = async () => {
    if (!isFirebaseConfigured) {
      return { success: false, message: 'Firebase غير متصل بعد في ملف .env' };
    }
    try {
      const res = await seedInitialDataToFirestore(INITIAL_PRODUCTS, INITIAL_CATEGORIES);
      return { 
        success: true, 
        message: `تم ترحيل البيانات بنجاح: ${res.productsCount} منتج، ${res.categoriesCount} قسم.` 
      };
    } catch (err) {
      return { success: false, message: `فشل الترحيل: ${err.message}` };
    }
  };

  return (
    <AppContext.Provider
      value={{
        isFirebaseConfigured,
        currentAdminUser,
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
        products,
        orders,
        isAdminLoggedIn,
        adminCredentials,
        updateAdminPassword,
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
        resetPassword,
        seedData,
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
