import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const UserModal = ({ show, onHide, user, onUserSaved }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "", // Never pre-fill password for security
        role: user.role || "user",
        status: user.status || "active",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = "Password is required for new users";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? `http://localhost:3001/api/users/${user.id}`
        : "http://localhost:3001/api/users";

      const method = isEditing ? "PATCH" : "POST";

      // Only include password in request if it's provided
      const requestData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        status: formData.status,
      };

      if (formData.password) {
        requestData.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? "update" : "create"} user`);
      }

      const savedUser = await response.json();

      toast.success(
        <div>
          <div className="fw-bold">
            ✅ User {isEditing ? "Updated" : "Created"}!
          </div>
          <div className="small">
            {formData.firstName} {formData.lastName} has been {isEditing ? "updated" : "added"} successfully
          </div>
        </div>
      );

      onUserSaved(savedUser);
      onHide();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        <div>
          <div className="fw-bold">❌ {isEditing ? "Update" : "Creation"} Failed</div>
          <div className="small">{error.message}</div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <FaUser className="me-2" />
              {isEditing ? "Edit User" : "Create New User"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <FaUser className="me-2" />
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                      value={formData.firstName}
                      onChange={handleChange("firstName")}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <FaUser className="me-2" />
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                      value={formData.lastName}
                      onChange={handleChange("lastName")}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaEnvelope className="me-2" />
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password {!isEditing && <span className="text-danger">*</span>}
                  {isEditing && <small className="text-muted">(leave blank to keep current password)</small>}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange("password")}
                    placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <FaShieldAlt className="me-2" />
                      Role
                    </label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange("role")}
                    >
                      <option value="user">👤 User</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                    <div className="form-text">
                      <small>
                        <strong>User:</strong> Can browse and purchase products<br />
                        <strong>Admin:</strong> Full system access and management capabilities
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange("status")}
                    >
                      <option value="active">✅ Active</option>
                      <option value="inactive">⏸️ Inactive</option>
                      <option value="suspended">🚫 Suspended</option>
                    </select>
                    <div className="form-text">
                      <small>
                        <strong>Active:</strong> User can log in and use the system<br />
                        <strong>Inactive:</strong> User account is temporarily disabled<br />
                        <strong>Suspended:</strong> User account is blocked
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="alert alert-info">
                  <h6>📝 Editing User Information</h6>
                  <p className="mb-0">
                    You are editing the user account for <strong>{user?.firstName} {user?.lastName}</strong>.
                    Changes will be applied immediately upon saving.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={loading}
              >
                <FaTimes className="me-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEditing ? "Update User" : "Create User"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
