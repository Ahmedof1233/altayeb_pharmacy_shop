import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { auth, db, storage, isFirebaseConfigured } from './config';

/**
 * Strips out any undefined keys to satisfy Firestore's strict data requirements.
 */
function cleanObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

// -------------------------------------------------------------
// Authentication
// -------------------------------------------------------------

export function listenToAuth(callback) {
  if (!isFirebaseConfigured || !auth) {
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function loginWithFirebase(email, password) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('لم يتم إعداد مفاتيح Firebase بعد في ملف .env');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
  return userCredential.user;
}

export async function logoutWithFirebase() {
  if (!isFirebaseConfigured || !auth) return;
  await signOut(auth);
}

export async function resetPasswordWithFirebase(email) {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('لم يتم إعداد مفاتيح Firebase بعد في ملف .env');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

// -------------------------------------------------------------
// Products
// -------------------------------------------------------------

export function subscribeToProducts(callback, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    },
    (error) => {
      console.error('Error fetching products from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

export async function addProductToFirestore(product) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const colRef = collection(db, 'products');
  const cleaned = cleanObject({
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  const docRef = await addDoc(colRef, cleaned);
  return { id: docRef.id, ...product };
}

export async function updateProductInFirestore(productId, data) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'products', String(productId));
  const cleaned = cleanObject({
    ...data,
    updatedAt: serverTimestamp()
  });
  await updateDoc(docRef, cleaned);
}

export async function deleteProductFromFirestore(productId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'products', String(productId));
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// Categories
// -------------------------------------------------------------

export function subscribeToCategories(callback, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  const colRef = collection(db, 'categories');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(items);
    },
    (error) => {
      console.error('Error fetching categories from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

export async function addCategoryToFirestore(category) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const slug = category.slug || category.id || `cat-${Date.now()}`;
  const docRef = doc(db, 'categories', String(slug));
  const cleaned = cleanObject({
    ...category,
    createdAt: serverTimestamp()
  });
  await setDoc(docRef, cleaned, { merge: true });
  return { id: slug, ...category };
}

export async function updateCategoryInFirestore(categoryId, data) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'categories', String(categoryId));
  await updateDoc(docRef, cleanObject(data));
}

export async function deleteCategoryFromFirestore(categoryId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'categories', String(categoryId));
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// Orders
// -------------------------------------------------------------

export function subscribeToOrders(callback, onError) {
  if (!isFirebaseConfigured || !db) return () => {};

  const colRef = collection(db, 'orders');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      items.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
        return timeB - timeA;
      });
      callback(items);
    },
    (error) => {
      console.error('Error fetching orders from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

export async function addOrderToFirestore(orderData) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const colRef = collection(db, 'orders');
  const cleaned = cleanObject({
    ...orderData,
    createdAt: serverTimestamp(),
    timestamp: Date.now()
  });
  const docRef = await addDoc(colRef, cleaned);
  return { id: docRef.id, ...orderData };
}

export async function updateOrderStatusInFirestore(orderId, newStatus) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'orders', String(orderId));
  await updateDoc(docRef, { 
    status: newStatus,
    updatedAt: serverTimestamp()
  });
}

export async function deleteOrderFromFirestore(orderId) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');
  const docRef = doc(db, 'orders', String(orderId));
  await deleteDoc(docRef);
}

// -------------------------------------------------------------
// Cloud Storage for Product Images
// -------------------------------------------------------------

export async function uploadImageToStorage(file) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('خدمة التخزين السحابي Firebase Storage غير مهيأة');
  }

  const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const fileRef = ref(storage, `products/${cleanFileName}`);
  
  const snapshot = await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

// -------------------------------------------------------------
// Initial Data Migration (Seeder)
// -------------------------------------------------------------

export async function seedInitialDataToFirestore(initialProducts, initialCategories) {
  if (!isFirebaseConfigured || !db) throw new Error('Firebase غير متصل');

  let productsCount = 0;
  let categoriesCount = 0;

  // 1. Seed Categories
  if (initialCategories && initialCategories.length > 0) {
    for (const cat of initialCategories) {
      const slug = cat.slug || cat.id || `cat-${Date.now()}`;
      const docRef = doc(db, 'categories', String(slug));
      const cleanedCategory = cleanObject({
        slug: slug,
        nameAr: cat.nameAr || '',
        nameEn: cat.nameEn || cat.nameAr || '',
        badge: cat.badge || 'خصم 50%',
        tagline: cat.tagline || 'عروض وتخفيضات اليوم الوطني 96',
        color: cat.color || 'from-saudi-800 to-emerald-900',
        icon: cat.icon || '✨',
        createdAt: serverTimestamp()
      });
      await setDoc(docRef, cleanedCategory, { merge: true });
      categoriesCount++;
    }
  }

  // 2. Seed Products
  if (initialProducts && initialProducts.length > 0) {
    for (const prod of initialProducts) {
      const { id, ...prodData } = prod;
      const docId = `prod-${id}`;
      const docRef = doc(db, 'products', docId);
      const cleanedProduct = cleanObject({
        name: prodData.name || '',
        nameAr: prodData.nameAr || '',
        price: String(prodData.price || '0'),
        discount: prodData.discount || '50%',
        offerType: prodData.offerType || 'percentage',
        bundlePrice: prodData.bundlePrice || '',
        offerPrice: prodData.offerPrice || '',
        brand: prodData.brand || 'bioderma',
        image: prodData.image || '',
        description: prodData.description || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await setDoc(docRef, cleanedProduct, { merge: true });
      productsCount++;
    }
  }

  return { productsCount, categoriesCount };
}
