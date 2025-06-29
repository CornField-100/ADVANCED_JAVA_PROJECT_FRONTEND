import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, getCurrentUser } from "../utils/auth";
import { fetchProducts } from "../utils/fetchProduts";
import OrderNotifications from "../components/OrderNotifications";
import UserStatsWidget from "../components/UserStatsWidget";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserCircle,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);

        // Calculate basic stats
        setStats({
          totalProducts: productsData.length,
          totalUsers: 150, // This would come from backend
          totalOrders: 89, // This would come from backend
          revenue: 12450, // This would come from backend
        });
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const currentUser = getCurrentUser();

  // Debug: Log current user data to console
  console.log("AdminDashboard - currentUser:", currentUser);
  console.log("AdminDashboard - imageUrl:", currentUser?.imageUrl);

  // IMMEDIATE FIX: Enhanced user display image with refresh capability
  const getUserDisplayImage = () => {
    if (currentUser?.imageUrl) {
      console.log("Using imageUrl from current user token:", currentUser.imageUrl);
      return currentUser.imageUrl;
    }
    
    // Check if there's a cached imageUrl in localStorage
    const cachedImageUrl = localStorage.getItem("userImageUrl");
    if (cachedImageUrl) {
      console.log("Using cached imageUrl from localStorage:", cachedImageUrl);
      return cachedImageUrl;
    }
    
    // If still no imageUrl, try to fetch fresh user data from the server
    if (currentUser?.id && !currentUser?.imageUrl) {
      console.log("Attempting to refresh user data from server");
      refreshUserData();
    }
    
    // If still no imageUrl, try the default professional avatars
    if (currentUser?.firstName) {
      // Use one of our professional avatars as fallback
      const fallbackAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=professional1&backgroundColor=b6e3f4&clothingColor=262e33&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=724133&hatColor=ff488e&mouthType=smile&skinColor=ae5d29&topType=shortHairShortWaved";
      console.log("Using fallback professional avatar");
      return fallbackAvatar;
    }
    
    return null;
  };

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !currentUser?.id) return;

      const response = await fetch(`http://localhost:3001/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Refreshed user data:", userData);
        
        // If we got an imageUrl, cache it
        if (userData.imageUrl) {
          localStorage.setItem("userImageUrl", userData.imageUrl);
          // Force a re-render by updating the page
          window.location.reload();
        }
      } else {
        console.log("Failed to refresh user data:", response.status);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <OrderNotifications />
      {/* Admin Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  {/* Profile Image */}
                  <div className="profile-section me-4">
                    {getUserDisplayImage() ? (
                      <img
                        src={getUserDisplayImage()}
                        alt={`${currentUser.firstName} ${currentUser.lastName}`}
                        className="profile-image"
                        onError={(e) => {
                          console.log("Failed to load profile image, using placeholder");
                          e.target.src = "https://via.placeholder.com/80x80/667eea/ffffff?text=" + 
                            (currentUser?.firstName?.charAt(0) || "U") + 
                            (currentUser?.lastName?.charAt(0) || "");
                        }}
                      />
                    ) : (
                      <div className="profile-placeholder">
                        <FaUserCircle size={80} color="#ffffff" />
                      </div>
                    )}
                    <div className="profile-status"></div>
                  </div>
                  
                  {/* Welcome Text */}
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h1 className="h3 mb-0">
                        Welcome back, {currentUser?.firstName || "Admin"}!
                      </h1>
                      <button
                        onClick={refreshUserData}
                        className="btn btn-sm btn-outline-light"
                        title="Refresh profile data"
                        style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                      >
                        🔄
                      </button>
                    </div>
                    <p className="mb-2 opacity-75">
                      Manage your e-commerce platform with ease
                    </p>
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
                        🛡️ Administrator
                      </span>
                      <span className="text-white-50 small">
                        Last login: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="text-end">
                  <div className="d-flex flex-column gap-2">
                    <button
                      onClick={() => navigate("/analytics")}
                      className="btn btn-light btn-sm text-primary fw-semibold"
                    >
                      <FaChartLine className="me-1" />
                      View Analytics
                    </button>
                    <button
                      onClick={() => navigate("/admin/users")}
                      className="btn btn-outline-light btn-sm"
                    >
                      <FaUsers className="me-1" />
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <FaBox size={30} />
              </div>
              <h3 className="h4 fw-bold">{stats.totalProducts}</h3>
              <p className="text-muted mb-0">Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <FaUsers size={30} />
              </div>
              <h3 className="h4 fw-bold">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <FaShoppingCart size={30} />
              </div>
              <h3 className="h4 fw-bold">{stats.totalOrders}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <FaChartLine size={30} />
              </div>
              <h3 className="h4 fw-bold">${stats.revenue.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pb-0">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/create-product")}
                  className="btn btn-primary d-flex align-items-center gap-2"
                >
                  <FaPlus /> Add New Product
                </button>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                >
                  <FaUsers /> Manage Users
                </button>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className="btn btn-outline-success d-flex align-items-center gap-2"
                >
                  <FaShoppingCart /> View Orders
                </button>
                <button
                  onClick={() => navigate("/analytics")}
                  className="btn btn-gradient text-white d-flex align-items-center gap-2 position-relative"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  }}
                >
                  <FaChartLine />
                  <span>🚀 Advanced Analytics</span>
                  <span className="badge bg-warning text-dark ms-2 px-2 py-1 rounded-pill small">
                    NEW!
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Management */}
      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Product Management</h5>
              <span className="badge bg-primary px-3 py-2">
                {products.length} Products
              </span>
            </div>
            <div className="card-body p-0">
              {error && <div className="alert alert-danger m-3">{error}</div>}

              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                product.imageUrl ||
                                "https://via.placeholder.com/50"
                              }
                              alt={product.Model}
                              className="me-3 rounded"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <h6 className="mb-0">
                                {product.Model || product.model}
                              </h6>
                              <small className="text-muted">
                                ID: {product._id.slice(-6)}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold">{product.brand}</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">
                            ${product.price}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              product.stock > 10
                                ? "bg-success"
                                : product.stock > 0
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              product.stock > 0 ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              onClick={() =>
                                navigate(`/products/${product._id}`)
                              }
                              className="btn btn-sm btn-outline-primary"
                              title="View Product"
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/edit-product/${product._id}`)
                              }
                              className="btn btn-sm btn-outline-warning"
                              title="Edit Product"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Product"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 && !error && (
                <div className="text-center py-5 text-muted">
                  <FaBox size={50} className="mb-3 opacity-50" />
                  <p>No products found. Start by adding your first product!</p>
                  <button
                    onClick={() => navigate("/create-product")}
                    className="btn btn-primary"
                  >
                    <FaPlus className="me-2" />
                    Add Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Management Widget */}
        <div className="col-md-4">
          <UserStatsWidget />
        </div>
      </div>

      {/* Profile Styles */}
      <style jsx>{`
        .profile-section {
          position: relative;
        }

        .profile-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          background: white;
          padding: 2px;
        }

        .profile-placeholder {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.3);
        }

        .profile-status {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          background: #28a745;
          border: 3px solid white;
          border-radius: 50%;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .btn {
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .profile-image,
          .profile-placeholder {
            width: 60px;
            height: 60px;
          }
          
          .profile-status {
            width: 15px;
            height: 15px;
            bottom: 2px;
            right: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
