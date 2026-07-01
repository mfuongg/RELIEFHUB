/**
 * ReliefHub API Service Layer
 * Kết nối React frontend với Spring Boot backend REST API
 * 
 * Cách sử dụng:
 *   import { api, authService, campaignService } from '../services/api';
 *   const res = await campaignService.getActive();
 *   if (res.success) console.log(res.data);
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ─── Token management ────────────────────────────────────────
const TOKEN_KEY = 'reliefhub_token';
const USER_KEY = 'reliefhub_user';

export const tokenManager = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

// ─── Core request function ───────────────────────────────────
async function request(path, options = {}) {
  const token = tokenManager.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    // Handle 401 – token hết hạn
    if (res.status === 401) {
      tokenManager.remove();
      window.location.href = '/login';
      return { success: false, error: 'Phiên đăng nhập hết hạn' };
    }

    const data = await res.json();

    // Handle non-2xx status
    if (!res.ok) {
      return { success: false, error: data.error || data.message || `HTTP ${res.status}`, status: res.status };
    }

    return data;
  } catch (err) {
    console.error(`API Error [${path}]:`, err);
    return { success: false, error: 'Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.' };
  }
}

// ─── Generic API helper ──────────────────────────────────────
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: async (path, formData) => {
    const token = tokenManager.get();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData, // không set Content-Type, browser tự set multipart
    });
    return res.json();
  },
};

// ─── Auth Service ────────────────────────────────────────────
export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),

  register: (data) =>
    api.post('/auth/register', data),

  logout: () => {
    tokenManager.remove();
    return { success: true };
  },
};

// ─── User Service ────────────────────────────────────────────
export const userService = {
  getAll: () => api.get('/users'),
  getMe: () => api.get('/users/me'),
  getById: (id) => api.get(`/users/${id}`),
  updateMe: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
  create: (data) => api.post('/users', data),
  toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
};

// ─── Campaign Service ────────────────────────────────────────
export const campaignService = {
  getAll: () => api.get('/campaigns'),
  getActive: () => api.get('/campaigns/active'),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
};

// ─── Disaster Service ────────────────────────────────────────
export const disasterService = {
  getAll: () => api.get('/disasters'),
  getActive: () => api.get('/disasters/active'),
  getById: (id) => api.get(`/disasters/${id}`),
  create: (data) => api.post('/disasters', data),
  update: (id, data) => api.put(`/disasters/${id}`, data),
  delete: (id) => api.delete(`/disasters/${id}`),
};

// ─── Donation Service ────────────────────────────────────────
export const donationService = {
  getAll: () => api.get('/donations'),
  getMine: () => api.get('/donations/me'),
  getByCampaign: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
  create: (data) => api.post('/donations', data),
  updateStatus: (id, status) => api.patch(`/donations/${id}/status`, { status }),
};

// ─── Support Request Service ─────────────────────────────────
export const supportRequestService = {
  getAll: () => api.get('/support-requests'),
  getMine: () => api.get('/support-requests/me'),
  getByStatus: (status) => api.get(`/support-requests/status/${status}`),
  create: (data) => api.post('/support-requests', data),
  advanceStatus: (id, newStatus, note) =>
    api.patch(`/support-requests/${id}/advance`, { newStatus, note }),
};

// ─── Complaint Service ───────────────────────────────────────
export const complaintService = {
  getAll: () => api.get('/complaints'),
  getMine: () => api.get('/complaints/me'),
  create: (data) => api.post('/complaints', data),
  reply: (id, adminReply) => api.put(`/complaints/${id}/reply`, { adminReply }),
  close: (id) => api.patch(`/complaints/${id}/close`),
};

// ─── Notification Service ────────────────────────────────────
export const notificationService = {
  getMine: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

// ─── Dashboard Service ───────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

// ─── Volunteer Group Service ─────────────────────────────────
export const volunteerGroupService = {
  getAll: () => api.get('/volunteer-groups'),
  getActive: () => api.get('/volunteer-groups/active'),
  getById: (id) => api.get(`/volunteer-groups/${id}`),
  create: (data) => api.post('/volunteer-groups', data),
  update: (id, data) => api.put(`/volunteer-groups/${id}`, data),
  delete: (id) => api.delete(`/volunteer-groups/${id}`),
};

// ─── Inventory Service ───────────────────────────────────────
export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  restock: (id, quantity, note) => api.patch(`/inventory/${id}/restock`, { quantity, note }),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// ─── Delivery Service ────────────────────────────────────────
export const deliveryService = {
  getAll: () => api.get('/deliveries'),
  getByStatus: (status) => api.get(`/deliveries/status/${status}`),
  create: (data) => api.post('/deliveries', data),
  updateStatus: (id, status, note) => api.patch(`/deliveries/${id}/status`, { status, note }),
  delete: (id) => api.delete(`/deliveries/${id}`),
};

// ─── Ledger Service ──────────────────────────────────────────
export const ledgerService = {
  getAll: () => api.get('/ledger'),
  getByCampaign: (campaignId) => api.get(`/ledger/campaign/${campaignId}`),
  create: (data) => api.post('/ledger', data),
  delete: (id) => api.delete(`/ledger/${id}`),
};

// ─── Warehouse Service ───────────────────────────────────────
export const warehouseService = {
  getAll: () => api.get('/warehouses'),
  create: (data) => api.post('/warehouses', data),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

// ─── File Upload Service ─────────────────────────────────────
export const fileUploadService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/uploads', formData);
  },
};

export default api;
