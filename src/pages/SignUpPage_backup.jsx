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

  // Professional cartoonish profile images - working URLs
  const profileImages = [
    {
      id: 1,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=business1&backgroundColor=1e40af&hair=variant01&hairColor=brown&eyes=variant01&mouth=happy&size=150",
      name: "Business Executive"
    },
    {
      id: 2,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=manager2&backgroundColor=059669&hair=variant02&hairColor=black&eyes=variant02&mouth=smile&size=150",
      name: "Team Manager"
    },
    {
      id: 3,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=director3&backgroundColor=dc2626&hair=variant03&hairColor=blonde&eyes=variant03&mouth=serious&size=150",
      name: "Creative Director"
    },
    {
      id: 4,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=consultant4&backgroundColor=7c3aed&hair=variant04&hairColor=auburn&eyes=variant04&mouth=smile&size=150",
      name: "Business Consultant"
    },
    {
      id: 5,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=analyst5&backgroundColor=ea580c&hair=variant05&hairColor=red&eyes=variant05&mouth=neutral&size=150",
      name: "Data Analyst"
    },
    {
      id: 6,
      url: "https://api.dicebear.com/8.x/lorelei/svg?seed=coordinator6&backgroundColor=0891b2&hair=variant06&hairColor=brown&eyes=variant06&mouth=happy&size=150",
      name: "Project Coordinator"
    },
    {
      id: 7,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof1&backgroundColor=4facfe&hair=short01&hairColor=brown&eyes=variant01&mouth=smile&size=150",
      name: "Tech Professional"
    },
    {
      id: 8,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof2&backgroundColor=00f2fe&hair=short02&hairColor=black&eyes=variant02&mouth=happy&size=150",
      name: "Marketing Lead"
    },
    {
      id: 9,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof3&backgroundColor=43e97b&hair=short03&hairColor=blonde&eyes=variant03&mouth=neutral&size=150",
      name: "Operations Manager"
    },
    {
      id: 10,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof4&backgroundColor=667eea&hair=short04&hairColor=red&eyes=variant04&mouth=smile&size=150",
      name: "Sales Director"
    },
    {
      id: 11,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof5&backgroundColor=764ba2&hair=short05&hairColor=brown&eyes=variant05&mouth=happy&size=150",
      name: "HR Manager"
    },
    {
      id: 12,
      url: "https://api.dicebear.com/8.x/adventurer/svg?seed=prof6&backgroundColor=f093fb&hair=short06&hairColor=black&eyes=variant06&mouth=smile&size=150",
      name: "Finance Lead"
    },
    {
      id: 13,
      url: "https://api.dicebear.com/8.x/shapes/svg?seed=geo1&backgroundColor=667eea&colors=4facfe,00f2fe,43e97b&size=150",
      name: "Modern Blue"
    },
    {
      id: 14,
      url: "https://api.dicebear.com/8.x/shapes/svg?seed=geo2&backgroundColor=764ba2&colors=f093fb,f5576c,4facfe&size=150",
      name: "Creative Purple"
    },
    {
      id: 15,
      url: "https://api.dicebear.com/8.x/shapes/svg?seed=geo3&backgroundColor=43e97b&colors=38f9d7,4facfe,00f2fe&size=150",
      name: "Fresh Green"
    },
    {
      id: 16,
      url: "https://api.dicebear.com/8.x/shapes/svg?seed=geo4&backgroundColor=f093fb&colors=667eea,764ba2,43e97b&size=150",
      name: "Vibrant Pink"
    }
  ];

  const handleChange = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
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
      // Generate default avatar if none selected
      const finalImageUrl = formData.imageUrl || generateDefaultAvatar(
        formData.firstName, 
        formData.lastName, 
        formData.email
      );

      const signupData = {
        ...formData,
        imageUrl: finalImageUrl
      };

      const response = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(signupData),
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
              <div className="d-flex align-items-center mb-3 p-3 bg-light rounded-3">
                <div className="me-3">
                  <img
                    src={
                      formData.imageUrl || 
                      generateDefaultAvatar(formData.firstName, formData.lastName, formData.email)
                    }
                    alt="Profile Preview"
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
                  <h6 className="mb-1">Avatar Preview</h6>
                  <small className="text-muted">
                    {formData.imageUrl ? "Professional avatar selected" : "Auto-generated from your initials"}
                  </small>
                </div>
              </div>

              {/* Avatar Style Filter */}
              <div className="avatar-filter mb-3">
                <small className="text-muted d-block mb-2">Filter by style:</small>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedAvatarStyle === "all" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSelectedAvatarStyle("all")}
                  >
                    All Styles
                  </button>
                  {avatarStyles.map(style => (
                    <button
                      key={style.key}
                      type="button"
                      className={`btn btn-sm ${selectedAvatarStyle === style.key ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setSelectedAvatarStyle(style.key)}
                      title={style.description}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="profile-image-grid">
                {displayedAvatars.map((avatar) => (
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
                
                {/* Add Random Option */}
                <div
                  className="profile-image-option random-option"
                  onClick={() => {
                    const randomAvatar = allAvatars[Math.floor(Math.random() * allAvatars.length)];
                    handleImageSelect(randomAvatar.url);
                  }}
                  title="Get Random Professional Avatar"
                >
                  <div className="random-avatar-placeholder">
                    <i className="fas fa-random" style={{ fontSize: '1.5rem', color: '#007bff' }}></i>
                    <small style={{ fontSize: '0.7rem', marginTop: '4px' }}>Random</small>
                  </div>
                </div>
              </div>
              
              <small className="text-muted d-block mt-2">
                Professional cartoon-style avatars perfect for business profiles. Leave blank for auto-generated initials.
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
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          border: 2px solid #e9ecef;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-image-option {
          position: relative;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 3px solid transparent;
          background: white;
          padding: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .profile-image-option:hover {
          transform: scale(1.08) translateY(-2px);
          border-color: #007bff;
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
        }

        .profile-image-option.selected {
          border-color: #007bff;
          transform: scale(1.12) translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 123, 255, 0.4);
          background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
        }

        .profile-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          background: white;
          transition: all 0.3s ease;
        }

        .selection-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(45deg, #007bff, #0056b3);
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: checkmark 0.3s ease-in-out;
        }

        .avatar-label {
          margin-top: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: #6c757d;
          font-weight: 500;
        }

        .profile-image-option:hover .avatar-label {
          opacity: 1;
        }

        .profile-image-option.selected .avatar-label {
          opacity: 1;
          color: #007bff;
          font-weight: 600;
        }

        .random-option {
          border: 3px dashed #6c757d !important;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
        }

        .random-option:hover {
          border-color: #007bff !important;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
        }

        .random-avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%);
          transition: all 0.3s ease;
        }

        .random-option:hover .random-avatar-placeholder {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        }

        .avatar-filter {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }

        .avatar-filter .btn-sm {
          border-radius: 20px;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .avatar-filter .btn-outline-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
        }

        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .profile-image-grid {
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 0.75rem;
            padding: 1rem;
          }

          .profile-image {
            width: 65px;
            height: 65px;
          }

          .random-avatar-placeholder {
            width: 65px;
            height: 65px;
          }

          .avatar-filter .btn-sm {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .avatar-filter .d-flex {
            flex-direction: column;
            gap: 0.5rem;
          }

          .avatar-filter .btn-sm {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
