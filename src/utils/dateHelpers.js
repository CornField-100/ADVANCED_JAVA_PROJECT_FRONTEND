// Date utility functions for handling different date formats
import { format, parseISO } from "date-fns";

/**
 * Safely parse a date that might be a string, Date object, or timestamp
 * @param {string|Date|number} dateInput - The date to parse
 * @returns {Date} - A valid Date object
 */
export const safeParseDate = (dateInput) => {
  if (!dateInput) {
    return new Date();
  }

  // If it's already a Date object
  if (dateInput instanceof Date) {
    return dateInput;
  }

  // If it's a number (timestamp)
  if (typeof dateInput === "number") {
    return new Date(dateInput);
  }

  // If it's a string
  if (typeof dateInput === "string") {
    // Try parseISO first (for ISO format strings)
    if (dateInput.includes("T") || dateInput.includes("-")) {
      try {
        return parseISO(dateInput);
      } catch (error) {
        console.warn("Failed to parse ISO date:", dateInput);
      }
    }

    // Fallback to new Date()
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Ultimate fallback
  console.warn("Could not parse date:", dateInput, "using current date");
  return new Date();
};

/**
 * Safely format a date for display
 * @param {string|Date|number} dateInput - The date to format
 * @param {string} formatString - The format string (default: "MMM dd, yyyy")
 * @returns {string} - Formatted date string
 */
export const safeFormatDate = (dateInput, formatString = "MMM dd, yyyy") => {
  try {
    const date = safeParseDate(dateInput);
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return "Invalid Date";
  }
};

/**
 * Check if a date is today
 * @param {string|Date|number} dateInput - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isToday = (dateInput) => {
  try {
    const date = safeParseDate(dateInput);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "yesterday")
 * @param {string|Date|number} dateInput - The date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateInput) => {
  try {
    const date = safeParseDate(dateInput);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return safeFormatDate(date, "MMM dd, yyyy");
    }
  } catch (error) {
    return "Unknown time";
  }
};
