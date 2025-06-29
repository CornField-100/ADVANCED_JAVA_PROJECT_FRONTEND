import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, getCurrentUser } from "../utils/auth";
import { BASE_URL } from "../utils/api";
import { testBackendConnection } from "../utils/backendTest";
import { toast } from "react-toastify";
import { format, subDays } from "date-fns";
import {
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaEye,
  FaTrash,
  FaDownload,
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBan,
  FaUndo,
  FaChartLine,
  FaDollarSign,
  FaCalendarAlt,
  FaFileExport,
  FaPrint,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    testing: false,
    lastChecked: null,
    error: null
  });

  // Check admin access and initialize page
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Test backend connectivity first, then load orders
  useEffect(() => {
    const initializeOrdersPage = async () => {
      try {
        setLoading(true);
        setBackendStatus(prev => ({ ...prev, testing: true }));
        
        // First, test backend connectivity
        console.log("🔍 Testing backend connection for orders...");
        const connectionTest = await testBackendConnection();
        
        if (!connectionTest.success) {
          setBackendStatus({
            connected: false,
            testing: false,
            lastChecked: new Date(),
            error: connectionTest.error
          });
          
          toast.error(
            <div>
              <div className="fw-bold">🚫 Backend Unreachable</div>
              <div className="small">Error: {connectionTest.error}</div>
              <div className="small mt-1">
                <strong>Troubleshooting:</strong>
                <br />• Check if backend server is running
                <br />• Verify BASE_URL: {BASE_URL}
                <br />• Check CORS configuration
                <br />• Check network connectivity
              </div>
            </div>
          );
          
          setOrders([]);
          setLoading(false);
          return;
        }

        // Backend is reachable, now load orders
        console.log("✅ Backend connection successful, loading orders...");
        setBackendStatus({
          connected: true,
          testing: false,
          lastChecked: new Date(),
          error: null
        });
        
        await loadOrders();
        
      } catch (error) {
        console.error("❌ Orders page initialization failed:", error);
        setBackendStatus({
          connected: false,
          testing: false,
          lastChecked: new Date(),
          error: error.message
        });
        
        toast.error(
          <div>
            <div className="fw-bold">❌ Initialization Failed</div>
            <div className="small">{error.message}</div>
          </div>
        );
        
        setLoading(false);
      }
    };

    initializeOrdersPage();
  }, [navigate]);

  // Load orders data with enhanced error handling
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("❌ No authentication token found");
        navigate("/login");
        return;
      }

      console.log("📡 Fetching orders from:", `${BASE_URL}/api/orders`);
      
      const response = await fetch(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Orders API response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("📊 Orders backend response received:", responseData);
        
        // Handle different response formats
        let ordersArray;
        
        if (Array.isArray(responseData)) {
          // Direct array format
          ordersArray = responseData;
          console.log("📊 Orders data received (array format):", ordersArray.length, "orders");
        } else if (responseData && Array.isArray(responseData.orders)) {
          // Object with orders array format
          ordersArray = responseData.orders;
          console.log("📊 Orders data received (object format):", ordersArray.length, "orders");
        } else {
          console.error("❌ Backend returned invalid orders format:", responseData);
          throw new Error(`Backend returned invalid data format. Expected array or object with orders property but got: ${JSON.stringify(responseData)}`);
        }

        // Transform backend data to match frontend format
        const formattedOrders = ordersArray.map((order) => ({
          id: order.orderId || order._id || order.id,
          customer: {
            name: `${order.shippingInfo?.firstName || order.firstName || "Unknown"} ${
              order.shippingInfo?.lastName || order.lastName || "User"
            }`,
            email: order.shippingInfo?.email || order.email || order.customerEmail || "no-email@example.com",
            id: order.userId || order.customerId || order.user || "unknown",
          },
          items: (order.items || order.orderItems || []).map((item) => ({
            name: item.title || item.name || item.productName || "Unknown Item",
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price || item.unitPrice) || 0,
            id: item._id || item.id || item.productId
          })),
          total: parseFloat(order.total || order.totalAmount || order.orderTotal) || 0,
          status: order.status || order.orderStatus || "pending",
          paymentMethod: order.paymentMethod || order.payment?.method || "card",
          paymentStatus: order.paymentStatus || order.payment?.status || "paid",
          date: order.orderDate || order.createdAt || order.date || new Date().toISOString(),
          shippingAddress: order.shippingInfo
            ? `${order.shippingInfo.address || ""}, ${
                order.shippingInfo.city || ""
              }, ${order.shippingInfo.state || ""} ${
                order.shippingInfo.zipCode || order.shippingInfo.postalCode || ""
              }`.trim()
            : order.shippingAddress || "No address provided",
          trackingNumber: order.trackingNumber || order.tracking || null,
          notes: order.orderNotes || order.notes || order.specialInstructions || "",
          // Enhanced order data
          deliveryDate: order.deliveryDate || order.estimatedDelivery || null,
          orderSource: order.orderSource || "web",
          discount: parseFloat(order.discount || order.discountAmount) || 0,
          tax: parseFloat(order.tax || order.taxAmount) || 0,
          shipping: parseFloat(order.shipping || order.shippingCost) || 0
        }));

        setOrders(formattedOrders);
        setLastOrderCount(formattedOrders.length);
        
        toast.success(
          <div>
            <div className="fw-bold">✅ Orders Loaded</div>
            <div className="small">
              Loaded {formattedOrders.length} orders successfully
            </div>
          </div>
        );
        
      } else if (response.status === 401) {
        console.log("❌ Authentication failed - redirecting to login");
        toast.error("❌ Authentication failed - Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (response.status === 403) {
        console.log("❌ Access forbidden - insufficient permissions");
        toast.error("❌ Access denied - Admin privileges required");
        navigate("/");
      } else if (response.status === 404) {
        console.log("❌ Orders API endpoint not found");
        toast.error(
          <div>
            <div className="fw-bold">❌ API Endpoint Missing</div>
            <div className="small">The backend server is running but missing the /api/orders endpoint</div>
            <div className="small mt-1">
              <strong>Backend URL:</strong> {BASE_URL}
              <br />
              <strong>Full endpoint:</strong> {BASE_URL}/api/orders
              <br />
              <strong>Status:</strong> 404 Not Found
            </div>
            <div className="small mt-2">
              <strong>Solution:</strong> Add the orders endpoint to your backend server
            </div>
          </div>
        );
        setOrders([]);
      } else {
        const errorText = await response.text();
        console.log("❌ Orders API error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
    } catch (error) {
      console.error("❌ Error loading orders:", error);
      
      // Provide specific error messages based on error type
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error(
          <div>
            <div className="fw-bold">🚫 Network Connection Failed</div>
            <div className="small">Cannot reach backend server</div>
            <div className="small mt-1">
              <strong>Check:</strong>
              <br />• Backend server is running
              <br />• URL: {BASE_URL}
              <br />• Network connectivity
              <br />• CORS configuration
            </div>
          </div>
        );
      } else {
        toast.error(
          <div>
            <div className="fw-bold">❌ Error Loading Orders</div>
            <div className="small">{error.message}</div>
          </div>
        );
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced refresh with connection testing and loading feedback
  const refreshOrders = async () => {
    const refreshToast = toast.loading("🔄 Testing connection and synchronizing order data...");
    
    try {
      // First test backend connectivity
      const connectionTest = await testBackendConnection();
      
      if (!connectionTest.success) {
        toast.update(refreshToast, {
          render: (
            <div>
              <div className="fw-bold">🚫 Backend Unreachable</div>
              <div className="small">Error: {connectionTest.error}</div>
            </div>
          ),
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        
        setBackendStatus({
          connected: false,
          testing: false,
          lastChecked: new Date(),
          error: connectionTest.error
        });
        return;
      }

      // Backend is reachable, update status
      setBackendStatus({
        connected: true,
        testing: false,
        lastChecked: new Date(),
        error: null
      });

      // Now fetch orders
      const token = localStorage.getItem("token");
      console.log("🔄 Refreshing orders data...");
      
      const response = await fetch(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("🔄 Refresh response data:", responseData);
        
        // Handle different response formats
        let ordersArray;
        if (Array.isArray(responseData)) {
          ordersArray = responseData;
        } else if (responseData && Array.isArray(responseData.orders)) {
          ordersArray = responseData.orders;
        } else {
          throw new Error("Invalid response format");
        }
        
        const formattedOrders = ordersArray.map((order) => ({
          id: order.orderId || order._id || order.id,
          customer: {
            name: `${order.shippingInfo?.firstName || order.firstName || "Unknown"} ${
              order.shippingInfo?.lastName || order.lastName || "User"
            }`,
            email: order.shippingInfo?.email || order.email || order.customerEmail || "no-email@example.com",
            id: order.userId || order.customerId || order.user || "unknown",
          },
          items: (order.items || order.orderItems || []).map((item) => ({
            name: item.title || item.name || item.productName || "Unknown Item",
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price || item.unitPrice) || 0,
          })),
          total: parseFloat(order.total || order.totalAmount || order.orderTotal) || 0,
          status: order.status || order.orderStatus || "pending",
          paymentMethod: order.paymentMethod || order.payment?.method || "card",
          paymentStatus: order.paymentStatus || order.payment?.status || "paid",
          date: order.orderDate || order.createdAt || order.date || new Date().toISOString(),
          shippingAddress: order.shippingInfo
            ? `${order.shippingInfo.address || ""}, ${
                order.shippingInfo.city || ""
              }, ${order.shippingInfo.state || ""} ${
                order.shippingInfo.zipCode || order.shippingInfo.postalCode || ""
              }`.trim()
            : order.shippingAddress || "No address provided",
          trackingNumber: order.trackingNumber || order.tracking || null,
          notes: order.orderNotes || order.notes || order.specialInstructions || "",
        }));

        setOrders(formattedOrders);
        toast.dismiss(refreshToast);
        toast.success(
          <div>
            <div className="fw-bold">✅ Data Synchronized</div>
            <div className="small">Updated {formattedOrders.length} order records</div>
          </div>
        );
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      toast.dismiss(refreshToast);
      toast.error(
        <div>
          <div className="fw-bold">❌ Sync Failed</div>
          <div className="small">Using cached data</div>
        </div>
      );
    }
  };
  // 🔥 NEW: View order details
  const viewOrderDetails = (order) => {
    let formattedDate;
    try {
      formattedDate = format(new Date(order.date), "PPpp");
    } catch (e) {
      formattedDate = "Invalid Date";
    }

    const orderDetails = `
🛍️ ORDER DETAILS

📋 Order ID: ${order.id}
👤 Customer: ${order.customer.name}
📧 Email: ${order.customer.email}
📅 Date: ${formattedDate}

🛒 Items (${order.items.length}):
${order.items
  .map((item) => `• ${item.name} x${item.quantity} - $${item.price.toFixed(2)}`)
  .join("\n")}

💰 Total: $${order.total.toFixed(2)}
📦 Status: ${order.status.toUpperCase()}
💳 Payment: ${order.paymentMethod} (${order.paymentStatus})

🏠 Shipping Address:
${order.shippingAddress}

${order.trackingNumber ? `📍 Tracking: ${order.trackingNumber}` : ""}
${order.notes ? `📝 Notes: ${order.notes}` : ""}
    `;

    alert(orderDetails);
  };

  // Auto-refresh orders every 30 seconds for real-time updates
  useEffect(() => {
    if (!orders.length) return; // Don't auto-refresh if no orders loaded yet

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const ordersData = await response.json();

          // Only update if there are changes
          if (ordersData.length !== orders.length) {
            const formattedOrders = ordersData.map((order) => ({
              id: order.orderId || order._id,
              customer: {
                name: `${order.shippingInfo?.firstName || "Unknown"} ${
                  order.shippingInfo?.lastName || "User"
                }`,
                email: order.shippingInfo?.email || "no-email@example.com",
                id: order.userId || order.customerId || "unknown",
              },
              items: (order.items || []).map((item) => ({
                name: item.title || item.name || "Unknown Item",
                quantity: item.quantity || 1,
                price: parseFloat(item.price) || 0,
              })),
              total: parseFloat(order.total) || 0,
              status: order.status || "pending",
              paymentMethod: order.paymentMethod || "card",
              paymentStatus: order.paymentStatus || "paid",
              date:
                order.orderDate || order.createdAt || new Date().toISOString(),
              shippingAddress: order.shippingInfo
                ? `${order.shippingInfo.address || ""}, ${
                    order.shippingInfo.city || ""
                  }, ${order.shippingInfo.state || ""} ${
                    order.shippingInfo.zipCode || ""
                  }`.trim()
                : "No address provided",
              trackingNumber: order.trackingNumber || null,
              notes: order.orderNotes || order.notes || "",
            }));

            setOrders(formattedOrders);
          }
        }
      } catch (error) {
        // Silent fail for auto-refresh
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [orders.length]);

  // 🔔 NEW: Notification system for new orders
  useEffect(() => {
    if (orders.length > lastOrderCount && lastOrderCount > 0) {
      const newOrdersCount = orders.length - lastOrderCount;

      // Show notification for new orders
      toast.info(
        <div>
          <div className="fw-bold">🛍️ New Order Alert!</div>
          <div className="small">
            {newOrdersCount} new order{newOrdersCount > 1 ? "s" : ""} received
          </div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #17a2b8, #138496)",
            color: "white",
          },
          autoClose: 5000,
        }
      );

      // Play notification sound (optional)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Order Received!", {
          body: `${newOrdersCount} new order${
            newOrdersCount > 1 ? "s" : ""
          } in your store`,
          icon: "/vite.svg",
        });
      }
    }

    setLastOrderCount(orders.length);
  }, [orders.length, lastOrderCount]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        class: "bg-warning text-dark",
        icon: <FaClock />,
        text: "Pending",
      },
      processing: { class: "bg-info", icon: <FaSync />, text: "Processing" },
      shipped: { class: "bg-primary", icon: <FaTruck />, text: "Shipped" },
      delivered: {
        class: "bg-success",
        icon: <FaCheckCircle />,
        text: "Delivered",
      },
      cancelled: { class: "bg-danger", icon: <FaBan />, text: "Cancelled" },
      returned: { class: "bg-secondary", icon: <FaUndo />, text: "Returned" },
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
    const icons = {
      card: "💳",
      paypal: "🔵",
      apple: "🍎",
      google: "🔴",
      crypto: "₿",
    };
    return icons[method] || "💳";
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const loadingToast = toast.loading("Updating order status...");

      // Update status in backend
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to update order status`
        );
      }

      const updatedOrder = await response.json();

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Success feedback
      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <div className="fw-bold">✅ Status Updated!</div>
          <div className="small">
            Order {orderId} → {newStatus}
          </div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
          },
        }
      );
    } catch (error) {
      toast.error(
        <div>
          <div className="fw-bold">❌ Update Failed</div>
          <div className="small">{error.message}</div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            color: "white",
          },
        }
      );

      // Don't update local state on error - keep original status
    }
  };

  const deleteOrder = async (orderId) => {
    if (
      !window.confirm(
        `⚠️ Are you sure you want to permanently delete order ${orderId}?\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const loadingToast = toast.loading("Deleting order...");

      // Delete from backend
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to delete order`
        );
      }

      console.log("✅ Order deleted successfully from backend");

      // Remove from local state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      // Success feedback
      toast.dismiss(loadingToast);
      toast.success(
        <div>
          <div className="fw-bold">🗑️ Order Deleted!</div>
          <div className="small">Order {orderId} removed permanently</div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #6c757d, #495057)",
            color: "white",
          },
        }
      );
    } catch (error) {
      toast.error(
        <div>
          <div className="fw-bold">❌ Delete Failed</div>
          <div className="small">{error.message}</div>
        </div>,
        {
          style: {
            background: "linear-gradient(135deg, #dc3545, #c82333)",
            color: "white",
          },
        }
      );
    }
  };

  const exportOrders = () => {
    const data = filteredOrders.map((order) => ({
      id: order.id,
      customer: order.customer.name,
      email: order.customer.email,
      total: order.total,
      status: order.status,
      date: order.date,
      items: order.items.length,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Orders exported successfully!");
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;
      const matchesSearch =
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case "total":
          aVal = a.total;
          bVal = b.total;
          break;
        case "customer":
          aVal = a.customer.name;
          bVal = b.customer.name;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
        <p className="mt-3">Loading order management...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="h3 mb-1">
                    <FaShoppingCart className="me-2" />
                    Order Management
                  </h1>
                  <p className="mb-0 opacity-75">
                    Manage and track all customer orders
                  </p>
                </div>
                <div className="text-end">
                  <div className="badge bg-white text-primary px-3 py-2 rounded-pill">
                    {orderStats.total} Total Orders
                  </div>
                  <div className={`badge text-white px-3 py-2 rounded-pill ms-2 ${
                    backendStatus.connected ? 'bg-success' : 'bg-danger'
                  }`}>
                    {backendStatus.connected ? '✅ Backend Connected' : '❌ Backend Offline'}
                  </div>
                  <div className="badge bg-info text-white px-3 py-2 rounded-pill ms-2">
                    🌐 {BASE_URL.replace('http://', '').replace('https://', '')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <FaShoppingCart size={24} />
              </div>
              <h4 className="fw-bold">{orderStats.total}</h4>
              <small className="text-muted">Total Orders</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <FaClock size={24} />
              </div>
              <h4 className="fw-bold">{orderStats.pending}</h4>
              <small className="text-muted">Pending</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <FaSync size={24} />
              </div>
              <h4 className="fw-bold">{orderStats.processing}</h4>
              <small className="text-muted">Processing</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <FaTruck size={24} />
              </div>
              <h4 className="fw-bold">{orderStats.shipped}</h4>
              <small className="text-muted">Shipped</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <FaCheckCircle size={24} />
              </div>
              <h4 className="fw-bold">{orderStats.delivered}</h4>
              <small className="text-muted">Delivered</small>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <FaDollarSign size={24} />
              </div>
              <h4 className="fw-bold">
                ${orderStats.totalRevenue.toLocaleString()}
              </h4>
              <small className="text-muted">Revenue</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="total">Sort by Total</option>
                    <option value="customer">Sort by Customer</option>
                    <option value="id">Sort by Order ID</option>
                  </select>
                </div>

                <div className="col-md-1">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    title={`Sort ${
                      sortOrder === "asc" ? "Descending" : "Ascending"
                    }`}
                  >
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </button>
                </div>

                <div className="col-md-4 text-end">
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={exportOrders}
                    >
                      <FaFileExport className="me-2" />
                      Export
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => window.print()}
                    >
                      <FaPrint className="me-2" />
                      Print
                    </button>
                    <button className="btn btn-primary" onClick={refreshOrders}>
                      <FaSync className="me-2" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                Orders ({filteredOrders.length})
              </h5>
              <span className="badge bg-info px-3 py-2">
                Showing {filteredOrders.length} of {orders.length}
              </span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div>
                            <span className="fw-bold">{order.id}</span>
                            {order.trackingNumber && (
                              <div className="small text-muted">
                                Track: {order.trackingNumber}
                              </div>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <FaUser />
                            </div>
                            <div>
                              <div className="fw-semibold">
                                {order.customer.name}
                              </div>
                              <small className="text-muted">
                                {order.customer.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div>
                            <span className="fw-semibold">
                              {order.items.length} items
                            </span>
                            <div className="small text-muted">
                              {order.items
                                .slice(0, 2)
                                .map((item) => item.name)
                                .join(", ")}
                              {order.items.length > 2 && "..."}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="fw-bold text-success fs-6">
                            ${order.total.toFixed(2)}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            {getStatusBadge(order.status)}
                            <select
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              style={{ fontSize: "0.75rem" }}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="returned">Returned</option>
                            </select>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">
                              {getPaymentIcon(order.paymentMethod)}
                            </span>
                            <div>
                              <div className="small fw-semibold text-capitalize">
                                {order.paymentMethod}
                              </div>
                              <span
                                className={`badge ${
                                  order.paymentStatus === "paid"
                                    ? "bg-success"
                                    : order.paymentStatus === "pending"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div>
                            <div className="fw-semibold">
                              {(() => {
                                try {
                                  const dateStr = order.date;
                                  if (!dateStr) return "No Date";

                                  // Handle both ISO strings and Date objects
                                  const date =
                                    typeof dateStr === "string"
                                      ? new Date(dateStr)
                                      : dateStr;

                                  if (isNaN(date.getTime())) {
                                    return "Invalid Date";
                                  }

                                  return format(date, "MMM dd, yyyy");
                                } catch (e) {
                                  console.error(
                                    "Date formatting error:",
                                    e,
                                    order.date
                                  );
                                  return "Invalid Date";
                                }
                              })()}
                            </div>
                            <small className="text-muted">
                              {(() => {
                                try {
                                  return format(new Date(order.date), "HH:mm");
                                } catch (e) {
                                  return "--:--";
                                }
                              })()}
                            </small>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="View Order Details"
                              onClick={() => viewOrderDetails(order)}
                            >
                              <FaEye size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete Order"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <FaShoppingCart size={50} className="mb-3 opacity-50" />
                  <p>No orders found matching your criteria.</p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      setFilterStatus("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">
                <FaChartLine className="me-2 text-primary" />
                Quick Stats & Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">Today's Orders</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-4 fw-bold text-primary">
                        {
                          orders.filter((o) => {
                            try {
                              const orderDate = new Date(o.date);
                              const today = new Date();
                              return (
                                orderDate.toDateString() ===
                                today.toDateString()
                              );
                            } catch (e) {
                              return false;
                            }
                          }).length
                        }
                      </span>
                      <FaArrowUp className="text-success" />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">Avg Order Value</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-4 fw-bold text-success">
                        $
                        {(
                          orderStats.totalRevenue /
                          Math.max(orderStats.total - orderStats.cancelled, 1)
                        ).toFixed(0)}
                      </span>
                      <FaDollarSign className="text-success" />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">Completion Rate</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-4 fw-bold text-info">
                        {Math.round(
                          (orderStats.delivered /
                            Math.max(orderStats.total, 1)) *
                            100
                        )}
                        %
                      </span>
                      <FaCheckCircle className="text-info" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
