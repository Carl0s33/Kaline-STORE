import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import LoadingSpinner from '@/components/LoadingSpinner';

    const HomePage = lazy(() => import('@/pages/HomePage'));
    const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
    const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
    const CartPage = lazy(() => import('@/pages/CartPage'));
    const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
    const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
    const LoginPage = lazy(() => import('@/pages/LoginPage'));
    const AboutPage = lazy(() => import('@/pages/AboutPage'));
    const SellerDashboardPage = lazy(() => import('@/pages/SellerDashboardPage'));
    const CustomerProfilePage = lazy(() => import('@/pages/CustomerProfilePage'));
    const ManageProductsPage = lazy(() => import('@/pages/ManageProductsPage'));
    const ProductFormPage = lazy(() => import('@/pages/ProductFormPage'));


    const ProtectedRoute = ({ children, allowedRoles, requireAuthForCheckout = false }) => {
      const { user, loading } = useAuth();
      const location = useLocation();

      if (loading) {
        return <LoadingSpinner />;
      }

      if (!user) {
        if (requireAuthForCheckout) {
          return <Navigate to="/login" state={{ from: location, message: "Você precisa estar logado para finalizar a compra." }} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
      }

      return children;
    };


    function App() {
  // ...
      return (
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <Router>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="category/:categoryName" element={<CategoryPage />} />
                      <Route path="product/:productId" element={<ProductDetailPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route 
                        path="checkout" 
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'seller']} requireAuthForCheckout={true}>
                            <CheckoutPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="favorites" element={<FavoritesPage />} />
                      <Route path="login" element={<LoginPage />} />
                      <Route path="about" element={<AboutPage />} />
                      
                      <Route 
                        path="seller/dashboard" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <SellerDashboardPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="seller/products" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <ManageProductsPage />
                          </ProtectedRoute>
                        } 
                      />
                       <Route 
                        path="seller/products/new" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <ProductFormPage />
                          </ProtectedRoute>
                        } 
                      />
                       <Route 
                        path="seller/products/edit/:productId" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <ProductFormPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="profile" 
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'seller']}>
                            <CustomerProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="profile/orders" 
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'seller']}>
                            <div className="text-center py-10">Página de Histórico de Pedidos (Em construção)</div>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="profile/addresses" 
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'seller']}>
                            <div className="text-center py-10">Página de Endereços (Em construção)</div>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="profile/edit" 
                        element={
                          <ProtectedRoute allowedRoles={['customer', 'seller']}>
                            <div className="text-center py-10">Página de Editar Perfil (Em construção)</div>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="seller/orders" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <div className="text-center py-10">Página de Pedidos do Vendedor (Em construção)</div>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="seller/settings" 
                        element={
                          <ProtectedRoute allowedRoles={['seller']}>
                            <div className="text-center py-10">Página de Configurações da Loja (Em construção)</div>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="register" 
                        element={
                          <div className="text-center py-10">Página de Cadastro (Em construção)</div>
                        } 
                      />
                      <Route 
                        path="forgot-password" 
                        element={
                          <div className="text-center py-10">Página de Esqueci a Senha (Em construção)</div>
                        } 
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      );
    }

    export default App;