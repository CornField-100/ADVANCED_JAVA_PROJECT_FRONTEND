import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">ProductApp</a>

        <div className="d-flex">
          {token ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={() => navigate("/create-product")}
              >
                Create Product
              </button>

              <button className="btn btn-outline-danger" onClick={handleLogout}>
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
