import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tenderService } from "../services/tenderService";
import { applicationService } from "../services/applicationService";
import { toast } from "react-toastify";
import {
  Calendar,
  IndianRupee,
  Building,
  ArrowLeft,
  Send,
  FileText,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const ViewTender = () => {
  const { id } = useParams();
  const { user, company } = useAuth();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [proposal, setProposal] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTender();
  }, [id]);

  const fetchTender = async () => {
    setLoading(true);
    try {
      const response = await tenderService.getTender(id);
      setTender(response.data.tender);
    } catch (error) {
      toast.error(error.message || "Failed to fetch tender");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!company) {
      toast.error("You need to create a company profile first");
      return;
    }

    setApplying(true);
    try {
      await applicationService.applyToTender({
        tenderId: id,
        proposal,
      });
      toast.success("Application submitted successfully!");
      setShowApplyForm(false);
      setProposal("");
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setApplying(false);
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
      month: "long",
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

  if (loading) {
    return <LoadingSpinner message="Loading tender details..." />;
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tender Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The tender you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/browse-tenders" className="btn btn-primary">
            Browse Tenders
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(tender.deadline) < new Date();
  const isOwner = company && company.id === tender.company_id;
  const daysLeft = getDaysUntilDeadline(tender.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg ">
        <div className="max-w-7xl mx-auto mb-10 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              to="/browse-tenders"
              className="inline-flex items-center space-x-2 text-primary-100 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Tenders</span>
            </Link>
          </div>

          <div className="glass-effect rounded-xl p-8 ">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  {isExpired ? (
                    <span className="badge bg-red-500 text-white">Expired</span>
                  ) : daysLeft <= 7 ? (
                    <span className="badge bg-yellow-500 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {daysLeft} days left
                    </span>
                  ) : (
                    <span className="badge bg-green-500 text-white">
                      Active
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {tender.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Deadline: {formatDate(tender.deadline)}</span>
                  </div>
                  {tender.budget && (
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-5 w-5" />
                      <span>Budget: {formatCurrency(tender.budget)}</span>
                    </div>
                  )}
                </div>
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
            {/* Description */}
            <div className="card-elevated">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Tender Description
                </h2>
              </div>
              <div className="p-6">
                <div className="prose prose-gray max-w-none">
                  {tender.description.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Section */}
            {user && !isOwner && !isExpired && (
              <div className="card-elevated">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">
                    Submit Your Proposal
                  </h2>
                </div>
                <div className="p-6">
                  {showApplyForm ? (
                    <form onSubmit={handleApply} className="space-y-6">
                      <div>
                        <label
                          htmlFor="proposal"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Your Proposal
                        </label>
                        <textarea
                          id="proposal"
                          value={proposal}
                          onChange={(e) => setProposal(e.target.value)}
                          rows="8"
                          className="input-field"
                          placeholder="Describe your proposal, approach, timeline, and why you're the best fit for this tender..."
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          type="submit"
                          disabled={applying}
                          className="btn btn-primary"
                        >
                          {applying ? (
                            <div className="flex items-center space-x-2">
                              <div className="loading-spinner w-4 h-4 border-2"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Send className="h-4 w-4" />
                              <span>Submit Proposal</span>
                            </div>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowApplyForm(false)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-primary-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready to Apply?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Submit your proposal to be considered for this tender
                        opportunity.
                      </p>
                      <button
                        onClick={() => setShowApplyForm(true)}
                        className="btn btn-primary"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Login Prompt */}
            {!user && !isExpired && (
              <div className="card-elevated">
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-blue-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Want to Apply?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create an account or log in to submit your application for
                      this tender.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <Link to="/register" className="btn btn-primary">
                        Create Account
                      </Link>
                      <Link to="/login" className="btn btn-outline">
                        Log In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Posted By
                </h3>
                <div className="flex items-start space-x-4">
                  {tender.companies.logo_url ? (
                    <img
                      src={tender.companies.logo_url}
                      alt={tender.companies.name}
                      className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary-700" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      <Link
                        to={`/company/${tender.companies.id}`}
                        className="hover:text-primary-900 transition-colors duration-200"
                      >
                        {tender.companies.name}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600">
                      {tender.companies.industry}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/company/${tender.companies.id}`}
                    className="w-full btn btn-outline text-sm"
                  >
                    View Company Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Tender Details */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tender Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(tender.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(tender.deadline)}
                    </span>
                  </div>
                  {tender.budget && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(tender.budget)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-medium ${
                        isExpired ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>
                  {!isExpired && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Time Left</span>
                      <span className="font-medium text-gray-900">
                        {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
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
                    Browse More Tenders
                  </Link>
                  <Link
                    to={`/company/${tender.companies.id}`}
                    className="w-full btn btn-outline"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    View Company
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

export default ViewTender;
