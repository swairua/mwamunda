/**
 * Centralized API configuration.
 *
 * The PHP API (api.php) is deployed next to index.html at the domain root,
 * so all calls use the same-origin relative URL /api.php. VITE_API_BASE_URL
 * is only needed when the API lives on a different origin (dev/staging).
 */

function getConfiguredApiUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "/api.php";
}

const apiUrl = getConfiguredApiUrl();

// Log the configured API URL for debugging
if (typeof window !== "undefined") {
  console.log(
    `[API Config] Using API endpoint: ${apiUrl} (PROD: ${import.meta.env.PROD})`,
  );
}

/**
 * Fetch wrapper for API calls.
 * Logs response status and network errors, then lets the caller handle them.
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
        "[API] Network or CORS error. Verify api.php is deployed and reachable.",
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
  PRIMARY_URL: apiUrl,
} as const;
