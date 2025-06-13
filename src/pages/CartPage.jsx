import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2 className="display-5">🛒 Your Cart is Empty</h2>
        <p className="lead">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛍️ Your Shopping Cart</h2>
      <div className="row">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div className="card mb-3 shadow-sm" key={item.productId}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
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
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "80px" }}
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h4>Order Summary</h4>
            <hr />
            <p>
              <strong>Items:</strong> {cart.length}
            </p>
            <p>
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </p>
            <button className="btn btn-success w-100 mb-2">
              🧾 Place Order
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearCart}
            >
              ❌ Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
