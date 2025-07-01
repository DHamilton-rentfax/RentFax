// frontend/utils/axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh token and store new one
const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    const newToken = res.data.token;
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (err) {
    console.error('❌ Token refresh failed:', err.message);
    localStorage.clear();
    window.location.href = '/login';
    throw err;
  }
};

// Request Interceptor
instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      token = await refreshToken();
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — force logout on 401
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('🔒 Unauthorized. Logging out...');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auto-refresh token every 10 mins in background
setInterval(async () => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    try {
      await refreshToken();
    } catch {
      // already handled in refreshToken()
    }
  }
}, 10 * 60 * 1000);

// Optional: clear token on tab close (for session-based security)
window.addEventListener('beforeunload', () => {
  // Uncomment if you want logout on close:
  // localStorage.removeItem('token');
});

export default instance;
