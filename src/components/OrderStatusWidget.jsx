import { useState, useEffect } from "react";
import { 
  FaShoppingCart, 
  FaClock, 
  FaTruck, 
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle 
} from "react-icons/fa";

const OrderStatusWidget = ({ orderId, status, compact = false }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const statusConfig = {
    pending: {
      icon: FaClock,
      color: "warning",
      bgColor: "#fff3cd",
      textColor: "#856404",
      label: "Pending",
      description: "Order received and being processed"
    },
    processing: {
      icon: FaSpinner,
      color: "info",
      bgColor: "#d1ecf1",
      textColor: "#0c5460",
      label: "Processing",
      description: "Order is being prepared"
    },
    shipped: {
      icon: FaTruck,
      color: "primary",
      bgColor: "#d1ecf1",
      textColor: "#004085",
      label: "Shipped",
      description: "Order is on its way"
    },
    delivered: {
      icon: FaCheckCircle,
      color: "success",
      bgColor: "#d4edda",
      textColor: "#155724",
      label: "Delivered",
      description: "Order has been delivered"
    },
    cancelled: {
      icon: FaExclamationTriangle,
      color: "danger",
      bgColor: "#f8d7da",
      textColor: "#721c24",
      label: "Cancelled",
      description: "Order has been cancelled"
    },
    returned: {
      icon: FaExclamationTriangle,
      color: "secondary",
      bgColor: "#e2e3e5",
      textColor: "#383d41",
      label: "Returned",
      description: "Order has been returned"
    }
  };

  const config = statusConfig[currentStatus] || statusConfig.pending;
  const IconComponent = config.icon;

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  if (compact) {
    return (
      <span 
        className={`badge bg-${config.color} d-inline-flex align-items-center`}
        style={{ fontSize: "0.75rem" }}
      >
        <IconComponent size={12} className="me-1" />
        {config.label}
      </span>
    );
  }

  return (
    <div 
      className="order-status-widget p-3 rounded-3 border"
      style={{ 
        backgroundColor: config.bgColor,
        borderColor: config.bgColor,
        color: config.textColor
      }}
    >
      <div className="d-flex align-items-center mb-2">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ 
            width: "40px", 
            height: "40px", 
            backgroundColor: "rgba(255,255,255,0.8)" 
          }}
        >
          <IconComponent 
            size={20} 
            className={currentStatus === "processing" ? "fa-spin" : ""}
            style={{ color: config.textColor }}
          />
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-0 fw-bold">{config.label}</h6>
          <small className="opacity-75">{config.description}</small>
        </div>
      </div>
      
      {orderId && (
        <div className="mt-2">
          <small className="opacity-75">
            Order: <span className="fw-semibold">{orderId}</span>
          </small>
        </div>
      )}
    </div>
  );
};

export default OrderStatusWidget;
