/**
 * Centralized API configuration with fallback support
 * Primary: https://mwamunda.ziratech.com/api.php (external API)
 * Fallback: /api.php (local development API)
 */

const primaryApiUrl = "https://mwamunda.ziratech.com/api.php";
const fallbackApiUrl = "/api.php";

// Track which API is currently active
let activeApiUrl = primaryApiUrl;
let apiHealthStatus: { primary: boolean; fallback: boolean } = {
  primary: true,
  fallback: true,
};

// Log the configured API URL for debugging
if (typeof window !== "undefined") {
  console.log(
    `[API Config] Primary endpoint: ${primaryApiUrl}, Fallback: ${fallbackApiUrl}`,
  );
}

/**
 * Attempt a fetch request with automatic fallback
 * Tries primary API first, falls back to local API if CORS or other issues occur
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const isExternalUrl = url.startsWith("http");

  // If it's already an external URL, try it directly
  if (isExternalUrl) {
    try {
      const response = await fetch(url, {
        ...options,
        mode: "cors",
      });

      if (response.ok) {
        activeApiUrl = url;
        apiHealthStatus.primary = true;
        return response;
      }

      // If primary fails and we haven't tried fallback yet, try fallback
      if (url === primaryApiUrl && apiHealthStatus.fallback) {
        console.warn(
          `[API] Primary API failed with status ${response.status}, attempting fallback...`,
        );
        apiHealthStatus.primary = false;
        return apiFetch(fallbackApiUrl, options);
      }

      return response;
    } catch (error) {
      console.error(`[API] Error with ${url}:`, error);

      // If primary fails with network error and fallback is available, try fallback
      if (url === primaryApiUrl && apiHealthStatus.fallback) {
        console.warn(
          `[API] Primary API failed (${error instanceof Error ? error.message : "network error"}), attempting fallback...`,
        );
        apiHealthStatus.primary = false;
        return apiFetch(fallbackApiUrl, options);
      }

      throw error;
    }
  }

  // For relative URLs, use the fallback (local API)
  try {
    const response = await fetch(url, {
      ...options,
      mode: "cors",
    });

    if (response.ok) {
      activeApiUrl = fallbackApiUrl;
      apiHealthStatus.fallback = true;
    }

    return response;
  } catch (error) {
    console.error(`[API] Error with fallback ${url}:`, error);
    throw error;
  }
}

/**
 * Get the full API URL with automatic fallback selection
 */
export function getApiUrl(path: string = ""): string {
  const baseUrl = apiHealthStatus.primary ? primaryApiUrl : fallbackApiUrl;
  return path ? `${baseUrl}${path}` : baseUrl;
}

/**
 * Get the currently active API URL
 */
export function getActiveApiUrl(): string {
  return activeApiUrl;
}

export const API_CONFIG = {
  BASE_URL: primaryApiUrl,
  FALLBACK_URL: fallbackApiUrl,
  PRIMARY_URL: primaryApiUrl,
} as const;
