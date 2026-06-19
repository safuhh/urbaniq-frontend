import axios from 'axios';

// Get API base URL from environment variable or fallback to local
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token if present
api.interceptors.request.use(
  (config) => {
    // In Next.js, localStorage is only available in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('urbaniq_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
