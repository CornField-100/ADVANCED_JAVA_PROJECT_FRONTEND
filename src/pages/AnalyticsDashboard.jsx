import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import RevenueChart from "../components/charts/RevenueChart";
import OrderStatusChart from "../components/charts/OrderStatusChart";
import ProductSalesChart from "../components/charts/ProductSalesChart";
import CustomerOrderChart from "../components/charts/CustomerOrderChart";
import RecentOrdersWidget from "../components/analytics/RecentOrdersWidget";
import UserAnalyticsWidget from "../components/analytics/UserAnalyticsWidget";
import RealTimeMetrics from "../components/analytics/RealTimeMetrics";
import RealTimeOrderTracking from "../components/analytics/RealTimeOrderTracking";
import GeographicAnalytics from "../components/analytics/GeographicAnalytics";
import { fetchProducts } from "../utils/fetchProduts";
import {
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaArrowUp,
  FaCalendarAlt,
  FaDownload,
  FaSyncAlt,
  FaFilter,
  FaGlobe,
  FaRocket,
} from "react-icons/fa";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1247,
    todayRevenue: 8450,
    pendingOrders: 23,
    conversionRate: 12.8,
  });

  // Check admin access
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 100),
        pendingOrders: prev.pendingOrders + Math.floor(Math.random() * 3) - 1,
        conversionRate: prev.conversionRate + Math.random() * 0.2 - 0.1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const exportData = () => {
    // Simulate data export
    const data = {
      period: selectedPeriod,
      exported: new Date().toISOString(),
      metrics: realTimeData,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${selectedPeriod}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
        <p className="mt-3">Loading analytics dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className="analytics-dashboard"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">
                  <FaChartLine className="me-3 text-primary" />
                  Analytics Dashboard
                </h1>
                <p className="text-muted mb-0">
                  Real-time insights and performance metrics
                </p>
              </div>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{ width: "auto" }}
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="1year">Last Year</option>
                </select>
                <button
                  className="btn btn-outline-primary"
                  onClick={exportData}
                >
                  <FaDownload className="me-2" />
                  Export
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <FaSyncAlt className="me-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Active Users</div>
                    <div className="fs-4 fw-bold text-primary">
                      {realTimeData.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-success small">
                      <FaArrowUp className="me-1" />
                      +5.2%
                    </div>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <FaUsers className="text-primary fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Today's Revenue</div>
                    <div className="fs-4 fw-bold text-success">
                      ${realTimeData.todayRevenue.toLocaleString()}
                    </div>
                    <div className="text-success small">
                      <FaArrowUp className="me-1" />
                      +12.8%
                    </div>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <FaDollarSign className="text-success fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Pending Orders</div>
                    <div className="fs-4 fw-bold text-warning">
                      {realTimeData.pendingOrders}
                    </div>
                    <div className="text-warning small">
                      <FaCalendarAlt className="me-1" />
                      Needs attention
                    </div>
                  </div>
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <FaShoppingCart className="text-warning fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">Conversion Rate</div>
                    <div className="fs-4 fw-bold text-info">
                      {realTimeData.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-success small">
                      <FaArrowUp className="me-1" />
                      +2.1%
                    </div>
                  </div>
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <FaChartLine className="text-info fs-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: REAL-TIME MONITORING */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-primary border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaRocket className="text-primary me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-primary fw-bold">
                    📊 Real-Time Analytics Engine
                  </h5>
                  <p className="mb-0 text-muted">
                    Live performance metrics, instant insights, and dynamic
                    monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <RealTimeMetrics />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: FINANCIAL ANALYTICS */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-success border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaDollarSign className="text-success me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-success fw-bold">
                    💰 Revenue & Financial Intelligence
                  </h5>
                  <p className="mb-0 text-muted">
                    Comprehensive revenue tracking, order analytics, and
                    financial insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">📈 Revenue Analytics</h5>
                </div>
                <div className="card-body">
                  <RevenueChart />
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">📦 Order Status Distribution</h5>
                </div>
                <div className="card-body">
                  <OrderStatusChart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PRODUCT & CUSTOMER ANALYTICS */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-info border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaShoppingCart className="text-info me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-info fw-bold">
                    🛍️ Product & Customer Intelligence
                  </h5>
                  <p className="mb-0 text-muted">
                    Product performance, customer behavior, and sales analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">🎯 Product Performance Dashboard</h5>
                </div>
                <div className="card-body">
                  <ProductSalesChart products={products} />
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">👥 Customer Analytics</h5>
                </div>
                <div className="card-body">
                  <CustomerOrderChart />
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">🌍 Geographic Distribution</h5>
                </div>
                <div className="card-body">
                  <GeographicAnalytics />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: OPERATIONAL INSIGHTS */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-warning border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaUsers className="text-warning me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-warning fw-bold">
                    ⚙️ Operational Intelligence
                  </h5>
                  <p className="mb-0 text-muted">
                    User analytics, order management, and operational insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <UserAnalyticsWidget />
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <RecentOrdersWidget />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: LIVE ACTIVITY & INSIGHTS */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-dark border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaGlobe className="text-dark me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-dark fw-bold">
                    🔴 Live Business Intelligence
                  </h5>
                  <p className="mb-0 text-muted">
                    Real-time activity feed, top products, and quick performance
                    metrics
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0">🔴 Live Activity Feed</h6>
                </div>
                <div className="card-body">
                  <div
                    className="activity-feed"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <div className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-dot bg-success me-3"></div>
                      <div>
                        <small className="text-muted">2 seconds ago</small>
                        <div>New order from John Doe - $299.99</div>
                      </div>
                    </div>
                    <div className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-dot bg-primary me-3"></div>
                      <div>
                        <small className="text-muted">1 minute ago</small>
                        <div>User Sarah registered</div>
                      </div>
                    </div>
                    <div className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-dot bg-warning me-3"></div>
                      <div>
                        <small className="text-muted">3 minutes ago</small>
                        <div>Low stock alert: iPhone 15</div>
                      </div>
                    </div>
                    <div className="activity-item d-flex align-items-center mb-3">
                      <div className="activity-dot bg-info me-3"></div>
                      <div>
                        <small className="text-muted">5 minutes ago</small>
                        <div>Payment processed: $1,299.99</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0">🏆 Top Performing Products</h6>
                </div>
                <div className="card-body">
                  <div className="top-products">
                    {products.slice(0, 5).map((product, index) => (
                      <div
                        key={product._id}
                        className="d-flex align-items-center mb-3"
                      >
                        <div className="rank-badge me-3">
                          <span className="badge bg-primary">{index + 1}</span>
                        </div>
                        <img
                          src={
                            product.imageUrl || "https://via.placeholder.com/40"
                          }
                          alt={product.Model}
                          className="rounded me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">
                            {product.Model || product.model}
                          </div>
                          <small className="text-muted">{product.brand}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">
                            ${product.price}
                          </div>
                          <small className="text-muted">
                            {Math.floor(Math.random() * 100)} sales
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0">🎯 Quick Performance Stats</h6>
                </div>
                <div className="card-body">
                  <div className="quick-stats">
                    <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                      <span>Average Order Value</span>
                      <span className="fw-bold text-success">$284.50</span>
                    </div>
                    <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                      <span>Customer Lifetime Value</span>
                      <span className="fw-bold text-primary">$1,247</span>
                    </div>
                    <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                      <span>Cart Abandonment Rate</span>
                      <span className="fw-bold text-warning">23.5%</span>
                    </div>
                    <div className="stat-item d-flex justify-content-between align-items-center mb-3">
                      <span>Return Customer Rate</span>
                      <span className="fw-bold text-info">68.2%</span>
                    </div>
                    <div className="stat-item d-flex justify-content-between align-items-center">
                      <span>Products in Catalog</span>
                      <span className="fw-bold">{products.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: ADVANCED REAL-TIME TRACKING */}
        <div className="analytics-section mb-5">
          <div className="section-header mb-4">
            <div
              className="alert alert-info border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",
              }}
            >
              <div className="d-flex align-items-center">
                <FaChartLine className="text-info me-3 fs-4" />
                <div>
                  <h5 className="mb-1 text-info fw-bold">
                    🚀 Advanced Order Intelligence
                  </h5>
                  <p className="mb-0 text-muted">
                    Real-time order tracking, customer journey analytics, and
                    predictive insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <RealTimeOrderTracking />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-section {
          margin-bottom: 3rem;
        }

        .section-header {
          position: relative;
          overflow: hidden;
        }

        .section-header .alert {
          border-radius: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .section-header .alert:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }

        .card-header {
          border-radius: 15px 15px 0 0 !important;
        }

        .rank-badge .badge {
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .stat-item {
          padding: 8px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .stat-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
