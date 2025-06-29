export const generateDefaultAvatar = (firstName = "", lastName = "", email = "") => {
  // Create a seed from the user's information
  const seed = firstName + lastName + email;
  
  // Array of professional avatar styles - updated to use latest API
  const styles = [
    "adventurer-neutral",
    "bottts-neutral", 
    "initials",
    "shapes",
    "pixel-art",
    "thumbs"
  ];
  
  // Array of professional colors (modern corporate palette)
  const backgroundColors = [
    "1e40af", "059669", "dc2626", "7c3aed", "ea580c", "0891b2",
    "374151", "475569", "6b7280", "1f2937", "065f46", "991b1b"
  ];
  
  // Simple hash function to make selection deterministic
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };
  
  const hash = hashCode(seed);
  
  // Select deterministic but varied options based on the hash
  const selectedStyle = styles[hash % styles.length];
  const selectedBackground = backgroundColors[hash % backgroundColors.length];
  
  // Generate the avatar URL with professional settings
  let avatarUrl;
  
  if (selectedStyle === "initials") {
    // For initials style, use the actual initials
    const initials = getInitials(firstName, lastName);
    avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=${selectedBackground}&textColor=ffffff&fontSize=60&fontWeight=700&size=150`;
  } else if (selectedStyle === "adventurer-neutral") {
    // For character style, add professional accessories
    avatarUrl = `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${selectedBackground}&accessories=glasses&hair=short&clothing=blazer&size=150`;
  } else {
    // For other styles, use simple professional setup
    avatarUrl = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${selectedBackground}&size=150`;
  }
  
  return avatarUrl;
};

// Get all available professional avatars for selection (only 2 profile pictures)
export const getProfessionalAvatars = () => {
  return [
    {
      id: 1,
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional1&backgroundColor=b6e3f4&clothingColor=262e33&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=724133&hatColor=ff488e&mouthType=smile&skinColor=ae5d29&topType=shortHairShortWaved",
      name: "Professional Manager",
      style: "business"
    },
    {
      id: 2,
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=professional2&backgroundColor=c7d2fe&clothingColor=3c4858&eyebrowType=default&eyeType=default&facialHairType=blank&hairColor=2c1b18&mouthType=smile&skinColor=f8d25c&topType=shortHairShortFlat",
      name: "Business Executive",
      style: "business"
    }
  ];
};

// Get avatars by style category
export const getAvatarsByStyle = (style) => {
  return getProfessionalAvatars().filter(avatar => avatar.style === style);
};

// Get a random professional avatar
export const getRandomProfessionalAvatar = () => {
  const avatars = getProfessionalAvatars();
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Get available avatar styles (simplified to only business style)
export const getAvatarStyles = () => {
  return [
    { key: 'business', name: 'Business Professional', description: 'Professional cartoon-style avatars for business use' }
  ];
};

// Create an avatar image element (returns object with props for img element)
export const createAvatarImageProps = (src, alt, size = 80, className = "", fallbackSeed = "default") => {
  return {
    src: src || generateDefaultAvatar(fallbackSeed),
    alt: alt,
    className: className,
    style: {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      objectFit: "cover",
      background: "white",
      border: "2px solid #e9ecef"
    },
    onError: (e) => {
      // If the image fails to load, generate a default avatar
      const fallbackAvatar = generateDefaultAvatar(fallbackSeed);
      e.target.src = fallbackAvatar;
    }
  };
};

// Get initials for fallback display
export const getInitials = (firstName = "", lastName = "") => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return first + last || "U";
};

// Validate if URL is a valid avatar URL
export const isValidAvatarUrl = (url) => {
  if (!url) return false;
  
  try {
    const validDomains = [
      'api.dicebear.com',
      'avatars.dicebear.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ];
    
    const urlObj = new URL(url);
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};
