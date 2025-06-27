import { useState, useEffect } from "react";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GeographicAnalytics = () => {
  const [salesByRegion, setSalesByRegion] = useState({
    labels: [
      "North America",
      "Europe",
      "Asia Pacific",
      "South America",
      "Africa",
      "Middle East",
    ],
    datasets: [
      {
        label: "Sales Revenue ($K)",
        data: [450, 320, 280, 150, 90, 120],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  });

  const [topCities, setTopCities] = useState([
    {
      city: "New York",
      country: "USA",
      orders: 1247,
      revenue: 234500,
      flag: "🇺🇸",
    },
    { city: "London", country: "UK", orders: 892, revenue: 189200, flag: "🇬🇧" },
    {
      city: "Tokyo",
      country: "Japan",
      orders: 756,
      revenue: 167800,
      flag: "🇯🇵",
    },
    {
      city: "Sydney",
      country: "Australia",
      orders: 634,
      revenue: 142300,
      flag: "🇦🇺",
    },
    {
      city: "Toronto",
      country: "Canada",
      orders: 578,
      revenue: 128900,
      flag: "🇨🇦",
    },
    {
      city: "Berlin",
      country: "Germany",
      orders: 523,
      revenue: 115600,
      flag: "🇩🇪",
    },
    {
      city: "Singapore",
      country: "Singapore",
      orders: 467,
      revenue: 98700,
      flag: "🇸🇬",
    },
    { city: "Dubai", country: "UAE", orders: 389, revenue: 87400, flag: "🇦🇪" },
  ]);

  const [timeZoneActivity, setTimeZoneActivity] = useState({
    datasets: [
      {
        label: "Order Activity by Time Zone",
        data: [
          { x: -8, y: 45, r: 15 }, // PST
          { x: -5, y: 68, r: 20 }, // EST
          { x: 0, y: 52, r: 18 }, // GMT
          { x: 1, y: 38, r: 14 }, // CET
          { x: 8, y: 42, r: 16 }, // CST
          { x: 9, y: 35, r: 13 }, // JST
        ],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTopCities((prev) =>
        prev.map((city) => ({
          ...city,
          orders: city.orders + Math.floor(Math.random() * 5),
          revenue: city.revenue + Math.floor(Math.random() * 1000),
        }))
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const regionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "🌍 Global Sales by Region",
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
        callbacks: {
          label: function (context) {
            return `Revenue: $${context.parsed.y}K`;
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
          color: "#6B7280",
          callback: function (value) {
            return "$" + value + "K";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          maxRotation: 45,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "🕐 Activity by Time Zone",
        font: {
          size: 14,
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
        callbacks: {
          title: function () {
            return "Time Zone Activity";
          },
          label: function (context) {
            const timezones = {
              "-8": "PST",
              "-5": "EST",
              0: "GMT",
              1: "CET",
              8: "CST",
              9: "JST",
            };
            return `${timezones[context.parsed.x]}: ${
              context.parsed.y
            } orders/hour`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "UTC Offset",
          color: "#6B7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        title: {
          display: true,
          text: "Orders/Hour",
          color: "#6B7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="row">
      {/* Global Sales Chart */}
      <div className="col-lg-8 mb-4">
        <div className="card border-0 shadow-lg h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">🌍</span>
                Geographic Analytics
              </h5>
              <div className="badge bg-white text-dark px-3 py-2 rounded-pill">
                Last 30 Days
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div style={{ height: "300px" }}>
              <Bar data={salesByRegion} options={regionOptions} />
            </div>
            <div className="mt-4 pt-3 border-top">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="text-primary fw-bold fs-5">125</div>
                  <div className="text-muted small">Countries</div>
                </div>
                <div className="col-md-3">
                  <div className="text-success fw-bold fs-5">$1.41M</div>
                  <div className="text-muted small">Global Revenue</div>
                </div>
                <div className="col-md-3">
                  <div className="text-info fw-bold fs-5">8,947</div>
                  <div className="text-muted small">International Orders</div>
                </div>
                <div className="col-md-3">
                  <div className="text-warning fw-bold fs-5">78%</div>
                  <div className="text-muted small">Mobile Traffic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Zone Activity */}
      <div className="col-lg-4 mb-4">
        <div className="card border-0 shadow-lg h-100">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0">Time Zone Activity</h5>
          </div>
          <div className="card-body">
            <div style={{ height: "200px" }}>
              <Scatter data={timeZoneActivity} options={scatterOptions} />
            </div>
            <div className="mt-3 pt-3 border-top">
              <div className="text-center">
                <div className="text-primary fw-bold fs-6">24/7</div>
                <div className="text-muted small">Global Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Cities Table */}
      <div className="col-12">
        <div className="card border-0 shadow-lg">
          <div
            className="card-header bg-gradient text-white border-0"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "0.375rem 0.375rem 0 0",
            }}
          >
            <h5 className="mb-0 d-flex align-items-center">
              <span className="me-2">🏙️</span>
              Top Performing Cities
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 fw-bold">Rank</th>
                    <th className="border-0 fw-bold">City</th>
                    <th className="border-0 fw-bold">Orders</th>
                    <th className="border-0 fw-bold">Revenue</th>
                    <th className="border-0 fw-bold">Avg. Order</th>
                    <th className="border-0 fw-bold">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((city, index) => (
                    <tr
                      key={city.city}
                      className={index < 3 ? "table-warning bg-opacity-25" : ""}
                    >
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          {index < 3 && (
                            <span className="me-2 fs-5">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </span>
                          )}
                          <span className="fw-bold">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <span className="me-2 fs-5">{city.flag}</span>
                          <div>
                            <div className="fw-semibold text-dark">
                              {city.city}
                            </div>
                            <div className="text-muted small">
                              {city.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <span className="fw-bold text-primary">
                          {city.orders.toLocaleString()}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className="fw-bold text-success">
                          ${city.revenue.toLocaleString()}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className="text-dark">
                          ${Math.round(city.revenue / city.orders)}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-success bg-opacity-10 text-success border border-success">
                          +{(Math.random() * 15 + 5).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicAnalytics;
