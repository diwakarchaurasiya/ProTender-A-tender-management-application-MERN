import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { tenderService } from "../services/tenderService";
import { toast } from "react-toastify";
import { FileText, Save, ArrowLeft, Calendar, IndianRupee } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const EditTender = () => {
  const { id } = useParams();
  const { company } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    budget: "",
  });

  useEffect(() => {
    fetchTender();
  }, [id]);

  const fetchTender = async () => {
    setLoading(true);
    try {
      const response = await tenderService.getTender(id);
      const tender = response.data.tender;

      // Check if user owns this tender
      if (!company || company.id !== tender.company_id) {
        toast.error("You are not authorized to edit this tender");
        navigate("/my-tenders");
        return;
      }

      setFormData({
        title: tender.title,
        description: tender.description,
        deadline: tender.deadline,
        budget: tender.budget ? tender.budget.toString() : "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to fetch tender");
      navigate("/my-tenders");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      const tenderData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };

      await tenderService.updateTender(id, tenderData);
      toast.success("Tender updated successfully!");
      navigate("/my-tenders");
    } catch (error) {
      toast.error(error.message || "Failed to update tender");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-tenders");
  };

  if (loading) {
    return <LoadingSpinner message="Loading tender..." />;
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Tender</h1>
            <p className="text-primary-100">
              Update your tender details and requirements
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
                Update Tender Information
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
                      placeholder="Enter budget amount (optional)"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
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
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-4 h-4 border-2"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
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

export default EditTender;
