import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="row g-0">
          <div className="col-md-6 text-center p-4 bg-light rounded-start">
            <img
              src={product.imageUrl || "https://via.placeholder.com/400"}
              alt={product.Model || "Product"}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "contain" }}
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
              <strong>Stock:</strong> {product.stock}
            </p>
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
              <li key={i} className="list-group-item">
                <strong>{r.name}</strong>{" "}
                <span className="text-warning">({r.rating}/5)</span>
                <br />
                <span>{r.comment}</span>
                <br />
                <small className="text-muted">
                  {r.date ? new Date(r.date).toLocaleString() : ""}
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
              <option value="">Rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"⭐️".repeat(n)} ({n})
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
