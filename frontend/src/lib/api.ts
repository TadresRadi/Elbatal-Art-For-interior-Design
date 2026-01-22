import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // رابط الباك
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh token
const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refresh
    });
    
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    return access;
  } catch (error) {
    // If refresh fails, clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.hash = '#login';
    throw error;
  }
};

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');
  
  // If no token, try to refresh
  if (!token && !config.url?.includes('login/')) {
    try {
      token = await refreshToken();
    } catch (error) {
      // Redirect to login if refresh fails
      return config;
    }
  }
  
  if (token && !config.url?.includes('login/')) {
    config.headers.Authorization = `Bearer ${token}`; // لازم Bearer قبل التوكن
  }
  
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.hash = '#login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// // مثال: استدعاء العملاء
// export const getClients = async () => {
//   const response = await api.get("clients/");
//   return response.data;
// };
// // مثال: استدعاء المصروفات
// export const getExpenses = async () => {
//   const response = await api.get("expense/");
//   return response.data;
// };

// // مثال: استدعاء المشاريع
// export const getProject = async () => {
//   const response = await api.get("project/");
//   return response.data;
// };
// // مثال: استدعاء التقدم
// export const getProgress = async () => {
//   const response = await api.get("progress/");
//   return response.data;
// };
// // مثال: استدعاء الرسائل
// export const getMessage = async () => {
//   const response = await api.get("message/");
//   return response.data;
// };

