import { ADMIN_USER_KEY, apiFetch, getApiUrl } from "./config";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  userId?: number;
  error?: string;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

/** Reads a JSON body without throwing on an empty or non-JSON response. */
async function readJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

/**
 * Signs in. On success the server sets an HttpOnly session cookie; nothing
 * secret is handed to JavaScript.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiFetch(
    getApiUrl(),
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ action: "login", email, password }),
    },
    // A wrong password is a 401 too; the login page shows it itself.
    { redirectOnUnauthorized: false },
  );
  const data = await readJson(response);

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: "",
      error: data.error || "Login failed",
    };
  }
  return data;
}

/** Ends the session on the server and forgets the cached profile. */
export async function logoutUser(): Promise<void> {
  try {
    await apiFetch(
      getApiUrl(),
      {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ action: "logout" }),
      },
      { redirectOnUnauthorized: false },
    );
  } catch {
    // Offline or server down: still sign out locally.
  } finally {
    clearUser();
  }
}

/**
 * Asks the server who is signed in. Returns null when nobody is; throws when
 * the server cannot be reached, so callers can tell the two apart.
 */
export async function fetchSession(): Promise<User | null> {
  const response = await apiFetch(
    getApiUrl("?action=session"),
    { method: "GET" },
    { redirectOnUnauthorized: false },
  );

  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await readJson(response);
  return data.user ?? null;
}

/** Creates another admin account. Only a signed-in admin can do this. */
export async function createAdminUser(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  const response = await apiFetch(getApiUrl(), {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ action: "create_user", email, password, name }),
  });
  const data = await readJson(response);

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: "",
      error: data.error || "Could not create the account",
    };
  }
  return data;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await apiFetch(`${getApiUrl()}?table=users`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Ensure we return an array
  if (!Array.isArray(data)) {
    console.warn("getAllUsers returned non-array response:", data);
    return [];
  }

  return data;
}

/*
 * The signed-in admin's profile is cached in localStorage so pages can show a
 * name without waiting. It grants nothing: the server checks the session
 * cookie on every request, and RequireAdmin refreshes this copy from it.
 */
export function saveUser(user: User): void {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  try {
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getStoredUser();
}
