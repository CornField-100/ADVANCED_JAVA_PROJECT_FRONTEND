import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import productImgPlaceholder from "../assets/image.png";

const CardComponent = ({ productId, title, brand, stock, price, imageUrl }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent card click
    e.preventDefault(); // prevent navigation
    addToCart({ productId, title, brand, price, imageUrl, quantity: 1 });
    alert(`${title} added to basket!`);
  };

  return (
    <article className="col">
      <Link
        to={`/products/${productId}`}
        className="text-decoration-none text-dark"
      >
        <div className="card shadow-sm h-100">
          <img
            src={imageUrl || productImgPlaceholder}
            className="card-img-top"
            alt={`${title} image`}
            style={{ minHeight: "300px", objectFit: "contain" }}
          />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text mb-1">
              <strong>Brand:</strong> {brand}
            </p>
            <p className="card-text mb-1">
              <strong>Stock:</strong> {stock}
            </p>
            <p className="card-text">
              <strong>Price:</strong> ${price}
            </p>
            <div className="d-flex justify-content-end mt-3">
              <button
                onClick={handleAddToCart}
                className="btn btn-sm btn-success"
              >
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CardComponent;
