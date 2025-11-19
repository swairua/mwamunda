/**
 * Centralized API configuration
 * Default: https://mwamunda.ziratech.com/api.php (for both dev and production)
 * Override: Use environment variable VITE_API_BASE_URL if needed
 */

const defaultApiUrl = "https://mwamunda.ziratech.com/api.php";
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
