import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Target,
  Activity,
  Eye,
} from "lucide-react";

const RiskCard = ({
  riskScore,
  riskBand,
  redFlags = [],
  explanation,
  recommendations = [],
  meta = {},
  ocr = null,
}) => {
  const getRiskConfig = (band) => {
    switch (band) {
      case "HIGH":
        return {
          color: "danger",
          icon: XCircle,
          bgGradient: "bg-gradient-to-br from-danger-50 to-red-100",
          borderColor: "border-danger-300",
          textColor: "text-danger-900",
          iconColor: "text-danger-600",
          scoreColor: "text-danger-700",
          barColor: "bg-gradient-to-r from-danger-500 to-red-600",
          title: "🚨 High Risk - Likely Fraud",
          description:
            "Multiple fraud indicators detected. Strongly recommend avoiding this investment.",
          shadow: "shadow-danger-500/20",
        };
      case "MEDIUM":
        return {
          color: "warning",
          icon: AlertTriangle,
          bgGradient: "bg-gradient-to-br from-warning-50 to-amber-100",
          borderColor: "border-warning-300",
          textColor: "text-warning-900",
          iconColor: "text-warning-600",
          scoreColor: "text-warning-700",
          barColor: "bg-gradient-to-r from-warning-500 to-amber-500",
          title: "⚠️ Medium Risk - Exercise Caution",
          description:
            "Some concerning elements detected. Thorough verification required before proceeding.",
          shadow: "shadow-warning-500/20",
        };
      case "LOW":
        return {
          color: "success",
          icon: CheckCircle,
          bgGradient: "bg-gradient-to-br from-success-50 to-green-100",
          borderColor: "border-success-300",
          textColor: "text-success-900",
          iconColor: "text-success-600",
          scoreColor: "text-success-700",
          barColor: "bg-gradient-to-r from-success-500 to-green-500",
          title: "✅ Low Risk - Appears Safe",
          description:
            "Few or no fraud indicators detected. Still verify independently with licensed advisors.",
          shadow: "shadow-success-500/20",
        };
      default:
        return {
          color: "gray",
          icon: Shield,
          bgGradient: "bg-gradient-to-br from-gray-50 to-slate-100",
          borderColor: "border-gray-300",
          textColor: "text-gray-900",
          iconColor: "text-gray-600",
          scoreColor: "text-gray-700",
          barColor: "bg-gradient-to-r from-gray-500 to-slate-500",
          title: "🔍 Analysis Complete",
          description: "Risk assessment completed.",
          shadow: "shadow-gray-500/20",
        };
    }
  };

  const config = getRiskConfig(riskBand);
  const RiskIcon = config.icon;

  const getScoreWidth = () => {
    return Math.min(100, Math.max(0, riskScore));
  };

  const formatRedFlags = () => {
    const grouped = redFlags.reduce((acc, flag) => {
      if (!acc[flag.severity]) acc[flag.severity] = [];
      acc[flag.severity].push(flag);
      return acc;
    }, {});

    return {
      high: grouped.high || [],
      medium: grouped.medium || [],
      low: grouped.low || [],
    };
  };

  const groupedFlags = formatRedFlags();

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return XCircle;
      case "medium":
        return AlertTriangle;
      case "low":
        return Clock;
      default:
        return Clock;
    }
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case "high":
        return {
          bg: "bg-gradient-to-r from-danger-50 to-red-50",
          border: "border-danger-200",
          text: "text-danger-900",
          subtext: "text-danger-700",
          badge: "bg-danger-100 text-danger-800 border border-danger-300",
          icon: "text-danger-600",
        };
      case "medium":
        return {
          bg: "bg-gradient-to-r from-warning-50 to-amber-50",
          border: "border-warning-200",
          text: "text-warning-900",
          subtext: "text-warning-700",
          badge: "bg-warning-100 text-warning-800 border border-warning-300",
          icon: "text-warning-600",
        };
      case "low":
        return {
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          border: "border-gray-200",
          text: "text-gray-900",
          subtext: "text-gray-700",
          badge: "bg-gray-100 text-gray-800 border border-gray-300",
          icon: "text-gray-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-900",
          subtext: "text-gray-700",
          badge: "bg-gray-100 text-gray-800",
          icon: "text-gray-600",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Risk Assessment Card */}
      <div
        className={`${config.bgGradient} ${config.borderColor} border-2 rounded-2xl p-8 shadow-xl ${config.shadow}`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <RiskIcon
                className={`h-12 w-12 ${config.iconColor} drop-shadow-sm`}
              />
              <div
                className={`absolute inset-0 h-12 w-12 ${config.iconColor} opacity-20 rounded-full blur-xl`}
              ></div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${config.textColor} mb-2`}>
                {config.title}
              </h3>
              <p
                className={`text-sm ${config.textColor} opacity-80 max-w-md leading-relaxed`}
              >
                {config.description}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-5xl font-bold ${config.scoreColor} drop-shadow-sm`}
            >
              {riskScore}
              <span className="text-2xl font-medium opacity-70">/100</span>
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">
              Risk Score
            </div>
          </div>
        </div>

        {/* Risk Score Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-medium text-gray-600">
            <span>Safe</span>
            <span>Cautious</span>
            <span>Dangerous</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200/60 rounded-full h-4 shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${config.barColor} shadow-lg`}
                style={{ width: `${getScoreWidth()}%` }}
              />
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center">
              <div
                className="w-1 h-6 bg-white rounded-full shadow-md"
                style={{ marginLeft: `calc(${getScoreWidth()}% - 2px)` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>35</span>
            <span>65</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* OCR Results (if image scan) */}
      {ocr && (
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 text-blue-600 mr-2" />
            Extracted Text Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">
                Confidence
              </div>
              <div className="text-lg font-bold text-blue-900">
                {Math.round(ocr.confidence)}%
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">
                Words Found
              </div>
              <div className="text-lg font-bold text-blue-900">
                {ocr.wordCount}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-blue-600 font-medium">
                Characters
              </div>
              <div className="text-lg font-bold text-blue-900">
                {ocr.extractedText.length}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Extracted Content:
            </div>
            <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
              "{ocr.extractedText}"
            </div>
          </div>
        </div>
      )}

      {/* Red Flags Section */}
      {redFlags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 text-warning-600 mr-3" />
            Detected Risk Indicators ({redFlags.length})
          </h4>

          <div className="space-y-6">
            {/* High Severity Flags */}
            {groupedFlags.high.length > 0 && (
              <div>
                <h5 className="text-base font-semibold text-danger-800 mb-4 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Critical Risk Indicators ({groupedFlags.high.length})
                </h5>
                <div className="space-y-3">
                  {groupedFlags.high.map((flag, index) => {
                    const severityConfig = getSeverityConfig("high");
                    const SeverityIcon = getSeverityIcon("high");
                    return (
                      <div
                        key={index}
                        className={`${severityConfig.bg} ${severityConfig.border} border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <SeverityIcon
                              className={`h-5 w-5 ${severityConfig.icon} mt-0.5 flex-shrink-0`}
                            />
                            <div className="flex-1">
                              <div
                                className={`font-semibold ${severityConfig.text} capitalize text-base`}
                              >
                                {flag.label.replace(/_/g, " ")}
                              </div>
                              <div
                                className={`text-sm ${severityConfig.subtext} mt-2 leading-relaxed`}
                              >
                                <span className="font-medium">
                                  Found evidence:
                                </span>{" "}
                                "{flag.evidence.slice(0, 2).join('", "')}"
                                {flag.evidence.length > 2 &&
                                  ` (and ${
                                    flag.evidence.length - 2
                                  } more instances)`}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.badge} flex-shrink-0`}
                          >
                            Weight: {flag.weight}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Medium Severity Flags */}
            {groupedFlags.medium.length > 0 && (
              <div>
                <h5 className="text-base font-semibold text-warning-800 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Moderate Risk Indicators ({groupedFlags.medium.length})
                </h5>
                <div className="space-y-3">
                  {groupedFlags.medium.map((flag, index) => {
                    const severityConfig = getSeverityConfig("medium");
                    const SeverityIcon = getSeverityIcon("medium");
                    return (
                      <div
                        key={index}
                        className={`${severityConfig.bg} ${severityConfig.border} border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <SeverityIcon
                              className={`h-5 w-5 ${severityConfig.icon} mt-0.5 flex-shrink-0`}
                            />
                            <div className="flex-1">
                              <div
                                className={`font-semibold ${severityConfig.text} capitalize text-base`}
                              >
                                {flag.label.replace(/_/g, " ")}
                              </div>
                              <div
                                className={`text-sm ${severityConfig.subtext} mt-2 leading-relaxed`}
                              >
                                <span className="font-medium">
                                  Found evidence:
                                </span>{" "}
                                "{flag.evidence.slice(0, 2).join('", "')}"
                                {flag.evidence.length > 2 &&
                                  ` (and ${
                                    flag.evidence.length - 2
                                  } more instances)`}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.badge} flex-shrink-0`}
                          >
                            Weight: {flag.weight}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Low Severity Flags */}
            {groupedFlags.low.length > 0 && (
              <div>
                <h5 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Minor Risk Indicators ({groupedFlags.low.length})
                </h5>
                <div className="space-y-3">
                  {groupedFlags.low.map((flag, index) => {
                    const severityConfig = getSeverityConfig("low");
                    const SeverityIcon = getSeverityIcon("low");
                    return (
                      <div
                        key={index}
                        className={`${severityConfig.bg} ${severityConfig.border} border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <SeverityIcon
                              className={`h-5 w-5 ${severityConfig.icon} mt-0.5 flex-shrink-0`}
                            />
                            <div className="flex-1">
                              <div
                                className={`font-semibold ${severityConfig.text} capitalize text-base`}
                              >
                                {flag.label.replace(/_/g, " ")}
                              </div>
                              <div
                                className={`text-sm ${severityConfig.subtext} mt-2 leading-relaxed`}
                              >
                                <span className="font-medium">
                                  Found evidence:
                                </span>{" "}
                                "{flag.evidence.slice(0, 2).join('", "')}"
                                {flag.evidence.length > 2 &&
                                  ` (and ${
                                    flag.evidence.length - 2
                                  } more instances)`}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${severityConfig.badge} flex-shrink-0`}
                          >
                            Weight: {flag.weight}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Explanation */}
      {explanation && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
            AI Analysis Report
          </h4>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
              {explanation}
            </pre>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="h-6 w-6 text-primary-600 mr-3" />
            Security Recommendations
          </h4>
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-blue-50 rounded-xl p-4 border border-blue-100"
              >
                <CheckCircle className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta Information */}
      {meta && Object.keys(meta).length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 text-gray-600 mr-2" />
            Scan Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {meta.processingTime && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-gray-500 text-sm font-medium">
                  Processing Time
                </div>
                <div className="font-bold text-lg text-gray-900 mt-1">
                  {meta.processingTime}ms
                </div>
              </div>
            )}
            {meta.flagCount !== undefined && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-gray-500 text-sm font-medium">
                  Flags Detected
                </div>
                <div className="font-bold text-lg text-gray-900 mt-1">
                  {meta.flagCount}
                </div>
              </div>
            )}
            {meta.language && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-gray-500 text-sm font-medium">
                  Language
                </div>
                <div className="font-bold text-lg text-gray-900 mt-1 uppercase">
                  {meta.language}
                </div>
              </div>
            )}
            {meta.inputType && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-gray-500 text-sm font-medium">
                  Input Type
                </div>
                <div className="font-bold text-lg text-gray-900 mt-1 capitalize">
                  {meta.inputType}
                </div>
              </div>
            )}
            {meta.imageSize && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-gray-500 text-sm font-medium">
                  Image Size
                </div>
                <div className="font-bold text-lg text-gray-900 mt-1">
                  {(meta.imageSize / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCard;
