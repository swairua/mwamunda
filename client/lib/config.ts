/**
 * Centralized API configuration
 * Update this URL to change the API endpoint across the entire application
 * Use environment variable VITE_API_BASE_URL to override the default
 * In development, uses relative path /api.php (proxied to localhost:8000)
 * In production, uses the absolute API URL
 */

const isDevelopment = import.meta.env.MODE === "development";
const defaultApiUrl = isDevelopment ? "/api.php" : "/api.php";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
