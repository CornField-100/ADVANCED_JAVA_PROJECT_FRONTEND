import { generateDefaultAvatar } from '../utils/avatarUtils';

const AvatarImage = ({ src, alt, size = 80, className = "", fallbackSeed = "default" }) => {
  const handleImageError = (e) => {
    // If the image fails to load, generate a default avatar
    const fallbackAvatar = generateDefaultAvatar(fallbackSeed);
    e.target.src = fallbackAvatar;
  };
  
  return (
    <img
      src={src || generateDefaultAvatar(fallbackSeed)}
      alt={alt}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        objectFit: "cover",
        background: "white",
        border: "2px solid #e9ecef"
      }}
      onError={handleImageError}
    />
  );
};

export default AvatarImage;
