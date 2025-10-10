import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

// نقدر نستخدم Axios علشان نسهل التعامل مع REST API
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// مثال: استدعاء العملاء
export const getClients = async () => {
  const response = await api.get("clients/");
  return response.data;
};
// مثال: استدعاء المصروفات
export const getExpenses = async () => {
  const response = await api.get("expense/");
  return response.data;
};

// مثال: استدعاء المشاريع
export const getProject = async () => {
  const response = await api.get("project/");
  return response.data;
};
// مثال: استدعاء التقدم
export const getProgress = async () => {
  const response = await api.get("progress/");
  return response.data;
};
// مثال: استدعاء الرسائل
export const getMessage = async () => {
  const response = await api.get("message/");
  return response.data;
};