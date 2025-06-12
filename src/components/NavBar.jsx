import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const NavBar = ({ cartItems = [] }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">

        {/* Brand */}
        <a className="navbar-brand" href="/">ProductApp</a>

        {/* Search Form */}
        <form 
          className="d-flex me-auto"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="btn btn-outline-success" 
            type="submit"
          >
            Search
          </button>
        </form>

        {/* Cart Button */}
        <Link to="/cart" className="btn btn-outline-primary me-2">
          🛒 Cart ({cartItems.length})
        </Link>

        {/* Login/Create/Logout Buttons */}
        <div className="d-flex">
          {token ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={() => navigate("/create-product")}
              >
                Create Product
              </button>

              <button 
                className="btn btn-outline-danger" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
