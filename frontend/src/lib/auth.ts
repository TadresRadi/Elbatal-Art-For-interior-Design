import api from './api';

interface LoginData {
  username: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('token/', data);
  const { access, refresh } = response.data;

  // خزن الـ tokens
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);

  return response.data;
};