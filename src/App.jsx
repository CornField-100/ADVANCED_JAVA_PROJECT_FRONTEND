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
      <main style={{ paddingTop: "5rem" }} className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<HomePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/search" element={<SearchProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/debug" element={<DebugPage />} />

          {/* Protected Routes */}
          <Route
            path="/create-product"
            element={
              <ProtectedRoute adminOnly={true}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditProductPage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute adminOnly={true}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
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
