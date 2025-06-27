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
import DebugPage from "./pages/DebugPage";

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
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/debug" element={<DebugPage />} />

          {/* Protected Routes */}
          <Route
            path="/create-product"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
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
