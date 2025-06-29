// Profile Image Fix Utility
// Run this in browser console to fix profile image display issues

console.log("=== PROFILE IMAGE FIX UTILITY ===");

// Step 1: Check current state
const token = localStorage.getItem("token");
const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;

console.log("1. Current user:", currentUser);
console.log("2. Current imageUrl in token:", currentUser?.imageUrl);

// Step 2: Set a default professional avatar if none exists
const professionalAvatars = [
  {
    name: "Professional Manager",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional1&backgroundColor=b6e3f4&clothingColor=262e33&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=724133&hatColor=ff488e&mouthType=smile&skinColor=ae5d29&topType=shortHairShortWaved"
  },
  {
    name: "Business Executive", 
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional2&backgroundColor=c7d2fe&clothingColor=3c4858&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=2c1b18&mouthType=smile&skinColor=f8d25c&topType=shortHairShortFlat"
  }
];

if (!currentUser?.imageUrl) {
  console.log("3. No imageUrl found in token, setting fallback...");
  
  // Use the first professional avatar as fallback
  const fallbackImage = professionalAvatars[0].url;
  localStorage.setItem("userImageUrl", fallbackImage);
  
  console.log("4. ✅ Fallback avatar set:", fallbackImage);
  console.log("5. 🔄 Refreshing page to apply changes...");
  
  setTimeout(() => {
    window.location.reload();
  }, 1000);
} else {
  console.log("3. ✅ Profile image already exists:", currentUser.imageUrl);
  
  // Store in localStorage as backup anyway
  localStorage.setItem("userImageUrl", currentUser.imageUrl);
  console.log("4. ✅ Image backed up to localStorage");
}

console.log("=== INSTRUCTIONS ===");
console.log("• If you want to change your avatar, go to signup and create a new account");
console.log("• The system now has fallback mechanisms to display professional avatars");
console.log("• Check the dashboard and navigation bar for your profile image");
console.log("=== END ===");
