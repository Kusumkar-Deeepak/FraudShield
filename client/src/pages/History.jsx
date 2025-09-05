import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  TrendingUp,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  Calendar,
  BarChart3,
} from "lucide-react";
import { scanAPI } from "../services/api";

const History = () => {
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    riskBand: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await scanAPI.getHistory(filters);
      setScans(data.scans);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch scan history:", err);
      setError(err.message || "Failed to load scan history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getRiskIcon = (riskBand) => {
    switch (riskBand) {
      case "HIGH":
        return <XCircle className="h-6 w-6 text-danger-600" />;
      case "MEDIUM":
        return <AlertTriangle className="h-6 w-6 text-warning-600" />;
      case "LOW":
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getInputTypeIcon = (inputType) => {
    switch (inputType) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "url":
        return <LinkIcon className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (riskBand) => {
    switch (riskBand) {
      case "HIGH":
        return "bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg shadow-danger-500/25";
      case "MEDIUM":
        return "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg shadow-warning-500/25";
      case "LOW":
        return "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Error Loading History
              </h2>
              <p className="text-gray-600">
                We encountered an issue retrieving your scan history
              </p>
            </div>
          </div>
          <div className="bg-danger-50 border border-danger-200 rounded-xl p-4 mb-6">
            <p className="text-danger-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-danger-600 rounded-2xl mb-4 shadow-lg">
          <BarChart3 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent mb-3">
          Scan History
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Track your fraud detection journey and review past analysis results
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <FileText className="h-5 w-5" />
          <span>New Scan</span>
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Filter & Search
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Search Scans
            </label>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search by scan ID or content..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Risk Level
            </label>
            <div className="relative">
              <AlertTriangle className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.riskBand}
                onChange={(e) => handleFilterChange("riskBand", e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              >
                <option value="">All Risk Levels</option>
                <option value="HIGH">🔴 High Risk</option>
                <option value="MEDIUM">🟡 Medium Risk</option>
                <option value="LOW">🟢 Low Risk</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Results per page
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", parseInt(e.target.value))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              <option value={10}>10 results</option>
              <option value={20}>20 results</option>
              <option value={50}>50 results</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-lg text-gray-600">Loading scan history...</p>
              <p className="text-sm text-gray-500">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        </div>
      ) : scans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="text-center py-16 space-y-6">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <TrendingUp className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                No Scans Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {filters.search || filters.riskBand
                  ? "No scans match your current filters. Try adjusting your search criteria."
                  : "You haven't performed any scans yet. Start by scanning your first investment promotion."}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              <span>Perform First Scan</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Scan Results
              </h3>
              <p className="text-gray-600">
                {pagination.total} scan{pagination.total !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </div>
          </div>

          {/* Scan List */}
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.scanId}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/scan/${scan.scanId}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {getRiskIcon(scan.riskBand)}
                      <div className="absolute inset-0 bg-current opacity-20 rounded-full blur-xl scale-150"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          Scan #{scan.scanId.slice(0, 8)}...
                        </h3>
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskBadge(
                            scan.riskBand
                          )}`}
                        >
                          {scan.riskBand} RISK
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(scan.createdAt)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {getInputTypeIcon(scan.inputType)}
                          <span className="capitalize font-medium">
                            {scan.inputType} • {scan.language.toUpperCase()}
                          </span>
                        </div>

                        {scan.processingTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{scan.processingTime}ms</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {scan.riskScore}
                      <span className="text-lg font-normal text-gray-500">
                        /100
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Risk Score
                    </div>

                    {/* Mini risk bar */}
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          scan.riskBand === "HIGH"
                            ? "bg-gradient-to-r from-danger-500 to-danger-600"
                            : scan.riskBand === "MEDIUM"
                            ? "bg-gradient-to-r from-warning-500 to-warning-600"
                            : "bg-gradient-to-r from-success-500 to-success-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, scan.riskScore)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span>{" "}
                  results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pageNum === pagination.page
                                ? "bg-gradient-to-r from-primary-600 to-danger-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
