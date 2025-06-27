// Automatically switch between local and production based on hostname
export const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001"
    : "https://advanced-java-project.onrender.com";

console.log("Using API Base URL:", BASE_URL);
