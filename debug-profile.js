// Debug Profile Image Issue
// Run this in browser console to check current user data

console.log("=== PROFILE IMAGE DEBUG ===");

// Check token and current user
const token = localStorage.getItem("token");
console.log("1. Token exists:", !!token);

if (token) {
  console.log("2. Token preview:", token.substring(0, 100) + "...");
  
  // Try to decode token manually
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = parts[1];
      const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
      const decoded = JSON.parse(atob(paddedPayload));
      console.log("3. Decoded token payload:", decoded);
      console.log("4. imageUrl in token:", decoded.imageUrl);
    } else {
      console.log("3. Invalid JWT format");
    }
  } catch (e) {
    console.log("3. Error decoding token:", e);
  }
}

// Check getCurrentUser function
if (window.getCurrentUser) {
  const user = window.getCurrentUser();
  console.log("5. getCurrentUser() result:", user);
  console.log("6. User imageUrl:", user?.imageUrl);
} else {
  console.log("5. getCurrentUser function not available globally");
}

// Check if imageUrl is displaying in current page
const profileImages = document.querySelectorAll('[src*="dicebear"]');
console.log("7. Profile images found on page:", profileImages.length);
profileImages.forEach((img, index) => {
  console.log(`   Image ${index + 1}:`, img.src);
});

console.log("=== END DEBUG ===");
