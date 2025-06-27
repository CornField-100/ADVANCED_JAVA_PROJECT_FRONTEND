import { getCurrentUser, isAuthenticated, isAdmin } from "../utils/auth";

const AuthDebug = () => {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  const token = localStorage.getItem("token");

  return (
    <div className="card p-3 mt-3" style={{ backgroundColor: "#f8f9fa" }}>
      <h6>🐛 Auth Debug Info</h6>
      <small>
        <strong>Token exists:</strong> {token ? "✅ Yes" : "❌ No"}
        <br />
        <strong>Token preview:</strong>{" "}
        {token ? `${token.substring(0, 50)}...` : "None"}
        <br />
        <strong>Is Authenticated:</strong> {authenticated ? "✅ Yes" : "❌ No"}
        <br />
        <strong>Is Admin:</strong> {admin ? "✅ Yes" : "❌ No"}
        <br />
        <strong>User Data:</strong>{" "}
        {user ? JSON.stringify(user, null, 2) : "None"}
      </small>
    </div>
  );
};

export default AuthDebug;
