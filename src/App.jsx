import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import "react-toastify/dist/ReactToastify.css";

// Core Components (loaded immediately)
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import PerformanceMonitor from "./components/PerformanceMonitor";

// Lazy-loaded Pages (split into chunks)
// Core pages - immediate load
const LandingPage = lazy(() => import("./pages/LandingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LogInPage = lazy(() => import("./pages/LogInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

// Shopping pages - separate chunk
const SearchProductPage = lazy(() => import("./pages/SearchProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

// Admin pages - separate chunk (heavy components)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));

// Product management - separate chunk
const CreateProduct = lazy(() => import("./pages/CreateProduct"));
const EditProductPage = lazy(() => import("./pages/EditProduct"));

// Utility pages
const DebugPage = lazy(() => import("./pages/DebugPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Loading components for different sections
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <p style={{
      color: '#6b7280',
      fontSize: '1rem',
      fontWeight: '500'
    }}>{message}</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AdminLoadingSpinner = () => (
  <LoadingSpinner message="Loading admin dashboard..." />
);

const ShoppingLoadingSpinner = () => (
  <LoadingSpinner message="Loading shopping experience..." />
);

const ProductLoadingSpinner = () => (
  <LoadingSpinner message="Loading product management..." />
);

const App = () => {
  return (
    <Router>
      <PerformanceMonitor />
      <NavBar />
      <Routes>
        {/* Full-width routes (no container) */}
        <Route
          path="/analytics"
          element={
            <div style={{ paddingTop: "5rem" }}>
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingSpinner />}>
                  <AnalyticsDashboard />
                </Suspense>
              </ProtectedRoute>
            </div>
          }
        />

        {/* Regular containerized routes */}
        <Route 
          path="/" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <LandingPage />
            </Suspense>
          } 
        />
        <Route
          path="/products"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<LoadingSpinner />}>
                <HomePage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/login"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<LoadingSpinner />}>
                <LogInPage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/signup"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<LoadingSpinner />}>
                <SignUpPage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/search"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<ShoppingLoadingSpinner />}>
                <SearchProductPage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/cart"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<ShoppingLoadingSpinner />}>
                <CartPage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/checkout"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<ShoppingLoadingSpinner />}>
                <CheckoutPage />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<ShoppingLoadingSpinner />}>
                <OrderConfirmation />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/products/:id"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<ShoppingLoadingSpinner />}>
                <ProductDetail />
              </Suspense>
            </main>
          }
        />
        <Route
          path="/debug"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <Suspense fallback={<LoadingSpinner />}>
                <DebugPage />
              </Suspense>
            </main>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/create-product"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<ProductLoadingSpinner />}>
                  <CreateProduct />
                </Suspense>
              </ProtectedRoute>
            </main>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<ProductLoadingSpinner />}>
                  <EditProductPage />
                </Suspense>
              </ProtectedRoute>
            </main>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/admin"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            </main>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingSpinner />}>
                  <AdminOrdersPage />
                </Suspense>
              </ProtectedRoute>
            </main>
          }
        />
        <Route
          path="/admin/users"
          element={
            <div style={{ paddingTop: "5rem" }}>
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingSpinner />}>
                  <AdminUsersPage />
                </Suspense>
              </ProtectedRoute>
            </div>
          }
        />

        <Route 
          path="*" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFoundPage />
            </Suspense>
          } 
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
        toastStyle={{
          borderRadius: "12px",
          fontSize: "0.95rem",
          fontFamily: "'Inter', sans-serif",
        }}
        progressStyle={{
          height: "4px",
        }}
      />
    </Router>
  );
};

export default App;
