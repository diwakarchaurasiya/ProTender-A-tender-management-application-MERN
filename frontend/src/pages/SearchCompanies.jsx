import React, { useState, useEffect } from 'react'
import { companyService } from '../services/companyService'
import { toast } from 'react-toastify'
import { Search, Building, Users, TrendingUp, Filter } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import Pagination from '../components/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'

const SearchCompanies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchCompanies()
  }, [currentPage, searchTerm])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const response = await companyService.getCompanies(currentPage, 12, searchTerm)
      setCompanies(response.data.companies)
      setTotalPages(response.data.totalPages)
      setTotalCount(response.data.totalCount)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch companies')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Business Partners
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Find and connect with companies across various industries to expand your business network
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Building className="h-5 w-5" />
                  <span className="text-2xl font-bold">{totalCount}</span>
                </div>
                <p className="text-primary-100 text-sm">Companies</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">15+</span>
                </div>
                <p className="text-primary-100 text-sm">Industries</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-primary-100 text-sm">Connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="card p-6 shadow-xl">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies by name, industry, or services..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-field pl-10 text-lg py-4"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner message="Loading companies..." />
        ) : companies.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchTerm ? 'Search Results' : 'All Companies'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {totalCount} compan{totalCount !== 1 ? 'ies' : 'y'} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {companies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Companies Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms or browse all companies'
                : 'No companies are currently available. Check back later!'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchCompanies