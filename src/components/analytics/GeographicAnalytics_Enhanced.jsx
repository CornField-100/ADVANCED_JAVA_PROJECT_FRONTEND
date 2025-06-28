import { useState, useEffect } from "react";
import { Bar, Scatter, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GeographicAnalytics = () => {
  const [salesByRegion, setSalesByRegion] = useState({
    labels: [
      "North America",
      "Europe",
      "Asia Pacific",
      "South America",
      "Africa",
      "Middle East",
    ],
    datasets: [
      {
        label: "Sales Revenue ($K)",
        data: [450, 320, 280, 150, 90, 120],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  });

  const [topCities, setTopCities] = useState([
    {
      city: "New York",
      country: "USA",
      orders: 1247,
      revenue: 234500,
      flag: "🇺🇸",
    },
    { city: "London", country: "UK", orders: 892, revenue: 189200, flag: "🇬🇧" },
    {
      city: "Tokyo",
      country: "Japan",
      orders: 756,
      revenue: 167800,
      flag: "🇯🇵",
    },
    {
      city: "Sydney",
      country: "Australia",
      orders: 634,
      revenue: 142300,
      flag: "🇦🇺",
    },
    {
      city: "Toronto",
      country: "Canada",
      orders: 578,
      revenue: 128900,
      flag: "🇨🇦",
    },
    {
      city: "Berlin",
      country: "Germany",
      orders: 523,
      revenue: 115600,
      flag: "🇩🇪",
    },
  ]);

  const [continentData, setContinentData] = useState({
    labels: ["North America", "Europe", "Asia", "Others"],
    datasets: [
      {
        data: [35, 28, 22, 15],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTopCities((prev) =>
        prev.map((city) => ({
          ...city,
          orders: city.orders + Math.floor(Math.random() * 5),
          revenue: city.revenue + Math.floor(Math.random() * 1000),
        }))
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const regionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `Revenue: $${context.parsed.y}K`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#6B7280",
          callback: function (value) {
            return "$" + value + "K";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          maxRotation: 45,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="geographic-analytics-enhanced">
      {/* Enhanced Global Header */}
      <div className="global-header-section mb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="global-overview-card">
              <div className="d-flex align-items-center mb-4">
                <div className="globe-animation me-4">
                  <div className="spinning-globe">🌍</div>
                </div>
                <div>
                  <h4 className="mb-2 fw-bold text-dark">
                    Global Market Intelligence
                  </h4>
                  <p className="text-muted mb-0 lead">
                    Real-time geographic performance across 87 countries and
                    234+ cities worldwide
                  </p>
                </div>
              </div>

              <div className="global-metrics">
                <div className="row g-3">
                  <div className="col-3">
                    <div className="metric-box">
                      <div className="metric-value text-primary">87</div>
                      <div className="metric-label">Countries</div>
                      <div className="metric-trend positive">+5 this month</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="metric-box">
                      <div className="metric-value text-success">234</div>
                      <div className="metric-label">Cities</div>
                      <div className="metric-trend positive">+12 active</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="metric-box">
                      <div className="metric-value text-info">$2.8M</div>
                      <div className="metric-label">Global Revenue</div>
                      <div className="metric-trend positive">+15.3%</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="metric-box">
                      <div className="metric-value text-warning">98.5%</div>
                      <div className="metric-label">Uptime</div>
                      <div className="metric-trend stable">24/7 service</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="timezone-panel">
              <div className="timezone-header mb-4">
                <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                  <span className="me-2">🕐</span>
                  Global Time Zones
                </h6>
                <p className="text-muted small mb-0">
                  Active markets around the clock
                </p>
              </div>
              <div className="timezone-grid">
                <div className="timezone-item">
                  <div className="timezone-dot americas"></div>
                  <div className="timezone-info">
                    <div className="timezone-region">Americas</div>
                    <div className="timezone-time">
                      {new Date().toLocaleTimeString("en-US", {
                        timeZone: "America/New_York",
                        hour12: false,
                      })}
                    </div>
                  </div>
                  <div className="timezone-status active">Live</div>
                </div>
                <div className="timezone-item">
                  <div className="timezone-dot europe"></div>
                  <div className="timezone-info">
                    <div className="timezone-region">Europe</div>
                    <div className="timezone-time">
                      {new Date().toLocaleTimeString("en-US", {
                        timeZone: "Europe/London",
                        hour12: false,
                      })}
                    </div>
                  </div>
                  <div className="timezone-status active">Live</div>
                </div>
                <div className="timezone-item">
                  <div className="timezone-dot asia"></div>
                  <div className="timezone-info">
                    <div className="timezone-region">Asia Pacific</div>
                    <div className="timezone-time">
                      {new Date().toLocaleTimeString("en-US", {
                        timeZone: "Asia/Tokyo",
                        hour12: false,
                      })}
                    </div>
                  </div>
                  <div className="timezone-status active">Live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Grid */}
      <div className="row g-4 mb-5">
        {/* Regional Performance Chart */}
        <div className="col-lg-8">
          <div className="analytics-card">
            <div className="card-header-premium">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 fw-bold text-white">
                    <span className="me-2">📊</span>
                    Regional Performance Analytics
                  </h5>
                  <p className="mb-0 text-white opacity-90 small">
                    Revenue distribution by geographic regions
                  </p>
                </div>
                <div className="header-controls">
                  <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill">
                    Last 30 Days
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body-premium">
              <div className="chart-container">
                <Bar data={salesByRegion} options={regionOptions} />
              </div>
              <div className="chart-footer">
                <div className="row text-center">
                  <div className="col-3">
                    <div className="footer-stat">
                      <div className="stat-value text-primary">6</div>
                      <div className="stat-label">Active Regions</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="footer-stat">
                      <div className="stat-value text-success">$1.41M</div>
                      <div className="stat-label">Total Revenue</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="footer-stat">
                      <div className="stat-value text-info">8,947</div>
                      <div className="stat-label">Global Orders</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="footer-stat">
                      <div className="stat-value text-warning">+15.3%</div>
                      <div className="stat-label">Growth Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continent Distribution */}
        <div className="col-lg-4">
          <div className="analytics-card">
            <div className="card-header-premium">
              <h5 className="mb-1 fw-bold text-white">
                <span className="me-2">🌎</span>
                Market Distribution
              </h5>
              <p className="mb-0 text-white opacity-90 small">
                Sales by continent percentage
              </p>
            </div>
            <div className="card-body-premium">
              <div className="chart-container-small">
                <Doughnut data={continentData} options={doughnutOptions} />
              </div>
              <div className="text-center mt-3">
                <div className="continent-summary">
                  <div className="summary-item">
                    <span className="summary-label">Leading Market:</span>
                    <span className="summary-value text-primary fw-bold">
                      North America
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Fastest Growing:</span>
                    <span className="summary-value text-success fw-bold">
                      Asia Pacific
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Cities Performance Table */}
      <div className="row">
        <div className="col-12">
          <div className="analytics-card">
            <div className="card-header-premium">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 fw-bold text-white">
                    <span className="me-2">🏙️</span>
                    Top Performing Cities
                  </h5>
                  <p className="mb-0 text-white opacity-90 small">
                    Real-time city-level performance metrics
                  </p>
                </div>
                <button className="btn btn-outline-light btn-sm">
                  <span className="me-1">📊</span>
                  View All
                </button>
              </div>
            </div>
            <div className="card-body-premium p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 premium-table">
                  <thead>
                    <tr>
                      <th className="border-0 fw-bold">Rank</th>
                      <th className="border-0 fw-bold">City</th>
                      <th className="border-0 fw-bold">Orders</th>
                      <th className="border-0 fw-bold">Revenue</th>
                      <th className="border-0 fw-bold">Avg. Order Value</th>
                      <th className="border-0 fw-bold">Growth</th>
                      <th className="border-0 fw-bold">Market Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCities.map((city, index) => (
                      <tr
                        key={city.city}
                        className={index < 3 ? "top-performer" : ""}
                      >
                        <td className="align-middle">
                          <div className="rank-indicator">
                            {index < 3 && (
                              <span className="trophy-icon me-2">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </span>
                            )}
                            <span className="rank-number">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className="city-info">
                            <span className="flag-icon me-3">{city.flag}</span>
                            <div>
                              <div className="city-name">{city.city}</div>
                              <div className="country-name">{city.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          <span className="metric-value primary">
                            {city.orders.toLocaleString()}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className="metric-value success">
                            ${city.revenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className="metric-value neutral">
                            ${Math.round(city.revenue / city.orders)}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className="growth-badge positive">
                            +{(Math.random() * 15 + 5).toFixed(1)}%
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="market-share">
                            <div className="progress-container">
                              <div
                                className="progress-bar-custom"
                                style={{ width: `${Math.random() * 40 + 20}%` }}
                              ></div>
                            </div>
                            <span className="percentage-text">
                              {(Math.random() * 15 + 5).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .geographic-analytics-enhanced {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .global-header-section {
          margin-bottom: 2rem;
        }

        .global-overview-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          height: 100%;
        }

        .globe-animation {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .spinning-globe {
          font-size: 2rem;
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .global-metrics {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .metric-box {
          text-align: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .metric-box:hover {
          transform: translateY(-2px);
          background: rgba(0, 0, 0, 0.05);
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .metric-trend {
          font-size: 0.7rem;
          font-weight: 600;
        }

        .metric-trend.positive {
          color: #10b981;
        }
        .metric-trend.stable {
          color: #f59e0b;
        }

        .timezone-panel {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          height: 100%;
        }

        .timezone-grid {
          space-y: 1rem;
        }

        .timezone-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }

        .timezone-item:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: translateX(4px);
        }

        .timezone-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 1rem;
          animation: pulse-timezone 2s infinite;
        }

        .timezone-dot.americas {
          background: #3b82f6;
        }
        .timezone-dot.europe {
          background: #10b981;
        }
        .timezone-dot.asia {
          background: #f59e0b;
        }

        @keyframes pulse-timezone {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .timezone-info {
          flex-grow: 1;
        }

        .timezone-region {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
        }

        .timezone-time {
          font-family: "Courier New", monospace;
          color: #6b7280;
          font-size: 0.8rem;
        }

        .timezone-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .timezone-status.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .analytics-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: none;
          overflow: hidden;
          transition: all 0.4s ease;
          height: 100%;
        }

        .analytics-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
        }

        .card-header-premium {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border: none;
        }

        .card-body-premium {
          padding: 2rem;
        }

        .chart-container {
          height: 320px;
          margin-bottom: 1.5rem;
        }

        .chart-container-small {
          height: 280px;
          margin-bottom: 1rem;
        }

        .chart-footer {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding-top: 1.5rem;
        }

        .footer-stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .continent-summary {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
          padding: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .summary-item:last-child {
          margin-bottom: 0;
        }

        .summary-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .summary-value {
          font-size: 0.9rem;
        }

        .premium-table {
          background: white;
        }

        .premium-table thead th {
          background: rgba(0, 0, 0, 0.05);
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 1rem;
        }

        .premium-table tbody td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          vertical-align: middle;
        }

        .top-performer {
          background: linear-gradient(
            135deg,
            rgba(251, 191, 36, 0.05) 0%,
            rgba(245, 158, 11, 0.05) 100%
          );
        }

        .rank-indicator {
          display: flex;
          align-items: center;
        }

        .trophy-icon {
          font-size: 1.2rem;
        }

        .rank-number {
          font-weight: 700;
          color: #374151;
        }

        .city-info {
          display: flex;
          align-items: center;
        }

        .flag-icon {
          font-size: 1.5rem;
        }

        .city-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.125rem;
        }

        .country-name {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .metric-value {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .metric-value.primary {
          color: #3b82f6;
        }
        .metric-value.success {
          color: #10b981;
        }
        .metric-value.neutral {
          color: #374151;
        }

        .growth-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .growth-badge.positive {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .market-share {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-container {
          flex-grow: 1;
          height: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar-custom {
          height: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .percentage-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          min-width: 40px;
          text-align: right;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .global-overview-card,
          .timezone-panel {
            padding: 1.5rem;
          }

          .card-header-premium,
          .card-body-premium {
            padding: 1.5rem;
          }

          .chart-container {
            height: 250px;
          }

          .chart-container-small {
            height: 200px;
          }

          .premium-table {
            font-size: 0.85rem;
          }

          .premium-table thead th,
          .premium-table tbody td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GeographicAnalytics;
