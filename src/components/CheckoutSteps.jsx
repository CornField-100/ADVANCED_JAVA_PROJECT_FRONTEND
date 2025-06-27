import { FaUser, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Shipping", icon: FaUser },
    { number: 2, title: "Payment", icon: FaCreditCard },
    { number: 3, title: "Review", icon: FaCheckCircle }
  ];

  return (
    <div className="checkout-steps mb-5">
      <div className="d-flex justify-content-center align-items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="d-flex align-items-center">
              {/* Step Circle */}
              <div className="text-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-primary text-white"
                      : "bg-light text-muted"
                  }`}
                  style={{
                    width: "60px",
                    height: "60px",
                    border: isActive ? "3px solid #0d6efd" : "2px solid #e9ecef",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isCompleted ? (
                    <FaCheckCircle size={24} />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <div className={`fw-semibold ${isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted"}`}>
                  {step.title}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 ${
                    currentStep > step.number ? "bg-success" : "bg-light"
                  }`}
                  style={{
                    height: "3px",
                    width: "80px",
                    transition: "all 0.3s ease"
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;
