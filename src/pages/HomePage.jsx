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
        setError("Failed to load products");
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

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold text-center">Latest Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found</p>}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {products.map((product) => (
          <div key={product._id} className="col">
            <CardComponent
              title={product.Model || product.model || "No Model"}
              brand={product.brand || "Unknown Brand"}
              price={product.price ?? "N/A"}
              stock={product.stock ?? 0}
              imageUrl={product.imageUrl || ""}
              productId={product._id}
            />
            {token && (
              <button
                className="btn btn-outline-warning w-100 mt-2"
                onClick={() => handleEdit(product._id)}
              >
                Edit Product
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
