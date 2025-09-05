import {
  Shield,
  AlertTriangle,
  Users,
  TrendingUp,
  Lock,
  Zap,
  Code,
  Database,
  Brain,
  Globe,
  MessageSquare,
  Heart,
  Star,
  Target,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-danger-600 rounded-3xl shadow-xl mb-6">
          <Shield className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent">
            About FraudShield
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Empowering investors with AI-powered fraud detection technology to
            make safer, more informed financial decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-900">95%+</div>
            <div className="text-sm text-blue-700">Detection Accuracy</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
            <Zap className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-emerald-900">&lt;2s</div>
            <div className="text-sm text-emerald-700">Analysis Time</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
            <Globe className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-900">3+</div>
            <div className="text-sm text-purple-700">Languages Supported</div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
        <div className="flex items-center space-x-4 mb-8">
          <Target className="h-8 w-8 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              FraudShield democratizes financial fraud detection by providing
              accessible, AI-powered tools that analyze investment promotions
              and identify potential red flags in real-time.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to empower every investor—from beginners to
              professionals—with the knowledge and technology needed to protect
              themselves from financial fraud and make informed investment
              decisions.
            </p>

            <div className="flex items-center space-x-4">
              <Heart className="h-6 w-6 text-danger-500" />
              <span className="text-gray-700 font-medium">
                Building a safer financial ecosystem for everyone
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-danger-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Our Impact Goals
            </h3>
            <div className="space-y-4">
              {[
                "Prevent financial fraud before it happens",
                "Educate investors about common scam tactics",
                "Verify advisor credentials instantly",
                "Build trust in digital financial services",
              ].map((goal, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-gray-700">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
        <div className="flex items-center space-x-4 mb-8">
          <Lightbulb className="h-8 w-8 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            How FraudShield Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Content Analysis",
              description:
                "Advanced pattern recognition analyzes text content or website URLs for fraud indicators using sophisticated linguistic analysis.",
              icon: MessageSquare,
              color: "blue",
            },
            {
              step: "2",
              title: "AI Classification",
              description:
                "Machine learning models classify content and identify potential fraud categories with detailed confidence scores.",
              icon: Brain,
              color: "purple",
            },
            {
              step: "3",
              title: "Risk Scoring",
              description:
                "Comprehensive risk assessment based on detected red flags, AI analysis, and regulatory compliance factors.",
              icon: TrendingUp,
              color: "emerald",
            },
            {
              step: "4",
              title: "Advisor Verification",
              description:
                "Real-time cross-reference with regulatory databases to verify advisor credentials and registration status.",
              icon: Users,
              color: "orange",
            },
            {
              step: "5",
              title: "Detailed Reporting",
              description:
                "Generate comprehensive reports with explanations, recommendations, and actionable insights for users.",
              icon: Star,
              color: "pink",
            },
            {
              step: "6",
              title: "Continuous Learning",
              description:
                "System continuously learns from new fraud patterns and user feedback to improve detection accuracy.",
              icon: Zap,
              color: "indigo",
            },
          ].map(({ step, title, description, icon: Icon, color }) => (
            <div
              key={step}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 relative shadow-lg"
            >
              <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-primary-500 to-danger-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">{step}</span>
              </div>

              <div className="pt-4 space-y-4">
                <Icon className="h-8 w-8 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Advanced technology designed for maximum fraud detection
            effectiveness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Real-time Analysis",
              description:
                "Instant fraud detection with comprehensive results available in under 2 seconds",
              color: "yellow",
            },
            {
              icon: TrendingUp,
              title: "High Accuracy",
              description:
                "95%+ detection accuracy using state-of-the-art AI algorithms and pattern recognition",
              color: "green",
            },
            {
              icon: Globe,
              title: "Multi-language Support",
              description:
                "Full support for English, Hindi, and Marathi content analysis",
              color: "blue",
            },
            {
              icon: Shield,
              title: "Advisor Verification",
              description:
                "Instant credential verification against official regulatory databases",
              color: "primary",
            },
            {
              icon: Lock,
              title: "Privacy First",
              description:
                "Secure processing with minimal data retention and end-to-end encryption",
              color: "purple",
            },
            {
              icon: AlertTriangle,
              title: "Comprehensive Risk Assessment",
              description:
                "Detailed risk scoring with clear explanations and actionable recommendations",
              color: "red",
            },
          ].map(({ icon: Icon, title, description, color }, index) => (
            <div
              key={index}
              className="group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8 h-full shadow-lg">
                <Icon className="h-10 w-10 text-gray-600 mb-4 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
        <div className="flex items-center space-x-4 mb-8">
          <Code className="h-8 w-8 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">Technology Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
            <Code className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Frontend
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• React 18 with hooks</li>
              <li>• Vite build system</li>
              <li>• Tailwind CSS</li>
              <li>• Axios & React Router</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
            <Database className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="text-lg font-semibold text-emerald-900 mb-4">
              Backend
            </h3>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>• Node.js & Express</li>
              <li>• MongoDB & Mongoose</li>
              <li>• RESTful APIs</li>
              <li>• Input validation</li>
              <li>• Rate limiting</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg">
            <Brain className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              AI & Detection
            </h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Pattern recognition</li>
              <li>• NLP processing</li>
              <li>• ML classification</li>
              <li>• Heuristic rules</li>
              <li>• OCR capabilities</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <Lock className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Security
            </h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li>• Input sanitization</li>
              <li>• DDoS protection</li>
              <li>• Secure headers</li>
              <li>• Environment config</li>
              <li>• Privacy-first design</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-10">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-10 w-10 text-yellow-600 flex-shrink-0 mt-1" />
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-yellow-900">
              Important Disclaimer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    🎓 Educational Purpose
                  </h4>
                  <p className="text-sm text-yellow-800">
                    FraudShield is a prototype system developed for educational
                    and demonstration purposes. Not intended for actual
                    financial decisions.
                  </p>
                </div>

                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    💼 Not Financial Advice
                  </h4>
                  <p className="text-sm text-yellow-800">
                    This tool does not provide financial advice. Always consult
                    qualified, registered financial advisors.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚠️ Accuracy Limitations
                  </h4>
                  <p className="text-sm text-yellow-800">
                    No automated system is 100% accurate. False positives and
                    negatives may occur. Always verify independently.
                  </p>
                </div>

                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ✅ Verification Required
                  </h4>
                  <p className="text-sm text-yellow-800">
                    Always verify investment opportunities through official
                    regulatory channels before making decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Involved */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600">
            Help us build a safer financial ecosystem for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
            <Code className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              For Developers
            </h3>
            <p className="text-blue-800 mb-6">
              FraudShield is open source and welcomes contributions from the
              global developer community.
            </p>
            <div className="space-y-3">
              {[
                "Enhance fraud detection algorithms",
                "Improve user interface design",
                "Add new language support",
                "Strengthen security features",
                "Optimize performance",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 shadow-lg">
            <Users className="h-10 w-10 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold text-emerald-900 mb-4">
              For Users & Investors
            </h3>
            <p className="text-emerald-800 mb-6">
              Your feedback and reports help us improve detection accuracy and
              protect more investors.
            </p>
            <div className="space-y-3">
              {[
                "Report false positives/negatives",
                "Suggest new fraud patterns",
                "Share user experience feedback",
                "Help educate other investors",
                "Spread awareness about fraud prevention",
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-emerald-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <div className="bg-gradient-to-r from-primary-50 to-danger-50 border border-primary-200 rounded-2xl p-6 inline-block">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              <Shield className="h-6 w-6 inline mr-2" />
              Remember: Your Financial Safety Matters
            </p>
            <p className="text-gray-700">
              Always verify investment opportunities independently and consult
              with registered financial advisors before making any financial
              commitments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
