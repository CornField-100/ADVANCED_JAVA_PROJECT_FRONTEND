import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerOrderChart = () => {
  // Sample customer order data - in real app, fetch from backend
  const customerOrderData = {
    labels: [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Emily Chen",
      "David Wilson",
      "Lisa Brown",
      "Alex Garcia",
    ],
    datasets: [
      {
        label: "Total Orders",
        data: [15, 12, 8, 20, 6, 14, 9],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(199, 199, 199, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "🏆 Top Customers by Order Count",
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
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `Orders: ${context.parsed.y}`;
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
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="customer-analytics-section">
      {/* Section Header */}
      <div className="analytics-section-header mb-5">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h3 className="fw-bold text-dark mb-2">
              <span className="me-2 fs-4">👥</span>
              Customer Analytics Hub
            </h3>
            <p className="text-muted mb-0">
              Comprehensive view of customer behavior and order patterns
            </p>
          </div>
          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
            <i className="fas fa-chart-line me-1"></i>
            Insights Available
          </div>
        </div>
      </div>

      {/* Top Customers Bar Chart - Full Width */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-lg analytics-card">
            <div
              className="card-header bg-gradient text-white border-0 py-4"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "0.5rem 0.5rem 0 0",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <span className="me-3 fs-4">🏆</span>
                  Top Customers by Order Count
                </h5>
                <div className="badge bg-white text-dark px-3 py-2 rounded-pill fw-semibold">
                  Performance Leaders
                </div>
              </div>
            </div>
            <div className="card-body p-5">
              <div style={{ height: "400px", marginBottom: "2rem" }}>
                <Bar data={customerOrderData} options={barOptions} />
              </div>

              {/* Customer Statistics */}
              <div
                className="customer-stats-grid mt-4 pt-4"
                style={{ borderTop: "2px solid #f8f9fa" }}
              >
                <div className="row g-4">
                  <div className="col-md-3">
                    <div
                      className="stat-card text-center p-4 rounded-3"
                      style={{
                        backgroundColor: "#f0f9ff",
                        border: "1px solid #e0f2fe",
                      }}
                    >
                      <div className="stat-icon mb-3">
                        <span className="fs-2">👤</span>
                      </div>
                      <div className="text-primary fw-bold fs-4 mb-1">84</div>
                      <div className="text-muted fw-medium">
                        Total Customers
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="stat-card text-center p-4 rounded-3"
                      style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #dcfce7",
                      }}
                    >
                      <div className="stat-icon mb-3">
                        <span className="fs-2">🔄</span>
                      </div>
                      <div className="text-success fw-bold fs-4 mb-1">89%</div>
                      <div className="text-muted fw-medium">Returning Rate</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="stat-card text-center p-4 rounded-3"
                      style={{
                        backgroundColor: "#fefce8",
                        border: "1px solid #fef3c7",
                      }}
                    >
                      <div className="stat-icon mb-3">
                        <span className="fs-2">💰</span>
                      </div>
                      <div className="text-warning fw-bold fs-4 mb-1">$247</div>
                      <div className="text-muted fw-medium">
                        Avg Order Value
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div
                      className="stat-card text-center p-4 rounded-3"
                      style={{
                        backgroundColor: "#fdf2f8",
                        border: "1px solid #fce7f3",
                      }}
                    >
                      <div className="stat-icon mb-3">
                        <span className="fs-2">⭐</span>
                      </div>
                      <div className="text-info fw-bold fs-4 mb-1">4.8</div>
                      <div className="text-muted fw-medium">Avg Rating</div>
                    </div>
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

export default CustomerOrderChart;
