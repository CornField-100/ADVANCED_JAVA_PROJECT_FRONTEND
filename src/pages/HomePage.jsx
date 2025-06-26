import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../utils/fetchProduts";
import CardComponent from "../components/CardComponent";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleEdit = (productId) => {
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/edit-product/${productId}`);
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="container my-5 pt-5">
      <h2 className="mb-4 fw-bold text-center">Featured Products</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          <p className="mb-0">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="alert alert-info text-center">
          <p className="mb-0">
            No products found at the moment. Please check back later.
          </p>
        </div>
      )}

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
              showEditButton={!!token} // Show edit button only if logged in
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
