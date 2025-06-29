import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../utils/fetchProduts";
import CardComponent from "../components/CardComponent";
import Hero from "../components/Hero"; // Import the Hero component
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component
import { isAdmin } from "../utils/auth";

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const navigate = useNavigate();
  const userIsAdmin = isAdmin();

  // Load products regardless of loading screen state
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.slice(0, 4)); // Show 4 featured products
      } catch (err) {
        console.error("Error loading featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
  };

  // Show loading screen until it completes its animation
  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="landing-page">
      <Hero /> {/* Use the Hero component */}
      {/* FEATURED PRODUCTS SECTION */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Featured Products</h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {products.map((product) => (
                <div key={product._id} className="col">
                  <CardComponent
                    title={product.Model || product.model || "No Model"}
                    brand={product.brand || "Unknown Brand"}
                    price={product.price ?? "N/A"}
                    stock={product.stock ?? 0}
                    imageUrl={product.imageUrl || ""}
                    productId={product._id}
                    onViewDetails={() => handleViewDetails(product._id)}
                    onEdit={() => handleEdit(product._id)}
                    showEditButton={userIsAdmin}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-outline-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
