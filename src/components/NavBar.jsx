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
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/">
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
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-product">
                  Add Product
                </Link>
              </li>
            )}
          </ul>
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control form-control-sm rounded-pill me-2"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="btn btn-outline-light btn-sm rounded-pill"
              type="submit"
            >
              Search
            </button>
          </form>
          {!token ? (
            <>
              <Link className="btn btn-outline-light btn-sm me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-light btn-sm" to="/signup">
                Sign Up
              </Link>
            </>
          ) : (
            <button className="btn btn-warning btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
