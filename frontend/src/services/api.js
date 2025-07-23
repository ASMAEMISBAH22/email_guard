import axios from 'axios';

// Get the API base URL from environment variable, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key to all requests
api.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('email-guardian-api-key');
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid API key
      localStorage.removeItem('email-guardian-api-key');
    }
    return Promise.reject(error);
  }
);

// API methods
export const emailAPI = {
  // Scan email
  scanEmail: (emailText, userId = 'web-user') => {
    return api.post('/scan', {
      email_text: emailText,
      user_id: userId
    });
  },

  // Get scan history
  getHistory: (limit = 50, offset = 0, userId = null) => {
    const params = { limit, offset };
    if (userId) params.user_id = userId;
    return api.get('/history', { params });
  },

  // Create API key
  createApiKey: (name, description = null) => {
    return api.post('/create-key', {
      name,
      description
    });
  },

  // Health check
  healthCheck: () => {
    return api.get('/health');
  }
};

export default api; 