// Test route access - paste this in browser console

// Test 1: Check current auth state
console.log("=== AUTH TEST ===");
console.log("Token exists:", !!localStorage.getItem("token"));
console.log("Token preview:", localStorage.getItem("token")?.substring(0, 50));

// Test 2: Try manual admin token (for testing only)
function createTestAdminToken() {
  const testPayload = {
    id: "test123",
    email: "admin@test.com",
    role: "admin",
    firstName: "Test",
    lastName: "Admin",
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify(testPayload));
  const signature = "test_signature";

  const token = `${header}.${payload}.${signature}`;
  localStorage.setItem("token", token);
  console.log("Test admin token created!");
  return token;
}

// Test 3: Check access functions
function testAuthFunctions() {
  // These should be available globally if auth.js is imported
  try {
    console.log(
      "getCurrentUser result:",
      window.getCurrentUser ? window.getCurrentUser() : "Function not available"
    );
    console.log(
      "isAdmin result:",
      window.isAdmin ? window.isAdmin() : "Function not available"
    );
  } catch (e) {
    console.error("Auth function test failed:", e);
  }
}

console.log("Run: createTestAdminToken() to create a test admin token");
console.log("Then navigate to /create-product");
