import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  FaEye,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaCircle,
} from "react-icons/fa";

const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 1247,
    liveVisitors: 89,
    recentSales: 15420,
    bounceRate: 23.4,
    avgSessionTime: 245,
    conversionRate: 12.8,
  });

  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const now = Date.now();
      for (let i = 29; i >= 0; i--) {
        data.push({
          time: new Date(now - i * 1000).toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          visitors: Math.floor(Math.random() * 50) + 50,
          sales: Math.floor(Math.random() * 1000) + 100,
          revenue: Math.floor(Math.random() * 5000) + 1000,
        });
      }
      setChartData(data);
    };

    generateInitialData();

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        activeUsers: Math.max(
          1000,
          prev.activeUsers + Math.floor(Math.random() * 20) - 10
        ),
        liveVisitors: Math.max(
          50,
          prev.liveVisitors + Math.floor(Math.random() * 10) - 5
        ),
        recentSales: prev.recentSales + Math.floor(Math.random() * 500),
        bounceRate: Math.max(
          15,
          Math.min(35, prev.bounceRate + Math.random() * 2 - 1)
        ),
        avgSessionTime: Math.max(
          180,
          Math.min(
            300,
            prev.avgSessionTime + Math.floor(Math.random() * 10) - 5
          )
        ),
        conversionRate: Math.max(
          8,
          Math.min(18, prev.conversionRate + Math.random() * 0.4 - 0.2)
        ),
      }));

      // Update chart data
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          visitors: Math.floor(Math.random() * 50) + 50,
          sales: Math.floor(Math.random() * 1000) + 100,
          revenue: Math.floor(Math.random() * 5000) + 1000,
        });
        return newData;
      });

      // Simulate connection status
      setIsConnected(Math.random() > 0.02); // 98% uptime
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getChangeIndicator = (value, threshold = 0) => {
    if (value > threshold) {
      return <FaArrowUp className="text-success ms-1" />;
    } else if (value < threshold) {
      return <FaArrowDown className="text-danger ms-1" />;
    }
    return null;
  };

  return (
    <div className="real-time-metrics">
      {/* Real-time Status */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">📡 Real-Time Analytics</h5>
        <div className="d-flex align-items-center">
          <FaCircle
            className={`me-2 ${isConnected ? "text-success" : "text-danger"}`}
            style={{
              fontSize: "8px",
              animation: isConnected ? "pulse 2s infinite" : "none",
            }}
          />
          <small className={isConnected ? "text-success" : "text-danger"}>
            {isConnected ? "Live" : "Disconnected"}
          </small>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-primary text-white h-100">
            <div className="card-body text-center p-3">
              <FaUsers className="mb-2" size={24} />
              <div className="metric-value">
                {metrics.activeUsers.toLocaleString()}
              </div>
              <small>Active Users</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-success text-white h-100">
            <div className="card-body text-center p-3">
              <FaEye className="mb-2" size={24} />
              <div className="metric-value">{metrics.liveVisitors}</div>
              <small>Live Visitors</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-warning text-white h-100">
            <div className="card-body text-center p-3">
              <FaDollarSign className="mb-2" size={24} />
              <div className="metric-value">
                ${metrics.recentSales.toLocaleString()}
              </div>
              <small>Today's Sales</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-info text-white h-100">
            <div className="card-body text-center p-3">
              <FaShoppingCart className="mb-2" size={24} />
              <div className="metric-value">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <small>Conversion</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-secondary text-white h-100">
            <div className="card-body text-center p-3">
              <FaClock className="mb-2" size={24} />
              <div className="metric-value">
                {formatTime(metrics.avgSessionTime)}
              </div>
              <small>Avg Session</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="metric-card card border-0 bg-danger text-white h-100">
            <div className="card-body text-center p-3">
              <FaArrowDown className="mb-2" size={24} />
              <div className="metric-value">
                {metrics.bounceRate.toFixed(1)}%
              </div>
              <small>Bounce Rate</small>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">🔥 Live Visitor Activity</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#007bff"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    fontSize={10}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#007bff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">💰 Live Revenue Stream</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    fontSize={10}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#28a745"
                    strokeWidth={3}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">⚡ Live Activity Stream</h6>
            </div>
            <div className="card-body">
              <div
                className="activity-stream"
                style={{ height: "250px", overflowY: "auto" }}
              >
                <div className="activity-item d-flex align-items-center mb-2 animate__animated animate__fadeInUp">
                  <div className="activity-dot bg-success me-3"></div>
                  <div className="flex-grow-1">
                    <small className="text-muted">Just now</small>
                    <div className="small">
                      🛒 New order: $299.99 from New York
                    </div>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center mb-2">
                  <div className="activity-dot bg-primary me-3"></div>
                  <div className="flex-grow-1">
                    <small className="text-muted">2 seconds ago</small>
                    <div className="small">
                      👤 New user registration from California
                    </div>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center mb-2">
                  <div className="activity-dot bg-warning me-3"></div>
                  <div className="flex-grow-1">
                    <small className="text-muted">5 seconds ago</small>
                    <div className="small">
                      📱 Product viewed: iPhone 15 Pro
                    </div>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center mb-2">
                  <div className="activity-dot bg-info me-3"></div>
                  <div className="flex-grow-1">
                    <small className="text-muted">8 seconds ago</small>
                    <div className="small">💳 Payment processed: $1,299.99</div>
                  </div>
                </div>
                <div className="activity-item d-flex align-items-center mb-2">
                  <div className="activity-dot bg-secondary me-3"></div>
                  <div className="flex-grow-1">
                    <small className="text-muted">12 seconds ago</small>
                    <div className="small">
                      🛍️ Cart abandoned: $450.00 value
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">🌍 Geographic Activity</h6>
            </div>
            <div className="card-body">
              <div className="geographic-data">
                <div className="country-stat d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span className="flag me-2">🇺🇸</span>
                    <span>United States</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress me-2"
                      style={{ width: "100px", height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                    <span className="small fw-bold">78%</span>
                  </div>
                </div>

                <div className="country-stat d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span className="flag me-2">🇨🇦</span>
                    <span>Canada</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress me-2"
                      style={{ width: "100px", height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                    <span className="small fw-bold">12%</span>
                  </div>
                </div>

                <div className="country-stat d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span className="flag me-2">🇬🇧</span>
                    <span>United Kingdom</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress me-2"
                      style={{ width: "100px", height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: "6%" }}
                      ></div>
                    </div>
                    <span className="small fw-bold">6%</span>
                  </div>
                </div>

                <div className="country-stat d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center">
                    <span className="flag me-2">🇩🇪</span>
                    <span>Germany</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      className="progress me-2"
                      style={{ width: "100px", height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-info"
                        style={{ width: "4%" }}
                      ></div>
                    </div>
                    <span className="small fw-bold">4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .metric-card {
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1.2;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .activity-stream {
          scrollbar-width: thin;
          scrollbar-color: #dee2e6 transparent;
        }

        .activity-stream::-webkit-scrollbar {
          width: 4px;
        }

        .activity-stream::-webkit-scrollbar-track {
          background: transparent;
        }

        .activity-stream::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default RealTimeMetrics;
