import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Download,
  Flag,
  Loader2,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import { scanAPI, reportAPI } from "../services/api";
import RiskCard from "../components/RiskCard";

const ScanResults = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    type: "feedback",
    subject: "",
    description: "",
  });
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const data = await scanAPI.getScanResults(scanId);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch scan results:", err);
        setError(err.message || "Failed to load scan results");
      } finally {
        setIsLoading(false);
      }
    };

    if (scanId) {
      fetchResults();
    }
  }, [scanId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FraudShield Scan Results",
          text: `Risk Level: ${results.riskBand} (${results.riskScore}/100)`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const reportData = {
      scanId: results.scanId,
      timestamp: new Date().toISOString(),
      riskAssessment: {
        score: results.riskScore,
        band: results.riskBand,
      },
      redFlags: results.redFlags,
      advisorMatches: results.advisorMatches,
      explanation: results.explanation,
      recommendations: results.recommendations,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fraudshield-report-${scanId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    setReportSubmitting(true);

    try {
      await reportAPI.submit({
        ...reportData,
        scanId: results.scanId,
      });

      alert("Report submitted successfully! Thank you for your feedback.");
      setShowReportForm(false);
      setReportData({ type: "feedback", subject: "", description: "" });
    } catch (err) {
      alert("Failed to submit report: " + err.message);
    } finally {
      setReportSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">
              Analyzing content for fraud indicators...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-danger-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Error Loading Results
            </h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            ← Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Scan Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested scan results could not be found. The scan may have
            expired or the ID may be invalid.
          </p>
          <button onClick={() => navigate("/")} className="btn-primary">
            ← Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>New Scan</span>
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan Results</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Scan ID: {results.scanId}</span>
              </span>
              {results.meta?.processingTime && (
                <span>• Processed in {results.meta.processingTime}ms</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>

          <button
            onClick={() => setShowReportForm(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Main Results */}
      <RiskCard
        riskScore={results.riskScore}
        riskBand={results.riskBand}
        redFlags={results.redFlags}
        explanation={results.explanation}
        recommendations={results.recommendations}
        meta={results.meta}
        ocr={results.ocr}
      />

      {/* Advisor Matches */}
      {results.advisorMatches && results.advisorMatches.length > 0 && (
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserCheck className="h-5 w-5 text-primary-600 mr-2" />
            Advisor Verification Results ({results.advisorMatches.length})
          </h3>

          <div className="space-y-4">
            {results.advisorMatches.map((match, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{match.name}</h4>
                    <p className="text-sm text-gray-600">
                      Registration: {match.registrationNumber}
                    </p>
                    <p className="text-sm text-gray-600">Firm: {match.firm}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`badge ${
                        match.status === "active"
                          ? "badge-success"
                          : match.status === "suspended"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {match.status.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {match.confidence}% match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LLM Analysis Info */}
      {results.llm && (
        <div className="mt-8 card bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🤖 AI Analysis Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">AI Used</div>
              <div className="font-medium">
                {results.llm.used ? "Yes" : "Mock (Demo)"}
              </div>
            </div>

            <div>
              <div className="text-gray-600">AI Boost</div>
              <div className="font-medium">+{results.llm.boost} points</div>
            </div>

            <div>
              <div className="text-gray-600">Categories Found</div>
              <div className="font-medium">
                {results.llm.labels?.length || 0}
              </div>
            </div>
          </div>

          {results.llm.labels && results.llm.labels.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">
                AI Categories:
              </div>
              <div className="space-y-2">
                {results.llm.labels.map((label, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-white rounded border"
                  >
                    <span className="capitalize">
                      {label.category?.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {label.confidence}% confidence
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Report Issue
            </h3>

            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportData.type}
                  onChange={(e) =>
                    setReportData({ ...reportData, type: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="feedback">General Feedback</option>
                  <option value="false_positive">False Positive</option>
                  <option value="fraud">Report Fraud</option>
                  <option value="advisor_issue">Advisor Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={reportData.subject}
                  onChange={(e) =>
                    setReportData({ ...reportData, subject: e.target.value })
                  }
                  className="input-field"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportData.description}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      description: e.target.value,
                    })
                  }
                  className="input-field"
                  rows={4}
                  placeholder="Please provide details about the issue or feedback"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="btn-primary disabled:opacity-50 flex items-center space-x-2"
                >
                  {reportSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Report</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;
