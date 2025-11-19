/**
 * Centralized API configuration
 * Update this URL to change the API endpoint across the entire application
 * Use environment variable VITE_API_BASE_URL to override the default
 *
 * Default: Local API endpoint (/api.php)
 * Production: Set VITE_API_BASE_URL=https://mwamunda.ziratech.com/api.php
 */

const defaultApiUrl = "/api.php";
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || defaultApiUrl;

export const API_CONFIG = {
  BASE_URL: apiBaseUrl,
} as const;
