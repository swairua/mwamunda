/**
 * Centralized API configuration
 * Update this URL to change the API endpoint across the entire application
 * Use environment variable VITE_API_BASE_URL to override the default
 */

const defaultApiUrl = "https://mwamunda.ziratech.com/api.php";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;

export const getApiUrl = (path?: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!path) return baseUrl;
  return `${baseUrl}${path}`;
};
