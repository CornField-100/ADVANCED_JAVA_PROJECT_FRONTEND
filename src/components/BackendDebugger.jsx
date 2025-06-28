import React, { useState } from "react";
import { BASE_URL } from "../utils/api";
import { testBackendConnection } from "../utils/backendTest";
import { toast } from "react-toastify";
import { FaServer, FaCheckCircle, FaTimesCircle, FaSpinner, FaCog } from "react-icons/fa";

const BackendDebugger = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({});
  const [showDebugger, setShowDebugger] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    setResults({});

    const tests = [
      {
        name: "Backend Connection",
        test: async () => {
          const result = await testBackendConnection();
          return { success: result.success, message: result.error || "Connected successfully" };
        }
      },
      {
        name: "Authentication Token",
        test: async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            return { success: false, message: "No token found in localStorage" };
          }
          return { success: true, message: "Token exists" };
        }
      },
      {
        name: "Users API Endpoint",
        test: async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/users`, {
              method: "HEAD", // Just check if endpoint exists
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            
            if (response.status === 401) {
              return { success: false, message: "Authentication failed - token may be invalid" };
            } else if (response.status === 403) {
              return { success: false, message: "Access forbidden - insufficient permissions" };
            } else if (response.status === 404) {
              return { success: false, message: "API endpoint not found" };
            } else if (response.ok || response.status === 405) { // 405 = Method Not Allowed (HEAD not supported)
              return { success: true, message: "Endpoint exists and accessible" };
            } else {
              return { success: false, message: `HTTP ${response.status}` };
            }
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
      },
      {
        name: "Network Connectivity",
        test: async () => {
          try {
            const startTime = Date.now();
            const response = await fetch(`${BASE_URL}`, { method: "HEAD" });
            const latency = Date.now() - startTime;
            return { success: true, message: `Connected (${latency}ms)` };
          } catch (error) {
            return { success: false, message: "Network unreachable" };
          }
        }
      }
    ];

    const testResults = {};
    
    for (const test of tests) {
      try {
        const result = await test.test();
        testResults[test.name] = result;
      } catch (error) {
        testResults[test.name] = { 
          success: false, 
          message: `Test failed: ${error.message}` 
        };
      }
    }

    setResults(testResults);
    setTesting(false);

    // Show summary toast
    const failedTests = Object.values(testResults).filter(r => !r.success).length;
    if (failedTests === 0) {
      toast.success("✅ All diagnostic tests passed!");
    } else {
      toast.error(`❌ ${failedTests} diagnostic test(s) failed`);
    }
  };

  if (!showDebugger) {
    return (
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => setShowDebugger(true)}
        title="Backend Diagnostics"
      >
        <FaCog /> Debug
      </button>
    );
  }

  return (
    <div className="backend-debugger">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaServer className="me-2" />
            Backend Diagnostics
          </h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowDebugger(false)}
          >
            ✕
          </button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <strong>Backend URL:</strong> <code>{BASE_URL}</code>
          </div>
          
          <button
            className="btn btn-primary mb-3"
            onClick={runDiagnostics}
            disabled={testing}
          >
            {testing ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <FaServer className="me-2" />
                Run Diagnostics
              </>
            )}
          </button>

          {Object.keys(results).length > 0 && (
            <div className="diagnostic-results">
              <h6>Test Results:</h6>
              {Object.entries(results).map(([testName, result]) => (
                <div key={testName} className="test-result mb-2">
                  <div className="d-flex align-items-center">
                    {result.success ? (
                      <FaCheckCircle className="text-success me-2" />
                    ) : (
                      <FaTimesCircle className="text-danger me-2" />
                    )}
                    <strong className={result.success ? "text-success" : "text-danger"}>
                      {testName}
                    </strong>
                  </div>
                  <div className="test-message text-muted small ms-4">
                    {result.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendDebugger;
