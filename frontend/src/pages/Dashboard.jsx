import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { companyService } from '../services/companyService'
import { toast } from 'react-toastify'
import { Building, Upload, Save, Plus, Edit, Trash2, Camera, User, Briefcase } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, company, updateCompany } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: ''
  })
  const [goodsServices, setGoodsServices] = useState([])
  const [newService, setNewService] = useState({ title: '', description: '' })
  const [showAddService, setShowAddService] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        description: company.description || ''
      })
      fetchGoodsServices()
    }
  }, [company])

  const fetchGoodsServices = async () => {
    if (!company) return
    
    try {
      const response = await companyService.getCompany(company.id)
      setGoodsServices(response.data.goods_services || [])
    } catch (error) {
      console.error('Error fetching goods/services:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (company) {
        const response = await companyService.updateCompany(company.id, formData)
        updateCompany(response.data.company)
        toast.success('Company profile updated successfully!')
      } else {
        const response = await companyService.createCompany(formData)
        updateCompany(response.data.company)
        toast.success('Company profile created successfully!')
      }
      setEditing(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !company) return

    const formData = new FormData()
    formData.append('logo', file)

    try {
      const response = await companyService.uploadLogo(company.id, formData)
      updateCompany(response.data.company)
      toast.success('Logo uploaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to upload logo')
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    if (!company || !newService.title.trim()) return

    try {
      await companyService.addGoodsServices(company.id, newService)
      setNewService({ title: '', description: '' })
      setShowAddService(false)
      await fetchGoodsServices()
      toast.success('Service added successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to add service')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.email}
            </h1>
            <p className="text-primary-100">
              Manage your company profile and business information
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="space-y-8">
          {/* Company Profile Card */}
          <div className="card-elevated">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
                    <p className="text-gray-600">Manage your company information</p>
                  </div>
                </div>
                {company && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {!company && !editing ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Your Company Profile
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Set up your company profile to start posting tenders and managing your business presence
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Profile
                  </button>
                </div>
              ) : editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Technology, Construction"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="input-field"
                      placeholder="Describe your company, services, and expertise..."
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="loading-spinner w-4 h-4 border-2"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="h-4 w-4" />
                          <span>Save Profile</span>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Company Info Display */}
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="w-24 h-24 rounded-xl object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                            <Building className="h-12 w-12 text-primary-700" />
                          </div>
                        )}
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-800 transition-colors duration-200">
                          <Camera className="h-4 w-4 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="badge badge-primary">{company.industry}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{company.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Goods & Services Card */}
          {company && (
            <div className="card-elevated">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Services & Capabilities</h2>
                      <p className="text-gray-600">Showcase what your company offers</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddService(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </button>
                </div>
              </div>

              <div className="p-6">
                {showAddService && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
                    <form onSubmit={handleAddService} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={newService.title}
                          onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                          className="input-field"
                          placeholder="e.g., Web Development, Construction Management"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newService.description}
                          onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                          rows="3"
                          className="input-field"
                          placeholder="Describe this service in detail..."
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <button type="submit" className="btn btn-primary">
                          <Save className="h-4 w-4 mr-2" />
                          Add Service
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddService(false)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {goodsServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goodsServices.map(service => (
                      <div key={service.id} className="card p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Added</h3>
                    <p className="text-gray-600 mb-4">
                      Add your services to help other companies find and connect with you
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard