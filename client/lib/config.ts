/**
 * Centralized API configuration
 * Uses local API proxy: /api.php (works in both dev and production)
 * The local API can be configured to forward to external APIs via server-side proxy
 */

const apiUrl = "/api.php";

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
  BASE_URL: primaryApiUrl,
  FALLBACK_URL: fallbackApiUrl,
  PRIMARY_URL: primaryApiUrl,
} as const;
