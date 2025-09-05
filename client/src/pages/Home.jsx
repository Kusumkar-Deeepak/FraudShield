import ScanForm from "../components/ScanForm";
import {
  Shield,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Lock,
  Brain,
  AlertTriangle,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms detect sophisticated fraud patterns and schemes with 95% accuracy.",
      color: "primary",
      gradient: "from-primary-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Real-time Results",
      description:
        "Get instant fraud risk assessment with detailed explanations and actionable recommendations.",
      color: "success",
      gradient: "from-success-500 to-green-600",
    },
    {
      icon: Users,
      title: "Advisor Verification",
      description:
        "Verify investment advisor credentials against official regulatory databases and registrations.",
      color: "warning",
      gradient: "from-warning-500 to-amber-600",
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description:
        "Analyze content in English, Hindi, and Marathi for comprehensive regional coverage.",
      color: "danger",
      gradient: "from-danger-500 to-red-600",
    },
    {
      icon: TrendingUp,
      title: "Detailed Reports",
      description:
        "Comprehensive analysis with risk scores, red flags, evidence, and detailed insights.",
      color: "purple",
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description:
        "Your data is processed securely with privacy protection and minimal data retention policies.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-600",
    },
  ];

  const stats = [
    { value: "95%", label: "Fraud Detection Accuracy", color: "primary" },
    { value: "10s", label: "Average Scan Time", color: "success" },
    { value: "24/7", label: "Always Available", color: "warning" },
    { value: "3", label: "Languages Supported", color: "danger" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-danger-600 to-primary-800 bg-clip-text text-transparent leading-tight">
            Protect Yourself from
            <br />
            Investment Fraud
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Use cutting-edge AI-powered analysis to detect fraud signals in
            investment promotions, verify advisor credentials, and make informed
            financial decisions with confidence.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${
                  stat.color === "primary"
                    ? "from-primary-600 to-blue-600"
                    : stat.color === "success"
                    ? "from-success-600 to-green-600"
                    : stat.color === "warning"
                    ? "from-warning-600 to-amber-600"
                    : "from-danger-600 to-red-600"
                } bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Scan Form */}
      <ScanForm />

      {/* Features Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Advanced Protection Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive fraud detection system combines artificial
            intelligence, regulatory data, and pattern recognition to keep your
            investments safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-200/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How FraudShield Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our three-step process ensures comprehensive fraud detection and
            verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Submit Content
            </h3>
            <p className="text-gray-600">
              Upload text, URLs, or images containing investment promotions or
              advisor information
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes patterns, verifies credentials, and identifies
              potential fraud indicators
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-warning-500 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Get Results</h3>
            <p className="text-gray-600">
              Receive detailed risk assessment with explanations and actionable
              recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Security Section */}
      <div className="bg-white rounded-3xl border border-gray-200/50 p-8 md:p-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Trusted & Secure</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Built with Security & Privacy in Mind
            </h2>

            <div className="space-y-4 text-gray-600">
              <p>
                FraudShield employs enterprise-grade security measures to
                protect your data while providing accurate fraud detection
                capabilities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>End-to-end encryption for all data transmission</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Minimal data retention with automatic deletion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No personal information required for analysis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Compliant with data protection regulations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary-50 to-blue-100 rounded-2xl p-8 border border-primary-200">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Enterprise Security
                </h3>
                <p className="text-gray-600">
                  Bank-level security protocols ensure your data remains
                  protected throughout the analysis process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-900">
              Important Legal Disclaimer
            </h3>
            <div className="text-amber-800 leading-relaxed space-y-3">
              <p>
                <strong>FraudShield is a prototype demonstration system</strong>{" "}
                designed for educational and research purposes. While our AI
                models and heuristics are designed to detect common fraud
                patterns, this tool should not be used as the sole basis for
                investment decisions or regulatory actions.
              </p>
              <p>
                <strong>
                  Always verify investment opportunities independently
                </strong>{" "}
                and consult with licensed, registered financial advisors before
                making any financial commitments. Past performance does not
                guarantee future results.
              </p>
              <p>
                For official regulatory guidance, please consult with SEBI
                (Securities and Exchange Board of India), RBI (Reserve Bank of
                India), or other relevant financial authorities in your
                jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
