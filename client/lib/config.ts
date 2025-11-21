/**
 * Centralized API configuration
 * In production: uses https://mwamunda.ziratech.com/api.php with /api.php fallback
 * In development: uses environment variable or local endpoint
 */

function getConfiguredApiUrl(): string {
  // Check environment variable first (for development/staging with custom URL)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // In production: use primary production URL, with fallback to relative path
  if (import.meta.env.PROD) {
    return "https://mwamunda.ziratech.com/api.php";
  }

  // In development: use relative path (local API server on port 8000)
  return "/api.php";
}

const apiUrl = getConfiguredApiUrl();

// Log the configured API URL for debugging
if (typeof window !== "undefined") {
  console.log(
    `[API Config] Using API endpoint: ${apiUrl} (PROD: ${import.meta.env.PROD})`,
  );
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
  PRODUCTION_URL: "https://mwamunda.ziratech.com/api.php",
  FALLBACK_URL: "/api.php", // Production fallback (same domain)
  PRIMARY_URL: apiUrl,
} as const;
