import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("🚨 API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("🚨 API Response Error:", error);

    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error?.message || "Server error occurred";
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error - please check your connection");
    } else {
      // Something else happened
      throw new Error("Request failed - please try again");
    }
  }
);

// API endpoints
export const scanAPI = {
  // Scan content for fraud
  scan: async (data) => {
    const response = await api.post("/scan", data);
    return response.data;
  },

  // Scan image for fraud (with OCR)
  scanImage: async (formData) => {
    const response = await api.post("/scan/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get scan results by ID
  getScanResults: async (scanId) => {
    const response = await api.get(`/scan/${scanId}`);
    return response.data;
  },

  // Get scan history
  getHistory: async (params = {}) => {
    const response = await api.get("/scan", { params });
    return response.data;
  },
};

export const advisorAPI = {
  // Verify advisor credentials
  verify: async (params) => {
    const response = await api.get("/advisors/verify", { params });
    return response.data;
  },

  // Get advisor details
  getAdvisor: async (advisorId) => {
    const response = await api.get(`/advisors/${advisorId}`);
    return response.data;
  },

  // List advisors
  list: async (params = {}) => {
    const response = await api.get("/advisors", { params });
    return response.data;
  },

  // Get advisor statistics
  getStats: async () => {
    const response = await api.get("/advisors/stats/summary");
    return response.data;
  },
};

export const reportAPI = {
  // Submit a report
  submit: async (data) => {
    const response = await api.post("/reports", data);
    return response.data;
  },

  // Get report status
  getStatus: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  // List reports (admin)
  list: async (params = {}) => {
    const response = await api.get("/reports", { params });
    return response.data;
  },
};

export const healthAPI = {
  // Check server health
  check: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
