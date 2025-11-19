import { API_CONFIG } from "./config";

export async function initApplicationsTable(): Promise<{
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
        action: "init_applications_table",
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error("Failed to initialize applications table");
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to initialize applications table";
    console.error("Error initializing applications table:", errorMessage);
    throw new Error(errorMessage);
  }
}

export type ApplicationStatus = "pending" | "approved" | "rejected";
export type ProductType =
  | "fair-personal-loans"
  | "chama-loans"
  | "debt-advice-services"
  | "financial-capability-training";

export interface Application {
  id?: number;
  product_type: ProductType;
  full_name: string;
  email: string;
  phone: string;
  national_id?: string;
  date_of_birth?: string;
  residential_address?: string;
  business_type?: string;
  business_name?: string;
  business_registration?: string;
  monthly_income?: number;
  requested_amount?: number;
  loan_purpose?: string;
  employment_status?: string;
  nearest_branch?: string;
  bank_account?: string;
  bank_name?: string;
  additional_info?: string;
  status?: ApplicationStatus;
  admin_notes?: string;
  approved_amount?: number;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  id?: number;
  error?: string;
}

export async function submitApplication(
  application: Application,
): Promise<ApplicationResponse> {
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "applications",
        data: {
          product_type: application.product_type,
          full_name: application.full_name,
          email: application.email,
          phone: application.phone,
          national_id: application.national_id || null,
          date_of_birth: application.date_of_birth || null,
          residential_address: application.residential_address || null,
          business_type: application.business_type || null,
          business_name: application.business_name || null,
          business_registration: application.business_registration || null,
          monthly_income: application.monthly_income || null,
          requested_amount: application.requested_amount || null,
          loan_purpose: application.loan_purpose || null,
          employment_status: application.employment_status || null,
          nearest_branch: application.nearest_branch || null,
          bank_account: application.bank_account || null,
          bank_name: application.bank_name || null,
          additional_info: application.additional_info || null,
          status: "pending",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit application";
    console.error("Error submitting application:", error);
    throw new Error(errorMessage);
  }
}

export async function getAllApplications(): Promise<Application[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}?table=applications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data)) {
        console.warn("getAllApplications returned non-array response:", data);
        return [];
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "API request timed out. The server may be slow or unreachable.",
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch applications";
    console.error("Error fetching applications:", error);
    throw new Error(errorMessage);
  }
}

export async function getApplicationById(
  id: number,
): Promise<Application | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}?table=applications&id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch application";
    console.error("Error fetching application:", error);
    throw new Error(errorMessage);
  }
}

export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
  approvedAmount?: number,
): Promise<ApplicationResponse> {
  try {
    const updateData: Record<string, unknown> = { status };

    if (approvedAmount !== undefined) {
      updateData.approved_amount = approvedAmount;
    }

    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "applications",
        id,
        data: updateData,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update application status";
    console.error("Error updating application status:", error);
    throw new Error(errorMessage);
  }
}

export async function addAdminNotes(
  id: number,
  notes: string,
): Promise<ApplicationResponse> {
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "applications",
        id,
        data: { admin_notes: notes },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to add admin notes";
    console.error("Error adding admin notes:", error);
    throw new Error(errorMessage);
  }
}

export async function rejectApplication(
  id: number,
  reason: string,
): Promise<ApplicationResponse> {
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table: "applications",
        id,
        data: {
          status: "rejected",
          rejection_reason: reason,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to reject application";
    console.error("Error rejecting application:", error);
    throw new Error(errorMessage);
  }
}

export async function deleteApplication(
  id: number,
): Promise<ApplicationResponse> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}?table=applications&id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete application";
    console.error("Error deleting application:", error);
    throw new Error(errorMessage);
  }
}
