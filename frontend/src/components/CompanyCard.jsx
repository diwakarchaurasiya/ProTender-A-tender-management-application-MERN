import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, MapPin, Users, Star } from 'lucide-react'

const CompanyCard = ({ company }) => {
  return (
    <div className="card-elevated group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-200">
              <Building2 className="w-8 h-8 text-primary-700" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-900 transition-colors duration-200 truncate">
              <Link to={`/company/${company.id}`} className="hover:underline">
                {company.name}
              </Link>
            </h3>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className="badge badge-primary">{company.industry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {company.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Member since {new Date(company.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short'
            })}
          </div>
          
          <Link
            to={`/company/${company.id}`}
            className="btn btn-outline text-sm px-4 py-2 group-hover:bg-primary-900 group-hover:text-white group-hover:border-primary-900 transition-all duration-200"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CompanyCard