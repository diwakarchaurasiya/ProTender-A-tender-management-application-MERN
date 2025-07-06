import { apiService } from './api'

export const companyService = {
  getCompanies: (page = 1, limit = 10, search = '') => 
    apiService.get(`/companies?page=${page}&limit=${limit}&search=${search}`),
  
  getCompany: (id) => apiService.get(`/companies/${id}`),
  
  createCompany: (companyData) => apiService.post('/companies', companyData),
  
  updateCompany: (id, companyData) => apiService.put(`/companies/${id}`, companyData),
  
  uploadLogo: (id, formData) => apiService.upload(`/companies/${id}/logo`, formData),
  
  addGoodsServices: (id, goodsServiceData) => 
    apiService.post(`/companies/${id}/goods-services`, goodsServiceData),
}