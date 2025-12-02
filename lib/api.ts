/**
 * API Utility Functions
 * Centralized API client for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    requiresAuth = true,
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Add auth token if required
  if (requiresAuth) {
    const token = localStorage.getItem('authToken');
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
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Dashboard API
export const dashboardApi = {
  getStats: () => apiRequest<{
    user: any;
    stats: any;
    levelProgress: any;
    recentOrders: any[];
    upcomingDeadlines: any[];
  }>('/dashboard', { method: 'GET' }),
};

// Websites API
export const websitesApi = {
  addWebsite: (data: any) => apiRequest('/websites', { method: 'POST', body: data }),
  getWebsites: (filters?: any) => apiRequest('/websites', { method: 'GET' }),
  getWebsite: (id: string) => apiRequest(`/websites/${id}`, { method: 'GET' }),
  updateWebsite: (id: string, data: any) => apiRequest(`/websites/${id}`, { method: 'PUT', body: data }),
  deleteWebsite: (id: string) => apiRequest(`/websites/${id}`, { method: 'DELETE' }),
  bulkAddWebsites: (data: any[]) => apiRequest('/websites/bulk', { method: 'POST', body: { websites: data } }),
  verifyWebsite: (id: string, method: 'tag' | 'article') => 
    apiRequest(`/websites/${id}/verify`, { method: 'POST', body: { method } }),
  respondToCounterOffer: (id: string, accept: boolean) =>
    apiRequest(`/websites/${id}/counter-offer`, { method: 'POST', body: { accept } }),
};

// Orders API
export const ordersApi = {
  getOrders: (filters?: any) => apiRequest('/orders', { method: 'GET' }),
  getOrder: (id: string) => apiRequest(`/orders/${id}`, { method: 'GET' }),
  createOrder: (data: any) => apiRequest('/orders', { method: 'POST', body: data }),
  updateOrder: (id: string, data: any) => apiRequest(`/orders/${id}`, { method: 'PUT', body: data }),
  submitOrder: (id: string, data: any) => apiRequest(`/orders/${id}/submit`, { method: 'POST', body: data }),
  requestRevision: (id: string, reason: string) => 
    apiRequest(`/orders/${id}/revision`, { method: 'POST', body: { reason } }),
  cancelOrder: (id: string, reason: string) =>
    apiRequest(`/orders/${id}/cancel`, { method: 'POST', body: { reason } }),
  completeOrder: (id: string) => apiRequest(`/orders/${id}/complete`, { method: 'POST' }),
};

// Payments API
export const paymentsApi = {
  getPayments: () => apiRequest('/payments', { method: 'GET' }),
  getInvoices: () => apiRequest('/payments/invoices', { method: 'GET' }),
  updatePaypalEmail: (email: string) => apiRequest('/payments/paypal', { method: 'PUT', body: { email } }),
  downloadInvoice: (id: string) => apiRequest(`/payments/invoices/${id}/download`, { method: 'GET' }),
};

// Profile API
export const profileApi = {
  getProfile: () => apiRequest('/users/profile', { method: 'GET' }),
  updateProfile: (data: any) => apiRequest('/users/profile', { method: 'PUT', body: data }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/users/password', { method: 'PUT', body: data }),
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_URL}/users/profile/image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
  },
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', { method: 'POST', body: { email, password }, requiresAuth: false }),
  register: (data: any) =>
    apiRequest('/auth/register', { method: 'POST', body: data, requiresAuth: false }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', { method: 'POST', body: { email }, requiresAuth: false }),
};

// Applications API
export const applicationsApi = {
  submitApplication: (data: any) =>
    apiRequest('/applications', { method: 'POST', body: data, requiresAuth: false }),
  getApplications: (filters?: any) => apiRequest('/applications', { method: 'GET' }),
  reviewApplication: (id: string, decision: 'approve' | 'reject', notes?: string) =>
    apiRequest(`/applications/${id}/review`, { method: 'POST', body: { decision, notes } }),
};

// Admin API
export const adminApi = {
  getDashboard: () => apiRequest('/admin/dashboard', { method: 'GET' }),
  getAllWebsites: (filters?: any, page = 1, limit = 20) =>
    apiRequest(`/admin/websites?page=${page}&limit=${limit}`, { method: 'GET' }),
  updateWebsiteStatus: (id: string, status: string, reason?: string) =>
    apiRequest(`/admin/websites/${id}/status`, { method: 'PUT', body: { status, reason } }),
  sendCounterOffer: (id: string, data: any) =>
    apiRequest(`/admin/websites/${id}/counter-offer`, { method: 'POST', body: data }),
  getAllOrders: (filters?: any) => apiRequest('/admin/orders', { method: 'GET' }),
  processPayment: (id: string) => apiRequest(`/admin/payments/${id}/process`, { method: 'POST' }),
  updateUserLevel: (userId: string, level: string) =>
    apiRequest(`/admin/users/${userId}/level`, { method: 'PUT', body: { level } }),
};

// Blog API
export const blogApi = {
  getPosts: (filters?: any) => apiRequest('/blog', { method: 'GET', requiresAuth: false }),
  getPost: (id: string) => apiRequest(`/blog/${id}`, { method: 'GET', requiresAuth: false }),
  createPost: (data: any) => apiRequest('/blog', { method: 'POST', body: data }),
  updatePost: (id: string, data: any) => apiRequest(`/blog/${id}`, { method: 'PUT', body: data }),
  deletePost: (id: string) => apiRequest(`/blog/${id}`, { method: 'DELETE' }),
};

// Support API
export const supportApi = {
  createTicket: (data: any) => apiRequest('/support/tickets', { method: 'POST', body: data }),
  getTickets: () => apiRequest('/support/tickets', { method: 'GET' }),
  getTicket: (id: string) => apiRequest(`/support/tickets/${id}`, { method: 'GET' }),
  updateTicket: (id: string, data: any) => apiRequest(`/support/tickets/${id}`, { method: 'PUT', body: data }),
};

export default apiRequest;

