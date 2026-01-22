import api from './api';

interface LoginData {
  username: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post('login/', data);
  const { token, refresh } = response.data;

  // Store the tokens
  localStorage.setItem('accessToken', token);
  localStorage.setItem('refreshToken', refresh);

  return response.data;
};