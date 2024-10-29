import axios from 'axios';
import type { Subscription } from '../types/subscription';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const subscriptionApi = {
  getAll: () => api.get<Subscription[]>('/subscriptions').then(res => res.data),
  
  create: (subscription: Omit<Subscription, 'id'>) => 
    api.post<Subscription>('/subscriptions', subscription).then(res => res.data),
  
  update: (id: string, subscription: Omit<Subscription, 'id'>) =>
    api.put<Subscription>(`/subscriptions/${id}`, subscription).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/subscriptions/${id}`),
  
  getStats: () => 
    api.get('/subscriptions/stats').then(res => res.data),
};

export default api;