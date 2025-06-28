import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { getCurrentUser, isAdmin, logout } from "../utils/auth";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBoxOpen,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaCrown,
  FaUsers,
} from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const { cart } = useCart();
  const [cartAnimation, setCartAnimation] = useState(false);

  // Get current user information
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Animate cart icon when items are added
  useEffect(() => {
    if (cartItemsCount > 0) {
      setCartAnimation(true);
      const timer = setTimeout(() => setCartAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleLogout = () => {
    logout(); // This will clear localStorage and redirect
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm position-fixed top-0 w-100"
      style={{ zIndex: 999 }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Lync
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <FaBoxOpen className="me-1" /> Products
              </Link>
            </li>
            <li className="nav-item position-relative">
              <Link className="nav-link d-flex align-items-center" to="/cart">
                <FaShoppingCart
                  className={`me-1 ${cartAnimation ? "cart-icon-bounce" : ""}`}
                />
                Cart
                {cartItemsCount > 0 && (
                  <span
                    className={`badge bg-danger ms-2 cart-badge-animate`}
                    style={{
                      fontSize: "0.75rem",
                      borderRadius: "50%",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: cartAnimation
                        ? "badgeScale 0.4s ease-in-out"
                        : "none",
                    }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </li>

            {/* Admin-only navigation items */}
            {userIsAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-warning fw-semibold"
                    to="/admin"
                  >
                    <FaTachometerAlt className="me-1" /> Admin Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/create-product">
                    <FaPlusCircle className="me-1" /> Add Product
                  </Link>
                </li>
              </>
            )}
          </ul>

          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              Search
            </button>
          </form>

          <div className="d-flex align-items-center">
            {!currentUser ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  <FaSignInAlt className="me-1" /> Login
                </Link>
                <Link className="btn btn-primary" to="/signup">
                  <FaUserPlus className="me-1" /> Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* User Info */}
                <div className="d-flex align-items-center me-3">
                  {currentUser.imageUrl ? (
                    <img
                      src={currentUser.imageUrl}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FaUserCircle size={32} className="text-white me-2" />
                  )}
                  <div className="text-white d-none d-md-block">
                    <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div style={{ fontSize: "0.75rem" }} className="opacity-75">
                      {userIsAdmin ? (
                        <span className="text-warning">
                          <FaCrown className="me-1" size={12} />
                          Administrator
                        </span>
                      ) : (
                        "User"
                      )}
                    </div>
                  </div>
                </div>

                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
