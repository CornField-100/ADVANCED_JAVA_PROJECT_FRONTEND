import { useState } from "react";
import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import { BASE_URL } from "../utils/api";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [savedImageUrl, setSavedImageUrl] = useState("");

  // Professional cartoon-style avatar images (only 2 profile pictures)
  const profileImages = [
    {
      id: 1,
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional1&backgroundColor=b6e3f4&clothingColor=262e33&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=724133&hatColor=ff488e&mouthType=smile&skinColor=ae5d29&topType=shortHairShortWaved",
      name: "Professional Manager"
    },
    {
      id: 2,
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional2&backgroundColor=c7d2fe&clothingColor=3c4858&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=2c1b18&mouthType=smile&skinColor=f8d25c&topType=shortHairShortFlat",
      name: "Business Executive"
    }
  ];

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleImageSelect = (imageUrl) => {
    console.log("Avatar selected:", imageUrl);
    setFormData((prev) => ({ ...prev, imageUrl }));
    // Store in localStorage as backup
    localStorage.setItem("userImageUrl", imageUrl);
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
      console.log("SignUp - formData being sent:", formData);
      console.log("SignUp - imageUrl being sent:", formData.imageUrl);
      
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

      console.log("SignUp - Server response:", serverData);
      console.log("SignUp successful:", serverData);
      
      // Store the imageUrl before clearing form
      if (formData.imageUrl) {
        setSavedImageUrl(formData.imageUrl);
        localStorage.setItem("userImageUrl", formData.imageUrl);
        console.log("Stored imageUrl in localStorage for immediate use:", formData.imageUrl);
      }
      
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
        <div className="col-md-8 col-lg-6">
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

            {/* Profile Image Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-3">
                Choose Your Professional Avatar
              </label>
              
              {/* Preview Section */}
              {formData.imageUrl && (
                <div className="d-flex align-items-center mb-3 p-3 bg-light rounded-3">
                  <div className="me-3">
                    <img
                      src={formData.imageUrl}
                      alt="Selected Avatar"
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        border: "3px solid #007bff",
                        background: "white"
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="mb-1">Selected Avatar</h6>
                    <small className="text-muted">Professional avatar selected</small>
                  </div>
                </div>
              )}

              <div className="profile-image-grid">
                {profileImages.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`profile-image-option ${
                      formData.imageUrl === avatar.url ? 'selected' : ''
                    }`}
                    onClick={() => handleImageSelect(avatar.url)}
                    title={avatar.name}
                  >
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="profile-image"
                      onError={(e) => {
                        console.log('Failed to load avatar:', avatar.url);
                        e.target.style.display = 'none';
                      }}
                    />
                    {formData.imageUrl === avatar.url && (
                      <div className="selection-indicator">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                    <div className="avatar-label">
                      <small>{avatar.name}</small>
                    </div>
                  </div>
                ))}
              </div>
              <small className="text-muted d-block mt-2">
                Select a professional avatar or leave blank for auto-generated initials
              </small>
            </div>

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
                      {savedImageUrl && (
                        <>
                          <br />
                          <span className="text-muted">
                            Your profile picture has been saved and will appear after login.
                          </span>
                        </>
                      )}
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

      {/* Profile Image Selection Styles */}
      <style jsx>{`
        .profile-image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px solid #e9ecef;
        }

        .profile-image-option {
          position: relative;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          border: 3px solid transparent;
          background: white;
          padding: 8px;
          text-align: center;
        }

        .profile-image-option:hover {
          transform: scale(1.05);
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
        }

        .profile-image-option.selected {
          border-color: #007bff;
          transform: scale(1.08);
          background: #e3f2fd;
        }

        .profile-image {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto 8px auto;
          background: white;
        }

        .selection-indicator {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .avatar-label {
          font-size: 11px;
          color: #6c757d;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .profile-image-grid {
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 0.75rem;
            padding: 1rem;
          }

          .profile-image {
            width: 55px;
            height: 55px;
          }
        }

        /* Scrollbar styling */
        .profile-image-grid::-webkit-scrollbar {
          width: 8px;
        }

        .profile-image-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .profile-image-grid::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .profile-image-grid::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
