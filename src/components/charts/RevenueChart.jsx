import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data }) => {
  const defaultData = data || [
    12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000,
    45000,
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Calculate metrics
  const currentMonth = defaultData[defaultData.length - 1];
  const previousMonth = defaultData[defaultData.length - 2];
  const monthlyGrowth = (
    ((currentMonth - previousMonth) / previousMonth) *
    100
  ).toFixed(1);
  const totalRevenue = defaultData.reduce((a, b) => a + b, 0);
  const averageRevenue = Math.round(totalRevenue / defaultData.length);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Revenue",
        data: defaultData,
        borderColor: "rgba(102, 126, 234, 1)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(102, 126, 234, 0.3)");
          gradient.addColorStop(0.5, "rgba(102, 126, 234, 0.1)");
          gradient.addColorStop(1, "rgba(102, 126, 234, 0)");
          return gradient;
        },
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(102, 126, 234, 1)",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 3,
        pointRadius: 7,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: "rgba(102, 126, 234, 1)",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 4,
      },
      {
        label: "Revenue Target",
        data: Array(12).fill(30000),
        borderColor: "rgba(255, 193, 7, 0.8)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [8, 4],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false, // Custom legend
      },
      tooltip: {
        backgroundColor: "rgba(28, 33, 39, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(102, 126, 234, 0.5)",
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 16,
        callbacks: {
          title: function (context) {
            return `${context[0].label} 2024`;
          },
          label: function (context) {
            if (context.datasetIndex === 0) {
              return `Revenue: $${context.parsed.y.toLocaleString()}`;
            } else {
              return `Target: $${context.parsed.y.toLocaleString()}`;
            }
          },
          afterBody: function (context) {
            const current = context[0].parsed.y;
            const target = 30000;
            const performance = ((current / target) * 100).toFixed(1);
            return `Performance: ${performance}% of target`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.08)",
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return "$" + value / 1000 + "K";
          },
          font: {
            size: 12,
            weight: "500",
          },
          color: "#6c757d",
          padding: 8,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: "600",
          },
          color: "#495057",
          padding: 8,
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: "rgba(102, 126, 234, 1)",
        hoverBorderColor: "#ffffff",
      },
    },
  };

  return (
    <div className="revenue-chart-container">
      {/* Header with Stats */}
      <div className="chart-header mb-4">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h4 className="chart-title mb-2">
              <FaDollarSign className="me-2 text-primary" />
              Revenue Analytics
            </h4>
            <p className="chart-subtitle text-muted mb-0">
              Monthly performance tracking and trend analysis
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row text-center">
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value">
                    ${(totalRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value">
                    ${(averageRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className="stat-label">Monthly Avg</div>
                </div>
              </div>
              <div className="col-4">
                <div className="stat-card">
                  <div className="stat-value d-flex align-items-center justify-content-center">
                    {monthlyGrowth > 0 ? (
                      <FaArrowUp className="me-1 text-success" />
                    ) : (
                      <FaArrowDown className="me-1 text-danger" />
                    )}
                    {Math.abs(monthlyGrowth)}%
                  </div>
                  <div className="stat-label">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper" style={{ height: "450px" }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div className="chart-legend mt-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="legend-item d-flex align-items-center me-4">
              <div
                className="legend-color"
                style={{ backgroundColor: "rgba(102, 126, 234, 1)" }}
              ></div>
              <span className="legend-text">Monthly Revenue</span>
            </div>
          </div>
          <div className="col-auto">
            <div className="legend-item d-flex align-items-center">
              <div
                className="legend-color legend-dashed"
                style={{ backgroundColor: "rgba(255, 193, 7, 0.8)" }}
              ></div>
              <span className="legend-text">Revenue Target</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .revenue-chart-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          height: 100%;
        }

        .chart-header {
          border-bottom: 2px solid rgba(0, 0, 0, 0.05);
          padding-bottom: 1.5rem;
        }

        .chart-title {
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .chart-subtitle {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .stat-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2c3e50;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chart-wrapper {
          padding: 1rem 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .chart-legend {
          text-align: center;
        }

        .legend-item {
          margin-bottom: 0.5rem;
        }

        .legend-color {
          width: 20px;
          height: 4px;
          border-radius: 2px;
          margin-right: 8px;
        }

        .legend-color.legend-dashed {
          background-image: linear-gradient(
            to right,
            rgba(255, 193, 7, 0.8) 50%,
            transparent 50%
          );
          background-size: 8px 4px;
          background-repeat: repeat-x;
        }

        .legend-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .revenue-chart-container {
            padding: 1.5rem;
          }

          .chart-title {
            font-size: 1.3rem;
          }

          .stat-value {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 768px) {
          .chart-wrapper {
            height: 350px !important;
          }

          .stat-card {
            margin-bottom: 1rem;
            padding: 0.8rem;
          }

          .stat-value {
            font-size: 1.1rem;
          }

          .chart-header .row {
            text-align: center;
          }

          .chart-legend .row {
            flex-direction: column;
            align-items: center;
          }

          .legend-item {
            margin-bottom: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RevenueChart;
