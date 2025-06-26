import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBoxOpen,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const NavBar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <FaShoppingCart className="me-1" /> Cart
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-product">
                  <FaPlusCircle className="me-1" /> Add Product
                </Link>
              </li>
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
            {!token ? (
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
                <FaUserCircle size={24} className="text-white me-3" />
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
