import { useState, useEffect } from "react";
import { Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

const RealTimeOrderTracking = () => {
  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-001",
      customer: "Sarah Johnson",
      product: "iPhone 14 Pro",
      amount: 1299,
      status: "delivered",
      time: "2 min ago",
      location: "New York, NY",
    },
    {
      id: "ORD-002",
      customer: "Mike Davis",
      product: "MacBook Air M2",
      amount: 1199,
      status: "shipped",
      time: "5 min ago",
      location: "Los Angeles, CA",
    },
    {
      id: "ORD-003",
      customer: "Emily Chen",
      product: "iPad Air",
      amount: 699,
      status: "processing",
      time: "8 min ago",
      location: "Chicago, IL",
    },
    {
      id: "ORD-004",
      customer: "David Wilson",
      product: "AirPods Pro",
      amount: 249,
      status: "pending",
      time: "12 min ago",
      location: "Miami, FL",
    },
    {
      id: "ORD-005",
      customer: "Lisa Brown",
      product: "Apple Watch Series 8",
      amount: 399,
      status: "delivered",
      time: "15 min ago",
      location: "Seattle, WA",
    },
  ]);

  const [orderTrends, setOrderTrends] = useState({
    labels: ["12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30"],
    datasets: [
      {
        label: "Orders per 15min",
        data: [5, 8, 12, 6, 15, 9, 11],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    labels: [
      "Processing Speed",
      "Customer Satisfaction",
      "Delivery Time",
      "Product Quality",
      "Support Response",
      "Return Rate",
    ],
    datasets: [
      {
        label: "Current Performance",
        data: [85, 92, 78, 95, 88, 82],
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 197, 94, 1)",
        pointRadius: 6,
      },
      {
        label: "Target",
        data: [90, 95, 85, 98, 90, 85],
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time order updates
      setRecentOrders((prev) => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const statuses = ["pending", "processing", "shipped", "delivered"];
        const currentStatusIndex = statuses.indexOf(
          updated[randomIndex].status
        );

        if (currentStatusIndex < statuses.length - 1) {
          updated[randomIndex].status = statuses[currentStatusIndex + 1];
          updated[randomIndex].time = "Just now";
        }

        return updated;
      });

      // Update order trends
      setOrderTrends((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: prev.datasets[0].data.map(
              (val) => val + Math.floor(Math.random() * 3) - 1
            ),
          },
        ],
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "shipped":
        return "🚚";
      case "delivered":
        return "✅";
      default:
        return "📦";
    }
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "📈 Real-Time Order Flow",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "🎯 Performance Metrics",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 11,
            weight: "500",
          },
          color: "#374151",
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="row">
      {/* Real-Time Orders List */}
      <div className="col-lg-5 mb-4">
        <div className="card border-0 shadow-lg h-100">
          <div
            className="card-header bg-gradient text-white border-0 d-flex justify-content-between align-items-center"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0 d-flex align-items-center">
              <span className="me-2">🔄</span>
              Live Order Updates
            </h5>
            <div className="badge bg-white text-dark px-3 py-2 rounded-pill">
              <span
                className="d-inline-block bg-success rounded-circle me-2"
                style={{ width: "8px", height: "8px" }}
              ></span>
              Live
            </div>
          </div>
          <div
            className="card-body p-0"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {recentOrders.map((order, index) => (
              <div
                key={order.id}
                className={`border-bottom p-3 ${
                  index % 2 === 0 ? "bg-light bg-opacity-50" : ""
                }`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className="me-2">
                        {getStatusIcon(order.status)}
                      </span>
                      <span className="fw-bold text-dark">
                        {order.customer}
                      </span>
                      <span
                        className={`badge bg-${getStatusColor(
                          order.status
                        )} ms-2`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">
                      <strong>{order.product}</strong> • ${order.amount}
                    </div>
                    <div className="text-muted small">
                      📍 {order.location} • {order.time}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-success fw-bold">${order.amount}</div>
                    <div className="text-muted small">{order.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Trends Chart */}
      <div className="col-lg-4 mb-4">
        <div className="card border-0 shadow-lg h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0">Order Trends</h5>
          </div>
          <div className="card-body">
            <div style={{ height: "250px" }}>
              <Line data={orderTrends} options={trendOptions} />
            </div>
            <div className="mt-3 pt-3 border-top">
              <div className="row text-center">
                <div className="col-6">
                  <div className="text-primary fw-bold fs-6">68</div>
                  <div className="text-muted small">Orders/Hour</div>
                </div>
                <div className="col-6">
                  <div className="text-success fw-bold fs-6">+23%</div>
                  <div className="text-muted small">vs Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Radar */}
      <div className="col-lg-3 mb-4">
        <div className="card border-0 shadow-lg h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0">Performance</h5>
          </div>
          <div className="card-body">
            <div style={{ height: "250px" }}>
              <Radar data={performanceMetrics} options={radarOptions} />
            </div>
            <div className="mt-3 pt-3 border-top text-center">
              <div className="text-success fw-bold fs-5">87.5%</div>
              <div className="text-muted small">Overall Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeOrderTracking;
