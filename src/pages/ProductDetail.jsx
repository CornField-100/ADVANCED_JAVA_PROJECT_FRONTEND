import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { getProductImage, getBrandColors } from "../utils/brandImages";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    setProduct(null); // Force rerender when ID changes

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:3001/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/reviews/${id}`);
        if (res.ok) {
          setReviews(await res.json());
        }
      } catch {
        // silently fail
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      toast.error("Sorry, this item is out of stock!", {
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
          boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
        },
      });
      return;
    }

    setIsAdding(true);

    // Enhanced delay with multiple feedback stages
    setTimeout(() => {
      addToCart({
        productId: product._id,
        title: product.Model || product.model || "Unnamed Product",
        brand: product.brand,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });

      // Show enhanced success toast with celebration
      toast.success(
        <div className="d-flex align-items-center">
          <div className="me-3" style={{ fontSize: "1.5rem" }}>
            ✓
          </div>
          <div>
            <div style={{ fontWeight: "bold" }}>Added to Cart</div>
            <div style={{ fontSize: "0.9rem" }}>
              {product.brand} {product.Model || product.model} added
              successfully
            </div>
          </div>
        </div>,
        {
          icon: false,
          style: {
            background: "linear-gradient(135deg, #28a745, #20c997, #17a2b8)",
            color: "white",
            borderRadius: "15px",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(40, 167, 69, 0.4)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
          },
          progressStyle: {
            background: "rgba(255, 255, 255, 0.3)",
            height: "4px",
          },
          autoClose: 3000,
        }
      );

      setIsAdding(false);
      setJustAdded(true);

      // Reset the "just added" state after animation
      setTimeout(() => setJustAdded(false), 3000);
    }, 500);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });

    if (res.ok) {
      setNewReview({ name: "", rating: "", comment: "" });
      const updated = await fetch(`http://localhost:3001/api/reviews/${id}`);
      setReviews(await updated.json());
    } else {
      alert("Failed to submit review");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  // Get brand-specific image and colors
  const productImage = getProductImage(product);
  const brandColors = getBrandColors(product.brand);

  return (
    <div className="container my-5">
      <div
        className="card shadow-lg border-0"
        style={{ border: `3px solid ${brandColors.primary}20` }}
      >
        <div className="row g-0">
          <div className="col-md-6 text-center p-4 bg-light rounded-start position-relative">
            {/* Brand badge */}
            {product.brand && (
              <div className="position-absolute top-0 start-0 m-3">
                <span
                  className="badge text-white px-3 py-2"
                  style={{
                    backgroundColor: brandColors.primary,
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {product.brand}
                </span>
              </div>
            )}

            <img
              src={productImage}
              alt={`${product.brand ? product.brand + " " : ""}${
                product.Model || product.model || "Product"
              }`}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.src = "https://via.placeholder.com/400";
              }}
            />
          </div>
          <div className="col-md-6 p-4">
            <h2 className="mb-3 text-primary">
              {product.Model || product.model || "Unnamed Product"}
            </h2>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Stock:</strong>
              {product.stock > 0 ? (
                <span className="text-success fw-semibold">
                  {" "}
                  {product.stock} In Stock
                </span>
              ) : (
                <span className="text-danger"> Out of Stock</span>
              )}
            </p>

            {/* Add to Cart Button */}
            <div className="mt-4 mb-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className={`btn btn-lg rounded-pill fw-semibold px-5 py-3 transition-all btn-ripple ${
                  justAdded
                    ? "btn-success-added"
                    : product.stock <= 0
                    ? "btn-outline-secondary"
                    : "btn-success hover-btn-success"
                } ${isAdding ? "btn-adding" : ""}`}
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isAdding
                    ? "scale(0.98)"
                    : justAdded
                    ? "scale(1.02)"
                    : "scale(1)",
                  opacity: isAdding ? 0.8 : 1,
                  minWidth: "250px",
                  fontSize: "1.1rem",
                  background: justAdded
                    ? "linear-gradient(135deg, #28a745, #20c997)"
                    : product.stock <= 0
                    ? "#6c757d"
                    : "linear-gradient(45deg, #28a745, #20c997)",
                  border: "none",
                  boxShadow: justAdded
                    ? "0 8px 25px rgba(40, 167, 69, 0.4)"
                    : isAdding
                    ? "0 4px 15px rgba(40, 167, 69, 0.2)"
                    : "0 6px 20px rgba(40, 167, 69, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isAdding ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-3 btn-spinner"
                      role="status"
                      style={{ width: "1.2rem", height: "1.2rem" }}
                    ></span>
                    Adding to Cart...
                  </>
                ) : justAdded ? (
                  <>Successfully Added!</>
                ) : product.stock <= 0 ? (
                  <>Sorry, Out of Stock</>
                ) : (
                  <>Add to Cart - ${product.price}</>
                )}
              </button>

              {/* Additional feedback for recently added */}
              {justAdded && (
                <div
                  className="mt-3 alert alert-success border-0 rounded-pill text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.1))",
                    border: "2px solid rgba(40, 167, 69, 0.2)",
                    animation: "successPulse 2s ease-in-out infinite",
                  }}
                >
                  {" "}
                  <small className="fw-semibold text-success">
                    Item added to your cart! Check it out in the navigation bar.
                  </small>
                </div>
              )}
            </div>

            {product.description && (
              <>
                <hr />
                <p>
                  <strong>Description:</strong>
                </p>
                <p>{product.description}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-secondary">Reviews</h4>
        <hr />
        {reviews.length === 0 ? (
          <p className="text-muted">
            No reviews yet. Be the first to leave one!
          </p>
        ) : (
          <ul className="list-group mb-4">
            {reviews.map((r, i) => (
              <li
                key={i}
                className="list-group-item border-0 bg-light rounded mb-2"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <strong className="text-primary">{r.name}</strong>
                  <span className="badge bg-primary">{r.rating}/5</span>
                </div>
                <p className="mb-2">{r.comment}</p>
                <small className="text-muted">
                  {r.date ? new Date(r.date).toLocaleDateString() : ""}
                </small>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleSubmitReview}
          className="card card-body border-0 shadow-sm"
        >
          <h5 className="mb-3 text-dark">Add a Review</h5>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="form-control"
              value={newReview.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <select
              name="rating"
              className="form-select"
              value={newReview.rating}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Star" : "Stars"}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <textarea
              name="comment"
              placeholder="Write your review..."
              className="form-control"
              value={newReview.comment}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-primary w-100">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;
