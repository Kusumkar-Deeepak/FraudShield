import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Home, History, UserCheck, Info } from "lucide-react";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Scan", href: "/", icon: Home },
    { name: "History", href: "/history", icon: History },
    { name: "Verify Advisor", href: "/verify", icon: UserCheck },
    { name: "About", href: "/about", icon: Info },
  ];

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-10 w-10 text-primary-600 drop-shadow-sm" />
                  <div className="absolute inset-0 h-10 w-10 bg-primary-600/20 rounded-full blur-xl"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent">
                    FraudShield
                  </span>
                  <span className="text-xs text-gray-500 -mt-1">
                    AI-Powered Protection
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActiveLink(item.href)
                        ? "text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg shadow-primary-600/25"
                        : "text-gray-700 hover:text-primary-600 hover:bg-primary-50/80 hover:shadow-md"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActiveLink(item.href) ? "" : "group-hover:scale-110"
                      } transition-transform duration-200`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 p-3 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActiveLink(item.href)
                        ? "text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg"
                        : "text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:pl-6"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-danger-600 bg-clip-text text-transparent">
                  FraudShield
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Advanced AI-powered fraud detection platform designed to protect
                your investments and verify financial advisors with cutting-edge
                machine learning technology.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 text-sm py-2 px-3 rounded-lg hover:bg-primary-50 transition-all duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Contact & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    AI Detection: Online
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">
                    Database: Connected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Demo Mode: Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright and Disclaimer */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span className="text-sm">
                  © 2025 FraudShield. Educational prototype system.
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="bg-gradient-to-r from-warning-500 to-danger-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                  ⚠️ DEMO VERSION - Not for regulatory decisions
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed">
              This is a prototype fraud detection system for demonstration
              purposes only. Do not rely on this system for actual investment
              decisions or regulatory compliance. Always consult with licensed
              financial professionals and conduct thorough due diligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
