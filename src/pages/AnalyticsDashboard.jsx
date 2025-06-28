import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import "../styles/AnalyticsDashboard.css";
import RevenueChart from "../components/charts/RevenueChart";

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
  FaArrowDown,
  FaCalendarAlt,
  FaDownload,
  FaSyncAlt,
  FaGlobe,
  FaRocket,
  FaClock,
  FaEye,
  FaUserCheck,
  FaBolt,
  FaTachometerAlt,
  FaChartBar,
  FaChartPie,
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
    totalOrders: 1567,
    avgOrderValue: 284.5,
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
        activeUsers: Math.max(
          1000,
          prev.activeUsers + Math.floor(Math.random() * 20) - 10
        ),
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 100),
        pendingOrders: Math.max(
          0,
          prev.pendingOrders + Math.floor(Math.random() * 3) - 1
        ),
        conversionRate: Math.max(
          8,
          Math.min(18, prev.conversionRate + Math.random() * 0.4 - 0.2)
        ),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 2),
        avgOrderValue: Math.max(
          200,
          Math.min(400, prev.avgOrderValue + Math.random() * 10 - 5)
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const exportData = () => {
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

  // Button handler functions - all functionality for dashboard buttons
  const refreshDashboard = () => {
    setLoading(true);
    // Simulate data refresh with updated values
    setTimeout(() => {
      setRealTimeData((prev) => ({
        ...prev,
        activeUsers: Math.max(
          1000,
          prev.activeUsers + Math.floor(Math.random() * 100) - 50
        ),
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 500),
        pendingOrders: Math.max(
          0,
          prev.pendingOrders + Math.floor(Math.random() * 10) - 5
        ),
        conversionRate: Math.max(
          8,
          Math.min(18, prev.conversionRate + Math.random() * 2 - 1)
        ),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
        avgOrderValue: Math.max(
          200,
          Math.min(400, prev.avgOrderValue + Math.random() * 20 - 10)
        ),
      }));
      setLoading(false);
    }, 1000);
  };

  const exportRevenuePDF = () => {
    const revenueData = {
      type: "Revenue Report",
      period: selectedPeriod,
      totalRevenue: realTimeData.todayRevenue,
      growthRate: "+15.2%",
      exportDate: new Date().toISOString(),
      metrics: realTimeData,
      chartData: "Revenue chart data would be included here",
    };

    const blob = new Blob([JSON.stringify(revenueData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${selectedPeriod}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportIntelligenceInsights = () => {
    const insights = {
      type: "AI Intelligence Report",
      period: selectedPeriod,
      aiAccuracy: "98.7%",
      efficiency: "2.3x",
      exportDate: new Date().toISOString(),
      insights: [
        "Order processing efficiency improved by 23%",
        "Peak ordering hours: 2-4 PM",
        "Recommended inventory adjustments available",
        "Customer retention rate trending upward",
      ],
    };

    const blob = new Blob([JSON.stringify(insights, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-insights-${selectedPeriod}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const retrainModel = () => {
    // Simulate AI model retraining
    alert(
      "AI Model retraining initiated. This process typically takes 15-30 minutes. You will be notified when complete."
    );
  };

  const viewDetails = (section) => {
    // Navigate to detailed view or show modal
    alert(
      `Opening detailed view for ${section}. This would typically navigate to a dedicated analytics page.`
    );
  };

  const configureAlerts = () => {
    alert(
      "Alert configuration panel would open here. Configure thresholds for metrics, notifications, and automated responses."
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Analytics Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Executive Header */}
      <div className="dashboard-header">
        <div className="header-gradient">
          <div className="container-fluid py-5">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="header-content text-white">
                  <div className="d-flex align-items-center mb-3">
                    <div className="header-icon me-4">
                      <FaTachometerAlt size={48} />
                    </div>
                    <div>
                      <h1 className="display-4 fw-bold mb-2">
                        Executive Analytics
                      </h1>
                      <p className="lead mb-0 opacity-90">
                        Real-time business intelligence and performance insights
                      </p>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mt-4">
                    <div className="header-badge">
                      <FaBolt className="me-2" />
                      Live Data
                    </div>
                    <div className="header-badge">
                      <FaUsers className="me-2" />
                      {realTimeData.activeUsers.toLocaleString()} Active
                    </div>
                    <div className="header-badge">
                      <FaDollarSign className="me-2" />$
                      {realTimeData.todayRevenue.toLocaleString()} Today
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="header-controls">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-2">
                      <select
                        className="form-select form-select-lg bg-white bg-opacity-90"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="1year">Last Year</option>
                      </select>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-light btn-lg flex-grow-1"
                        onClick={exportData}
                      >
                        <FaDownload className="me-2" />
                        Export
                      </button>

                      <button
                        className="btn btn-outline-light btn-lg"
                        onClick={refreshDashboard}
                        title="Refresh Dashboard Data"
                      >
                        <FaSyncAlt />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content with Enhanced Spacing */}
      <div className="dashboard-content">
        <div className="container-fluid py-5 px-4">
          {/* Executive KPI Cards with Better Spacing */}
          <div className="row g-4 mb-6">
            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card primary">
                <div className="kpi-icon">
                  <FaUsers />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    {realTimeData.activeUsers.toLocaleString()}
                  </div>
                  <div className="kpi-label">Active Users</div>
                  <div className="kpi-change positive">
                    <FaArrowUp /> +12.5%
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line primary"></div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card success">
                <div className="kpi-icon">
                  <FaDollarSign />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    ${realTimeData.todayRevenue.toLocaleString()}
                  </div>
                  <div className="kpi-label">Today's Revenue</div>
                  <div className="kpi-change positive">
                    <FaArrowUp /> +8.2%
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line success"></div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card warning">
                <div className="kpi-icon">
                  <FaShoppingCart />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">{realTimeData.pendingOrders}</div>
                  <div className="kpi-label">Pending Orders</div>
                  <div className="kpi-change neutral">
                    <FaClock /> Review
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line warning"></div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card info">
                <div className="kpi-icon">
                  <FaChartLine />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    {realTimeData.conversionRate.toFixed(1)}%
                  </div>
                  <div className="kpi-label">Conversion</div>
                  <div className="kpi-change positive">
                    <FaArrowUp /> +2.1%
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line info"></div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card purple">
                <div className="kpi-icon">
                  <FaChartBar />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    {realTimeData.totalOrders.toLocaleString()}
                  </div>
                  <div className="kpi-label">Total Orders</div>
                  <div className="kpi-change positive">
                    <FaArrowUp /> +15.3%
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line purple"></div>
                </div>
              </div>
            </div>

            <div className="col-xl-2 col-md-4 col-6">
              <div className="kpi-card teal">
                <div className="kpi-icon">
                  <FaChartPie />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">
                    ${realTimeData.avgOrderValue.toFixed(0)}
                  </div>
                  <div className="kpi-label">Avg Order</div>
                  <div className="kpi-change positive">
                    <FaArrowUp /> +5.7%
                  </div>
                </div>
                <div className="kpi-chart">
                  <div className="mini-chart-line teal"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Analytics Grid with Professional Spacing */}
          <div className="analytics-grid-enhanced">
            {/* Section 1: Real-Time Command Center */}
            <div className="analytics-section-enhanced real-time-section mb-6">
              <div className="section-header-enhanced mb-5">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="section-badge live-badge mb-3">
                      <div className="pulse-dot me-2"></div>
                      LIVE DATA STREAM
                    </div>
                    <h3 className="section-title-enhanced mb-2">
                      <FaRocket className="section-icon me-3" />
                      Real-Time Command Center
                    </h3>
                    <p className="section-description">
                      Live performance metrics, instant insights, and dynamic
                      monitoring dashboard
                    </p>
                  </div>
                  <div className="section-controls">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={refreshDashboard}
                      title="Refresh Real-time Data"
                    >
                      <FaSyncAlt className="me-1" />
                      Refresh
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={exportData}
                      title="Export Real-time Metrics"
                    >
                      <FaDownload className="me-1" />
                      Export
                    </button>
                  </div>
                </div>
              </div>

              <div className="enhanced-card glass-card">
                <div className="card-header-enhanced">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title-enhanced mb-0">
                      <FaBolt className="me-2 text-primary" />
                      Live Metrics Engine
                    </h5>
                    <div className="live-indicator">
                      <span className="live-dot"></span>
                      <span className="text-success fw-medium">Real-time</span>
                    </div>
                  </div>
                </div>
                <div className="card-body-enhanced p-5">
                  <RealTimeMetrics />
                </div>
              </div>
            </div>

            {/* Section 2: Executive Financial Dashboard */}
            <div className="analytics-section-enhanced financial-section mb-8">
              <div className="section-header-enhanced mb-5">
                <div className="section-badge financial-badge mb-3">
                  <FaDollarSign className="me-2" />
                  FINANCIAL INTELLIGENCE
                </div>
                <h3 className="section-title-enhanced mb-2">
                  <FaDollarSign className="section-icon me-3" />
                  Executive Financial Dashboard
                </h3>
                <p className="section-description">
                  Comprehensive revenue analytics, financial insights, and
                  performance tracking
                </p>
              </div>

              <div className="row g-6">
                <div className="col-12">
                  <div className="enhanced-card revenue-card">
                    <div className="card-header-enhanced">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title-enhanced mb-0">
                          <FaChartLine className="me-2 text-success" />
                          Revenue Analytics Engine
                        </h5>
                        <div className="card-actions">
                          <span className="badge bg-success bg-opacity-10 text-success me-2">
                            +15.2% Growth
                          </span>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={exportRevenuePDF}
                            title="Export Revenue Report"
                          >
                            <FaDownload className="me-1" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-enhanced p-5">
                      <RevenueChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Order Intelligence Engine - REDESIGNED */}
            <div className="analytics-section-enhanced order-intelligence-section-redesigned mb-10">
              <div className="section-header-premium mb-8">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="header-left">
                    <div className="section-badge-premium intelligence-badge-premium mb-4">
                      <div className="badge-icon">
                        <FaRocket />
                      </div>
                      <div className="badge-content">
                        <span className="badge-label">
                          AI-POWERED ORDER INTELLIGENCE
                        </span>
                        <span className="badge-sublabel">
                          Machine Learning Analytics Engine
                        </span>
                      </div>
                    </div>
                    <h2 className="section-title-premium mb-3">
                      <span className="title-accent"></span>
                      Advanced Order Intelligence Center
                    </h2>
                    <p className="section-description-premium">
                      Next-generation AI-powered order analytics with predictive
                      insights, intelligent automation, and real-time decision
                      support systems
                    </p>
                  </div>

                  <div className="header-right">
                    <div className="intelligence-metrics-preview">
                      <div className="ai-metric-card">
                        <div className="ai-icon">
                          <FaBolt />
                        </div>
                        <div className="ai-content">
                          <div className="ai-value">98.7%</div>
                          <div className="ai-label">AI Accuracy</div>
                        </div>
                      </div>
                      <div className="ai-metric-card">
                        <div className="ai-icon">
                          <FaRocket />
                        </div>
                        <div className="ai-content">
                          <div className="ai-value">2.3x</div>
                          <div className="ai-label">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-intelligence-container-premium">
                <div className="order-intelligence-card-premium">
                  <div className="card-header-premium">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="header-info">
                        <h3 className="card-title-premium">
                          <div className="title-icon ai-icon-gradient">
                            <FaRocket />
                          </div>
                          Intelligent Order Tracking & Predictive Analytics
                          Engine
                        </h3>
                        <p className="card-subtitle-premium">
                          Advanced machine learning algorithms for order
                          optimization and predictive insights
                        </p>
                      </div>

                      <div className="card-controls-premium">
                        <div className="ai-status-indicators">
                          <div className="indicator-item ai-active">
                            <div className="ai-pulse-dot"></div>
                            <span>AI Engine Active</span>
                          </div>
                          <div className="indicator-item">
                            <FaBolt className="me-1" />
                            <span>ML Model: v3.2.1</span>
                          </div>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="btn-premium btn-outline-ai"
                            onClick={retrainModel}
                            title="Retrain AI Model"
                          >
                            <FaSyncAlt className="me-1" />
                            Retrain Model
                          </button>
                          <button
                            className="btn-premium btn-ai"
                            onClick={exportIntelligenceInsights}
                            title="Export AI Insights"
                          >
                            <FaDownload className="me-1" />
                            Export Insights
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body-premium">
                    <div className="intelligence-container-premium">
                      <RealTimeOrderTracking />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Live Activity Stream Command Center - REDESIGNED */}
            <div className="analytics-section-enhanced activity-section-redesigned mb-10">
              <div className="section-header-premium mb-8">
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="header-left">
                    <div className="section-badge-premium activity-badge-premium mb-4">
                      <div className="badge-icon">
                        <FaEye />
                      </div>
                      <div className="badge-content">
                        <span className="badge-label">
                          LIVE ACTIVITY INTELLIGENCE
                        </span>
                        <span className="badge-sublabel">
                          Real-time Order & User Stream
                        </span>
                      </div>
                    </div>
                    <h2 className="section-title-premium mb-3">
                      <span className="title-accent"></span>
                      Live Activity Stream Command Center
                    </h2>
                    <p className="section-description-premium">
                      Real-time activity monitoring with comprehensive order
                      tracking, live user interactions, and intelligent activity
                      feed analytics
                    </p>
                  </div>

                  <div className="header-right">
                    <div className="activity-metrics-preview">
                      <div className="activity-metric-card">
                        <div className="activity-icon live">
                          <FaEye />
                        </div>
                        <div className="activity-content">
                          <div className="activity-value">
                            {realTimeData.activeUsers}
                          </div>
                          <div className="activity-label">Live Viewers</div>
                        </div>
                      </div>
                      <div className="activity-metric-card">
                        <div className="activity-icon processing">
                          <FaClock />
                        </div>
                        <div className="activity-content">
                          <div className="activity-value">247</div>
                          <div className="activity-label">Live Orders</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-stream-container-premium">
                <div className="activity-stream-card-premium">
                  <div className="card-header-premium">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="header-info">
                        <h3 className="card-title-premium">
                          <div className="title-icon live-icon-gradient">
                            <FaEye />
                          </div>
                          Comprehensive Live Activity Feed & Order Stream
                        </h3>
                        <p className="card-subtitle-premium">
                          Real-time monitoring of all platform activities with
                          intelligent filtering and analysis
                        </p>
                      </div>

                      <div className="card-controls-premium">
                        <div className="live-status-indicators">
                          <div className="indicator-item live-active">
                            <div className="live-pulse-dot"></div>
                            <span>Live Stream Active</span>
                          </div>
                          <div className="indicator-item">
                            <FaBolt className="me-1" />
                            <span>Updates: Real-time</span>
                          </div>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="btn-premium btn-outline-live"
                            onClick={refreshDashboard}
                            title="Refresh Activity Feed"
                          >
                            <FaSyncAlt className="me-1" />
                            Refresh Feed
                          </button>
                          <button
                            className="btn-premium btn-live"
                            onClick={() => exportData()}
                            title="Export Activity Log"
                          >
                            <FaDownload className="me-1" />
                            Export Activity Log
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body-premium">
                    <div className="activity-feed-container-premium">
                      <RecentOrdersWidget />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Product & Customer Intelligence */}
            <div className="analytics-section-enhanced product-section mb-8">
              <div className="section-header-enhanced mb-5">
                <div className="section-badge product-badge mb-3">
                  <FaShoppingCart className="me-2" />
                  BUSINESS INTELLIGENCE
                </div>
                <h3 className="section-title-enhanced mb-2">
                  <FaShoppingCart className="section-icon me-3" />
                  Product & Customer Intelligence
                </h3>
                <p className="section-description">
                  Advanced product performance analytics and customer behavior
                  insights
                </p>
              </div>

              <div className="row g-6">
                <div className="col-lg-6">
                  <div className="enhanced-card product-performance-card">
                    <div className="card-header-enhanced">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title-enhanced mb-0">
                          <FaChartBar className="me-2 text-primary" />
                          Product Performance Matrix
                        </h5>
                        <div className="performance-indicator">
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            <FaArrowUp className="me-1" />
                            Trending
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-enhanced p-5">
                      <ProductSalesChart products={products} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="enhanced-card customer-analytics-card">
                    <div className="card-header-enhanced">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title-enhanced mb-0">
                          <FaUsers className="me-2 text-info" />
                          Customer Analytics Hub
                        </h5>
                        <div className="insight-badge">
                          <span className="badge bg-info bg-opacity-10 text-info">
                            <FaEye className="me-1" />
                            Insights Available
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-enhanced p-5">
                      <CustomerOrderChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: User Analytics & Operational Excellence */}
            <div className="analytics-section-enhanced operational-section mb-8">
              <div className="section-header-enhanced mb-5">
                <div className="section-badge operational-badge mb-3">
                  <FaUsers className="me-2" />
                  OPERATIONAL EXCELLENCE
                </div>
                <h3 className="section-title-enhanced mb-2">
                  <FaUsers className="section-icon me-3" />
                  User Analytics & Operational Excellence
                </h3>
                <p className="section-description">
                  User behavior analytics, operational metrics, and performance
                  optimization insights
                </p>
              </div>

              <div className="row g-6">
                <div className="col-12">
                  <div className="enhanced-card user-analytics-card">
                    <div className="card-header-enhanced">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title-enhanced mb-0">
                          <FaUserCheck className="me-2 text-primary" />
                          Advanced User Analytics & Behavioral Insights
                        </h5>
                        <div className="analytics-controls">
                          <select className="form-select form-select-sm bg-light border-0">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-enhanced p-5">
                      <UserAnalyticsWidget />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8: Geographic Intelligence Suite */}
            <div className="analytics-section-enhanced geographic-section mb-8">
              <div className="section-header-enhanced mb-5">
                <div className="section-badge geographic-badge mb-3">
                  <FaGlobe className="me-2" />
                  GLOBAL INTELLIGENCE
                </div>
                <h3 className="section-title-enhanced mb-2">
                  <FaGlobe className="section-icon me-3" />
                  Geographic Intelligence Suite
                </h3>
                <p className="section-description">
                  Global analytics, location-based insights, and worldwide
                  market penetration data
                </p>
              </div>

              <div className="row g-6">
                <div className="col-12">
                  <div className="enhanced-card geographic-card">
                    <div className="card-header-enhanced">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title-enhanced mb-0">
                          <FaGlobe className="me-2 text-success" />
                          Global Distribution Analytics & Market Intelligence
                        </h5>
                        <div className="geographic-controls">
                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => viewDetails("Geographic Regions")}
                            title="View Regional Analytics"
                          >
                            <FaGlobe className="me-1" />
                            Regions
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => viewDetails("Country Analytics")}
                            title="View Country-wise Analytics"
                          >
                            <FaChartBar className="me-1" />
                            Countries
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body-enhanced p-5">
                      <GeographicAnalytics />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Styling */}
      <style jsx>{`
        .analytics-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .dashboard-header {
          position: relative;
          overflow: hidden;
        }

        .header-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
        }

        .header-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.1;
        }

        .header-content {
          position: relative;
          z-index: 2;
        }

        .header-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
        }

        .header-controls {
          position: relative;
          z-index: 2;
        }

        .dashboard-content {
          margin-top: -20px;
          position: relative;
          z-index: 3;
        }

        .kpi-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--accent-color);
        }

        .kpi-card.primary { --accent-color: #007bff; }
        .kpi-card.success { --accent-color: #28a745; }
        .kpi-card.warning { --accent-color: #ffc107; }
        .kpi-card.info { --accent-color: #17a2b8; }
        .kpi-card.purple { --accent-color: #6f42c1; }
        .kpi-card.teal { --accent-color: #20c997; }

        .kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--accent-color);
          background: color-mix(in srgb, var(--accent-color) 10%, white);
          margin-bottom: 16px;
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 4px;
        }

        .kpi-label {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .kpi-change {
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .kpi-change.positive { color: #28a745; }
        .kpi-change.negative { color: #dc3545; }
        .kpi-change.neutral { color: #ffc107; }

        .kpi-chart {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 60px;
          height: 30px;
          opacity: 0.3;
        }

        .mini-chart-line {
          width: 100%;
          height: 100%;
          background: var(--accent-color);
          border-radius: 4px 4px 0 0;
          clip-path: polygon(0 80%, 20% 60%, 40% 70%, 60% 40%, 80% 50%, 100% 20%, 100% 100%, 0 100%);
        }

        .grid-section {
          margin-bottom: 5rem;
          padding: 0 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          letter-spacing: -0.02em;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }

        .section-subtitle {
          color: #6c757d;
          font-size: 1.2rem;
          margin-bottom: 0;
          font-weight: 400;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .dashboard-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .dashboard-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }

        .dashboard-card .card-header {
          background: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px 20px 0 0 !important;
          padding: 2.5rem 2.5rem 1.5rem;
          position: relative;
        }

        .dashboard-card .card-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          letter-spacing: -0.01em;
        }

        .dashboard-card .card-title::before {
          content: '';
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin-right: 12px;
          animation: pulse-dot 2s infinite;
        }

        .dashboard-card .card-body {
          padding: 2.5rem;
          position: relative;
        }
        }

        /* Enhanced spacing utilities */
        .mb-6 { margin-bottom: 4rem !important; }
        .mb-7 { margin-bottom: 5rem !important; }
        .py-6 { padding-top: 4rem !important; padding-bottom: 4rem !important; }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content .display-4 {
            font-size: 2.5rem !important;
          }
          
          .header-badge {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
          
          .kpi-card {
            height: 140px;
            padding: 20px;
          }
          
          .kpi-value {
            font-size: 1.6rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .kpi-card {
            height: 120px;
            padding: 16px;
          }
          
          .kpi-value {
            font-size: 1.4rem;
          }
          
          .kpi-icon {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
        }

        /* Enhanced Analytics Section Styles */
        .analytics-section-enhanced {
          position: relative;
          margin-bottom: 6rem;
          padding: 0 1rem;
        }

        .section-header-enhanced {
          margin-bottom: 3rem;
          position: relative;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .live-badge {
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          animation: pulse-badge 2s ease-in-out infinite;
        }

        .financial-badge {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .product-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .operational-badge {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .geographic-badge {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .section-title-enhanced {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .section-icon {
          font-size: 1.8rem;
          opacity: 0.8;
        }

        .section-description {
          color: #6c757d;
          font-size: 1.1rem;
          font-weight: 400;
          margin-bottom: 0;
          line-height: 1.5;
          max-width: 70%;
        }

        .section-controls {
          display: flex;
          gap: 0.5rem;
        }

        /* Enhanced Card Styles */
        .enhanced-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.9);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .enhanced-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          z-index: 1;
        }

        .enhanced-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
          border-color: rgba(102, 126, 234, 0.2);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-header-enhanced {
          background: transparent;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          padding: 2rem 2.5rem 1.5rem;
          position: relative;
          z-index: 2;
        }

        .card-title-enhanced {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          letter-spacing: -0.01em;
        }

        .card-body-enhanced {
          padding: 0;
          position: relative;
          z-index: 1;
        }

        /* Specialized Card Styles */
        .revenue-card:hover::before {
          background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
        }

        .order-status-card:hover::before {
          background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
        }

        .product-performance-card:hover::before {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .customer-analytics-card:hover::before {
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        }

        .user-analytics-card:hover::before {
          background: linear-gradient(90deg, #a8edea 0%, #fed6e3 100%);
        }

        .activity-feed-card:hover::before {
          background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%);
        }

        .geographic-card:hover::before {
          background: linear-gradient(90deg, #a8caba 0%, #5d4e75 100%);
        }

        .order-intelligence-card:hover::before {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        /* Full-width Card Enhancements */
        .order-status-card-full,
        .order-intelligence-card-full,
        .activity-feed-card-full {
          min-height: 500px;
          margin-bottom: 2rem;
        }

        .order-status-card-full {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
        }

        .order-status-card-full::before {
          background: linear-gradient(90deg, #ffc107 0%, #fd7e14 100%);
        }

        .order-status-card-full:hover::before {
          background: linear-gradient(90deg, #ff8c00 0%, #ff6b6b 100%);
        }

        .order-intelligence-card-full {
          background: linear-gradient(135deg, rgba(13, 202, 240, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
        }

        .order-intelligence-card-full::before {
          background: linear-gradient(90deg, #0dcaf0 0%, #6f42c1 100%);
        }

        .order-intelligence-card-full:hover::before {
          background: linear-gradient(90deg, #0056b3 0%, #6610f2 100%);
        }

        .activity-feed-card-full {
          background: linear-gradient(135deg, rgba(25, 135, 84, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
        }

        .activity-feed-card-full::before {
          background: linear-gradient(90deg, #198754 0%, #20c997 100%);
        }

        .activity-feed-card-full:hover::before {
          background: linear-gradient(90deg, #146c43 0%, #0f5132 100%);
        }

        /* Enhanced Section Badges */
        .order-status-badge {
          background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
          color: white;
        }

        .intelligence-badge {
          background: linear-gradient(135deg, #0dcaf0 0%, #6f42c1 100%);
          color: white;
        }

        .activity-badge {
          background: linear-gradient(135deg, #198754 0%, #20c997 100%);
          color: white;
        }

        /* Enhanced Control Buttons */
        .status-controls,
        .intelligence-controls,
        .activity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-controls .btn,
        .intelligence-controls .btn,
        .activity-controls .btn {
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 16px;
          transition: all 0.3s ease;
        }

        .status-controls .btn:hover,
        .intelligence-controls .btn:hover,
        .activity-controls .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* Live Indicators */
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse-dot 2s infinite;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6c757d;
        }

        .status-dot.active {
          background: #28a745;
          animation: pulse-dot 2s infinite;
        }

        /* Card Actions & Controls */
        .card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .analytics-controls select {
          border-radius: 12px;
          font-size: 0.85rem;
          padding: 6px 12px;
          min-width: 140px;
        }

        .geographic-controls {
          display: flex;
          gap: 0.5rem;
        }

        .performance-indicator,
        .insight-badge,
        .intelligence-status,
        .activity-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Animations */
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes pulse-badge {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
          }
          50% {
            box-shadow: 0 4px 25px rgba(0, 210, 255, 0.6);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .enhanced-card {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .enhanced-card:nth-child(1) { animation-delay: 0.1s; }
        .enhanced-card:nth-child(2) { animation-delay: 0.2s; }
        .enhanced-card:nth-child(3) { animation-delay: 0.3s; }

        /* Smooth animations */
        .analytics-dashboard * {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
