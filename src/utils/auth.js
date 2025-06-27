// Authentication and Authorization utilities

// Decode JWT token to get user information
export const decodeToken = (token) => {
  try {
    if (!token) {
      console.log("No token provided to decode");
      return null;
    }

    // Remove quotes if token is stored as a string
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    // Check if this looks like a JWT token
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("Invalid JWT format - not 3 parts:", parts.length);

      // If it's not a JWT, try to see if it's a simple token we can work with
      // For now, return null, but you could implement simple token handling here
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(paddedPayload));

    console.log("Successfully decoded JWT token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get current user information from stored token
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem("token");
    console.log(
      "Getting current user, raw token:",
      token?.substring(0, 50) + "..."
    ); // Debug log

    if (!token) {
      console.log("No token found in localStorage");
      return null;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      console.log("Failed to decode token, removing invalid token");
      localStorage.removeItem("token");
      return null;
    }

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      console.log("Token is expired, removing expired token");
      localStorage.removeItem("token");
      return null;
    }

    const user = {
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
      role: decoded.role || "user", // Default to 'user' if no role
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      imageUrl: decoded.imageUrl,
    };

    console.log("Current user extracted from token:", user); // Debug log
    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    localStorage.removeItem("token"); // Clean up invalid token
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user !== null;
};

// Check if user has admin role
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// Check if user has user role
export const isUser = () => {
  const user = getCurrentUser();
  return user && user.role === "user";
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Role-based access control
export const hasPermission = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin has access to everything
  if (user.role === "admin") return true;

  // Check specific role
  return user.role === requiredRole;
};

// Get user display name
export const getUserDisplayName = () => {
  const user = getCurrentUser();
  if (!user) return "Guest";

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  return user.email || "User";
};

// Check if token is about to expire (within 5 minutes)
export const isTokenExpiringSoon = () => {
  const user = getCurrentUser();
  if (!user) return false;

  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) return false;

  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = decoded.exp - currentTime;

  // Return true if token expires within 5 minutes (300 seconds)
  return timeUntilExpiry < 300 && timeUntilExpiry > 0;
};

// Refresh token if needed (placeholder for future implementation)
export const refreshTokenIfNeeded = async () => {
  if (isTokenExpiringSoon()) {
    // TODO: Implement token refresh logic with backend
    console.log("Token is expiring soon, consider refreshing");
  }
};
