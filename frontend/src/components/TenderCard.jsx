import React from "react";
import { Link } from "react-router-dom";
import { Calendar, IndianRupee, Building, Clock, MapPin } from "lucide-react";

const TenderCard = ({ tender }) => {
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

  const isExpired = new Date(tender.deadline) < new Date();
  const daysLeft = getDaysUntilDeadline(tender.deadline);

  return (
    <div className={`card-elevated group ${isExpired ? "opacity-75" : ""}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {tender.companies?.logo_url ? (
              <img
                src={tender.companies.logo_url}
                alt={tender.companies.name}
                className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-primary-700" />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-900 transition-colors duration-200">
                {tender.companies?.name}
              </h4>
              <p className="text-sm text-gray-500">
                {tender.companies?.industry}
              </p>
            </div>
          </div>

          {isExpired ? (
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

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-900 transition-colors duration-200 line-clamp-2">
          <Link to={`/tender/${tender.id}`} className="hover:underline">
            {tender.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {tender.description}
        </p>
      </div>

      {/* Meta Information */}
      <div className="p-6 bg-gray-50 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Deadline: {formatDate(tender.deadline)}</span>
          </div>
          {tender.budget && (
            <div className="flex items-center space-x-2 text-primary-700 font-semibold">
              <span>{formatCurrency(tender.budget)}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200">
          <Link
            to={`/tender/${tender.id}`}
            className="btn btn-primary w-full group-hover:shadow-lg transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
