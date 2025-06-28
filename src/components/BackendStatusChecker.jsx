import React, { useState } from 'react';
import { BASE_URL } from '../utils/api';
import { testBackendConnection } from '../utils/backendTest';
import { FaServer, FaCheckCircle, FaTimesCircle, FaSpinner, FaCode, FaExclamationTriangle } from 'react-icons/fa';

const BackendStatusChecker = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const runBackendTest = async () => {
    setTesting(true);
    setResults(null);

    const token = localStorage.getItem('token');
    const testResults = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'None',
      tests: []
    };

    // Test 1: Basic connectivity
    try {
      const response = await fetch(`${BASE_URL}/`);
      testResults.tests.push({
        name: 'Basic Connectivity',
        status: response.status,
        success: response.status < 400,
        message: `Server responded with status ${response.status}`
      });
    } catch (error) {
      testResults.tests.push({
        name: 'Basic Connectivity',
        status: 'ERROR',
        success: false,
        message: `Connection failed: ${error.message}`
      });
    }

    // Test 2: Health endpoint
    try {
      const response = await fetch(`${BASE_URL}/api/test`);
      const data = await response.text();
      testResults.tests.push({
        name: 'Health Endpoint (/api/test)',
        status: response.status,
        success: response.status === 200,
        message: response.status === 200 ? 'Health endpoint working' : `Status ${response.status}`,
        data: response.status === 200 ? data : null
      });
    } catch (error) {
      testResults.tests.push({
        name: 'Health Endpoint (/api/test)',
        status: 'ERROR',
        success: false,
        message: `Failed: ${error.message}`
      });
    }

    // Test 3: Users endpoint without auth
    try {
      const response = await fetch(`${BASE_URL}/api/users`);
      testResults.tests.push({
        name: 'Users Endpoint (no auth)',
        status: response.status,
        success: response.status === 401, // 401 is expected without auth
        message: response.status === 401 ? 'Correctly requires authentication' : 
                response.status === 404 ? 'Endpoint not found - needs to be implemented' :
                `Unexpected status ${response.status}`
      });
    } catch (error) {
      testResults.tests.push({
        name: 'Users Endpoint (no auth)',
        status: 'ERROR',
        success: false,
        message: `Failed: ${error.message}`
      });
    }

    // Test 4: Users endpoint with auth (if token available)
    if (token) {
      try {
        const response = await fetch(`${BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const responseText = await response.text();
        testResults.tests.push({
          name: 'Users Endpoint (with auth)',
          status: response.status,
          success: response.status === 200,
          message: response.status === 200 ? `Successfully fetched users` :
                  response.status === 401 ? 'Token invalid or expired' :
                  response.status === 403 ? 'Access forbidden - not admin?' :
                  response.status === 404 ? 'Endpoint not implemented' :
                  `Status ${response.status}`,
          data: response.status === 200 ? responseText : null
        });
      } catch (error) {
        testResults.tests.push({
          name: 'Users Endpoint (with auth)',
          status: 'ERROR',
          success: false,
          message: `Failed: ${error.message}`
        });
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  const getStatusIcon = (test) => {
    if (test.success) return <FaCheckCircle className="text-success" />;
    if (test.status === 'ERROR') return <FaTimesCircle className="text-danger" />;
    return <FaExclamationTriangle className="text-warning" />;
  };

  const getRecommendations = () => {
    if (!results) return null;

    const recs = [];
    
    const connectivityTest = results.tests.find(t => t.name === 'Basic Connectivity');
    const healthTest = results.tests.find(t => t.name.includes('Health Endpoint'));
    const usersTest = results.tests.find(t => t.name.includes('Users Endpoint (no auth)'));
    const authUsersTest = results.tests.find(t => t.name.includes('Users Endpoint (with auth)'));

    if (!connectivityTest?.success) {
      recs.push("❌ Backend server is not running. Start your backend server first.");
    } else if (!healthTest?.success) {
      recs.push("⚠️ Backend is running but health endpoint missing. Add GET /api/test endpoint.");
    } else if (usersTest?.status === 404) {
      recs.push("🔧 Users endpoint missing. Copy code from BACKEND_USERS_ENDPOINTS.js to your backend.");
    } else if (authUsersTest?.status === 404) {
      recs.push("🔧 Users endpoint missing. Add the /api/users routes to your backend.");
    } else if (authUsersTest?.status === 401) {
      recs.push("🔑 Token expired or invalid. Try logging out and logging back in.");
    } else if (authUsersTest?.status === 403) {
      recs.push("🚫 Access denied. Make sure you're logged in as an admin user.");
    } else if (authUsersTest?.success) {
      recs.push("✅ All tests passed! Your backend is working correctly.");
    }

    return recs;
  };

  return (
    <div className="card border-info">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">
          <FaServer className="me-2" />
          Backend Connection Diagnostics
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <p className="mb-2">
            <strong>Backend URL:</strong> <code>{BASE_URL}</code>
          </p>
          <p className="mb-3">
            <strong>Auth Token:</strong> {localStorage.getItem('token') ? 
              <span className="text-success">✅ Present</span> : 
              <span className="text-warning">⚠️ Missing</span>
            }
          </p>
          
          <button 
            className="btn btn-primary me-2" 
            onClick={runBackendTest}
            disabled={testing}
          >
            {testing ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Testing...
              </>
            ) : (
              <>
                <FaServer className="me-2" />
                Test Backend Connection
              </>
            )}
          </button>

          {results && (
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowDetails(!showDetails)}
            >
              <FaCode className="me-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>

        {results && (
          <div>
            <h6>Test Results:</h6>
            <div className="list-group mb-3">
              {results.tests.map((test, index) => (
                <div key={index} className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    {getStatusIcon(test)}
                  </div>
                  <div className="flex-grow-1">
                    <strong>{test.name}</strong>
                    <br />
                    <small className="text-muted">{test.message}</small>
                  </div>
                  <div>
                    <span className={`badge ${test.success ? 'bg-success' : 'bg-danger'}`}>
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="alert alert-info">
              <h6>Recommendations:</h6>
              <ul className="mb-0">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {showDetails && (
              <div className="mt-3">
                <h6>Technical Details:</h6>
                <pre className="bg-light p-3 rounded">
                  <code>{JSON.stringify(results, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatusChecker;
