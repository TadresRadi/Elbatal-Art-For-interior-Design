import api from './api';

export const getClientDashboard = async () => {
  const response = await api.get('clients/dashboard/');
  return response.data;
};

export const getClients = async () => {
  const response = await api.get('clients/');
  return response.data;
};