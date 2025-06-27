import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin, getCurrentUser } from "../utils/auth";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  redirectTo = "/login",
}) => {
  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const adminAccess = isAdmin();

  console.log("ProtectedRoute check:", {
    user,
    authenticated,
    adminAccess,
    adminOnly,
    redirectTo,
  }); // Debug log

  // Check if user is authenticated
  if (!authenticated) {
    console.log("User not authenticated, redirecting to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Check admin-only routes
  if (adminOnly && !adminAccess) {
    console.log(
      "Admin access required but user is not admin, redirecting to home"
    );
    return <Navigate to="/" replace />;
  }

  console.log("Access granted, rendering children");
  return children;
};

export default ProtectedRoute;
