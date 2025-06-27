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

const ProductSalesChart = ({ products }) => {
  // Use real product data or mock data
  const productData =
    products && products.length > 0
      ? products.slice(0, 10).map((p) => ({
          name: p.Model || p.model || "Unknown",
          sales: Math.floor(Math.random() * 100) + 10, // Mock sales data
        }))
      : [
          { name: "iPhone 15", sales: 85 },
          { name: "Samsung Galaxy", sales: 72 },
          { name: "MacBook Pro", sales: 64 },
          { name: "iPad Air", sales: 58 },
          { name: "AirPods Pro", sales: 95 },
          { name: "Dell XPS", sales: 42 },
          { name: "Apple Watch", sales: 67 },
          { name: "Surface Pro", sales: 35 },
          { name: "Google Pixel", sales: 28 },
          { name: "Sony WH-1000XM4", sales: 51 },
        ];

  const chartData = {
    labels: productData.map((p) => p.name),
    datasets: [
      {
        label: "Units Sold",
        data: productData.map((p) => p.sales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 84, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(199, 199, 199, 0.8)",
          "rgba(83, 102, 255, 0.8)",
          "rgba(255, 99, 255, 0.8)",
          "rgba(99, 255, 132, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 84, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(83, 102, 255, 1)",
          "rgba(255, 99, 255, 1)",
          "rgba(99, 255, 132, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "🏆 Top Selling Products",
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
            return `Sales: ${context.parsed.y} units`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
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
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="product-sales-chart" style={{ height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ProductSalesChart;
