// Token Reset Utility
// Use this in browser console to reset authentication and test fresh signup

console.log("=== TOKEN RESET UTILITY ===");

// Clear current token
localStorage.removeItem("token");
console.log("✅ Token cleared from localStorage");

// Clear any other auth-related data
localStorage.removeItem("user");
localStorage.removeItem("userRole");
console.log("✅ All auth data cleared");

// Force page reload to reset auth state
console.log("🔄 Reloading page to reset auth state...");
setTimeout(() => {
  window.location.reload();
}, 1000);

console.log("=== INSTRUCTIONS ===");
console.log("1. Page will reload automatically");
console.log("2. Go to signup page and create new account with avatar");
console.log("3. Check if avatar displays correctly in dashboard");
console.log("4. If still not working, check browser console for debug logs");
