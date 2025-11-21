import { apiFetch, getApiUrl } from "./config";

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  features?: string;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function initProductsTable(): Promise<{
  success?: boolean;
  message?: string;
  error?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await apiFetch(getApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "init_products_table",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error("Failed to initialize products table");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "API request timed out (30s). Server may be slow or unreachable.",
      );
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to initialize products table";
    console.error("Error initializing products table:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getProducts(): Promise<Product[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const url = `${API_CONFIG.BASE_URL}?table=products`;
    console.log(`[getProducts] Fetching from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      mode: "cors",
    });

    clearTimeout(timeoutId);

    console.log(
      `[getProducts] Response status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[getProducts] Error response body: ${errorText}`);
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log(
      `[getProducts] Successfully parsed ${data.length || 0} products`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("[getProducts] Request timed out after 30s");
      throw new Error(
        "API request timed out (30s). Server may be slow or unreachable.",
      );
    }
    if (error instanceof TypeError) {
      console.error("[getProducts] Network error:", error.message);
      throw new Error(
        `Cannot connect to API at ${API_CONFIG.BASE_URL}. The server may be down, unreachable, or have CORS issues.`,
      );
    }
    console.error("[getProducts] Unexpected error:", error);
    throw error;
  }
}

export async function getRecentProducts(limit: number = 5): Promise<Product[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}?table=products&orderBy=created_at&order=DESC&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        mode: "cors",
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch recent products");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "API request timed out (30s). Server may be slow or unreachable.",
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        `Cannot connect to API at ${API_CONFIG.BASE_URL}. The server may be down, unreachable, or have CORS issues.`,
      );
    }
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}?table=products&id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        mode: "cors",
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const products = await response.json();
    return products[0];
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "API request timed out (30s). Server may be slow or unreachable.",
      );
    }
    if (error instanceof TypeError) {
      throw new Error(`Cannot connect to API at ${API_CONFIG.BASE_URL}`);
    }
    throw error;
  }
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at" | "updated_at">,
): Promise<{
  success: boolean;
  id?: number;
  error?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await apiFetch(getApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "products",
        data,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("API request timed out (30s)");
    }
    throw error;
  }
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await apiFetch(getApiUrl(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "products",
        id,
        data,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("API request timed out (30s)");
    }
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<{
  success: boolean;
  error?: string;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}?table=products&id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        mode: "cors",
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("API request timed out (30s)");
    }
    throw error;
  }
}
