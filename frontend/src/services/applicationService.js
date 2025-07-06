import { apiService } from './api'

export const applicationService = {
  applyToTender: (applicationData) => apiService.post('/applications', applicationData),
  
  getApplicationsForTender: (tenderId) => apiService.get(`/applications/tender/${tenderId}`),
  
  getApplicationsByCompany: (companyId) => apiService.get(`/applications/company/${companyId}`),
  
  updateApplicationStatus: (id, status) => 
    apiService.patch(`/applications/${id}/status`, { status }),
}