import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
      className="navbar navbar-expand-lg navbar-dark px-4 shadow-sm position-fixed top-0 w-100"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 999,
      }}
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
              <Link className="nav-link px-3 rounded-pill" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill" to="/products">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill" to="/cart">
                Cart
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link
                  className="nav-link px-3 rounded-pill"
                  to="/create-product"
                >
                  Add Product
                </Link>
              </li>
            )}
          </ul>

          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control form-control-sm rounded-pill me-2"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                backgroundColor: "#f8f9fa",
                color: "#000",
                border: "none",
              }}
            />
            <button
              className="btn btn-outline-light btn-sm rounded-pill"
              type="submit"
            >
              Go
            </button>
          </form>

          {!token ? (
            <>
              <Link
                className="btn btn-outline-light btn-sm me-2 rounded-pill"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="btn btn-outline-light btn-sm rounded-pill"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              className="btn btn-warning btn-sm rounded-pill"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
