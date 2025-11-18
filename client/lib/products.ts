import { API_CONFIG } from "./config";

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
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "init_products_table",
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error("Failed to initialize products table");
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to initialize products table";
    console.error("Error initializing products table:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}?table=products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getRecentProducts(limit: number = 5): Promise<Product[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}?table=products&orderBy=created_at&order=DESC&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent products");
  }

  return response.json();
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_CONFIG.BASE_URL}?table=products&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const products = await response.json();
  return products[0];
}

export async function createProduct(
  data: Omit<Product, "id" | "created_at" | "updated_at">,
): Promise<{
  success: boolean;
  id?: number;
  error?: string;
}> {
  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table: "products",
      data,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await fetch(API_CONFIG.BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table: "products",
      id,
      data,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<{
  success: boolean;
  error?: string;
}> {
  const response = await fetch(`${API_CONFIG.BASE_URL}?table=products&id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
}
