// Backend connectivity test utility
import { BASE_URL } from "./api";

// Test if backend is reachable
export const testBackendConnection = async () => {
  try {
    console.log("Testing backend connection to:", BASE_URL);

    const response = await fetch(`${BASE_URL}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Backend test response status:", response.status);

    if (response.ok) {
      const data = await response.text();
      console.log("Backend is reachable:", data);
      return { success: true, data };
    } else {
      console.log("Backend returned error:", response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error("Backend connection failed:", error);
    return { success: false, error: error.message };
  }
};

// Test if your specific login endpoint exists
export const testLoginEndpoint = async () => {
  try {
    console.log("Testing login endpoint:", `${BASE_URL}/api/users/login`);

    // Send an invalid request to see if endpoint exists
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Empty body should trigger validation error
    });

    console.log("Login endpoint test status:", response.status);
    const responseText = await response.text();
    console.log("Login endpoint response:", responseText);

    // If we get back a 400 (validation error), the endpoint exists
    if (response.status === 400 || response.status === 422) {
      return {
        success: true,
        message: "Login endpoint exists and is validating input",
      };
    } else if (response.status === 404) {
      return { success: false, error: "Login endpoint not found (404)" };
    } else {
      return {
        success: true,
        message: `Login endpoint exists (status: ${response.status})`,
      };
    }
  } catch (error) {
    console.error("Login endpoint test failed:", error);
    return { success: false, error: error.message };
  }
};

// Test user registration endpoint
export const testSignupEndpoint = async () => {
  try {
    console.log("Testing signup endpoint:", `${BASE_URL}/api/users/signup`);

    const response = await fetch(`${BASE_URL}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Empty body should trigger validation error
    });

    console.log("Signup endpoint test status:", response.status);
    const responseText = await response.text();
    console.log("Signup endpoint response:", responseText);

    if (response.status === 400 || response.status === 422) {
      return {
        success: true,
        message: "Signup endpoint exists and is validating input",
      };
    } else if (response.status === 404) {
      return { success: false, error: "Signup endpoint not found (404)" };
    } else {
      return {
        success: true,
        message: `Signup endpoint exists (status: ${response.status})`,
      };
    }
  } catch (error) {
    console.error("Signup endpoint test failed:", error);
    return { success: false, error: error.message };
  }
};

// Run all backend tests
export const runAllBackendTests = async () => {
  console.log("🔍 Running comprehensive backend tests...");

  const results = {
    connection: await testBackendConnection(),
    login: await testLoginEndpoint(),
    signup: await testSignupEndpoint(),
  };

  console.log("📊 Backend Test Results:", results);
  return results;
};
