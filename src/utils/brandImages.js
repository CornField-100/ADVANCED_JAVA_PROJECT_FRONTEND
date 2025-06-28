// Brand-specific placeholder images utility
// This utility provides brand-specific images when products don't have their own images

export const getBrandImage = (brandName) => {
  if (!brandName) return getDefaultImage();

  const brand = brandName.toLowerCase().trim();

  // Brand image mappings using high-quality placeholder services
  const brandImages = {
    // Tech Brands
    samsung:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format",
    apple:
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop&auto=format",
    sony: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
    lg: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&auto=format",
    dell: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format",
    hp: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format",
    lenovo:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop&auto=format",
    asus: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop&auto=format",
    acer: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop&auto=format",
    microsoft:
      "https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=400&h=400&fit=crop&auto=format",

    // Gaming
    nintendo:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
    playstation:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
    xbox: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop&auto=format",

    // Audio
    bose: "https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=400&h=400&fit=crop&auto=format",
    beats:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format",
    jbl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format",
    sennheiser:
      "https://images.unsplash.com/photo-1583394838974-15c9be6a7870?w=400&h=400&fit=crop&auto=format",
    airpods:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&auto=format",

    // Mobile
    iphone:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop&auto=format",
    google:
      "https://images.unsplash.com/photo-1533519320561-4b324479de00?w=400&h=400&fit=crop&auto=format",
    oneplus:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format",
    xiaomi:
      "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=400&fit=crop&auto=format",
    huawei:
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&auto=format",

    // Cameras
    canon:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&auto=format",
    nikon:
      "https://images.unsplash.com/photo-1606983340119-2ab5c6ea55eb?w=400&h=400&fit=crop&auto=format",
    fujifilm:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&auto=format",
    gopro:
      "https://images.unsplash.com/photo-1551798507-629020c81463?w=400&h=400&fit=crop&auto=format",

    // Tablets
    ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&auto=format",
    surface:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=400&fit=crop&auto=format",

    // Smartwatches
    watch:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format",
    fitbit:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&auto=format",
    garmin:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format",

    // Generic categories
    laptop:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format",
    phone:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format",
    tablet:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&auto=format",
    headphones:
      "https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=400&h=400&fit=crop&auto=format",
    speaker:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format",
    camera:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&auto=format",
    gaming:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
    console:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
  };

  // Try exact match first
  if (brandImages[brand]) {
    return brandImages[brand];
  }

  // Try partial matches for compound brand names
  for (const [key, image] of Object.entries(brandImages)) {
    if (brand.includes(key) || key.includes(brand)) {
      return image;
    }
  }

  // Try to match common brand patterns
  if (
    brand.includes("apple") ||
    brand.includes("iphone") ||
    brand.includes("ipad") ||
    brand.includes("mac")
  ) {
    return brandImages["apple"];
  }

  if (brand.includes("samsung") || brand.includes("galaxy")) {
    return brandImages["samsung"];
  }

  if (
    brand.includes("gaming") ||
    brand.includes("game") ||
    brand.includes("console")
  ) {
    return brandImages["gaming"];
  }

  if (
    brand.includes("laptop") ||
    brand.includes("notebook") ||
    brand.includes("computer")
  ) {
    return brandImages["laptop"];
  }

  if (
    brand.includes("phone") ||
    brand.includes("mobile") ||
    brand.includes("smartphone")
  ) {
    return brandImages["phone"];
  }

  if (
    brand.includes("headphone") ||
    brand.includes("earphone") ||
    brand.includes("earbuds")
  ) {
    return brandImages["headphones"];
  }

  if (brand.includes("speaker") || brand.includes("audio")) {
    return brandImages["speaker"];
  }

  if (brand.includes("camera") || brand.includes("photo")) {
    return brandImages["camera"];
  }

  if (
    brand.includes("watch") ||
    brand.includes("fitness") ||
    brand.includes("tracker")
  ) {
    return brandImages["watch"];
  }

  // If no match found, return a generic tech product image
  return getDefaultImage();
};

export const getDefaultImage = () => {
  // Beautiful generic tech product image
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format";
};

// Get category-specific image based on model name
export const getCategoryImage = (modelName) => {
  if (!modelName) return getDefaultImage();

  const model = modelName.toLowerCase().trim();

  // Category detection based on model names
  const categories = {
    iphone:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop&auto=format",
    ipad: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&auto=format",
    macbook:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format",
    galaxy:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&auto=format",
    airpods:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&auto=format",
    watch:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop&auto=format",
    surface:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400&h=400&fit=crop&auto=format",
    xbox: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop&auto=format",
    playstation:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
    nintendo:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop&auto=format",
  };

  // Try to find a match
  for (const [key, image] of Object.entries(categories)) {
    if (model.includes(key)) {
      return image;
    }
  }

  return getDefaultImage();
};

// Get the best image for a product (tries imageUrl first, then brand, then model, then default)
export const getProductImage = (product) => {
  // If product has its own image, use it
  if (product.imageUrl && product.imageUrl.trim() !== "") {
    return product.imageUrl;
  }

  // Try brand-specific image
  if (product.brand) {
    const brandImage = getBrandImage(product.brand);
    if (brandImage !== getDefaultImage()) {
      return brandImage;
    }
  }

  // Try model-specific image
  if (product.Model || product.model) {
    const modelImage = getCategoryImage(product.Model || product.model);
    if (modelImage !== getDefaultImage()) {
      return modelImage;
    }
  }

  // Fallback to default
  return getDefaultImage();
};

// Add some visual indicators for different brands
export const getBrandColors = (brandName) => {
  if (!brandName) return { primary: "#007bff", secondary: "#6c757d" };

  const brand = brandName.toLowerCase().trim();

  const brandColors = {
    apple: { primary: "#000000", secondary: "#f5f5f7" },
    samsung: { primary: "#1f65f1", secondary: "#74b9ff" },
    sony: { primary: "#000000", secondary: "#ff6b35" },
    lg: { primary: "#a50034", secondary: "#ff4757" },
    dell: { primary: "#007db8", secondary: "#74b9ff" },
    hp: { primary: "#0096d6", secondary: "#74b9ff" },
    microsoft: { primary: "#00bcf2", secondary: "#74b9ff" },
    google: { primary: "#4285f4", secondary: "#ea4335" },
    bose: { primary: "#000000", secondary: "#ddd" },
    beats: { primary: "#fa233b", secondary: "#000" },
    nintendo: { primary: "#e60012", secondary: "#0066cc" },
    xbox: { primary: "#107c10", secondary: "#000" },
    playstation: { primary: "#003087", secondary: "#00d4ff" },
  };

  return brandColors[brand] || { primary: "#007bff", secondary: "#6c757d" };
};

export default {
  getBrandImage,
  getDefaultImage,
  getCategoryImage,
  getProductImage,
  getBrandColors,
};
