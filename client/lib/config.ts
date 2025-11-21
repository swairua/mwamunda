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
 * Makes requests to the remote API endpoint with CORS enabled
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      mode: "cors",
    });

    if (!response.ok) {
      console.warn(`[API] Response status ${response.status} from ${url}`);
    }

    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[API] Error with API call to ${url}:`, errorMsg);

    if (error instanceof TypeError && errorMsg.includes("fetch")) {
      console.error(
        "[API] CORS or network error. Verify the remote endpoint is accessible and has proper CORS headers.",
      );
    }

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
