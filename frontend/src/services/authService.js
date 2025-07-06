import { apiService } from './api'

export const authService = {
  login: (email, password) => apiService.post('/auth/login', { email, password }),
  register: (email, password) => apiService.post('/auth/register', { email, password }),
  getCurrentUser: () => apiService.get('/auth/me'),
}