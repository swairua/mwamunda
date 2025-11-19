/**
 * Centralized API configuration
 * Default: /api.php (relative path - works with proxies in both dev and production)
 * This ensures Apache proxy on fly.dev can intercept and forward to the actual API
 */

const defaultApiUrl = "/api.php";
const apiBaseUrl = defaultApiUrl;

// Log the configured API URL for debugging
if (typeof window !== 'undefined') {
  console.log(`[API Config] Using API endpoint: ${apiBaseUrl}`);
}

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
