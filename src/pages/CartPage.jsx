import { useCart } from "../contexts/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                key={item._id}
              >
                <div>
                  <h5>{item.Model}</h5>
                  <p className="mb-1">Brand: {item.brand}</p>
                  <p className="mb-1">Price: ${item.price}</p>
                  <p className="mb-1">Quantity: {item.quantity}</p>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h4>Total: ${total.toFixed(2)}</h4>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-secondary" onClick={clearCart}>
              Clear Cart
            </button>
            <button className="btn btn-success">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
