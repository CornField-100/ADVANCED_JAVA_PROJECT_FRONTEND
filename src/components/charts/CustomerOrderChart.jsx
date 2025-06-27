import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

  const orderStatusData = {
    labels: ["Delivered", "Pending", "Shipped", "Cancelled"],
    datasets: [
      {
        data: [65, 15, 15, 5],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 10,
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
      title: {
        display: true,
        text: "📊 Order Status Distribution",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#374151",
        padding: {
          bottom: 20,
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
            const percentage = (
              (context.parsed /
                context.dataset.data.reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 2000,
    },
  };

  return (
    <div className="row">
      <div className="col-lg-8 mb-4">
        <div className="card border-0 shadow-sm h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0 d-flex align-items-center">
              <span className="me-2">👥</span>
              Top Customers Analytics
            </h5>
          </div>
          <div className="card-body p-4">
            <div style={{ height: "350px" }}>
              <Bar data={customerOrderData} options={barOptions} />
            </div>
            <div className="mt-3 pt-3 border-top">
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="text-primary fw-bold fs-5">84</div>
                  <div className="text-muted small">Total Customers</div>
                </div>
                <div className="col-md-4">
                  <div className="text-success fw-bold fs-5">89%</div>
                  <div className="text-muted small">Returning Rate</div>
                </div>
                <div className="col-md-4">
                  <div className="text-info fw-bold fs-5">$247</div>
                  <div className="text-muted small">Avg Order Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 mb-4">
        <div className="card border-0 shadow-sm h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0 d-flex align-items-center">
              <span className="me-2">📦</span>
              Order Status Overview
            </h5>
          </div>
          <div className="card-body p-4">
            <div style={{ height: "250px" }}>
              <Doughnut data={orderStatusData} options={doughnutOptions} />
            </div>
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Total Orders Today</span>
                <span className="fw-bold text-primary">156</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Success Rate</span>
                <span className="fw-bold text-success">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderChart;
