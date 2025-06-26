import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import LandingPage from "./pages/LandingPage"; // ✅ add this

// Components
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <Router>
      <NavBar />
      <main style={{ paddingTop: "5rem" }} className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* ✅ updated */}
          <Route path="/products" element={<HomePage />} />{" "}
          {/* ✅ moved product grid */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/search" element={<SearchProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
