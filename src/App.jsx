import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ContextoTema';
import { AuthProvider, useAuth } from '@/contexts/ContextoAutenticacao';
import { ProvedorProdutos } from '@/contexts/ContextoProduto';
import LoadingSpinner from '@/components/SpinnerCarregamento';
import ErrorBoundary from '@/components/LimiteDeErro';

// Carregamento preguiçoso dos componentes para melhor performance
const Layout = lazy(() => import('@/components/Estrutura'));
const HomePage = lazy(() => import('@/pages/Inicio'));
const CategoryPage = lazy(() => import('@/pages/Categoria'));
const ProductDetailPage = lazy(() => import('@/pages/DetalhesProduto'));
const CartPage = lazy(() => import('@/pages/Carrinho'));
const CheckoutPage = lazy(() => import('@/pages/FinalizarCompra'));
const FavoritesPage = lazy(() => import('@/pages/Favoritos'));
const LoginPage = lazy(() => import('@/pages/Login'));
const AboutPage = lazy(() => import('@/pages/Sobre'));
const SellerDashboardPage = lazy(() => import('@/pages/PainelVendedor'));
const CustomerProfilePage = lazy(() => import('@/pages/PerfilCliente'));
const ManageProductsPage = lazy(() => import('@/pages/GerenciarProdutos'));
const ProductFormPage = lazy(() => import('@/pages/FormularioProduto'));

// Componente para rotas protegidas
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
  // Obtém o caminho base do ambiente ou usa a raiz
  const basePath = import.meta.env.BASE_URL || '/';

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProvedorProdutos>
          <ErrorBoundary>
            <Router basename={basePath}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="category/:categoryName" element={<CategoryPage />} />
                        <Route path="produtos/:productId" element={<ProductDetailPage />} />
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
                          path="orders" 
                          element={
                            <ProtectedRoute allowedRoles={['customer', 'seller']}>
                              <div className="text-center py-10">Página de Pedidos (Em construção)</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="addresses" 
                          element={
                            <ProtectedRoute allowedRoles={['customer', 'seller']}>
                              <div className="text-center py-10">Página de Endereços (Em construção)</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="payment-methods" 
                          element={
                            <ProtectedRoute allowedRoles={['customer', 'seller']}>
                              <div className="text-center py-10">Página de Formas de Pagamento (Em construção)</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="settings" 
                          element={
                            <ProtectedRoute allowedRoles={['customer', 'seller']}>
                              <div className="text-center py-10">Página de Configurações (Em construção)</div>
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="help" 
                          element={
                            <div className="text-center py-10">Página de Ajuda (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="contact" 
                          element={
                            <div className="text-center py-10">Página de Contato (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="privacy" 
                          element={
                            <div className="text-center py-10">Política de Privacidade (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="terms" 
                          element={
                            <div className="text-center py-10">Termos de Uso (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="shipping" 
                          element={
                            <div className="text-center py-10">Política de Envio (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="returns" 
                          element={
                            <div className="text-center py-10">Política de Devolução (Em construção)</div>
                          } 
                        />
                        <Route 
                          path="faq" 
                          element={
                            <div className="text-center py-10">Perguntas Frequentes (Em construção)</div>
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
              </ErrorBoundary>
            </ProvedorProdutos>
          </AuthProvider>
        </ThemeProvider>
      );
    }

    export default App;