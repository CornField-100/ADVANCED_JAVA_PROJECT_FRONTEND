import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import CreateProduct from "./pages/CreateProduct";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import EditProductPage from "./pages/EditProduct";
import SearchProductPage from "./pages/SearchProductPage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DebugPage from "./pages/DebugPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";

// Components
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Full-width routes (no container) */}
        <Route
          path="/analytics"
          element={
            <div style={{ paddingTop: "5rem" }}>
              <ProtectedRoute adminOnly={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            </div>
          }
        />

        {/* Regular containerized routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/products"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <HomePage />
            </main>
          }
        />
        <Route
          path="/login"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <LogInPage />
            </main>
          }
        />
        <Route
          path="/signup"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <SignUpPage />
            </main>
          }
        />
        <Route
          path="/search"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <SearchProductPage />
            </main>
          }
        />
        <Route
          path="/cart"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <CartPage />
            </main>
          }
        />
        <Route
          path="/checkout"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <CheckoutPage />
            </main>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <OrderConfirmation />
            </main>
          }
        />
        <Route
          path="/products/:id"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProductDetail />
            </main>
          }
        />
        <Route
          path="/debug"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <DebugPage />
            </main>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/create-product"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <CreateProduct />
              </ProtectedRoute>
            </main>
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <EditProductPage />
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
                <AdminDashboard />
              </ProtectedRoute>
            </main>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <main style={{ paddingTop: "5rem" }} className="container">
              <ProtectedRoute adminOnly={true}>
                <AdminOrdersPage />
              </ProtectedRoute>
            </main>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
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
