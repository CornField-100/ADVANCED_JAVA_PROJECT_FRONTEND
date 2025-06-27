import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaBell, FaShoppingCart, FaTruck, FaCheckCircle } from "react-icons/fa";

const OrderNotifications = () => {
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    // Check for new orders every 30 seconds (for demo purposes)
    const checkForNewOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:3001/api/orders", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const orders = await response.json();
          const currentOrderCount = orders.length;

          // Check if there are new orders
          if (lastOrderCount > 0 && currentOrderCount > lastOrderCount) {
            const newOrdersCount = currentOrderCount - lastOrderCount;
            
            // Show notification for new orders
            toast.info(
              <div className="d-flex align-items-center">
                <FaShoppingCart className="me-2 text-primary" />
                <div>
                  <div className="fw-bold">New Order Alert!</div>
                  <div className="small">{newOrdersCount} new order(s) received</div>
                </div>
              </div>,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }

          setLastOrderCount(currentOrderCount);
        }
      } catch (error) {
        console.error("Error checking for new orders:", error);
      }
    };

    // Initial check
    checkForNewOrders();

    // Set up interval for periodic checks
    const interval = setInterval(checkForNewOrders, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  return null; // This component doesn't render anything visible
};

export default OrderNotifications;
