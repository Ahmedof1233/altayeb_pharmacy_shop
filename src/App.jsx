import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
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

// Client Layout with Navbar and Footer
function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-cairo">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
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
