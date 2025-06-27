import { getCurrentUser, isAdmin, isAuthenticated } from "../utils/auth";

const AuthStatus = () => {
  const user = getCurrentUser();
  const isAuth = isAuthenticated();
  const isAdminUser = isAdmin();

  return (
    <div
      className="alert alert-info"
      style={{ fontSize: "0.9rem", marginBottom: "1rem" }}
    >
      <h6>🔐 Auth Status</h6>
      <div>
        <strong>Authenticated:</strong> {isAuth ? "✅ Yes" : "❌ No"}
      </div>
      <div>
        <strong>Is Admin:</strong> {isAdminUser ? "✅ Yes" : "❌ No"}
      </div>
      {user && (
        <div>
          <strong>User:</strong> {user.firstName} {user.lastName} ({user.role})
        </div>
      )}
    </div>
  );
};

export default AuthStatus;
