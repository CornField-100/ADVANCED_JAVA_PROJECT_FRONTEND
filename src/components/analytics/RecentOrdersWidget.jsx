import { useState, useEffect } from "react";
import { format, subDays, parseISO } from "date-fns";
import {
  FaUser,
  FaShoppingCart,
  FaCreditCard,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaEye,
} from "react-icons/fa";

const RecentOrdersWidget = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent orders (in real app, fetch from backend)
    const mockOrders = [
      {
        id: "ORD-2025-001",
        customer: "John Smith",
        email: "john@example.com",
        items: 3,
        total: 299.99,
        status: "delivered",
        paymentMethod: "card",
        date: new Date().toISOString(),
        shippingAddress: "New York, NY",
      },
      {
        id: "ORD-2025-002",
        customer: "Sarah Johnson",
        email: "sarah@example.com",
        items: 1,
        total: 899.99,
        status: "shipped",
        paymentMethod: "paypal",
        date: subDays(new Date(), 1).toISOString(),
        shippingAddress: "Los Angeles, CA",
      },
      {
        id: "ORD-2025-003",
        customer: "Mike Wilson",
        email: "mike@example.com",
        items: 2,
        total: 599.5,
        status: "processing",
        paymentMethod: "apple",
        date: subDays(new Date(), 2).toISOString(),
        shippingAddress: "Chicago, IL",
      },
      {
        id: "ORD-2025-004",
        customer: "Emily Davis",
        email: "emily@example.com",
        items: 4,
        total: 1299.99,
        status: "pending",
        paymentMethod: "card",
        date: subDays(new Date(), 3).toISOString(),
        shippingAddress: "Houston, TX",
      },
      {
        id: "ORD-2025-005",
        customer: "David Brown",
        email: "david@example.com",
        items: 1,
        total: 199.99,
        status: "cancelled",
        paymentMethod: "google",
        date: subDays(new Date(), 4).toISOString(),
        shippingAddress: "Phoenix, AZ",
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", icon: <FaClock />, text: "Pending" },
      processing: {
        class: "bg-info",
        icon: <FaShoppingCart />,
        text: "Processing",
      },
      shipped: {
        class: "bg-primary",
        icon: <FaMapMarkerAlt />,
        text: "Shipped",
      },
      delivered: {
        class: "bg-success",
        icon: <FaCheckCircle />,
        text: "Delivered",
      },
      cancelled: { class: "bg-danger", icon: <FaTimes />, text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case "card":
        return "💳";
      case "paypal":
        return "🅿️";
      case "apple":
        return "🍎";
      case "google":
        return "🔍";
      case "crypto":
        return "₿";
      default:
        return "💳";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
        <p className="mt-3 text-muted">Loading recent orders...</p>
      </div>
    );
  }

  return (
    <div className="recent-orders-widget">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          <FaShoppingCart className="me-2 text-primary" />
          Recent Orders
        </h5>
        <span className="badge bg-primary">{orders.length} orders</span>
      </div>

      <div className="orders-list">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="order-item card border-0 shadow-sm mb-3"
            style={{
              transform: `translateY(${index * 5}px)`,
              animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="card-body p-3">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaUser className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{order.customer}</h6>
                      <small className="text-muted">{order.email}</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-2 text-center">
                  <div className="fw-bold text-success fs-6">
                    ${order.total.toFixed(2)}
                  </div>
                  <small className="text-muted">{order.items} items</small>
                </div>

                <div className="col-md-2 text-center">
                  {getStatusBadge(order.status)}
                </div>

                <div className="col-md-2 text-center">
                  <div className="payment-method">
                    <span className="fs-5 me-1">
                      {getPaymentIcon(order.paymentMethod)}
                    </span>
                    <small className="text-muted text-capitalize">
                      {order.paymentMethod}
                    </small>
                  </div>
                </div>

                <div className="col-md-2 text-center">
                  <small className="text-muted">
                    {format(new Date(order.date), "MMM dd, yyyy")}
                  </small>
                  <br />
                  <small className="text-muted">
                    {format(new Date(order.date), "HH:mm")}
                  </small>
                </div>

                <div className="col-md-1 text-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    title="View Order Details"
                  >
                    <FaEye />
                  </button>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-12">
                  <small className="text-muted">
                    <FaMapMarkerAlt className="me-1" />
                    {order.shippingAddress}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-outline-primary">View All Orders</button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .order-item {
          transition: all 0.3s ease;
        }

        .order-item:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default RecentOrdersWidget;
