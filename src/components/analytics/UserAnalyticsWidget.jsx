import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const UserAnalyticsWidget = () => {
  const [timeframe, setTimeframe] = useState("7days");
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mock user analytics data
    const generateData = () => {
      const timeframes = {
        "7days": [
          { name: "Mon", newUsers: 12, activeUsers: 150, orders: 8 },
          { name: "Tue", newUsers: 19, activeUsers: 180, orders: 12 },
          { name: "Wed", newUsers: 8, activeUsers: 120, orders: 6 },
          { name: "Thu", newUsers: 25, activeUsers: 220, orders: 15 },
          { name: "Fri", newUsers: 32, activeUsers: 280, orders: 22 },
          { name: "Sat", newUsers: 28, activeUsers: 250, orders: 18 },
          { name: "Sun", newUsers: 15, activeUsers: 170, orders: 10 },
        ],
        "30days": [
          { name: "Week 1", newUsers: 85, activeUsers: 1200, orders: 65 },
          { name: "Week 2", newUsers: 120, activeUsers: 1450, orders: 88 },
          { name: "Week 3", newUsers: 95, activeUsers: 1180, orders: 72 },
          { name: "Week 4", newUsers: 140, activeUsers: 1650, orders: 105 },
        ],
        "90days": [
          { name: "Month 1", newUsers: 340, activeUsers: 4800, orders: 280 },
          { name: "Month 2", newUsers: 420, activeUsers: 5200, orders: 350 },
          { name: "Month 3", newUsers: 380, activeUsers: 4950, orders: 320 },
        ],
      };

      setData(timeframes[timeframe]);
    };

    generateData();
  }, [timeframe]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark text-white p-3 rounded shadow border-0">
          <p className="mb-2 fw-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="user-analytics-widget">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">👥 User Analytics</h5>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${
              timeframe === "7days" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeframe("7days")}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              timeframe === "30days" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeframe("30days")}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`btn btn-sm ${
              timeframe === "90days" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTimeframe("90days")}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="fw-bold">
                {data.reduce((sum, item) => sum + item.newUsers, 0)}
              </h3>
              <small>New Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-success text-white">
            <div className="card-body text-center">
              <h3 className="fw-bold">
                {data.length > 0
                  ? Math.max(...data.map((item) => item.activeUsers))
                  : 0}
              </h3>
              <small>Peak Active Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body text-center">
              <h3 className="fw-bold">
                {data.reduce((sum, item) => sum + item.orders, 0)}
              </h3>
              <small>Total Orders</small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">👤 New vs Active Users</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#007bff"
                    strokeWidth={3}
                    dot={{ fill: "#007bff", strokeWidth: 2, r: 4 }}
                    name="New Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#28a745"
                    strokeWidth={3}
                    dot={{ fill: "#28a745", strokeWidth: 2, r: 4 }}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">📊 Order Conversion</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ffc107" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#ffc107"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#ffc107"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* User Insights */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="mb-0">🎯 User Insights</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="insight-item">
                    <div className="fs-2 mb-2">📈</div>
                    <h6 className="text-success">+23%</h6>
                    <small className="text-muted">User Growth</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="insight-item">
                    <div className="fs-2 mb-2">⏱️</div>
                    <h6 className="text-info">4.2 min</h6>
                    <small className="text-muted">Avg. Session</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="insight-item">
                    <div className="fs-2 mb-2">🛒</div>
                    <h6 className="text-warning">12.5%</h6>
                    <small className="text-muted">Conversion Rate</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="insight-item">
                    <div className="fs-2 mb-2">🔄</div>
                    <h6 className="text-primary">68%</h6>
                    <small className="text-muted">Return Users</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsWidget;
