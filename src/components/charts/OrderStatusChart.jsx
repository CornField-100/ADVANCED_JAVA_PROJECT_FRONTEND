import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  FaBox,
  FaBolt,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
} from "react-icons/fa";

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
      "📦 Pending Orders",
      "⚡ Processing",
      "🚚 In Transit",
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
          "rgba(255, 193, 7, 0.9)", // Amber for pending
          "rgba(13, 110, 253, 0.9)", // Blue for processing
          "rgba(255, 87, 34, 0.9)", // Orange for shipped
          "rgba(40, 167, 69, 0.9)", // Green for delivered
          "rgba(220, 53, 69, 0.9)", // Red for cancelled
        ],
        borderColor: [
          "rgba(255, 193, 7, 1)",
          "rgba(13, 110, 253, 1)",
          "rgba(255, 87, 34, 1)",
          "rgba(40, 167, 69, 1)",
          "rgba(220, 53, 69, 1)",
        ],
        borderWidth: 4,
        hoverBorderWidth: 6,
        hoverOffset: 15,
        spacing: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        backgroundColor: "rgba(28, 33, 39, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${
              context.label
            }: ${context.parsed.toLocaleString()} orders (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: "easeOutQuart",
    },
    interaction: {
      intersect: false,
    },
  };

  const totalOrders = Object.values(defaultData).reduce((a, b) => a + b, 0);
  const deliveryRate = ((defaultData.delivered / totalOrders) * 100).toFixed(1);

  const statusItems = [
    {
      label: "Pending Orders",
      value: defaultData.pending,
      icon: FaBox,
      color: "#ffc107",
      bgColor: "rgba(255, 193, 7, 0.1)",
    },
    {
      label: "Processing",
      value: defaultData.processing,
      icon: FaBolt,
      color: "#0d6efd",
      bgColor: "rgba(13, 110, 253, 0.1)",
    },
    {
      label: "In Transit",
      value: defaultData.shipped,
      icon: FaTruck,
      color: "#ff5722",
      bgColor: "rgba(255, 87, 34, 0.1)",
    },
    {
      label: "Delivered",
      value: defaultData.delivered,
      icon: FaCheckCircle,
      color: "#28a745",
      bgColor: "rgba(40, 167, 69, 0.1)",
    },
    {
      label: "Cancelled",
      value: defaultData.cancelled,
      icon: FaTimesCircle,
      color: "#dc3545",
      bgColor: "rgba(220, 53, 69, 0.1)",
    },
  ];

  return (
    <div className="order-status-chart-container">
      <div className="row h-100">
        {/* Chart Section */}
        <div className="col-lg-8">
          <div
            className="chart-wrapper position-relative"
            style={{ height: "400px" }}
          >
            <Doughnut data={chartData} options={options} />

            {/* Center Content */}
            <div className="chart-center-content position-absolute top-50 start-50 translate-middle text-center">
              <div className="total-orders">
                <div className="total-number">
                  {totalOrders.toLocaleString()}
                </div>
                <div className="total-label">Total Orders</div>
              </div>
              <div className="delivery-rate mt-2">
                <FaArrowUp className="me-1" style={{ color: "#28a745" }} />
                <span className="rate-percentage">{deliveryRate}%</span>
                <div className="rate-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="col-lg-4">
          <div className="status-legend h-100 d-flex flex-column justify-content-center">
            <h6 className="legend-title mb-4">Order Distribution</h6>
            {statusItems.map((item, index) => {
              const percentage = ((item.value / totalOrders) * 100).toFixed(1);
              const IconComponent = item.icon;

              return (
                <div key={index} className="status-item mb-3">
                  <div className="status-header d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <div
                        className="status-icon-wrapper me-3"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <IconComponent
                          style={{ color: item.color }}
                          size={16}
                        />
                      </div>
                      <span className="status-label">{item.label}</span>
                    </div>
                    <div className="status-stats text-end">
                      <div className="status-value">
                        {item.value.toLocaleString()}
                      </div>
                      <div className="status-percentage">{percentage}%</div>
                    </div>
                  </div>
                  <div className="status-progress">
                    <div
                      className="progress-bar-custom"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-status-chart-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .chart-wrapper {
          padding: 1rem;
        }

        .chart-center-content {
          pointer-events: none;
          z-index: 10;
        }

        .total-orders {
          margin-bottom: 8px;
        }

        .total-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2c3e50;
          line-height: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .total-label {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .delivery-rate {
          padding: 8px 16px;
          background: rgba(40, 167, 69, 0.1);
          border-radius: 20px;
          display: inline-block;
        }

        .rate-percentage {
          font-size: 1.1rem;
          font-weight: 700;
          color: #28a745;
        }

        .rate-label {
          font-size: 0.7rem;
          color: #28a745;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-legend {
          padding: 1rem;
        }

        .legend-title {
          font-weight: 700;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .status-item {
          transition: all 0.3s ease;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .status-item:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateX(8px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .status-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .status-stats {
          min-width: 60px;
        }

        .status-value {
          font-weight: 700;
          color: #2c3e50;
          font-size: 1rem;
          line-height: 1;
        }

        .status-percentage {
          font-size: 0.75rem;
          color: #6c757d;
          font-weight: 600;
        }

        .status-progress {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-bar-custom {
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease-out;
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .order-status-chart-container {
            padding: 1.5rem;
          }

          .total-number {
            font-size: 2rem;
          }

          .status-legend {
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .chart-wrapper {
            height: 300px !important;
          }

          .total-number {
            font-size: 1.8rem;
          }

          .status-item {
            padding: 8px;
          }

          .status-icon-wrapper {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderStatusChart;
