import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getCurrentUser, isAuthenticated } from "../utils/auth";
import { toast } from "react-toastify";
import {
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaTruck,
  FaGift,
  FaCheck,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaUndo,
} from "react-icons/fa";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const currentUser = getCurrentUser(); // Move this to the top

  // Form state - initialize with proper currentUser
  const [shippingInfo, setShippingInfo] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [showCvv, setShowCvv] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  // Calculate totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
  }, [cart.length, navigate]); // Simplified dependencies

  const handleShippingChange = (e) => {
    setShippingInfo((prevShippingInfo) => ({
      ...prevShippingInfo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCardChange = (e) => {
    let value = e.target.value;

    // Format card number
    if (e.target.name === "cardNumber") {
      value = value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
      if (value.length > 19) value = value.slice(0, 19);
    }

    // Format expiry date
    if (e.target.name === "expiryDate") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (value.length > 5) value = value.slice(0, 5);
    }

    // Format CVV
    if (e.target.name === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) value = value.slice(0, 4);
    }

    setCardInfo({
      ...cardInfo,
      [e.target.name]: value,
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          shippingInfo.firstName &&
          shippingInfo.lastName &&
          shippingInfo.email &&
          shippingInfo.address &&
          shippingInfo.city &&
          shippingInfo.state &&
          shippingInfo.zipCode
        );
      case 2:
        if (paymentMethod === "card") {
          return (
            cardInfo.cardNumber.replace(/\s/g, "").length >= 16 &&
            cardInfo.expiryDate.length === 5 &&
            cardInfo.cvv.length >= 3 &&
            cardInfo.nameOnCard
          );
        }
        return true;
      case 3:
        return agreedToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show more specific error messages based on current step
      if (currentStep === 1) {
        toast.error("Please complete all shipping information fields");
      } else if (currentStep === 2) {
        toast.error("Please complete payment information");
      } else {
        toast.error("Please complete all required fields");
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const processOrder = async () => {
    if (!validateStep(3)) {
      toast.error("Please agree to terms and conditions");
      return;
    }

    setOrderProcessing(true);

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderData = {
        items: cart.map(item => ({
          title: item.title,
          brand: item.brand,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          imageUrl: item.imageUrl || ""
        })),
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone || "",
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country || "United States"
        },
        paymentMethod,
        cardInfo: paymentMethod === "card" ? {
          last4: cardInfo.cardNumber.slice(-4),
          nameOnCard: cardInfo.nameOnCard
        } : null,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        orderNotes,
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        status: "pending",
        paymentStatus: "paid"
      };

      // 🔥 NEW: Send order to backend
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const savedOrder = await response.json();
      console.log("Order saved to backend:", savedOrder);

      // Store locally for order confirmation page
      localStorage.setItem("lastOrder", JSON.stringify(savedOrder));

      // Clear cart
      clearCart();

      // Show success toast
      toast.success(
        <div>
          <div className="fw-bold">🎉 Order Placed Successfully!</div>
          <div className="small">Order ID: {savedOrder.orderId || orderData.orderId}</div>
        </div>,
        {
          autoClose: 5000,
          style: {
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
            borderRadius: "12px",
          },
        }
      );

      // Navigate to success page
      navigate("/order-confirmation", {
        state: { order: savedOrder || orderData },
      });
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(`Failed to process order: ${error.message}`);
      
      // Fallback: save locally if backend fails
      const fallbackOrder = {
        items: cart,
        shippingInfo,
        paymentMethod,
        cardInfo: paymentMethod === "card" ? {
          last4: cardInfo.cardNumber.slice(-4),
          nameOnCard: cardInfo.nameOnCard
        } : null,
        subtotal,
        tax,
        shipping,
        total,
        orderNotes,
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
        status: "pending",
        paymentStatus: "paid"
      };
      
      localStorage.setItem("lastOrder", JSON.stringify(fallbackOrder));
      clearCart();
      navigate("/order-confirmation", { state: { order: fallbackOrder } });
    } finally {
      setOrderProcessing(false);
    }
  };

  const CheckoutSteps = ({ currentStep }) => (
    <div className="row justify-content-center mb-5">
      <div className="col-md-8">
        <div className="d-flex justify-content-between align-items-center">
          {[
            { num: 1, title: "Shipping Info", icon: <FaUser /> },
            { num: 2, title: "Payment", icon: <FaCreditCard /> },
            { num: 3, title: "Review & Confirm", icon: <FaCheckCircle /> },
          ].map((stepItem, index) => (
            <div
              key={stepItem.num}
              className="d-flex flex-column align-items-center flex-grow-1 position-relative"
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                  currentStep >= stepItem.num
                    ? "bg-success text-white"
                    : "bg-light text-muted"
                }`}
                style={{ width: "50px", height: "50px", fontSize: "1.2rem" }}
              >
                {currentStep > stepItem.num ? <FaCheck /> : stepItem.icon}
              </div>
              <small
                className={
                  currentStep >= stepItem.num
                    ? "text-success fw-bold"
                    : "text-muted"
                }
              >
                {stepItem.title}
              </small>
              {index < 2 && (
                <div
                  className={`position-absolute ${
                    currentStep > stepItem.num ? "bg-success" : "bg-light"
                  }`}
                  style={{
                    width: "100px",
                    height: "2px",
                    top: "25px",
                    left: "calc(50% + 25px)",
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (cart.length === 0) {
    return null;
  }

  return (
    <div
      className="checkout-page"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "2rem",
      }}
    >
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-2">Secure Checkout</h1>
          <p className="lead text-muted">
            Complete your purchase safely and securely
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-success">
            <FaShieldAlt />
            <small className="fw-semibold">SSL Encrypted & Secure</small>
          </div>
        </div>

        {/* Progress Steps */}
        <CheckoutSteps currentStep={currentStep} />

        <div className="row mt-5">
          {/* Main Checkout Form */}
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="step-content">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <FaUser />
                      </div>
                      <div>
                        <h4 className="mb-0">Shipping Information</h4>
                        <small className="text-muted">
                          Where should we deliver your order?
                        </small>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          First Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label fw-semibold">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">City *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          State *
                        </label>
                        <select
                          className="form-select form-select-lg"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          {/* Add more states as needed */}
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleShippingChange}
                          required
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="step-content">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <FaCreditCard />
                      </div>
                      <div>
                        <h4 className="mb-0">Payment Method</h4>
                        <small className="text-muted">
                          Choose your preferred payment option
                        </small>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <div className="payment-methods mb-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div
                            className={`payment-option ${
                              paymentMethod === "paypal" ? "selected" : ""
                            }`}
                            onClick={() => setPaymentMethod("paypal")}
                            style={{
                              border:
                                paymentMethod === "paypal"
                                  ? "2px solid #0070ba"
                                  : "2px solid #e9ecef",
                              borderRadius: "12px",
                              padding: "20px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              backgroundColor:
                                paymentMethod === "paypal"
                                  ? "#f8f9ff"
                                  : "white",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <FaPaypal
                                size={30}
                                color="#0070ba"
                                className="me-3"
                              />
                              <div>
                                <div className="fw-bold">PayPal</div>
                                <small className="text-muted">
                                  Pay with your PayPal account
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                            className={`payment-option ${
                              paymentMethod === "card" ? "selected" : ""
                            }`}
                            onClick={() => setPaymentMethod("card")}
                            style={{
                              border:
                                paymentMethod === "card"
                                  ? "2px solid #28a745"
                                  : "2px solid #e9ecef",
                              borderRadius: "12px",
                              padding: "20px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              backgroundColor:
                                paymentMethod === "card" ? "#f8fff8" : "white",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <FaCreditCard
                                size={30}
                                color="#28a745"
                                className="me-3"
                              />
                              <div>
                                <div className="fw-bold">Credit/Debit Card</div>
                                <small className="text-muted">
                                  Visa, Mastercard, American Express
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alternative Payment Methods */}
                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <div
                            className={`payment-option ${
                              paymentMethod === "apple" ? "selected" : ""
                            }`}
                            onClick={() => setPaymentMethod("apple")}
                            style={{
                              border:
                                paymentMethod === "apple"
                                  ? "2px solid #000"
                                  : "2px solid #e9ecef",
                              borderRadius: "12px",
                              padding: "15px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              backgroundColor:
                                paymentMethod === "apple" ? "#f8f8f8" : "white",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <FaApplePay size={24} className="me-2" />
                              <span className="fw-semibold">Apple Pay</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div
                            className={`payment-option ${
                              paymentMethod === "google" ? "selected" : ""
                            }`}
                            onClick={() => setPaymentMethod("google")}
                            style={{
                              border:
                                paymentMethod === "google"
                                  ? "2px solid #4285f4"
                                  : "2px solid #e9ecef",
                              borderRadius: "12px",
                              padding: "15px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              backgroundColor:
                                paymentMethod === "google"
                                  ? "#f8f9ff"
                                  : "white",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <FaGooglePay size={24} className="me-2" />
                              <span className="fw-semibold">Google Pay</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div
                            className={`payment-option ${
                              paymentMethod === "crypto" ? "selected" : ""
                            }`}
                            onClick={() => setPaymentMethod("crypto")}
                            style={{
                              border:
                                paymentMethod === "crypto"
                                  ? "2px solid #f7931a"
                                  : "2px solid #e9ecef",
                              borderRadius: "12px",
                              padding: "15px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              backgroundColor:
                                paymentMethod === "crypto"
                                  ? "#fff8f0"
                                  : "white",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <span className="me-2">₿</span>
                              <span className="fw-semibold">Crypto</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Details Form */}
                    {paymentMethod === "card" && (
                      <div className="card-details mt-4 p-4 bg-light rounded-3">
                        <h6 className="mb-3">Card Details</h6>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">
                              Name on Card *
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="nameOnCard"
                              value={cardInfo.nameOnCard}
                              onChange={handleCardChange}
                              required
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <div className="col-12 mb-3">
                            <label className="form-label fw-semibold">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="cardNumber"
                              value={cardInfo.cardNumber}
                              onChange={handleCardChange}
                              placeholder="1234 5678 9012 3456"
                              required
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="expiryDate"
                              value={cardInfo.expiryDate}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              required
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                              CVV *
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              name="cvv"
                              value={cardInfo.cvv}
                              onChange={handleCardChange}
                              placeholder="123"
                              required
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PayPal Info */}
                    {paymentMethod === "paypal" && (
                      <div className="paypal-info mt-4 p-4 bg-light rounded-3">
                        <div className="d-flex align-items-center">
                          <FaPaypal
                            size={40}
                            color="#0070ba"
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-1">Pay with PayPal</h6>
                            <small className="text-muted">
                              You'll be redirected to PayPal to complete your
                              payment securely
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 3 && (
                  <div className="step-content">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <FaCheckCircle />
                      </div>
                      <div>
                        <h4 className="mb-0">Review Your Order</h4>
                        <small className="text-muted">
                          Please review your order details before placing
                        </small>
                      </div>
                    </div>

                    {/* Order Review */}
                    <div className="order-review">
                      {/* Shipping Info Summary */}
                      <div className="card mb-3 border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title d-flex align-items-center">
                            <FaMapMarkerAlt className="me-2 text-primary" />
                            Shipping Address
                          </h6>
                          <p className="card-text mb-0">
                            {shippingInfo.firstName} {shippingInfo.lastName}
                            <br />
                            {shippingInfo.address}
                            <br />
                            {shippingInfo.city}, {shippingInfo.state}{" "}
                            {shippingInfo.zipCode}
                          </p>
                        </div>
                      </div>

                      {/* Payment Method Summary */}
                      <div className="card mb-3 border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title d-flex align-items-center">
                            <FaCreditCard className="me-2 text-success" />
                            Payment Method
                          </h6>
                          <p className="card-text mb-0">
                            {paymentMethod === "paypal" && "PayPal"}
                            {paymentMethod === "card" &&
                              `Card ending in ${cardInfo.cardNumber.slice(-4)}`}
                            {paymentMethod === "apple" && "Apple Pay"}
                            {paymentMethod === "google" && "Google Pay"}
                            {paymentMethod === "crypto" && "Cryptocurrency"}
                          </p>
                        </div>
                      </div>

                      {/* Order Notes */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          Order Notes (Optional)
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="Any special instructions for your order..."
                          style={{ borderRadius: "10px" }}
                        />
                      </div>

                      {/* Terms and Conditions */}
                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="agreeTerms"
                        >
                          I agree to the{" "}
                          <a href="#" className="text-primary">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-primary">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  {currentStep > 1 && (
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={prevStep}
                      disabled={orderProcessing}
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      className="btn btn-primary btn-lg ms-auto"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-lg ms-auto"
                      onClick={processOrder}
                      disabled={!validateStep(3) || orderProcessing}
                      style={{
                        background: "linear-gradient(45deg, #28a745, #20c997)",
                        border: "none",
                        minWidth: "200px",
                      }}
                    >
                      {orderProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock className="me-2" />
                          Place Order - ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div
              className="card shadow-lg border-0 rounded-4 sticky-top"
              style={{ top: "2rem" }}
            >
              <div
                className="card-header bg-gradient text-white text-center border-0 rounded-top-4"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                }}
              >
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body p-4">
                {/* Cart Items */}
                <div
                  className="cart-items mb-4"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="d-flex align-items-center mb-3 p-2 rounded"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/60"}
                        alt={item.title}
                        className="rounded me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.title}</h6>
                        <small className="text-muted">{item.brand}</small>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className="fw-bold">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="badge bg-secondary">
                            ×{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span
                      className={shipping === 0 ? "text-success fw-bold" : ""}
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3 fw-bold fs-5">
                    <span>Total:</span>
                    <span className="text-success">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="trust-indicators">
                  <div className="row text-center g-2">
                    <div className="col-4">
                      <div className="p-2">
                        <FaShieldAlt className="text-success mb-1" />
                        <div className="small text-muted">SSL Secure</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <FaTruck className="text-info mb-1" />
                        <div className="small text-muted">Fast Delivery</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2">
                        <FaUndo className="text-warning mb-1" />
                        <div className="small text-muted">Easy Returns</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="delivery-estimate mt-4 p-3 bg-light rounded-3">
                  <div className="d-flex align-items-center">
                    <FaClock className="text-primary me-2" />
                    <div>
                      <div className="fw-semibold">Estimated Delivery</div>
                      <small className="text-muted">3-5 business days</small>
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

export default CheckoutPage;
