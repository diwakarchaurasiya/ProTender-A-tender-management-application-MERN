import React, { useState, useEffect } from "react";
import { tenderService } from "../services/tenderService";
import { toast } from "react-toastify";
import { Search, Filter, Briefcase, TrendingUp } from "lucide-react";
import TenderCard from "../components/TenderCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const tenderCategories = [
  "All Categories", // Option to clear filter
  "IT & Software",
  "Construction",
  "Healthcare",
  "Education",
  "Finance",
  "Marketing",
  "Consulting",
  "Manufacturing",
  "Logistics",
  "Retail",
  "Public Sector",
  // Add more categories as needed
];

const BrowseTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories"); // New state for category filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTenders();
  }, [currentPage, searchTerm, selectedCategory]); // Add selectedCategory to dependency array

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const category =
        selectedCategory === "All Categories" ? null : selectedCategory;
      const response = await tenderService.getTenders(
        currentPage,
        12,
        searchTerm,
        category // Pass the selected category to the service
      );
      setTenders(response.data.tenders);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      toast.error(error.message || "Failed to fetch tenders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Business Opportunities
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Browse active tenders from leading companies and submit your
              proposals to grow your business
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-2xl font-bold">{totalCount}</span>
                </div>
                <p className="text-primary-100 text-sm">Active Tenders</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <p className="text-primary-100 text-sm">Companies</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-white">
                  <Filter className="h-5 w-5" />
                  <span className="text-2xl font-bold">15+</span>
                </div>
                <p className="text-primary-100 text-sm">Industries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="card p-6 shadow-xl flex flex-col md:flex-row items-center gap-4">
          {" "}
          {/* Added flexbox for layout */}
          <div className="relative flex-grow">
            {" "}
            {/* Search bar */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tenders by title, description, or company..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-field w-full pl-10 text-lg py-4"
            />
          </div>
          <div className="relative w-full md:w-64">
            {/* Filter dropdown */}
            <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="input-field w-full pl-10 text-md py-4 appearance-none pr-8" // Added appearance-none and pr-8 for custom arrow
            >
              {tenderCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <LoadingSpinner message="Loading tenders..." />
        ) : tenders.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchTerm || selectedCategory !== "All Categories"
                    ? "Filtered Results"
                    : "All Tenders"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {totalCount} tender{totalCount !== 1 ? "s" : ""} found
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory !== "All Categories" &&
                    ` in "${selectedCategory}"`}
                </p>
              </div>
            </div>

            {/* Tenders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
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
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tenders Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All Categories"
                ? "Try adjusting your search terms or filter, or browse all tenders."
                : "No tenders are currently available. Check back later!"}
            </p>
            {(searchTerm || selectedCategory !== "All Categories") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
                className="btn btn-primary"
              >
                Clear Search and Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseTenders;
