/**
 * Centralized API configuration
 * Uses remote API endpoint: https://mwamunda.ziratech.com/api.php
 */

const apiUrl = "https://mwamunda.ziratech.com/api.php";

// Log the configured API URL for debugging
if (typeof window !== "undefined") {
  console.log(`[API Config] Using API endpoint: ${apiUrl}`);
}

/**
 * Fetch wrapper for API calls
 * Uses the local API proxy which works in both dev and production environments
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
    });

    return response;
  } catch (error) {
    console.error(`[API] Error with API call:`, error);
    throw error;
  }
}

/**
 * Get the full API URL
 */
export function getApiUrl(path: string = ""): string {
  return path ? `${apiUrl}${path}` : apiUrl;
}

/**
 * Get the currently active API URL
 */
export function getActiveApiUrl(): string {
  return apiUrl;
}

export const API_CONFIG = {
  BASE_URL: apiUrl,
  FALLBACK_URL: apiUrl,
  PRIMARY_URL: apiUrl,
} as const;
