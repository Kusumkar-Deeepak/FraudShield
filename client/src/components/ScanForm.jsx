import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Link as LinkIcon,
  Loader2,
  AlertTriangle,
  Shield,
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle,
  Eye,
} from "lucide-react";
import { scanAPI } from "../services/api";

const ScanForm = () => {
  const [inputType, setInputType] = useState("text");
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (inputType === "image" && !selectedImage) {
      setError("Please select an image to scan");
      return;
    }

    if (inputType !== "image" && !value.trim()) {
      setError("Please enter content to scan");
      return;
    }

    if (inputType === "text" && value.trim().length < 10) {
      setError("Text content must be at least 10 characters long");
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (inputType === "image") {
        // Handle image upload and OCR
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("lang", language);

        result = await scanAPI.scanImage(formData);
      } else {
        result = await scanAPI.scan({
          inputType,
          value: value.trim(),
          lang: language,
        });
      }

      console.log("✅ Scan completed:", result.scanId);
      navigate(`/scan/${result.scanId}`);
    } catch (err) {
      console.error("❌ Scan failed:", err);
      setError(err.message || "Failed to scan content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setSelectedImage(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
  };

  const handleClear = () => {
    setValue("");
    setError("");
    removeImage();
  };

  const exampleTexts = {
    en: {
      scam: "🚨 URGENT INVESTMENT OPPORTUNITY! 🚨\n\nGuaranteed 200% returns in just 30 days! Pre-IPO shares of XYZ company available for firm allotment. Limited time offer - only today!\n\nContact Rajesh on WhatsApp: +91-9876543210\nPay registration fee of ₹5000 via UPI: rajesh@paytm\n\nNo SEBI approval required. This is a government scheme. Act now before slots are full!",
      legit:
        "We are pleased to inform you about our new mutual fund scheme focusing on large-cap equity investments. The scheme aims to provide long-term capital appreciation with moderate risk.\n\nFund Details:\n- Minimum investment: ₹500\n- Lock-in period: None\n- Exit load: 1% if redeemed within 1 year\n- Expense ratio: 2.25%\n\nPlease read the scheme information document carefully before investing. Mutual fund investments are subject to market risks.",
      mixed:
        "Exclusive investment opportunity in pre-IPO shares! Our SEBI registered advisor recommends this stock for high returns. Contact our certified financial planner for detailed analysis.\n\nNote: Past performance does not guarantee future results. Please consult with qualified advisors before making investment decisions.",
    },
  };

  const loadExample = (type) => {
    setValue(exampleTexts.en[type]);
    setInputType("text");
    setError("");
    removeImage();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-danger-600 rounded-2xl mb-4 shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent mb-2">
          AI Fraud Detection Scanner
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analyze investment content using advanced AI to detect fraud patterns,
          verify advisors, and protect your financial interests.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Type Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Choose Analysis Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: "text",
                  icon: FileText,
                  label: "Text Content",
                  desc: "Analyze text messages or documents",
                },
                {
                  value: "url",
                  icon: LinkIcon,
                  label: "Website URL",
                  desc: "Scan web pages for fraud indicators",
                },
                {
                  value: "image",
                  icon: ImageIcon,
                  label: "Image Upload",
                  desc: "Extract and analyze text from images",
                },
              ].map(({ value: radioValue, icon: Icon, label, desc }) => (
                <label
                  key={radioValue}
                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
                    inputType === radioValue
                      ? "border-primary-600 bg-primary-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={radioValue}
                    checked={inputType === radioValue}
                    onChange={(e) => setInputType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Icon
                      className={`h-8 w-8 ${
                        inputType === radioValue
                          ? "text-primary-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <div
                        className={`font-semibold ${
                          inputType === radioValue
                            ? "text-primary-900"
                            : "text-gray-900"
                        }`}
                      >
                        {label}
                      </div>
                      <div
                        className={`text-sm ${
                          inputType === radioValue
                            ? "text-primary-700"
                            : "text-gray-500"
                        }`}
                      >
                        {desc}
                      </div>
                    </div>
                  </div>
                  {inputType === radioValue && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                Analysis Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </div>

          {/* Content Input Area */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-semibold text-gray-900">
                {inputType === "text"
                  ? "Text Content"
                  : inputType === "url"
                  ? "Website URL"
                  : "Image Upload"}
              </label>
              {inputType === "text" && (
                <div className="flex flex-wrap gap-2">
                  {[
                    { type: "scam", label: "Scam Example", color: "danger" },
                    {
                      type: "legit",
                      label: "Legitimate Example",
                      color: "success",
                    },
                    { type: "mixed", label: "Mixed Example", color: "warning" },
                  ].map(({ type, label, color }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => loadExample(type)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200 border ${
                        color === "danger"
                          ? "text-danger-700 bg-danger-50 border-danger-200 hover:bg-danger-100"
                          : color === "success"
                          ? "text-success-700 bg-success-50 border-success-200 hover:bg-success-100"
                          : "text-warning-700 bg-warning-50 border-warning-200 hover:bg-warning-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Text Input */}
            {inputType === "text" && (
              <div className="space-y-3">
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter the investment promotion text, message, or advertisement content you want to check for fraud indicators..."
                  rows={10}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                  disabled={isLoading}
                />
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{value.length} characters (minimum 10 required)</span>
                  <span
                    className={
                      value.length >= 10 ? "text-success-600" : "text-gray-400"
                    }
                  >
                    {value.length >= 10
                      ? "✓ Ready to scan"
                      : "Need more content"}
                  </span>
                </div>
              </div>
            )}

            {/* URL Input */}
            {inputType === "url" && (
              <div className="space-y-3">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://example.com/investment-offer"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  disabled={isLoading}
                />
                <div className="text-sm text-gray-500">
                  Enter a complete URL starting with http:// or https://
                </div>
              </div>
            )}

            {/* Image Upload */}
            {inputType === "image" && (
              <div className="space-y-4">
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload Image
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Select an image containing investment content or
                        advertisements
                      </p>
                      <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {selectedImage.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center text-success-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Ready for analysis</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-danger-600 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start space-x-3 p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-danger-800">Error</h4>
                <p className="text-sm text-danger-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                isLoading ||
                (inputType === "image" ? !selectedImage : !value.trim())
              }
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Start Fraud Analysis</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={
                isLoading ||
                (inputType === "image" ? !selectedImage : !value.trim())
              }
              className="flex items-center justify-center space-x-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            How Analysis Works
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              AI-powered pattern recognition for fraud indicators
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Real-time advisor credential verification
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              OCR text extraction from images
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Comprehensive risk scoring and reporting
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Detection Capabilities
          </h3>
          <ul className="text-sm text-amber-800 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Unrealistic return promises and guarantees
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Urgency tactics and limited-time offers
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Unregistered advisor and regulatory violations
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Social engineering and psychological manipulation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanForm;
