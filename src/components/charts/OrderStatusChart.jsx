import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = ({ orderData }) => {
  const defaultData = orderData || {
    pending: 25,
    processing: 40,
    shipped: 80,
    delivered: 120,
    cancelled: 5,
  };

  const chartData = {
    labels: [
      "📦 Pending",
      "⚡ Processing",
      "🚚 Shipped",
      "✅ Delivered",
      "❌ Cancelled",
    ],
    datasets: [
      {
        label: "Orders",
        data: [
          defaultData.pending,
          defaultData.processing,
          defaultData.shipped,
          defaultData.delivered,
          defaultData.cancelled,
        ],
        backgroundColor: [
          "rgba(255, 206, 84, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: [
          "rgba(255, 206, 84, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "📊 Order Status Distribution",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 1,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} orders (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
    },
  };

  const totalOrders = Object.values(defaultData).reduce((a, b) => a + b, 0);

  return (
    <div
      className="order-status-chart position-relative"
      style={{ height: "400px" }}
    >
      <Doughnut data={chartData} options={options} />
      <div
        className="position-absolute top-50 start-50 translate-middle text-center"
        style={{ pointerEvents: "none" }}
      >
        <div className="fw-bold fs-4 text-primary">{totalOrders}</div>
        <div className="text-muted small">Total Orders</div>
      </div>
    </div>
  );
};

export default OrderStatusChart;
