import { apiService } from './api'

export const tenderService = {
  getTenders: (page = 1, limit = 10, search = '') => 
    apiService.get(`/tenders?page=${page}&limit=${limit}&search=${search}`),
  
  getTender: (id) => apiService.get(`/tenders/${id}`),
  
  createTender: (tenderData) => apiService.post('/tenders', tenderData),
  
  updateTender: (id, tenderData) => apiService.put(`/tenders/${id}`, tenderData),
  
  deleteTender: (id) => apiService.delete(`/tenders/${id}`),
  
  getTendersByCompany: (companyId) => apiService.get(`/tenders/company/${companyId}`),
}