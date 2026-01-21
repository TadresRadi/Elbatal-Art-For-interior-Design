import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // رابط الباك
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('accessToken'); // التوكن اللي اتخزن بعد login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // لازم Bearer قبل التوكن
  }
  
  return config;
  
});

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

