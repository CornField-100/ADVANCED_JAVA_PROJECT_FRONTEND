import { useState } from "react";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import AlertComp from "../components/AlertComp";
import { BASE_URL } from "../utils/api";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user", // Default to user role
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const fieldConfig = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      id: "firstNameInput",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      id: "lastNameInput",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      id: "emailInput",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      id: "pwdInput",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Profile Picture URL (Optional)",
      type: "text",
      id: "imageInput",
      required: false,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!formData.role.trim()) {
      setError("Please select an account type");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const serverData = await response.json();

      if (!response.ok) {
        throw Error(serverData.message || "Signup failed");
      }

      console.log("Signup successful:", serverData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
        imageUrl: "",
      });
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <form
            className="card shadow-lg border-0 rounded-4 p-5"
            style={{ backgroundColor: "#ffffff" }}
            onSubmit={handleSubmit}
          >
            <div className="text-center mb-4">
              <h1 className="fw-bold text-dark mb-2">Create Account</h1>
              <p className="text-muted">Join our community today</p>
            </div>

            {/* Form Fields */}
            {fieldConfig.map(({ name, label, type, id, required }) => (
              <div className="mb-3" key={name}>
                <LabelComp htmlFor={id} displayText={label} />
                <InputForm
                  id={id}
                  type={type}
                  value={formData[name]}
                  onchange={handleChange(name)}
                  ariaDescribe={`${id}Help`}
                />
                {required && <small className="text-muted">* Required</small>}
              </div>
            ))}

            {/* Role Selection */}
            <div className="mb-4">
              <label htmlFor="roleSelect" className="form-label fw-semibold">
                Account Type <span className="text-danger">*</span>
              </label>
              <select
                id="roleSelect"
                className="form-select"
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                required
                style={{
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  padding: "12px",
                }}
              >
                <option value="">Choose your account type...</option>
                <option value="user">🛍️ Customer Account</option>
                <option value="admin">👑 Admin Account</option>
              </select>
              <div className="form-text mt-2">
                <small className="text-muted">
                  <strong>Customer:</strong> Browse and purchase products
                  <br />
                  <strong>Admin:</strong> Manage products, users, and view
                  analytics
                </small>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div
                className="alert alert-danger border-0 rounded-3"
                role="alert"
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {success && (
              <div
                className="alert alert-success border-0 rounded-3"
                role="alert"
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">✅</div>
                  <div>
                    <strong>Account Created Successfully!</strong>
                    <div className="small">
                      You can now log in with your credentials.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-3 rounded-3 fw-semibold"
              style={{
                background: "linear-gradient(45deg, #007bff, #0056b3)",
                border: "none",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0, 123, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Create {formData.role === "admin" ? "Admin" : "User"} Account
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary fw-semibold text-decoration-none"
                >
                  Sign In
                </a>
              </p>
            </div>

            {/* Role Information */}
            <div className="mt-4 pt-3 border-top">
              <h6 className="text-muted mb-3">Account Types</h6>
              <div className="row text-start">
                <div className="col-12 mb-2">
                  <div className="d-flex align-items-start">
                    <span className="me-2">👤</span>
                    <div>
                      <strong className="d-block">User Account</strong>
                      <small className="text-muted">
                        Browse products, manage cart, place orders
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-start">
                    <span className="me-2">🛡️</span>
                    <div>
                      <strong className="d-block">Admin Account</strong>
                      <small className="text-muted">
                        Full system access, manage products, view analytics
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
