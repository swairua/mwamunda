/**
 * Centralized API configuration
 * Update this URL to change the API endpoint across the entire application
 * Use environment variable VITE_API_BASE_URL to override the default
 */

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://mwamunda.ziratech.com/api.php";

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
