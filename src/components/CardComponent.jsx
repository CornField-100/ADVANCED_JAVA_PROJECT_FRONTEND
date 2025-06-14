import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import productImgPlaceholder from "../assets/image.png";

const CardComponent = ({ productId, title, brand, stock, price, imageUrl }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ productId, title, brand, price, imageUrl, quantity: 1 });
    alert(`${title} added to basket!`);
  };

  return (
    <article className="col">
      <div className="card shadow-sm">
        <img
          src={imageUrl || productImgPlaceholder}
          className="card-img-top"
          alt={`${title} image`}
          style={{ minHeight: "380px", objectFit: "contain" }}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            <strong>Brand:</strong> {brand}
            <br />
            <strong>Stock:</strong> {stock}
            <br />
            <strong>Price:</strong> ${price}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link
              to={`/products/${productId}`}
              className="btn btn-outline-primary btn-sm me-2"
            >
              View
            </Link>
            <button
              onClick={handleAddToCart}
              className="btn btn-sm btn-success"
            >
              Add to Basket
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardComponent;
