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
    <div className="real-time-metrics-enhanced">
      {/* Live Status Header */}
      <div
        className="status-header d-flex justify-content-between align-items-center mb-4 p-4 rounded-4"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="d-flex align-items-center text-white">
          <div className="live-indicator me-3">
            <FaCircle className="live-dot" />
          </div>
          <div>
            <h5 className="mb-1 text-white fw-bold">
              Real-Time Analytics Dashboard
            </h5>
            <small className="opacity-90">
              Live data • Updates every 2 seconds
            </small>
          </div>
        </div>
        <div className="status-info text-white text-end">
          <div className="fw-bold">
            {isConnected ? "🟢 Online" : "🔴 Offline"}
          </div>
          <small className="opacity-90">
            {new Date().toLocaleTimeString()}
          </small>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="metrics-grid row g-4 mb-5">
        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-blue">
            <div className="metric-header">
              <div className="metric-icon">
                <FaUsers size={28} />
              </div>
              <div className="metric-status">
                <FaArrowUp className="trend-up" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {metrics.activeUsers.toLocaleString()}
              </div>
              <div className="metric-label">Active Users</div>
              <div className="metric-change positive">+12.5% vs yesterday</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={chartData.slice(-8)}>
                  <defs>
                    <linearGradient
                      id="userGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgba(255,255,255,0.4)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgba(255,255,255,0.1)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="rgba(255,255,255,0.8)"
                    fill="url(#userGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-green">
            <div className="metric-header">
              <div className="metric-icon">
                <FaEye size={28} />
              </div>
              <div className="metric-status">
                <FaArrowUp className="trend-up" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">{metrics.liveVisitors}</div>
              <div className="metric-label">Live Visitors</div>
              <div className="metric-change positive">+8.2% this hour</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={chartData.slice(-8)}>
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-orange">
            <div className="metric-header">
              <div className="metric-icon">
                <FaDollarSign size={28} />
              </div>
              <div className="metric-status">
                <FaArrowUp className="trend-up" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                ${metrics.recentSales.toLocaleString()}
              </div>
              <div className="metric-label">Revenue Today</div>
              <div className="metric-change positive">+15.7% vs target</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={chartData.slice(-8)}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgba(255,255,255,0.4)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgba(255,255,255,0.1)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="rgba(255,255,255,0.8)"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-red">
            <div className="metric-header">
              <div className="metric-icon">
                <FaArrowDown size={28} />
              </div>
              <div className="metric-status">
                <FaArrowDown className="trend-down" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {metrics.bounceRate.toFixed(1)}%
              </div>
              <div className="metric-label">Bounce Rate</div>
              <div className="metric-change negative">-2.3% (improved)</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={chartData.slice(-8)}>
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-purple">
            <div className="metric-header">
              <div className="metric-icon">
                <FaClock size={28} />
              </div>
              <div className="metric-status">
                <FaArrowUp className="trend-up" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {formatTime(metrics.avgSessionTime)}
              </div>
              <div className="metric-label">Avg Session</div>
              <div className="metric-change positive">+7.4% quality</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={chartData.slice(-8)}>
                  <defs>
                    <linearGradient
                      id="sessionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgba(255,255,255,0.4)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgba(255,255,255,0.1)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="rgba(255,255,255,0.8)"
                    fill="url(#sessionGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-lg-4 col-md-6">
          <div className="metric-card-enhanced gradient-teal">
            <div className="metric-header">
              <div className="metric-icon">
                <FaShoppingCart size={28} />
              </div>
              <div className="metric-status">
                <FaArrowUp className="trend-up" />
              </div>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {metrics.conversionRate.toFixed(1)}%
              </div>
              <div className="metric-label">Conversion</div>
              <div className="metric-change positive">+4.2% today</div>
            </div>
            <div className="metric-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={chartData.slice(-8)}>
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Charts Section */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-header bg-gradient-primary text-white border-0 rounded-top-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="live-pulse"></div>
                </div>
                <h5 className="mb-0 fw-bold">🔥 Live Visitor Activity</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#667eea"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    fontSize={12}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#667eea"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                    dot={{ fill: "#667eea", strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-header bg-gradient-success text-white border-0 rounded-top-4">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="live-pulse success"></div>
                </div>
                <h5 className="mb-0 fw-bold">💰 Live Revenue Stream</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="revenueGlow"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#28a745" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#28a745" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    fontSize={12}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#28a745"
                    strokeWidth={4}
                    dot={{ fill: "#28a745", strokeWidth: 3, r: 5 }}
                    filter="url(#revenueGlow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Live Activity & Geographic Section */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-header bg-gradient-warning text-dark border-0 rounded-top-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">⚡ Live Activity Stream</h5>
                <span className="badge bg-dark rounded-pill">Real-time</span>
              </div>
            </div>
            <div className="card-body p-0">
              <div
                className="activity-stream-enhanced"
                style={{ height: "350px", overflowY: "auto" }}
              >
                <div className="activity-item-enhanced">
                  <div className="activity-timeline">
                    <div className="activity-dot bg-success pulse-success"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">Just now</div>
                    <div className="activity-text">
                      <strong>🛒 New Order Placed</strong>
                      <br />
                      <span className="text-muted">$299.99 • New York, NY</span>
                    </div>
                  </div>
                </div>

                <div className="activity-item-enhanced">
                  <div className="activity-timeline">
                    <div className="activity-dot bg-primary pulse-primary"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">2 seconds ago</div>
                    <div className="activity-text">
                      <strong>👤 New User Registration</strong>
                      <br />
                      <span className="text-muted">
                        Premium Plan • California
                      </span>
                    </div>
                  </div>
                </div>

                <div className="activity-item-enhanced">
                  <div className="activity-timeline">
                    <div className="activity-dot bg-warning pulse-warning"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">5 seconds ago</div>
                    <div className="activity-text">
                      <strong>📱 High-Value Product View</strong>
                      <br />
                      <span className="text-muted">iPhone 15 Pro • $1,199</span>
                    </div>
                  </div>
                </div>

                <div className="activity-item-enhanced">
                  <div className="activity-timeline">
                    <div className="activity-dot bg-info pulse-info"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">8 seconds ago</div>
                    <div className="activity-text">
                      <strong>💳 Payment Processed</strong>
                      <br />
                      <span className="text-muted">
                        $1,299.99 • Credit Card
                      </span>
                    </div>
                  </div>
                </div>

                <div className="activity-item-enhanced">
                  <div className="activity-timeline">
                    <div className="activity-dot bg-danger pulse-danger"></div>
                  </div>
                  <div className="activity-content">
                    <div className="activity-time">12 seconds ago</div>
                    <div className="activity-text">
                      <strong>🛍️ Cart Abandoned</strong>
                      <br />
                      <span className="text-muted">
                        $450.00 value • 3 items
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-header bg-gradient-info text-white border-0 rounded-top-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">🌍 Geographic Distribution</h5>
                <span className="badge bg-light text-dark rounded-pill">
                  Live Data
                </span>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="geographic-data-enhanced">
                <div className="country-stat-enhanced">
                  <div className="country-info">
                    <span className="flag-large">🇺🇸</span>
                    <div className="country-details">
                      <div className="country-name">United States</div>
                      <div className="country-metrics">
                        1,247 visitors • $15,420 revenue
                      </div>
                    </div>
                  </div>
                  <div className="country-progress">
                    <div className="progress-container">
                      <div
                        className="progress-bar-custom bg-primary"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                    <span className="percentage">78%</span>
                  </div>
                </div>

                <div className="country-stat-enhanced">
                  <div className="country-info">
                    <span className="flag-large">🇨🇦</span>
                    <div className="country-details">
                      <div className="country-name">Canada</div>
                      <div className="country-metrics">
                        189 visitors • $2,340 revenue
                      </div>
                    </div>
                  </div>
                  <div className="country-progress">
                    <div className="progress-container">
                      <div
                        className="progress-bar-custom bg-success"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                    <span className="percentage">12%</span>
                  </div>
                </div>

                <div className="country-stat-enhanced">
                  <div className="country-info">
                    <span className="flag-large">🇬🇧</span>
                    <div className="country-details">
                      <div className="country-name">United Kingdom</div>
                      <div className="country-metrics">
                        95 visitors • $1,180 revenue
                      </div>
                    </div>
                  </div>
                  <div className="country-progress">
                    <div className="progress-container">
                      <div
                        className="progress-bar-custom bg-warning"
                        style={{ width: "6%" }}
                      ></div>
                    </div>
                    <span className="percentage">6%</span>
                  </div>
                </div>

                <div className="country-stat-enhanced">
                  <div className="country-info">
                    <span className="flag-large">🇩🇪</span>
                    <div className="country-details">
                      <div className="country-name">Germany</div>
                      <div className="country-metrics">
                        63 visitors • $780 revenue
                      </div>
                    </div>
                  </div>
                  <div className="country-progress">
                    <div className="progress-container">
                      <div
                        className="progress-bar-custom bg-info"
                        style={{ width: "4%" }}
                      ></div>
                    </div>
                    <span className="percentage">4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .real-time-metrics-enhanced {
          margin-bottom: 2rem;
        }

        /* Live Status Indicator */
        .live-indicator {
          display: flex;
          align-items: center;
        }

        .live-dot {
          color: #00ff88;
          animation: pulse-glow 2s infinite;
          font-size: 12px;
        }

        .live-pulse {
          width: 12px;
          height: 12px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse-glow 2s infinite;
        }

        .live-pulse.success {
          background: #28a745;
        }

        /* Enhanced Metric Cards */
        .metric-card-enhanced {
          background: linear-gradient(
            135deg,
            var(--gradient-start) 0%,
            var(--gradient-end) 100%
          );
          border-radius: 20px;
          padding: 24px;
          color: white;
          height: 180px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .metric-card-enhanced:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        }

        .metric-card-enhanced::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .gradient-blue {
          --gradient-start: #667eea;
          --gradient-end: #764ba2;
        }

        .gradient-green {
          --gradient-start: #11998e;
          --gradient-end: #38ef7d;
        }

        .gradient-orange {
          --gradient-start: #ff8a00;
          --gradient-end: #e52e71;
        }

        .gradient-red {
          --gradient-start: #ff416c;
          --gradient-end: #ff4b2b;
        }

        .gradient-purple {
          --gradient-start: #8e2de2;
          --gradient-end: #4a00e0;
        }

        .gradient-teal {
          --gradient-start: #00b4db;
          --gradient-end: #0083b0;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .metric-icon {
          opacity: 0.9;
        }

        .metric-status .trend-up {
          color: #00ff88;
        }

        .metric-status .trend-down {
          color: #ff6b6b;
        }

        .metric-body {
          margin-bottom: 16px;
        }

        .metric-value {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .metric-change {
          font-size: 0.8rem;
          margin-top: 8px;
          font-weight: 600;
        }

        .metric-change.positive {
          color: #00ff88;
        }

        .metric-change.negative {
          color: #ff6b6b;
        }

        .metric-chart {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          opacity: 0.7;
        }

        /* Enhanced Activity Stream */
        .activity-stream-enhanced {
          padding: 1rem;
        }

        .activity-item-enhanced {
          display: flex;
          margin-bottom: 24px;
          position: relative;
        }

        .activity-timeline {
          width: 40px;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .activity-timeline::after {
          content: "";
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 40px;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.1),
            transparent
          );
        }

        .activity-item-enhanced:last-child .activity-timeline::after {
          display: none;
        }

        .activity-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: relative;
          z-index: 1;
        }

        .pulse-success {
          animation: pulse-success 2s infinite;
        }

        .pulse-primary {
          animation: pulse-primary 2s infinite;
        }

        .pulse-warning {
          animation: pulse-warning 2s infinite;
        }

        .pulse-info {
          animation: pulse-info 2s infinite;
        }

        .pulse-danger {
          animation: pulse-danger 2s infinite;
        }

        .activity-content {
          flex: 1;
          padding-left: 16px;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .activity-text {
          line-height: 1.4;
        }

        .activity-text strong {
          color: #2c3e50;
          font-weight: 600;
        }

        /* Enhanced Geographic Data */
        .geographic-data-enhanced {
          space-y: 1rem;
        }

        .country-stat-enhanced {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .country-stat-enhanced:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateX(8px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .country-info {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .flag-large {
          font-size: 1.5rem;
          margin-right: 12px;
        }

        .country-details {
          flex: 1;
        }

        .country-name {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 2px;
        }

        .country-metrics {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .country-progress {
          display: flex;
          align-items: center;
          min-width: 120px;
        }

        .progress-container {
          width: 80px;
          height: 8px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          margin-right: 12px;
          overflow: hidden;
        }

        .progress-bar-custom {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .percentage {
          font-weight: 700;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        /* Gradient backgrounds for cards */
        .bg-gradient-primary {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 100%
          ) !important;
        }

        .bg-gradient-success {
          background: linear-gradient(
            135deg,
            #11998e 0%,
            #38ef7d 100%
          ) !important;
        }

        .bg-gradient-warning {
          background: linear-gradient(
            135deg,
            #ff8a00 0%,
            #ffb347 100%
          ) !important;
        }

        .bg-gradient-info {
          background: linear-gradient(
            135deg,
            #00b4db 0%,
            #0083b0 100%
          ) !important;
        }

        /* Animations */
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-success {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(40, 167, 69, 0);
          }
        }

        @keyframes pulse-primary {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(0, 123, 255, 0);
          }
        }

        @keyframes pulse-warning {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(255, 193, 7, 0);
          }
        }

        @keyframes pulse-info {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(23, 162, 184, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(23, 162, 184, 0);
          }
        }

        @keyframes pulse-danger {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(220, 53, 69, 0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .metric-card-enhanced {
            height: 160px;
            padding: 20px;
          }

          .metric-value {
            font-size: 1.8rem;
          }

          .activity-stream-enhanced {
            height: 280px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RealTimeMetrics;
