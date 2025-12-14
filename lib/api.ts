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
      let error: { message?: string; error?: { message?: string }; [key: string]: unknown };
      try {
        const text = await response.text();
        if (text) {
          try {
            error = JSON.parse(text);
          } catch (parseErr) {
            // If it's not JSON, use the text as error message
            error = { message: text || `HTTP error! status: ${response.status}` };
          }
        } else {
          error = { message: `HTTP error! status: ${response.status} ${response.statusText || ""}`.trim() };
        }
      } catch (parseError) {
        // If text() fails, create a meaningful error message
        error = { 
          message: `HTTP error! status: ${response.status} ${response.statusText || ""}`.trim()
        };
      }
      
      // Extract error message from backend response format
      // Backend returns: { success: false, message: "...", error: {...} }
      const errorMessage =
        error.message ||
        error.error?.message ||
        `HTTP error! status: ${response.status}`;
      
      // Log more details in development only
      if (process.env.NODE_ENV === "development") {
        try {
          const errorDetails: Record<string, unknown> = {
            status: response.status,
            statusText: response.statusText || "",
            url: `${API_URL}${endpoint}`,
            errorMessage: errorMessage || "Unknown error",
          };
          
          // Only add errorObject if it has meaningful content
          if (error && typeof error === "object" && Object.keys(error).length > 0) {
            errorDetails.errorObject = error;
          } else if (error) {
            errorDetails.errorObject = String(error);
          }
          
          console.error("API Error Details:", errorDetails);
        } catch (logError) {
          // Silently ignore logging errors
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Backend returns { success: true, data: {...} } format
    // Return data directly (it already has success, message, data structure)
    return data;
  } catch (error: unknown) {
    // Handle network errors first
    const apiError = error as ApiError;
    if (
      apiError.name === "TypeError" &&
      (apiError.message?.includes("fetch") ||
        apiError.message === "Failed to fetch")
    ) {
      const networkError = new Error(
        `Unable to connect to backend server at ${API_URL}. ` +
        `Please ensure the backend is running on port 5003. ` +
        `Error: ${apiError.message || "Unknown error"}`
      );
      // Safe error logging - only in development
      if (process.env.NODE_ENV === "development") {
        try {
          console.error("Network error:", networkError.message);
        } catch (logError) {
          // Silently ignore logging errors
        }
      }
      throw networkError;
    }
    
    // For other errors, log in development
    if (process.env.NODE_ENV === "development") {
      try {
        const errorInfo = error instanceof Error 
          ? { message: error.message, name: error.name, stack: error.stack }
          : { error: String(error || "Unknown error") };
        console.error("API request failed:", errorInfo);
        console.error("Endpoint:", endpoint);
        console.error("Full URL:", `${API_URL}${endpoint}`);
        if (options.body) {
          console.error("Request body:", JSON.stringify(options.body, null, 2));
        }
      } catch (logError) {
        // Silently ignore logging errors
      }
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
    const query = filters
      ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
      : "";
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
    }),
  verifyWebsiteTag: (id: string) =>
    apiRequest(`/websites/${id}/verify/tag`, { method: "POST" }),
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
  sendCounterOffer: (
    id: string,
    data: { price: number; notes?: string; terms?: string }
  ) =>
    apiRequest(`/websites/${id}/counter-offer`, {
      method: "POST",
      body: data,
    }),
};

// Orders API
export const ordersApi = {
  getOrders: (filters?: Filters) => {
    const query = filters
      ? `?${new URLSearchParams(filters as Record<string, string>).toString()}`
      : "";
    return apiRequest(`/orders${query}`, { method: "GET" });
  },
  getOrder: (id: string) => apiRequest(`/orders/${id}`, { method: "GET" }),
  approveOrderTopic: (id: string) =>
    apiRequest(`/orders/${id}/approve`, { method: "POST" }),
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
  getPaymentStats: () => apiRequest("/payments/stats", { method: "GET" }),
  updatePaypalEmail: (email: string, paymentMethod?: string) =>
    apiRequest("/payments/settings", {
      method: "PUT",
      body: { paypalEmail: email, paymentMethod },
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
  updateProfile: async (data: ProfileData) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest("/users/change-password", { method: "POST", body: data }),
  uploadProfileImage: async (file: File) => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/users/profile/image`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response;
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
  resetPassword: (token: string, password: string) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: { token, password },
      requiresAuth: false,
    }),
  getMe: () => apiRequest("/auth/me", { method: "GET" }),
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
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res
            .json()
            .catch(() => ({ message: "An error occurred" }));
          throw new Error(error.message || `HTTP error! status: ${res.status}`);
        }

        // SAFE PARSE — supports empty response
        const text = await res.text();
        try {
          return text ? JSON.parse(text) : {};
        } catch {
          return {}; // fallback for non-JSON
        }
      });

    }

    // Otherwise use regular apiRequest
    return apiRequest("/applications", {
      method: "POST",
      body: data,
      requiresAuth: false,
    });
  },
  getApplications: () => apiRequest("/applications", { method: "GET" }),
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
  verifyWebsite: (id: string, method: "tag" | "article") =>
    apiRequest(`/admin/websites/${id}/verify`, {
      method: "PUT",
      body: { method },
    }),
  updateWebsiteStatus: (id: string, status: string, reason?: string) =>
    apiRequest(`/admin/websites/${id}/status`, {
      method: "PUT",
      body: { status, rejectionReason: reason },
    }),
  sendCounterOffer: (
    id: string,
    data: { price: number; notes?: string; terms?: string }
  ) =>
    apiRequest(`/admin/websites/${id}/counter-offer`, {
      method: "POST",
      body: data,
    }),
  acceptUserCounterOffer: (id: string) =>
    apiRequest(`/admin/websites/${id}/counter-offer/accept`, {
      method: "POST",
    }),
  getAllPublishers: (filters?: Filters, page = 1, limit = 100) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.accountLevel)
      params.append("accountLevel", filters.accountLevel);
    if (filters?.accountStatus)
      params.append("accountStatus", filters.accountStatus);
    return apiRequest(`/admin/publishers?${params.toString()}`, {
      method: "GET",
    });
  },
  getAllOrders: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.publisherId) params.append("publisherId", filters.publisherId);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/admin/orders${query}`, { method: "GET" });
  },
  getOrder: (id: string) => apiRequest(`/admin/orders/${id}`, { method: "GET" }),
  getAllPayments: (filters?: Filters, page = 1, limit = 100) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) params.append("status", filters.status);
    return apiRequest(`/admin/payments?${params.toString()}`, {
      method: "GET",
    });
  },
  getUserPayments: (userId: string, filters?: Filters, page = 1, limit = 100) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status) params.append("status", filters.status);
    return apiRequest(`/admin/payments/user/${userId}?${params.toString()}`, {
      method: "GET",
    });
  },
  getUserPaymentStats: (userId: string) =>
    apiRequest(`/admin/payments/user/${userId}/stats`, { method: "GET" }),
  processPayment: (id: string) =>
    apiRequest(`/admin/payments/${id}/process`, { method: "PUT" }),
  markPaymentAsPaid: (id: string) =>
    apiRequest(`/admin/payments/${id}/mark-paid`, { method: "PUT" }),
  getPublisherDetails: (id: string) =>
    apiRequest(`/admin/publishers/${id}`, { method: "GET" }),
  updateUserLevel: (userId: string, level: string) =>
    apiRequest(`/admin/publishers/${userId}/level`, {
      method: "PUT",
      body: { accountLevel: level },
    }),
  updatePublisherStatus: (userId: string, status: string) =>
    apiRequest(`/admin/publishers/${userId}/status`, {
      method: "PUT",
      body: { accountStatus: status },
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
  getSupportTicket: (ticketId: string) =>
    apiRequest(`/admin/support/tickets/${ticketId}`, { method: "GET" }),
  updateTicketStatus: (id: string, status: string) =>
    apiRequest(`/admin/support/tickets/${id}/status`, {
      method: "PUT",
      body: { status },
    }),
  getSettings: () => apiRequest("/admin/settings", { method: "GET" }),
  updateSettings: (data: {
    platformName?: string;
    adminEmail?: string;
    supportEmail?: string;
    paymentSchedule?: string;
    minimumPayout?: number;
  }) => apiRequest("/admin/settings", { method: "PUT", body: data }),
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
  getAdminPosts: (filters?: Filters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    params.append("admin", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`/admin/blog/posts${query}`, {
      method: "GET",
    });
  },
  getBlogPostById: (id: string) =>
    apiRequest(`/admin/blog/posts/${id}`, { method: "GET" }),
  getPost: (slug: string) =>
    apiRequest(`/blog/posts/${slug}`, { method: "GET", requiresAuth: false }),
  createPost: (data: BlogPostData) =>
    apiRequest("/admin/blog/posts", { method: "POST", body: data }),
  updatePost: (id: string, data: BlogPostData) =>
    apiRequest(`/admin/blog/posts/${id}`, { method: "PUT", body: data }),
  deletePost: (id: string) =>
    apiRequest(`/admin/blog/posts/${id}`, { method: "DELETE" }),
  getCategories: () =>
    apiRequest("/blog/categories", { method: "GET", requiresAuth: false }),
};

// Support API
export const supportApi = {
  createTicket: (data: SupportTicketData) =>
    apiRequest("/support/tickets", { method: "POST", body: data }),
  getTickets: () => apiRequest("/support/tickets", { method: "GET" }),
  getTicket: (id: string) =>
    apiRequest(`/support/tickets/${id}`, { method: "GET" }),
  addMessage: (id: string, message: string) =>
    apiRequest(`/support/tickets/${id}/messages`, {
      method: "POST",
      body: { message },
    }),
};

export default apiRequest;
