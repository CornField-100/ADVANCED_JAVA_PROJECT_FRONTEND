import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTruck,
  FaCalendarAlt,
  FaReceipt,
  FaEnvelope,
  FaPrint,
  FaDownload,
  FaHome,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCreditCard,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get order data from location state or localStorage
    if (location.state?.order) {
      setOrder(location.state.order);
      setIsLoading(false);
    } else {
      // Fallback to localStorage
      const lastOrder = localStorage.getItem("lastOrder");
      if (lastOrder) {
        setOrder(JSON.parse(lastOrder));
        setIsLoading(false);
      } else {
        // No order found, redirect to home
        toast.error("No order found");
        navigate("/");
      }
    }
  }, [location.state, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    if (!order) return;

    const receiptData = {
      ...order,
      downloadedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.orderId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully!");
  };

  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  if (isLoading || !order) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="order-confirmation"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "2rem",
      }}
    >
      <div className="container py-5">
        {/* Success Header */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <div
              className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "80px", height: "80px" }}
            >
              <FaCheckCircle size={40} />
            </div>
          </div>
          <h1 className="display-4 fw-bold text-success mb-2">
            Order Confirmed!
          </h1>
          <p className="lead text-muted mb-3">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
          <div className="bg-white rounded-4 shadow-sm p-4 d-inline-block">
            <div className="text-muted mb-1">Order Number</div>
            <div className="h4 fw-bold text-primary mb-0">{order.orderId}</div>
          </div>
        </div>

        <div className="row">
          {/* Order Details */}
          <div className="col-lg-8">
            {/* Order Status Timeline */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">
                  <FaTruck className="me-2 text-primary" />
                  Order Timeline
                </h5>
                <div className="timeline">
                  <div className="timeline-item active">
                    <div className="timeline-marker bg-success"></div>
                    <div className="timeline-content">
                      <h6 className="mb-1">Order Confirmed</h6>
                      <small className="text-muted">Just now</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker bg-light"></div>
                    <div className="timeline-content">
                      <h6 className="mb-1">Processing</h6>
                      <small className="text-muted">Within 2-4 hours</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker bg-light"></div>
                    <div className="timeline-content">
                      <h6 className="mb-1">Shipped</h6>
                      <small className="text-muted">1-2 business days</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker bg-light"></div>
                    <div className="timeline-content">
                      <h6 className="mb-1">Delivered</h6>
                      <small className="text-muted">
                        {estimatedDeliveryDate.toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">
                  <FaShoppingBag className="me-2 text-primary" />
                  Order Items
                </h5>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="d-flex align-items-center mb-3 p-3 bg-light rounded-3"
                    >
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/80"}
                        alt={item.title}
                        className="rounded me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.title}</h6>
                        <p className="text-muted mb-1">{item.brand}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="badge bg-secondary">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  Delivery Information
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Shipping Address</h6>
                      <p className="mb-0">
                        {order.shippingInfo.firstName}{" "}
                        {order.shippingInfo.lastName}
                        <br />
                        {order.shippingInfo.address}
                        <br />
                        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                        {order.shippingInfo.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="text-muted mb-1">Estimated Delivery</h6>
                      <p className="mb-0 fw-semibold">
                        <FaCalendarAlt className="me-2 text-primary" />
                        {estimatedDeliveryDate.toLocaleDateString()}
                      </p>
                      <small className="text-muted">3-5 business days</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            {/* Order Summary */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-header bg-primary text-white text-center border-0 rounded-top-4">
                <h5 className="mb-0">
                  <FaReceipt className="me-2" />
                  Order Summary
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span
                    className={
                      order.shipping === 0 ? "text-success fw-bold" : ""
                    }
                  >
                    {order.shipping === 0
                      ? "FREE"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 text-success">
                  <span>Total Paid:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>

                <hr />

                {/* Payment Method */}
                <div className="mb-3">
                  <h6 className="text-muted mb-2">
                    <FaCreditCard className="me-2" />
                    Payment Method
                  </h6>
                  <p className="mb-0">
                    {order.paymentMethod === "paypal" && "PayPal"}
                    {order.paymentMethod === "card" && "Credit/Debit Card"}
                    {order.paymentMethod === "apple" && "Apple Pay"}
                    {order.paymentMethod === "google" && "Google Pay"}
                    {order.paymentMethod === "crypto" && "Cryptocurrency"}
                  </p>
                </div>

                {/* Actions */}
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handlePrint}
                  >
                    <FaPrint className="me-2" />
                    Print Receipt
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleDownloadReceipt}
                  >
                    <FaDownload className="me-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4 text-center">
                <h6 className="card-title mb-3">What's Next?</h6>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    <FaHome className="me-2" />
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => {
                      // In a real app, this would navigate to order tracking
                      toast.info("Order tracking would be implemented here");
                    }}
                  >
                    <FaTruck className="me-2" />
                    Track Order
                  </button>
                </div>
              </div>
            </div>

            {/* Email Notification */}
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 text-center">
                <FaEnvelope size={32} className="text-primary mb-3" />
                <h6 className="card-title">Confirmation Email Sent</h6>
                <p className="text-muted mb-0">
                  We've sent a confirmation email to
                  <br />
                  <strong>{order.shippingInfo.email}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Review Prompt */}
        <div className="text-center mt-5">
          <div className="card shadow-sm border-0 rounded-4 bg-light">
            <div className="card-body p-4">
              <h5 className="card-title">
                <FaStar className="me-2 text-warning" />
                Love your purchase?
              </h5>
              <p className="card-text text-muted">
                Help other customers by leaving a review once your order
                arrives.
              </p>
              <button
                className="btn btn-warning"
                onClick={() =>
                  toast.info("Review system would be implemented here")
                }
              >
                <FaStar className="me-2" />
                Leave a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e9ecef;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 30px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -23px;
          top: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid white;
        }

        .timeline-item.active .timeline-marker {
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
        }

        .timeline-content h6 {
          margin-bottom: 5px;
          font-weight: 600;
        }

        @media print {
          .btn,
          .card-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
