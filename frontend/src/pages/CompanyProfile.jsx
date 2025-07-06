import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { companyService } from "../services/companyService";
import { tenderService } from "../services/tenderService";
import { toast } from "react-toastify";
import {
  Building,
  Calendar,
  FileText,
  ArrowLeft,
  MapPin,
  Users,
  Briefcase,
  Star,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import TenderCard from "../components/TenderCard";

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [goodsServices, setGoodsServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const [companyResponse, tendersResponse] = await Promise.all([
        companyService.getCompany(id),
        tenderService.getTendersByCompany(id),
      ]);

      setCompany(companyResponse.data.company);
      setGoodsServices(companyResponse.data.goods_services || []);
      setTenders(tendersResponse.data.tenders || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch company data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading company profile..." />;
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/search-companies" className="btn btn-primary">
            Browse Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/search-companies"
              className="inline-flex items-center space-x-2 text-primary-100 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Companies</span>
            </Link>
          </div>

          <div className="glass-effect rounded-xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="flex-shrink-0">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="badge bg-white/20 text-white border-white/30">
                    {company.industry}
                  </span>
                  <div className="flex items-center space-x-2 text-primary-100">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Member since{" "}
                      {new Date(company.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-primary-100 leading-relaxed">
                  {company.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services & Capabilities */}
            {goodsServices.length > 0 && (
              <div className="card-elevated">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Services & Capabilities
                      </h2>
                      <p className="text-gray-600">What this company offers</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goodsServices.map((service) => (
                      <div key={service.id} className="card p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active Tenders */}
            <div className="card-elevated">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Active Tenders
                    </h2>
                    <p className="text-gray-600">
                      Current opportunities from this company
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {tenders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {tenders.map((tender) => (
                      <TenderCard key={tender.id} tender={tender} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Tenders
                    </h3>
                    <p className="text-gray-600">
                      This company doesn't have any active tenders at the
                      moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium text-gray-900">
                      {company.industry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Tenders</span>
                    <span className="font-medium text-gray-900">
                      {tenders.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium text-gray-900">
                      {goodsServices.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">
                      {new Date(company.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/browse-tenders" className="w-full btn btn-primary">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Tenders
                  </Link>
                  <Link
                    to="/search-companies"
                    className="w-full btn btn-outline"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Browse Companies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
