// mm_frontend/src/api.js
const API_URL = 'http://localhost:3000/api';

export const api = {
  // GET request
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`);
    return res.json();
  },

  // POST request
  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // PUT request
  put: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // DELETE request
  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // PATCH request
  patch: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// User API helpers
export const userApi = {
  // Sync user after login (call this after Firebase auth success)
  sync: (userData) => api.post('/user/sync', userData),

  // Get user data
  get: (firebaseUid) => api.get(`/user/${firebaseUid}`),

  // Update profile
  updateProfile: (firebaseUid, profile) =>
    api.put(`/user/${firebaseUid}/profile`, profile),

  // Update photo (supports base64)
  updatePhoto: (firebaseUid, photoURL) =>
    api.put(`/user/${firebaseUid}/photo`, { photoURL }),

  // Wishlist
  addToWishlist: (firebaseUid, productId) =>
    api.post(`/user/${firebaseUid}/wishlist/${productId}`),

  removeFromWishlist: (firebaseUid, productId) =>
    api.delete(`/user/${firebaseUid}/wishlist/${productId}`),

  // Cart
  updateCart: (firebaseUid, cart) =>
    api.put(`/user/${firebaseUid}/cart`, cart),

  // Shipping Address
  updateShippingAddress: (firebaseUid, shippingAddress) =>
    api.put(`/user/${firebaseUid}/shipping-address`, shippingAddress),
};

// Order API helpers
export const orderApi = {
  // Create new order
  create: (orderData) => api.post('/order', orderData),

  // Get order by ID
  get: (orderId) => api.get(`/order/number/${orderId}`),

  // Get orders by user
  getByUser: (userId) => api.get(`/order/user/${userId}`),

  // Update payment status
  updateStatus: (orderId, status) =>
    api.patch(`/order/${orderId}/status`, { status }),
};

// Payment API helpers
export const paymentApi = {
  // Generate PromptPay QR
  generateQR: (amount, phoneNumber) =>
    api.post('/payment/promptpay-qr', { amount, phoneNumber }),

  // Upload and verify slip
  verifySlip: async (orderId, slipFile) => {
    const formData = new FormData();
    formData.append('slip', slipFile);

    const res = await fetch(`http://localhost:3000/api/payment/verify-slip/${orderId}`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
};