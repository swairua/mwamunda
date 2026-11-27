/**
 * Centralized API configuration.
 *
 * The API is served from the same origin as the site (/api.php), which is
 * what lets the admin session cookie (HttpOnly, SameSite=Strict) work.
 * VITE_API_BASE_URL can point somewhere else for development; a different
 * origin must be on the API's allow-list (ALLOWED_ORIGINS).
 */

const apiUrl: string = import.meta.env.VITE_API_BASE_URL || "/api.php";

/** localStorage key for the signed-in admin's profile (display only). */
export const ADMIN_USER_KEY = "user";

const LOGIN_PATH = "/admin/login";

/**
 * The server said "not signed in": forget the cached profile and, inside the
 * admin area, go back to the login page.
 */
function handleUnauthorized(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    // Storage can be unavailable (private mode); nothing to clear then.
  }

  const { pathname } = window.location;
  if (pathname.startsWith("/admin") && pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
}

interface ApiFetchBehaviour {
  /** Set to false when the caller handles a 401 itself. */
  redirectOnUnauthorized?: boolean;
}

/**
 * Fetch wrapper for API calls. Always sends the session cookie, and treats a
 * 401 as "signed out" (see handleUnauthorized).
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
  { redirectOnUnauthorized = true }: ApiFetchBehaviour = {},
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && redirectOnUnauthorized) {
    handleUnauthorized();
  }

  return response;
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
} as const;
