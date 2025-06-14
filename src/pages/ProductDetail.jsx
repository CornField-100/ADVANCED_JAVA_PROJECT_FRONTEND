import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://advanced-java-project.onrender.com/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok)
          throw new Error(`Failed to fetch product, status: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        <div className="row g-0">
          {/* Left: Product Image */}
          <div className="col-md-6 text-center p-4">
            <img
              src={product.imageUrl || "https://via.placeholder.com/400"}
              alt={product.Model || "Product"}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>

          {/* Right: Product Info */}
          <div className="col-md-6 p-4">
            <h2 className="mb-3">
              {product.Model || product.model || "Unnamed Product"}
            </h2>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            {product.description && (
              <div>
                <hr />
                <p>
                  <strong>Description:</strong>
                </p>
                <p>{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4>Reviews</h4>
        <hr />
        <p className="text-muted">No reviews yet. Be the first to leave one!</p>
      </div>
    </div>
  );
};

export default ProductDetail;
