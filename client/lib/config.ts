/**
 * Centralized API configuration
 * Default: /api.php (relative path - works with proxies in both dev and production)
 * Override: Use environment variable VITE_API_BASE_URL if needed
 *
 * For production, set: VITE_API_BASE_URL=https://mwamunda.ziratech.com/api.php
 */

const defaultApiUrl = "/api.php";
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
