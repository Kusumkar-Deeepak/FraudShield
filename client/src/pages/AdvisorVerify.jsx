import { useState } from "react";
import {
  Search,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Award,
  Building,
  Mail,
  Phone,
  Shield,
  Eye,
  FileCheck,
  Users,
} from "lucide-react";
import { advisorAPI } from "../services/api";

const AdvisorVerify = () => {
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const params = {};
      if (searchType === "name") {
        params.name = searchValue.trim();
      } else {
        params.registration = searchValue.trim();
      }

      const data = await advisorAPI.verify(params);
      setResults(data);
    } catch (err) {
      console.error("Advisor verification failed:", err);
      setError(err.message || "Failed to verify advisor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setResults(null);
    setError("");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case "suspended":
        return <AlertTriangle className="h-6 w-6 text-warning-600" />;
      case "cancelled":
        return <XCircle className="h-6 w-6 text-danger-600" />;
      default:
        return <UserCheck className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg shadow-success-500/25";
      case "suspended":
        return "bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-lg shadow-warning-500/25";
      case "cancelled":
        return "bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg shadow-danger-500/25";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-danger-600 rounded-2xl mb-4 shadow-lg">
          <UserCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent mb-3">
          Investment Advisor Verification
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Verify investment advisor credentials against official regulatory
          databases to ensure legitimacy and protect your investments
        </p>
      </div>

      {/* Search Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Credential Verification Search
          </h2>
        </div>

        <form onSubmit={handleSearch} className="space-y-8">
          {/* Search Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Search Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "name",
                  icon: Users,
                  label: "Advisor Name",
                  desc: "Search by full name of the advisor",
                },
                {
                  value: "registration",
                  icon: FileCheck,
                  label: "Registration Number",
                  desc: "Search by SEBI registration number",
                },
              ].map(({ value, icon: Icon, label, desc }) => (
                <label
                  key={value}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
                    searchType === value
                      ? "border-primary-600 bg-primary-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={value}
                    checked={searchType === value}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4">
                    <Icon
                      className={`h-8 w-8 ${
                        searchType === value
                          ? "text-primary-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <div
                        className={`font-semibold ${
                          searchType === value
                            ? "text-primary-900"
                            : "text-gray-900"
                        }`}
                      >
                        {label}
                      </div>
                      <div
                        className={`text-sm ${
                          searchType === value
                            ? "text-primary-700"
                            : "text-gray-500"
                        }`}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                  {searchType === value && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-900">
              {searchType === "name"
                ? "Advisor Full Name"
                : "SEBI Registration Number"}
            </label>
            <div className="relative">
              <Search className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === "name"
                    ? "Enter complete advisor name (e.g., Rajesh Kumar Sharma)"
                    : "Enter SEBI registration number (e.g., INH000001234)"
                }
                className="w-full pl-14 pr-6 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>
                {searchType === "name"
                  ? "Use the complete name as mentioned in official documents"
                  : "Registration numbers typically start with INH, INA, or similar prefixes"}
              </span>
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start space-x-3 p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-danger-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-danger-800">
                  Verification Error
                </h4>
                <p className="text-sm text-danger-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !searchValue.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Verify Advisor</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <XCircle className="h-5 w-5" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Search Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">
                    Search Query
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-blue-700">Search Type:</div>
                  <div className="font-semibold text-blue-900 capitalize">
                    {searchType}
                  </div>
                  <div className="text-sm text-blue-700 mt-3">Query:</div>
                  <div className="font-semibold text-blue-900">
                    {searchType === "name"
                      ? results.query.name
                      : results.query.registration}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <FileCheck className="h-6 w-6 text-emerald-600" />
                  <h4 className="text-lg font-semibold text-emerald-900">
                    Results Found
                  </h4>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-900 mb-2">
                    {results.count}
                  </div>
                  <div className="text-sm text-emerald-700">
                    {results.count === 1 ? "Match Found" : "Matches Found"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advisor Matches */}
          {results.found ? (
            <div className="space-y-6">
              {results.matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {getStatusIcon(match.status)}
                        <div className="absolute inset-0 bg-current opacity-20 rounded-full blur-xl scale-150"></div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900">
                          {match.name}
                        </h4>
                        <p className="text-gray-600 text-lg">
                          Registration: {match.registrationNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                          match.status
                        )}`}
                      >
                        {match.status.toUpperCase()}
                      </span>
                      <div className="text-sm text-gray-500">
                        {match.confidence}% match • {match.matchType}
                      </div>
                    </div>
                  </div>

                  {/* Advisor Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Building className="h-5 w-5 mr-2 text-primary-600" />
                          Professional Details
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Firm:</span>
                            <span className="font-semibold text-gray-900">
                              {match.firm}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Registration Date:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatDate(match.registrationDate)}
                            </span>
                          </div>
                          {match.verified && (
                            <div className="flex items-center justify-center space-x-2 bg-success-50 border border-success-200 rounded-lg p-3">
                              <CheckCircle className="h-5 w-5 text-success-600" />
                              <span className="font-semibold text-success-800">
                                Verified Advisor
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      {(match.email || match.phone) && (
                        <div className="bg-blue-50 rounded-xl p-6">
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Information
                          </h5>
                          <div className="space-y-3">
                            {match.email && (
                              <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-900">
                                  {match.email}
                                </span>
                              </div>
                            )}
                            {match.phone && (
                              <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-900">
                                  {match.phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-purple-50 rounded-xl p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-purple-600" />
                          Specializations & Expertise
                        </h5>
                        {match.specializations &&
                        match.specializations.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {match.specializations.map((spec, i) => (
                              <span
                                key={i}
                                className="inline-block bg-primary-100 text-primary-800 px-3 py-1.5 rounded-lg text-sm font-medium"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <span className="text-gray-500">
                              No specializations specified
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status Message */}
                      <div
                        className={`rounded-xl p-6 border-2 ${
                          match.status === "active"
                            ? "bg-success-50 border-success-200"
                            : match.status === "suspended"
                            ? "bg-warning-50 border-warning-200"
                            : "bg-danger-50 border-danger-200"
                        }`}
                      >
                        <h5 className="font-semibold mb-2">
                          Verification Status
                        </h5>
                        <p
                          className={`text-sm ${
                            match.status === "active"
                              ? "text-success-800"
                              : match.status === "suspended"
                              ? "text-warning-800"
                              : "text-danger-800"
                          }`}
                        >
                          {match.status === "active"
                            ? "✅ This advisor is currently active and registered with proper credentials."
                            : match.status === "suspended"
                            ? "⚠️ This advisor is currently suspended. Exercise extreme caution before proceeding."
                            : "❌ This advisor's registration has been cancelled. Do not proceed with any investments."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <XCircle className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    No Advisor Found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No registered advisor found matching your search criteria.
                    This could indicate an unregistered advisor.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 text-left max-w-2xl mx-auto">
                  <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    ⚠️ Critical Safety Warning
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Never invest with unregistered advisors or unlicensed
                        entities
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Always verify credentials through official SEBI channels
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Report suspicious advisors to regulatory authorities
                        immediately
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Be wary of promises of guaranteed high returns
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Eye className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-900">
              How Verification Works
            </h3>
          </div>
          <ul className="text-sm text-blue-800 space-y-3">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Real-time search across official regulatory databases</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Cross-reference advisor names and registration numbers
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Verify current registration status and standing</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Display professional qualifications and specializations
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Provide confidence scores and match types</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-emerald-600" />
            <h3 className="text-xl font-semibold text-emerald-900">
              Red Flags to Watch
            </h3>
          </div>
          <ul className="text-sm text-emerald-800 space-y-3">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>No valid SEBI registration number provided</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Status shows as "Suspended" or "Cancelled"</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Promises of guaranteed returns above market rates</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Pressure to invest immediately without documentation</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Requests for cash payments or unusual transfer methods
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvisorVerify;

// const AdvisorVerify = () => {
//   const [searchType, setSearchType] = useState("name");
//   const [searchValue, setSearchValue] = useState("");
//   const [results, setResults] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async (e) => {
//     e.preventDefault();

//     if (!searchValue.trim()) {
//       setError("Please enter a search term");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setResults(null);

//     try {
//       const params = {};
//       if (searchType === "name") {
//         params.name = searchValue.trim();
//       } else {
//         params.registration = searchValue.trim();
//       }

//       const data = await advisorAPI.verify(params);
//       setResults(data);
//     } catch (err) {
//       console.error("Advisor verification failed:", err);
//       setError(err.message || "Failed to verify advisor");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setSearchValue("");
//     setResults(null);
//     setError("");
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "active":
//         return <CheckCircle className="h-5 w-5 text-success-600" />;
//       case "suspended":
//         return <AlertTriangle className="h-5 w-5 text-warning-600" />;
//       case "cancelled":
//         return <XCircle className="h-5 w-5 text-danger-600" />;
//       default:
//         return <UserCheck className="h-5 w-5 text-gray-600" />;
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "active":
//         return "badge-success";
//       case "suspended":
//         return "badge-warning";
//       case "cancelled":
//         return "badge-danger";
//       default:
//         return "badge bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">
//           Verify Investment Advisor
//         </h1>
//         <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//           Check if an investment advisor is registered and verify their
//           credentials against official databases.
//         </p>
//       </div>

//       {/* Search Form */}
//       <div className="card mb-8">
//         <div className="flex items-center space-x-2 mb-6">
//           <UserCheck className="h-6 w-6 text-primary-600" />
//           <h2 className="text-xl font-semibold text-gray-900">
//             Advisor Verification Search
//           </h2>
//         </div>

//         <form onSubmit={handleSearch} className="space-y-6">
//           {/* Search Type Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Search By
//             </label>
//             <div className="flex space-x-4">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="name"
//                   checked={searchType === "name"}
//                   onChange={(e) => setSearchType(e.target.value)}
//                   className="mr-2 text-primary-600 focus:ring-primary-500"
//                 />
//                 Advisor Name
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="registration"
//                   checked={searchType === "registration"}
//                   onChange={(e) => setSearchType(e.target.value)}
//                   className="mr-2 text-primary-600 focus:ring-primary-500"
//                 />
//                 Registration Number
//               </label>
//             </div>
//           </div>

//           {/* Search Input */}
//           <div>
//             <label
//               htmlFor="search"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               {searchType === "name" ? "Advisor Name" : "Registration Number"}
//             </label>
//             <div className="relative">
//               <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 id="search"
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => setSearchValue(e.target.value)}
//                 placeholder={
//                   searchType === "name"
//                     ? "Enter advisor full name (e.g., Rajesh Kumar Sharma)"
//                     : "Enter registration number (e.g., INH000001234)"
//                 }
//                 className="input-field pl-10"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="flex items-center space-x-2 p-3 bg-danger-50 border border-danger-200 rounded-md">
//               <AlertTriangle className="h-5 w-5 text-danger-600 flex-shrink-0" />
//               <span className="text-danger-700 text-sm">{error}</span>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex space-x-3">
//             <button
//               type="submit"
//               disabled={isLoading || !searchValue.trim()}
//               className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="loading-spinner"></div>
//                   <span>Searching...</span>
//                 </>
//               ) : (
//                 <>
//                   <Search className="h-4 w-4" />
//                   <span>Verify Advisor</span>
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleClear}
//               disabled={isLoading}
//               className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Clear
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Search Results */}
//       {results && (
//         <div className="space-y-6">
//           {/* Results Summary */}
//           <div className="card">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Search Results
//             </h3>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <div className="text-sm text-gray-600">Search Query:</div>
//                 <div className="font-medium">
//                   {searchType === "name"
//                     ? results.query.name
//                     : results.query.registration}
//                 </div>
//               </div>

//               <div className="text-right">
//                 <div className="text-sm text-gray-600">Results Found:</div>
//                 <div className="text-2xl font-bold text-gray-900">
//                   {results.count}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Advisor Matches */}
//           {results.found ? (
//             <div className="space-y-4">
//               {results.matches.map((match, index) => (
//                 <div key={index} className="card">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center space-x-3">
//                       {getStatusIcon(match.status)}
//                       <div>
//                         <h4 className="text-xl font-semibold text-gray-900">
//                           {match.name}
//                         </h4>
//                         <p className="text-gray-600">
//                           Registration: {match.registrationNumber}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <span className={`badge ${getStatusBadge(match.status)}`}>
//                         {match.status.toUpperCase()}
//                       </span>
//                       <div className="text-sm text-gray-500 mt-1">
//                         {match.confidence}% match • {match.matchType}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Advisor Details Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
//                         <Building className="h-4 w-4 mr-1" />
//                         Professional Details
//                       </h5>
//                       <div className="space-y-2 text-sm">
//                         <div>
//                           <span className="text-gray-600">Firm:</span>
//                           <span className="ml-2 font-medium">{match.firm}</span>
//                         </div>
//                         <div>
//                           <span className="text-gray-600">
//                             Registration Date:
//                           </span>
//                           <span className="ml-2 font-medium">
//                             {formatDate(match.registrationDate)}
//                           </span>
//                         </div>
//                         {match.verified && (
//                           <div className="flex items-center space-x-1 text-success-600">
//                             <CheckCircle className="h-4 w-4" />
//                             <span>Verified Advisor</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
//                         <Award className="h-4 w-4 mr-1" />
//                         Specializations
//                       </h5>
//                       <div className="space-y-2 text-sm">
//                         {match.specializations &&
//                         match.specializations.length > 0 ? (
//                           <div className="flex flex-wrap gap-1">
//                             {match.specializations.map((spec, i) => (
//                               <span
//                                 key={i}
//                                 className="inline-block bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs"
//                               >
//                                 {spec}
//                               </span>
//                             ))}
//                           </div>
//                         ) : (
//                           <span className="text-gray-500">Not specified</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Contact Information */}
//                   {(match.email || match.phone) && (
//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                       <h5 className="text-sm font-medium text-gray-900 mb-3">
//                         Contact Information
//                       </h5>
//                       <div className="flex flex-wrap gap-4 text-sm">
//                         {match.email && (
//                           <div className="flex items-center space-x-1">
//                             <Mail className="h-4 w-4 text-gray-400" />
//                             <span>{match.email}</span>
//                           </div>
//                         )}
//                         {match.phone && (
//                           <div className="flex items-center space-x-1">
//                             <Phone className="h-4 w-4 text-gray-400" />
//                             <span>{match.phone}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Status Message */}
//                   <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                     <p className="text-sm text-blue-800">
//                       {match.status === "active"
//                         ? "✅ This advisor is currently active and registered."
//                         : match.status === "suspended"
//                         ? "⚠️ This advisor is currently suspended. Exercise caution."
//                         : "❌ This advisor registration has been cancelled."}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="card">
//               <div className="text-center py-8">
//                 <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No Advisor Found
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   No registered advisor found matching your search criteria.
//                 </p>
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-left">
//                   <h4 className="text-sm font-medium text-yellow-800 mb-2">
//                     ⚠️ Important Safety Tips:
//                   </h4>
//                   <ul className="text-sm text-yellow-700 space-y-1">
//                     <li>
//                       • Always verify advisor credentials before investing
//                     </li>
//                     <li>• Be cautious of unregistered investment advisors</li>
//                     <li>• Check SEBI's official website for verification</li>
//                     <li>• Report suspicious activity to authorities</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Information Section */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="card bg-blue-50">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             🔍 How Verification Works
//           </h3>
//           <ul className="text-sm text-gray-700 space-y-2">
//             <li>• Search by advisor name or registration number</li>
//             <li>• Cross-reference with regulatory databases</li>
//             <li>• Check current registration status</li>
//             <li>• View professional qualifications and specializations</li>
//             <li>• Get match confidence and verification status</li>
//           </ul>
//         </div>

//         <div className="card bg-green-50">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             ✅ What to Look For
//           </h3>
//           <ul className="text-sm text-gray-700 space-y-2">
//             <li>• Valid SEBI registration number</li>
//             <li>• "Active" status in our database</li>
//             <li>• Professional certifications (CFP, CFA, etc.)</li>
//             <li>• Transparent fee structure</li>
//             <li>• Proper documentation and disclosures</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdvisorVerify;
