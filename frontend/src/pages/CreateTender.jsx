import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tenderService } from "../services/tenderService";
import { toast } from "react-toastify";
import {
  FileText,
  Save,
  ArrowLeft,
  Calendar,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

const CreateTender = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    budget: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company) {
      toast.error("You need to create a company profile first");
      navigate("/dashboard");
      return;
    }

    setLoading(true);
    try {
      const tenderData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      await tenderService.createTender(tenderData);
      toast.success("Tender created successfully!");
      navigate("/my-tenders");
    } catch (error) {
      toast.error(error.message || "Failed to create tender");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-tenders");
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

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
            You need to create a company profile before you can post tenders.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            Create Company Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create New Tender
            </h1>
            <p className="text-primary-100">
              Post a new tender to receive proposals from qualified companies
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="card-elevated">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Tender Information
              </h2>
              <button onClick={handleCancel} className="btn btn-outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Tenders
              </button>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tender Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter a clear, descriptive title for your tender"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Make it specific and engaging to attract the right applicants
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="8"
                  className="input-field"
                  placeholder="Provide detailed information about your tender requirements, scope of work, deliverables, and any specific criteria..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Include project scope, requirements, deliverables, and
                  evaluation criteria
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Application Deadline *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      min={today}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    When should applications be submitted by?
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Budget (INR)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Enter budget amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Optional: Help applicants understand the project scale
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  💡 Tips for a Great Tender
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Be specific about your requirements and expectations
                  </li>
                  <li>• Include clear deliverables and success criteria</li>
                  <li>• Mention any preferred technologies or methodologies</li>
                  <li>• Specify the timeline and key milestones</li>
                  <li>• Include evaluation criteria for proposals</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4 border-2"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create Tender</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
