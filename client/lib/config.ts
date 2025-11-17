/**
 * Centralized API configuration
 * Update this URL to change the API endpoint across the entire application
 */

export const API_CONFIG = {
  BASE_URL: "https://mwamunda.ziratech.com/api.php",
} as const;

export const getApiUrl = (path?: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  if (!path) return baseUrl;
  return `${baseUrl}${path}`;
};
