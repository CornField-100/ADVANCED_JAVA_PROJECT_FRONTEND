import { useState } from "react";
import { getCurrentUser, isAuthenticated, isAdmin } from "../utils/auth";
import { runAllBackendTests } from "../utils/backendTest";
import { BASE_URL } from "../utils/api";
import AuthDebug from "../components/AuthDebug";

const DebugPage = () => {
  const [testResults, setTestResults] = useState("");
  const [backendResults, setBackendResults] = useState("");

  const runAuthTests = () => {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    const authenticated = isAuthenticated();
    const admin = isAdmin();

    const results = `
=== Authentication Debug Results ===

1. Raw Token Check:
   - Token exists: ${!!token}
   - Token length: ${token?.length || 0}
   - Token preview: ${token ? token.substring(0, 100) + "..." : "None"}

2. Token Parsing:
   ${
     token
       ? `
   - First 20 chars: ${token.substring(0, 20)}
   - Last 20 chars: ${token.substring(token.length - 20)}
   - Contains dots: ${token.includes(".")}
   - Split parts: ${token.split(".").length}
   `
       : "- No token to parse"
   }

3. User Extraction:
   - User object: ${JSON.stringify(user, null, 2)}
   - Is Authenticated: ${authenticated}
   - Is Admin: ${admin}

4. Local Storage Check:
   - All keys: ${Object.keys(localStorage).join(", ")}
   - Token value type: ${typeof token}

5. Environment:
   - Backend URL: ${BASE_URL}
   - Current URL: ${window.location.href}
    `;

    setTestResults(results);
  };

  const runBackendTests = async () => {
    setBackendResults("Running backend tests...");

    try {
      const results = await runAllBackendTests();

      const formatted = `
=== Backend Connectivity Tests ===

1. Connection Test:
   - Success: ${results.connection.success}
   - ${
     results.connection.success
       ? "Data: " + results.connection.data
       : "Error: " + results.connection.error
   }

2. Login Endpoint Test:
   - Success: ${results.login.success}
   - ${
     results.login.success
       ? "Message: " + results.login.message
       : "Error: " + results.login.error
   }

3. Signup Endpoint Test:
   - Success: ${results.signup.success}
   - ${
     results.signup.success
       ? "Message: " + results.signup.message
       : "Error: " + results.signup.error
   }

=== Recommendations ===
${
  !results.connection.success
    ? "❌ Backend is not reachable. Check if your backend server is running on " +
      BASE_URL
    : ""
}
${
  !results.login.success
    ? "❌ Login endpoint is not working. Check your backend routes."
    : ""
}
${
  !results.signup.success
    ? "❌ Signup endpoint is not working. Check your backend routes."
    : ""
}
${
  results.connection.success && results.login.success && results.signup.success
    ? "✅ All backend endpoints are working!"
    : ""
}
      `;

      setBackendResults(formatted);
    } catch (error) {
      setBackendResults(`Backend tests failed: ${error.message}`);
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setTestResults("Token cleared!");
    setBackendResults("");
  };

  const testManualToken = () => {
    // Create a test JWT token for testing
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId: "123",
        email: "test@test.com",
        role: "user",
        firstName: "Test",
        lastName: "User",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      })
    );
    const signature = "test-signature";
    const testToken = `${header}.${payload}.${signature}`;

    localStorage.setItem("token", testToken);
    setTestResults("Test token created and stored!");
  };

  return (
    <div className="container mt-4">
      <h2>🐛 Authentication Debug Page</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3">
            <h4>Debug Actions</h4>
            <button
              className="btn btn-primary me-2 mb-2"
              onClick={runAuthTests}
            >
              Run Auth Tests
            </button>
            <button className="btn btn-warning me-2 mb-2" onClick={clearToken}>
              Clear Token
            </button>
            <button
              className="btn btn-info me-2 mb-2"
              onClick={testManualToken}
            >
              Create Test Token
            </button>
            <button
              className="btn btn-warning me-2 mb-2"
              onClick={runBackendTests}
            >
              Test Backend
            </button>
          </div>

          <AuthDebug />
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h4>Auth Test Results</h4>
            <pre style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
              {testResults || "Click 'Run Auth Tests' to see results"}
            </pre>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="card p-3">
            <h4>Backend Test Results</h4>
            <pre style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
              {backendResults || "Click 'Test Backend' to check connectivity"}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card p-3">
          <h4>Manual Login Test</h4>
          <p>Use this form to test login with detailed logging:</p>
          <ManualLoginTest />
        </div>
      </div>
    </div>
  );
};

const ManualLoginTest = () => {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("testpassword");
  const [result, setResult] = useState("");

  const testLogin = async () => {
    setResult("Testing login...");

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();

      let result = `
Response Status: ${response.status}
Response Headers: ${JSON.stringify(
        Object.fromEntries(response.headers.entries()),
        null,
        2
      )}
Raw Response: ${responseText}
Response Length: ${responseText.length}
      `;

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          result += `\nParsed JSON: ${JSON.stringify(data, null, 2)}`;
          result += `\nData Type: ${typeof data}`;
        } catch (e) {
          result += `\nJSON Parse Error: ${e.message}`;
        }
      }

      setResult(result);
    } catch (error) {
      setResult(`Network Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-success" onClick={testLogin}>
          Test Login
        </button>
      </div>

      <pre
        style={{
          fontSize: "12px",
          backgroundColor: "#f8f9fa",
          padding: "10px",
        }}
      >
        {result || "Click 'Test Login' to see detailed response"}
      </pre>
    </div>
  );
};

export default DebugPage;
