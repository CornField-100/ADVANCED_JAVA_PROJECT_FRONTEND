import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (existing) {
        // Show enhanced notification for adding more quantity
        toast.info(
          <div className="d-flex align-items-center">
            <div className="me-3" style={{ fontSize: "1.4rem" }}>
              +
            </div>
            <div>
              <div style={{ fontWeight: "bold" }}>Quantity Updated</div>
              <div style={{ fontSize: "0.9rem" }}>
                {product.title || product.brand} quantity increased to{" "}
                {existing.quantity + 1}
              </div>
            </div>
          </div>,
          {
            icon: false,
            style: {
              background: "linear-gradient(135deg, #17a2b8, #6f42c1)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "500",
              boxShadow: "0 8px 25px rgba(23, 162, 184, 0.3)",
            },
            autoClose: 2000,
          }
        );
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.productId === productId);
      if (removedItem) {
        toast.warn(
          <div className="d-flex align-items-center">
            <div className="me-3" style={{ fontSize: "1.4rem" }}>
              −
            </div>
            <div>
              <div style={{ fontWeight: "bold" }}>Item Removed</div>
              <div style={{ fontSize: "0.9rem" }}>
                {removedItem.title || removedItem.brand} removed from cart
              </div>
            </div>
          </div>,
          {
            icon: false,
            style: {
              background: "linear-gradient(135deg, #ffc107, #fd7e14)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "500",
              boxShadow: "0 8px 25px rgba(255, 193, 7, 0.3)",
            },
            autoClose: 2000,
          }
        );
      }
      return prevCart.filter((item) => item.productId !== productId);
    });
  };

  const clearCart = () => {
    if (cart.length > 0) {
      toast.success(
        <div className="d-flex align-items-center">
          <div className="me-3" style={{ fontSize: "1.4rem" }}>
            ✓
          </div>
          <div>
            <div style={{ fontWeight: "bold" }}>Cart Cleared</div>
            <div style={{ fontSize: "0.9rem" }}>
              All items removed successfully
            </div>
          </div>
        </div>,
        {
          icon: false,
          style: {
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
            borderRadius: "12px",
            fontWeight: "500",
            boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
          },
          autoClose: 2000,
        }
      );
    }
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
