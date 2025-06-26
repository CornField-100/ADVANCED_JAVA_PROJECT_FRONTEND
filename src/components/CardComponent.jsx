import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
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
  showEditButton,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({ productId, title, brand, price, imageUrl, quantity: 1 });
    alert(`${title} added to basket!`);
  };

  const imageSrc =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : productImgPlaceholder;

  return (
    <article className="col">
      <div className="card shadow-sm h-100 border-0 rounded-4 hover-shadow">
        <img
          src={imageSrc}
          className="card-img-top rounded-top"
          alt={`${title} image`}
          style={{ height: "250px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title fw-semibold text-primary mb-2">
              {title.length > 25 ? `${title.slice(0, 25)}...` : title}
            </h5>
            <p className="card-text mb-1">
              <span className="text-muted">Brand:</span>{" "}
              <strong>{brand}</strong>
            </p>
            <p className="card-text mb-1">
              <span className="text-muted">Stock:</span>
              {stock > 0 ? (
                <span className="text-success fw-semibold"> In Stock</span>
              ) : (
                <span className="text-danger"> Out of Stock</span>
              )}
            </p>
            <p className="card-text fs-5 fw-bold text-dark">${price}</p>
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              onClick={onViewDetails}
              className="btn btn-primary rounded-pill fw-semibold"
            >
              View Details
            </button>
            <button
              onClick={handleAddToCart}
              className="btn btn-outline-success rounded-pill fw-semibold"
            >
              🛒 Add to Basket
            </button>
            {showEditButton && (
              <button
                onClick={onEdit}
                className="btn btn-outline-warning rounded-pill fw-semibold mt-2"
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
