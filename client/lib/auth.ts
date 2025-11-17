import { API_CONFIG } from "./config";

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
  token?: string;
  userId?: number;
  error?: string;
}

export async function initializeUsersTable(): Promise<any> {
  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "init_users_table",
    }),
  });
  return response.json();
}

export async function registerUser(
  email: string,
  password: string,
  name?: string,
): Promise<AuthResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "register", email, password, name }),
  });
  return response.json();
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "login", email, password }),
  });
  return response.json();
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}?table=users&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  throw new Error("User not found");
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}?table=users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Handle API error responses
  if (data.error) {
    throw new Error(data.error);
  }

  // Ensure we return an array
  if (!Array.isArray(data)) {
    console.warn("getAllUsers returned non-array response:", data);
    return [];
  }

  return data;
}

// Local storage helpers
export function saveUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function clearUser(): void {
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getStoredUser();
}
