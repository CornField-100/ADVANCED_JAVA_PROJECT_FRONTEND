import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import productImgPlaceholder from "../assets/image.png";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="mb-4">
          <div
            className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center"
            style={{ width: "120px", height: "120px" }}
          >
            <FaShoppingCart size={50} className="text-muted" />
          </div>
        </div>
        <h2 className="display-5 mb-3">Your Cart is Empty</h2>
        <p className="lead text-muted mb-4">
          Discover amazing products and start shopping!
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/products" className="btn btn-primary btn-lg">
            Browse Products
          </Link>
          <Link to="/" className="btn btn-outline-secondary btn-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      <div className="row">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div
              className="card mb-3 shadow-sm border-0 rounded-4"
              key={item.productId}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={
                      item.imageUrl && item.imageUrl.trim() !== ""
                        ? item.imageUrl
                        : productImgPlaceholder
                    }
                    alt={item.title || "Product"}
                    className="img-fluid rounded-start"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">
                      <strong>Brand:</strong> {item.brand}
                      <br />
                      <strong>Price:</strong> ${item.price.toFixed(2)}
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <label className="form-label mb-0">Quantity:</label>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={10} />
                        </button>
                        <input
                          type="number"
                          className="form-control mx-2 text-center"
                          style={{ width: "60px" }}
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="btn btn-outline-danger btn-sm ms-auto"
                      >
                        <FaTrash className="me-1" size={12} />
                        Remove
                      </button>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        Subtotal:{" "}
                        <strong>
                          ${(item.price * item.quantity).toFixed(2)}
                        </strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div
            className="card shadow-sm p-4 border-0 rounded-4 sticky-top"
            style={{ top: "6rem" }}
          >
            <h4 className="mb-3">Order Summary</h4>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Items ({cart.length}):</span>
              <span>
                {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                products
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping:</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax:</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3 fw-bold">
              <span>Total:</span>
              <span>${(totalPrice * 1.08).toFixed(2)}</span>
            </div>
            <button className="btn btn-success w-100 mb-3 btn-lg">
              Proceed to Checkout
            </button>
            <button
              className="btn btn-outline-secondary w-100 mb-2"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link to="/products" className="btn btn-link w-100 text-center">
              Continue Shopping
            </Link>

            {/* Trust Indicators */}
            <div className="mt-4 pt-3 border-top">
              <h6 className="text-muted mb-3">Secure Checkout</h6>
              <div className="row text-center">
                <div className="col-4">
                  <div className="mb-2">
                    <div className="badge bg-success rounded-circle p-2">✓</div>
                  </div>
                  <small className="text-muted">SSL Secure</small>
                </div>
                <div className="col-4">
                  <div className="mb-2">
                    <div className="badge bg-info rounded-circle p-2">✓</div>
                  </div>
                  <small className="text-muted">Fast Delivery</small>
                </div>
                <div className="col-4">
                  <div className="mb-2">
                    <div className="badge bg-warning rounded-circle p-2">✓</div>
                  </div>
                  <small className="text-muted">Easy Returns</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
