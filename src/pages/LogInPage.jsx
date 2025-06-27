import LabelComp from "../components/LabelComp";
import InputForm from "../components/InputFormComp";
import { useState } from "react";
import { checkEmail } from "../utils/checkFormErrors";
import AlertComp from "../components/AlertComp";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/api";

const LogInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (changedValue) => {
    setEmail(changedValue);
  };

  const handlePasswordChange = (changedPassword) => {
    setPassword(changedPassword);
  };

  // Temporary test login function (remove this when backend is fixed)
  const testLogin = () => {
    console.log("Using test login...");

    // Create a fake JWT token for testing
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId: "test123",
        email: email,
        role: email.includes("admin") ? "admin" : "user",
        firstName: "Test",
        lastName: "User",
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
      })
    );
    const signature = "fake_signature";
    const testToken = `${header}.${payload}.${signature}`;

    localStorage.setItem("token", testToken);
    console.log("Test token created and stored");

    navigate("/", { replace: true });
    setTimeout(() => window.location.reload(), 100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!checkEmail.checkEmpty(email)) throw Error("Email is empty");
      if (!checkEmail.checkFormat(email)) throw Error("Wrong email format");
      if (!password.trim()) throw Error("Password is required");

      setError("");

      console.log("Attempting login to:", `${BASE_URL}/api/users/login`);
      console.log("Login payload:", { email, password: "***hidden***" });

      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Get response text for better error handling
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        let errorMessage = "Login failed";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Server error: ${response.status}`;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
          errorMessage = `Server error (${response.status}): ${responseText}`;
        }

        if (response.status === 401) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (response.status === 500) {
          errorMessage =
            "Server error occurred. Please try again later or contact support.";
        }

        throw Error(errorMessage);
      }

      // Parse the successful response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Could not parse success response:", parseError);
        throw Error("Invalid response from server");
      }

      console.log("Login response data:", data);
      console.log("Response type:", typeof data);

      // Handle different possible token response formats from your backend
      let token;

      if (typeof data === "string") {
        // Backend returns token directly as string
        token = data;
      } else if (typeof data === "object" && data !== null) {
        // Backend returns object with token field
        token = data.token || data.accessToken || data.jwt || data.authToken;

        // If no token field, but response contains user data, it might be the token itself
        if (!token && data.user) {
          // Look for token in user object
          token = data.user.token || data.user.accessToken;
        }
      }

      if (!token) {
        console.error("No token found in response:", data);
        throw Error(
          "No authentication token received from server. Please contact support."
        );
      }

      // Clean the token (remove quotes if present)
      if (typeof token === "string") {
        token = token.replace(/^"|"$/g, ""); // Remove surrounding quotes
      }

      console.log("Final token to store:", token.substring(0, 50) + "...");

      // Store the token
      localStorage.setItem("token", token);

      // Verify token was stored
      const storedToken = localStorage.getItem("token");
      console.log("Token verification - stored successfully:", !!storedToken);

      // Test if token can be decoded (if it's a JWT)
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(
            atob(parts[1] + "=".repeat((4 - (parts[1].length % 4)) % 4))
          );
          console.log("Token payload preview:", payload);
        } else {
          console.log("Token is not a JWT (not 3 parts):", parts.length);
        }
      } catch (e) {
        console.warn("Could not decode token as JWT:", e.message);
      }

      // Show success message
      console.log("Login successful! Redirecting...");

      // Use navigate instead of window.location for better React Router integration
      navigate("/", { replace: true });

      // Force a page reload to ensure all components refresh with new auth state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <form
      className="card shadow-sm p-4 w-100"
      style={{ maxWidth: "480px", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Log In</h1>

      <div className="mb-3">
        <LabelComp htmlFor="emailInput" displayText="Email" />
        <InputForm
          onchange={handleEmailChange}
          value={email}
          type="email"
          id="emailInput"
          ariaDescribe="emailHelp"
        />
      </div>

      <div className="mb-3">
        <LabelComp htmlFor="passwordInput" displayText="Password" />
        <InputForm
          onchange={handlePasswordChange}
          value={password}
          type="password"
          id="passwordInput"
          ariaDescribe="passwordHelp"
        />
      </div>

      {error && <AlertComp alertType="alert-danger" text={error} />}

      <div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </div>
    </form>
  );
};

export default LogInPage;
