import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tenderService } from "../services/tenderService";
import { applicationService } from "../services/applicationService";
import { toast } from "react-toastify";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  IndianRupee,
  Clock,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const MyTenders = () => {
  const { company } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchTenders();
    }
  }, [company]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await tenderService.getTendersByCompany(company.id);
      const tenderList = response.data.tenders;
      setTenders(tenderList);

      // Fetch applications for each tender
      const applicationPromises = tenderList.map((tender) =>
        applicationService
          .getApplicationsForTender(tender.id)
          .then((response) => ({
            tenderId: tender.id,
            applications: response.data.applications,
          }))
          .catch(() => ({ tenderId: tender.id, applications: [] }))
      );

      const applicationResults = await Promise.all(applicationPromises);
      const applicationMap = {};
      applicationResults.forEach((result) => {
        applicationMap[result.tenderId] = result.applications;
      });
      setApplications(applicationMap);
    } catch (error) {
      toast.error(error.message || "Failed to fetch tenders");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTender = async (tenderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tender? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await tenderService.deleteTender(tenderId);
      toast.success("Tender deleted successfully!");
      fetchTenders();
    } catch (error) {
      toast.error(error.message || "Failed to delete tender");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpired = (deadline) => new Date(deadline) < new Date();

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Company Profile Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to create a company profile before you can manage tenders.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Create Company Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h1 className="text-3xl font-bold text-white mb-2">My Tenders</h1>
              <p className="text-primary-100">
                Manage your posted tenders and view applications
              </p>
            </div>
            <Link
              to="/create-tender"
              className="btn bg-white text-primary-900 hover:bg-gray-100"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Tender
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {loading ? (
          <LoadingSpinner message="Loading your tenders..." />
        ) : tenders.length > 0 ? (
          <div className="space-y-6">
            {tenders.map((tender) => {
              const daysLeft = getDaysUntilDeadline(tender.deadline);
              const expired = isExpired(tender.deadline);
              const tenderApplications = applications[tender.id] || [];

              return (
                <div
                  key={tender.id}
                  className={`card-elevated ${expired ? "opacity-75" : ""}`}
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {tender.title}
                          </h3>
                          {expired ? (
                            <span className="badge badge-danger">Expired</span>
                          ) : daysLeft <= 7 ? (
                            <span className="badge badge-warning">
                              <Clock className="w-3 h-3 mr-1" />
                              {daysLeft} days left
                            </span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {formatDate(tender.deadline)}</span>
                          </div>
                          {tender.budget && (
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="h-4 w-4" />
                              <span>
                                Budget: {formatCurrency(tender.budget)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {tenderApplications.length} Application
                              {tenderApplications.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-2">
                          {tender.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/tender/${tender.id}`}
                          className="btn btn-outline text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/edit-tender/${tender.id}`}
                          className="btn btn-secondary text-sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteTender(tender.id)}
                          className="btn btn-danger text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Applications Preview */}
                  {tenderApplications.length > 0 && (
                    <div className="p-6 bg-gray-50">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Applications
                      </h4>
                      <div className="space-y-3">
                        {tenderApplications.slice(0, 3).map((application) => (
                          <div
                            key={application.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center space-x-3">
                              {application.companies.logo_url ? (
                                <img
                                  src={application.companies.logo_url}
                                  alt={application.companies.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                  <Users className="h-5 w-5 text-primary-700" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {application.companies.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Applied {formatDate(application.created_at)}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`badge ${
                                application.status === "pending"
                                  ? "badge-warning"
                                  : application.status === "accepted"
                                  ? "badge-success"
                                  : "badge-danger"
                              }`}
                            >
                              {application.status}
                            </span>
                          </div>
                        ))}
                        {tenderApplications.length > 3 && (
                          <p className="text-sm text-gray-500 text-center">
                            And {tenderApplications.length - 3} more application
                            {tenderApplications.length - 3 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-elevated">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Tenders Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't created any tenders yet. Start by creating your
                first tender to receive proposals from qualified companies.
              </p>
              <Link to="/create-tender" className="btn btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Tender
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTenders;
