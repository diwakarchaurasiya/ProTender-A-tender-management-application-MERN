import { apiService } from './api'

export const goodsServicesService = {
  getGoodsServicesByCompany: (companyId) => 
    apiService.get(`/goods-services/company/${companyId}`),
  
  addGoodsServices: (goodsServiceData) => 
    apiService.post('/goods-services', goodsServiceData),
  
  updateGoodsServices: (id, goodsServiceData) => 
    apiService.put(`/goods-services/${id}`, goodsServiceData),
  
  deleteGoodsServices: (id) => 
    apiService.delete(`/goods-services/${id}`),
}