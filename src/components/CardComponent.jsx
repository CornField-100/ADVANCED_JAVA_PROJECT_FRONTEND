import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import { isAdmin } from "../utils/auth";
import productImgPlaceholder from "../assets/image.png";

const CardComponent = ({
  productId,
  title,
  brand,
  stock,
  price,
  imageUrl,
  onViewDetails,
  onEdit,
  showEditButton, // This should only be true for admins
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Always check admin status in the component for security
  const userIsAdmin = isAdmin();

  // Only allow edit button if user is admin AND showEditButton is true
  const shouldShowEditButton = showEditButton && userIsAdmin;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (stock <= 0) {
      toast.error("Sorry, this item is out of stock!", {
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
        },
      });
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      addToCart({ productId, title, brand, price, imageUrl, quantity: 1 });

      toast.success(
        <div>
          <div className="fw-bold">Success!</div>
          <div className="small text-light opacity-75">
            {brand} {title} added to cart
          </div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
            borderRadius: "12px",
            fontWeight: "500",
            boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
          },
          progressStyle: {
            background: "rgba(255, 255, 255, 0.3)",
          },
          autoClose: 3000,
        }
      );

      setIsAdding(false);
      setJustAdded(true);

      setTimeout(() => setJustAdded(false), 3000);
    }, 400);
  };

  // Professional product status indicator
  const getProductStatus = () => {
    if (stock === 0)
      return { text: "Out of Stock", color: "text-danger", show: true };
    if (stock <= 5)
      return { text: "Limited Stock", color: "text-warning", show: true };
    if (price > 500)
      return { text: "Premium Product", color: "text-primary", show: true };
    return { show: false };
  };

  const productStatus = getProductStatus();
  const imageSrc =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : productImgPlaceholder;

  return (
    <article className="col">
      <div
        className="card shadow-sm h-100 border-0 rounded-3 card-hover-effect"
        style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
      >
        <div
          className="position-relative overflow-hidden"
          style={{ borderRadius: "12px 12px 0 0" }}
        >
          <img
            src={imageSrc}
            className="card-img-top"
            alt={`${title} image`}
            style={{
              height: "200px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />

          {/* Clean status indicator */}
          {stock === 0 && (
            <div className="position-absolute top-0 end-0 m-3">
              <span
                className="badge bg-dark text-white px-3 py-2"
                style={{ borderRadius: "8px", fontSize: "0.75rem" }}
              >
                Out of Stock
              </span>
            </div>
          )}

          {stock <= 5 && stock > 0 && (
            <div className="position-absolute top-0 end-0 m-3">
              <span
                className="badge bg-warning text-dark px-3 py-2"
                style={{ borderRadius: "8px", fontSize: "0.75rem" }}
              >
                Limited Stock
              </span>
            </div>
          )}
        </div>

        <div className="card-body d-flex flex-column p-4">
          <div className="flex-grow-1 mb-3">
            {/* Product Title */}
            <h5
              className="card-title fw-semibold text-dark mb-2 lh-sm"
              style={{ fontSize: "1.1rem", fontWeight: "600" }}
            >
              {title.length > 35 ? `${title.slice(0, 35)}...` : title}
            </h5>

            {/* Brand */}
            <p
              className="text-muted mb-2"
              style={{ fontSize: "0.9rem", fontWeight: "500" }}
            >
              {brand}
            </p>

            {/* Price and Stock Info */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <p
                  className="fs-4 fw-bold text-dark mb-0"
                  style={{ color: "#2c3e50" }}
                >
                  ${price}
                </p>
                <small className="text-muted">
                  {stock > 0 ? `${stock} in stock` : "Unavailable"}
                </small>
              </div>

              {/* Professional status indicator */}
              {productStatus.show && (
                <div className="text-end">
                  <small
                    className={`fw-semibold ${productStatus.color}`}
                    style={{ fontSize: "0.8rem" }}
                  >
                    {productStatus.text}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <button
              onClick={onViewDetails}
              className="btn btn-outline-primary btn-sm rounded-pill fw-semibold transition-all"
              style={{
                borderColor: "#007bff",
                color: "#007bff",
                padding: "8px 16px",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#007bff";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              View Details
            </button>

            <button
              onClick={handleAddToCart}
              disabled={stock <= 0 || isAdding}
              className={`btn btn-sm rounded-pill fw-semibold transition-all ${
                justAdded
                  ? "btn-success"
                  : stock <= 0
                  ? "btn-outline-secondary"
                  : "btn-dark"
              } ${isAdding ? "btn-adding" : ""}`}
              style={{
                transition: "all 0.3s ease",
                transform: isAdding ? "scale(0.98)" : "scale(1)",
                opacity: isAdding ? 0.8 : 1,
                padding: "10px 16px",
                fontSize: "0.9rem",
                backgroundColor: justAdded
                  ? "#28a745"
                  : stock <= 0
                  ? "#6c757d"
                  : "#212529",
                borderColor: justAdded
                  ? "#28a745"
                  : stock <= 0
                  ? "#6c757d"
                  : "#212529",
              }}
            >
              {isAdding ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    style={{ width: "0.8rem", height: "0.8rem" }}
                  ></span>
                  Adding to Cart...
                </>
              ) : justAdded ? (
                <>Added Successfully</>
              ) : stock <= 0 ? (
                <>Unavailable</>
              ) : (
                <>Add to Cart</>
              )}
            </button>

            {/* Only show edit button for admins */}
            {shouldShowEditButton && (
              <button
                onClick={onEdit}
                className="btn btn-outline-warning btn-sm rounded-pill fw-semibold transition-all"
                style={{
                  padding: "6px 16px",
                  fontSize: "0.85rem",
                }}
              >
                Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardComponent;
