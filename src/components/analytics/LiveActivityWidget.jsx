import { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaUser,
  FaDollarSign,
  FaBox,
  FaClock,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const LiveActivityWidget = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 15420,
    activeUsers: 847,
    pendingOrders: 23,
    lowStockItems: 5,
  });

  useEffect(() => {
    // Generate real-time activity feed
    const generateActivity = () => {
      const activityTypes = [
        {
          icon: FaShoppingBag,
          color: "success",
          message: "New order placed",
          value: `$${(Math.random() * 500 + 50).toFixed(2)}`,
          user: "Customer",
        },
        {
          icon: FaUser,
          color: "primary",
          message: "New user registered",
          value: "",
          user: "New User",
        },
        {
          icon: FaDollarSign,
          color: "info",
          message: "Payment processed",
          value: `$${(Math.random() * 1000 + 100).toFixed(2)}`,
          user: "System",
        },
        {
          icon: FaBox,
          color: "warning",
          message: "Low stock alert",
          value: "",
          user: "Inventory",
        },
      ];

      const names = [
        "John Doe",
        "Sarah Johnson",
        "Mike Davis",
        "Emily Chen",
        "David Wilson",
      ];
      const products = [
        "iPhone 15",
        "MacBook Pro",
        "iPad Air",
        "AirPods Pro",
        "Apple Watch",
      ];

      const newActivity =
        activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];

      let detailedMessage = newActivity.message;
      if (newActivity.message === "New order placed") {
        detailedMessage = `${randomName} ordered ${randomProduct}`;
      } else if (newActivity.message === "New user registered") {
        detailedMessage = `${randomName} just signed up`;
      } else if (newActivity.message === "Low stock alert") {
        detailedMessage = `${randomProduct} is running low`;
      }

      return {
        ...newActivity,
        message: detailedMessage,
        timestamp: new Date(),
        id: Math.random().toString(36).substr(2, 9),
      };
    };

    // Initialize with some activities
    const initialActivities = Array.from({ length: 8 }, generateActivity);
    setActivities(initialActivities);

    // Update activities every 3-8 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);

      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats((prev) => ({
          totalSales: prev.totalSales + Math.floor(Math.random() * 200),
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
          pendingOrders: Math.max(
            0,
            prev.pendingOrders + Math.floor(Math.random() * 3) - 1
          ),
          lowStockItems: Math.max(
            0,
            prev.lowStockItems + Math.floor(Math.random() * 2) - 1
          ),
        }));
      }
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0 py-4">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-semibold d-flex align-items-center">
            <div className="icon-wrapper me-3">
              <FaClock className="text-primary" size={18} />
            </div>
            Live Business Activity Center
          </h5>
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
            <span className="status-dot me-2"></span>
            Real-time
          </span>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="row g-4">
          {/* Executive Quick Stats */}
          <div className="col-lg-4">
            <div className="stats-grid">
              <div className="row g-3">
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaDollarSign className="text-success" size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value text-success">
                        ${stats.totalSales.toLocaleString()}
                      </div>
                      <div className="stat-label">Total Sales</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaUser className="text-primary" size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value text-primary">
                        {stats.activeUsers}
                      </div>
                      <div className="stat-label">Active Users</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaShoppingBag className="text-warning" size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value text-warning">
                        {stats.pendingOrders}
                      </div>
                      <div className="stat-label">Pending Orders</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaBox className="text-danger" size={20} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value text-danger">
                        {stats.lowStockItems}
                      </div>
                      <div className="stat-label">Low Stock</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="col-lg-8">
            <div className="live-activity-feed">
              <div className="activity-header mb-4">
                <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                  <span className="status-dot me-2"></span>
                  Live Activity Stream
                </h6>
              </div>
              <div
                className="activity-stream"
                style={{ maxHeight: "320px", overflowY: "auto" }}
              >
                {activities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-content">
                        <div className={`activity-icon bg-${activity.color}`}>
                          <IconComponent size={16} />
                        </div>
                        <div className="activity-details">
                          <div className="activity-message">
                            {activity.message}
                          </div>
                          {activity.value && (
                            <div
                              className={`activity-value text-${activity.color}`}
                            >
                              {activity.value}
                            </div>
                          )}
                        </div>
                        <div className="activity-time">
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .icon-wrapper {
          width: 45px;
          height: 45px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(139, 92, 246, 0.1) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #22c55e 0%, #16a34a 100%);
          animation: pulse-dot 2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
        }

        @keyframes pulse-dot {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }

        .stats-grid {
          background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
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
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-icon {
          margin-bottom: 0.75rem;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .live-activity-feed {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          height: 100%;
        }

        .activity-stream {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }

        .activity-stream::-webkit-scrollbar {
          width: 4px;
        }

        .activity-stream::-webkit-scrollbar-track {
          background: transparent;
        }

        .activity-stream::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #64748b, #475569);
          border-radius: 2px;
        }

        .activity-item {
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .activity-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .activity-content:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.bg-success {
          background: linear-gradient(
            135deg,
            rgba(34, 197, 94, 0.1) 0%,
            rgba(22, 163, 74, 0.1) 100%
          );
          color: #16a34a;
        }

        .activity-icon.bg-primary {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.1) 0%,
            rgba(37, 99, 235, 0.1) 100%
          );
          color: #2563eb;
        }

        .activity-icon.bg-warning {
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.1) 0%,
            rgba(217, 119, 6, 0.1) 100%
          );
          color: #d97706;
        }

        .activity-icon.bg-info {
          background: linear-gradient(
            135deg,
            rgba(6, 182, 212, 0.1) 0%,
            rgba(8, 145, 178, 0.1) 100%
          );
          color: #0891b2;
        }

        .activity-details {
          flex-grow: 1;
        }

        .activity-message {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .activity-value {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
};

export default LiveActivityWidget;
