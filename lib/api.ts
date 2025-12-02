/**
 * API Utility Functions
 * Centralized API client for backend communication
 */

// Get API URL - check both server-side and client-side
export const getApiUrl = () => {
  // Client-side: check window location for production
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // If running on production domain, use production API
    if (
      hostname === "publisherauthority.com" ||
      hostname.includes("publisherauthority.com")
    ) {
      return "https://publisherauthority.com/api/v1";
    }
    // Otherwise use env variable or localhost
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api/v1";
  }
  // Server-side: use env variable or default
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003/api/v1";
};

const API_URL = getApiUrl();

// Log API URL in development for debugging
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  console.log("🔗 API URL:", API_URL);
  console.log("💡 Make sure backend is running on port 5003");
}

// Type definitions
interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiError extends Error {
  message: string;
}

interface WebsiteData {
  url: string;
  domain?: string;
  [key: string]: unknown;
}

interface OrderData {
  [key: string]: unknown;
}

interface ProfileData {
  [key: string]: unknown;
}

interface ApplicationData {
  [key: string]: unknown;
}

interface BlogPostData {
  [key: string]: unknown;
}

interface SupportTicketData {
  [key: string]: unknown;
}

interface Filters {
  status?: string;
  category?: string;
  priority?: string;
  publisherId?: string;
  [key: string]: string | undefined;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, requiresAuth = true } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    // Backend returns { success: true, data: {...} } format
    // Return data directly (it already has success, message, data structure)
    return data;
  } catch (error: unknown) {
    console.error("API request failed:", error);
    console.error("API URL:", `${API_URL}${endpoint}`);
    // Handle network errors
    const apiError = error as ApiError;
    if (
      apiError.name === "TypeError" &&
      (apiError.message?.includes("fetch") || apiError.message === "Failed to fetch")
    ) {
      throw new Error(
        `Unable to connect to backend server at ${API_URL}. ` +
          `Please ensure the backend is running on port 5003. ` +
          `Error: ${apiError.message || "Unknown error"}`
      );
    }
    throw error;
  }
}

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest<{
      user: Record<string, unknown>;
      stats: Record<string, unknown>;
      levelProgress: Record<string, unknown>;
      recentOrders: unknown[];
      upcomingDeadlines: unknown[];
    }>("/dashboard", { method: "GET" }),
};

// Websites API
export const websitesApi = {
  addWebsite: (data: WebsiteData) =>
    apiRequest("/websites", { method: "POST", body: data }),
  getWebsites: (filters?: Filters) => {
    const query = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
    return apiRequest(`/websites${query}`, { method: "GET" });
  },
  getWebsite: (id: string) => apiRequest(`/websites/${id}`, { method: "GET" }),
  updateWebsite: (id: string, data: WebsiteData) =>
    apiRequest(`/websites/${id}`, { method: "PUT", body: data }),
  deleteWebsite: (id: string) =>
    apiRequest(`/websites/${id}`, { method: "DELETE" }),
  bulkAddWebsites: (data: WebsiteData[]) =>
    apiRequest("/websites/bulk", { method: "POST", body: { websites: data } }),
  verifyWebsite: (id: string) =>
    apiRequest(`/websites/${id}/verify/tag`, {
      method: "POST",
      body: { tag: "" },
    }), // Will be handled by component
  verifyWebsiteTag: (id: string, tag: string) =>
    apiRequest(`/websites/${id}/verify/tag`, { method: "POST", body: { tag } }),
  verifyWebsiteArticle: (id: string, articleUrl: string) =>
    apiRequest(`/websites/${id}/verify/article`, {
      method: "POST",
      body: { articleUrl },
    }),
  respondToCounterOffer: (id: string, accept: boolean) =>
    apiRequest(`/websites/${id}/counter-offer/respond`, {
      method: "POST",
      body: { accept },
    }),
};

// Orders API
export const ordersApi = {
  getOrders: (filters?: Filters) => {
    const query = filters ? `?${new URLSearchParams(filters as Record<string, string>).toString()}` : "";
    return apiRequest(`/orders${query}`, { method: "GET" });
  },
  getOrder: (id: string) => apiRequest(`/orders/${id}`, { method: "GET" }),
  createOrder: (data: OrderData) =>
    apiRequest("/admin/orders", { method: "POST", body: data }),
  updateOrder: (id: string, data: OrderData) =>
    apiRequest(`/admin/orders/${id}`, { method: "PUT", body: data }),
  submitOrder: (
    id: string,
    data: { submissionUrl: string; submissionNotes?: string }
  ) =>
    apiRequest(`/orders/${id}/submit`, {
      method: "POST",
      body: { submittedUrl: data.submissionUrl, notes: data.submissionNotes },
    }),
  requestRevision: (id: string, reason: string) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: { status: "revision-requested", notes: reason },
    }),
  cancelOrder: (id: string, reason: string) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: { status: "cancelled", notes: reason },
    }),
  completeOrder: (id: string) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: { status: "completed" },
    }),
};

// Payments API
export const paymentsApi = {
  getPayments: () => apiRequest("/payments", { method: "GET" }),
  getInvoices: () => apiRequest("/payments", { method: "GET" }), // Same endpoint
  updatePaypalEmail: (email: string) =>
    apiRequest("/payments/settings", {
      method: "PUT",
      body: { paypalEmail: email },
    }),
  downloadInvoice: (id: string) => {
    const token = localStorage.getItem("authToken");
    return fetch(`${API_URL}/payments/${id}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to download invoice");
      return res.blob();
    });
  },
};

// Profile API
export const profileApi = {
  getProfile: () => apiRequest("/auth/me", { method: "GET" }),
  updateProfile: (data: ProfileData) => {
    const token = localStorage.getItem("authToken");
    return fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest("/users/change-password", { method: "POST", body: data }),
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetch(`${API_URL}/users/profile/image`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
  },
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
      requiresAuth: false,
    }),
  register: (data: ApplicationData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: data,
      requiresAuth: false,
    }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: { email },
      requiresAuth: false,
    }),
};

// Applications API
export const applicationsApi = {
  submitApplication: (data: FormData | ApplicationData) => {
    // If FormData, use fetch directly for file upload
    if (data instanceof FormData) {
      const token = localStorage.getItem("authToken");
      const API_URL = getApiUrl();
      
      return fetch(`${API_URL}/applications`, {
        method: "POST",
        body: data,
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.json().catch(() => ({ message: "An error occurred" }));
          throw new Error(error.message || `HTTP error! status: ${res.status}`);
        }
        return res.json();
      });
    }
    
    // Otherwise use regular apiRequest
    return apiRequest("/applications", {
      method: "POST",
      body: data,
      requiresAuth: false,
    });
  },
  getApplications: () =>
    apiRequest("/applications", { method: "GET" }),
  reviewApplication: (
    id: string,
    decision: "approve" | "reject",
    notes?: string
  ) =>
    apiRequest(`/applications/${id}/review`, {
      method: "POST",
      body: { decision, notes },
    }),
};

// Admin API
export const adminApi = {
  getDashboard: () => apiRequest("/admin/dashboard", { method: "GET" }),
  getAllWebsites: (filters?: Filters, page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) params.append("status", filters.status);
    return apiRequest(`/admin/websites?${params.toString()}`, {
      method: "GET",
    });
  },
  updateWebsiteStatus: (id: string, status: string, reason?: string) =>
    apiRequest(`/admin/websites/${id}/status`, {
      method: "PUT",
      body: { status, rejectionReason: reason },
    }),
  sendCounterOffer: (id: string, data: { notes: string; terms: string }) =>
    apiRequest(`/admin/websites/${id}/counter-offer`, {
      method: "POST",
      body: data,
    }),
  getAllOrders: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.publisherId) params.append("publisherId", filters.publisherId);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/admin/orders${query}`, { method: "GET" });
  },
  processPayment: (id: string) =>
    apiRequest(`/admin/payments/${id}/process`, { method: "PUT" }),
  markPaymentAsPaid: (id: string) =>
    apiRequest(`/admin/payments/${id}/mark-paid`, { method: "PUT" }),
  updateUserLevel: (userId: string, level: string) =>
    apiRequest(`/admin/publishers/${userId}/level`, {
      method: "PUT",
      body: { accountLevel: level },
    }),
  getAllApplications: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/admin/applications${query}`, { method: "GET" });
  },
  getApplicationById: (id: string) =>
    apiRequest(`/admin/applications/${id}`, { method: "GET" }),
  approveApplication: (id: string) =>
    apiRequest(`/admin/applications/${id}/approve`, { method: "POST" }),
  rejectApplication: (id: string, reason: string) =>
    apiRequest(`/admin/applications/${id}/reject`, {
      method: "POST",
      body: { rejectionReason: reason },
    }),
  getAllSupportTickets: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/admin/support/tickets${query}`, { method: "GET" });
  },
  updateTicketStatus: (id: string, status: string) =>
    apiRequest(`/admin/support/tickets/${id}/status`, {
      method: "PUT",
      body: { status },
    }),
};

// Blog API
export const blogApi = {
  getPosts: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/blog/posts${query}`, {
      method: "GET",
      requiresAuth: false,
    });
  },
  getPost: (slug: string) =>
    apiRequest(`/blog/posts/${slug}`, { method: "GET", requiresAuth: false }),
  createPost: (data: BlogPostData) =>
    apiRequest("/admin/blog/posts", { method: "POST", body: data }),
  updatePost: (id: string, data: BlogPostData) =>
    apiRequest(`/admin/blog/posts/${id}`, { method: "PUT", body: data }),
  deletePost: (id: string) =>
    apiRequest(`/admin/blog/posts/${id}`, { method: "DELETE" }),
};

// Support API
export const supportApi = {
  createTicket: (data: SupportTicketData) =>
    apiRequest("/support/tickets", { method: "POST", body: data }),
  getTickets: () => apiRequest("/support/tickets", { method: "GET" }),
  getTicket: (id: string) =>
    apiRequest(`/support/tickets/${id}`, { method: "GET" }),
  updateTicket: (id: string, data: SupportTicketData) =>
    apiRequest(`/support/tickets/${id}`, { method: "PUT", body: data }),
};

export default apiRequest;
