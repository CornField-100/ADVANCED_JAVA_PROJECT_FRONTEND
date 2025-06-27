import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, getCurrentUser } from "../utils/auth";
import { fetchProducts } from "../utils/fetchProduts";
import OrderNotifications from "../components/OrderNotifications";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
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
                <div>
                  <h1 className="h3 mb-1">Admin Dashboard</h1>
                  <p className="mb-0 opacity-75">
                    Welcome back, {currentUser?.firstName || "Admin"}! Manage
                    your e-commerce platform.
                  </p>
                </div>
                <div className="text-end">
                  <div className="badge bg-white text-primary px-3 py-2 rounded-pill">
                    🛡️ Administrator
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
        <div className="col-12">
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
      </div>
    </div>
  );
};

export default AdminDashboard;
