import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import CartDrawer from './components/client/CartDrawer';
import OrderModal from './components/client/OrderModal';
import CartToast from './components/client/CartToast';
import FloatingCartButton from './components/client/FloatingCartButton';
import FloatingWhatsAppButton from './components/client/FloatingWhatsAppButton';
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import ProductPage from './pages/ProductPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Client Layout with Navbar, Footer, and Global Modals
function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-cairo relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Global Shopping Modals & Overlays */}
      <CartDrawer />
      <OrderModal />
      <CartToast />
      <FloatingCartButton />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Client Routes */}
          <Route
            path="/"
            element={
              <ClientLayout>
                <HomePage />
              </ClientLayout>
            }
          />
          <Route
            path="/brand/:brandName"
            element={
              <ClientLayout>
                <BrandPage />
              </ClientLayout>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <ClientLayout>
                <ProductPage />
              </ClientLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Fallback to Home */}
          <Route
            path="*"
            element={
              <ClientLayout>
                <HomePage />
              </ClientLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
