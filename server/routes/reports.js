import express from "express";
import { v4 as uuidv4 } from "../utils/uuid.js";
import Report from "../models/Report.js";
import validator from "validator";

const router = express.Router();

// POST /api/reports - Create a new report
router.post("/", async (req, res) => {
  try {
    const {
      type,
      scanId,
      subject,
      description,
      evidence = {},
      reporter = {},
    } = req.body;

    // Input validation
    if (!type || !subject || !description) {
      return res.status(400).json({
        error: { message: "type, subject, and description are required" },
      });
    }

    if (
      !["fraud", "false_positive", "feedback", "advisor_issue"].includes(type)
    ) {
      return res.status(400).json({
        error: { message: "Invalid report type" },
      });
    }

    if (subject.length < 5 || subject.length > 200) {
      return res.status(400).json({
        error: { message: "Subject must be between 5 and 200 characters" },
      });
    }

    if (description.length < 10 || description.length > 2000) {
      return res.status(400).json({
        error: {
          message: "Description must be between 10 and 2000 characters",
        },
      });
    }

    // Validate scanId if provided
    if (scanId && !validator.isUUID(scanId)) {
      return res.status(400).json({
        error: { message: "Invalid scanId format" },
      });
    }

    // Validate reporter email if provided
    if (reporter.email && !validator.isEmail(reporter.email)) {
      return res.status(400).json({
        error: { message: "Invalid email format" },
      });
    }

    // Generate report ID
    const reportId = uuidv4();

    // Determine priority based on type and keywords
    let priority = "medium";
    const urgentKeywords = ["urgent", "immediate", "critical", "emergency"];
    const highKeywords = ["fraud", "scam", "stolen", "hack", "unauthorized"];

    const contentLower = (subject + " " + description).toLowerCase();

    if (urgentKeywords.some((keyword) => contentLower.includes(keyword))) {
      priority = "critical";
    } else if (
      type === "fraud" ||
      highKeywords.some((keyword) => contentLower.includes(keyword))
    ) {
      priority = "high";
    } else if (type === "feedback") {
      priority = "low";
    }

    // Create report
    const reportData = {
      reportId,
      type,
      scanId,
      subject: validator.escape(subject),
      description: validator.escape(description),
      evidence: {
        urls: (evidence.urls || [])
          .filter((url) => validator.isURL(url))
          .slice(0, 10),
        screenshots: (evidence.screenshots || []).slice(0, 5),
        documents: (evidence.documents || []).slice(0, 5),
      },
      reporter: {
        email: reporter.email
          ? validator.normalizeEmail(reporter.email)
          : undefined,
        userAgent: req.get("User-Agent"),
        timestamp: new Date(),
      },
      priority,
      status: "pending",
    };

    const savedReport = await Report.create(reportData);
    console.log(
      `📋 New report created: ${reportId} (${type}, ${priority} priority)`
    );

    // In production, trigger notification system here
    // - Email to admin/moderators
    // - Slack/Teams notification for critical reports
    // - Create ticket in support system

    res.status(201).json({
      reportId,
      status: "submitted",
      priority,
      message:
        "Report submitted successfully. We will review it and take appropriate action.",
      estimatedResponseTime:
        priority === "critical"
          ? "1-2 hours"
          : priority === "high"
          ? "24 hours"
          : priority === "medium"
          ? "2-3 days"
          : "1 week",
    });
  } catch (error) {
    console.error("Report creation error:", error);
    res.status(500).json({
      error: { message: "Failed to submit report" },
    });
  }
});

// GET /api/reports/:reportId - Get report status
router.get("/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!validator.isUUID(reportId)) {
      return res.status(400).json({
        error: { message: "Invalid report ID format" },
      });
    }

    const report = await Report.findOne({ reportId })
      .select("reportId type subject status priority createdAt resolution")
      .lean();

    if (!report) {
      return res.status(404).json({
        error: { message: "Report not found" },
      });
    }

    res.json({
      reportId: report.reportId,
      type: report.type,
      subject: report.subject,
      status: report.status,
      priority: report.priority,
      submittedAt: report.createdAt,
      resolution: report.resolution,
      statusMessage: getStatusMessage(report.status),
    });
  } catch (error) {
    console.error("Report retrieval error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve report status" },
    });
  }
});

// GET /api/reports - List reports (admin/internal use)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      priority,
      sort = "-createdAt",
    } = req.query;

    // Note: In production, add authentication/authorization middleware
    // to restrict access to admin users only

    const query = {};

    if (
      status &&
      ["pending", "reviewing", "resolved", "dismissed"].includes(status)
    ) {
      query.status = status;
    }

    if (
      type &&
      ["fraud", "false_positive", "feedback", "advisor_issue"].includes(type)
    ) {
      query.type = type;
    }

    if (priority && ["low", "medium", "high", "critical"].includes(priority)) {
      query.priority = priority;
    }

    const reports = await Report.find(query)
      .sort(sort)
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-reporter.userAgent -internalNotes")
      .lean();

    const total = await Report.countDocuments(query);

    // Get statistics
    const stats = await Report.aggregate([
      {
        $group: {
          _id: { status: "$status", priority: "$priority" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      statistics: {
        total,
        breakdown: stats,
      },
    });
  } catch (error) {
    console.error("Report list error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve reports" },
    });
  }
});

// PUT /api/reports/:reportId/status - Update report status (admin only)
router.put("/:reportId/status", async (req, res) => {
  try {
    // Note: In production, add admin authentication middleware here

    const { reportId } = req.params;
    const { status, resolution, assignedTo } = req.body;

    if (!validator.isUUID(reportId)) {
      return res.status(400).json({
        error: { message: "Invalid report ID format" },
      });
    }

    if (
      !status ||
      !["pending", "reviewing", "resolved", "dismissed"].includes(status)
    ) {
      return res.status(400).json({
        error: { message: "Invalid status" },
      });
    }

    const updateData = { status };

    if (resolution) {
      updateData.resolution = validator.escape(resolution);
    }

    if (assignedTo) {
      updateData.assignedTo = validator.escape(assignedTo);
    }

    const updatedReport = await Report.findOneAndUpdate(
      { reportId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        error: { message: "Report not found" },
      });
    }

    console.log(`📋 Report ${reportId} status updated to: ${status}`);

    res.json({
      reportId,
      status: updatedReport.status,
      resolution: updatedReport.resolution,
      assignedTo: updatedReport.assignedTo,
      updatedAt: updatedReport.updatedAt,
    });
  } catch (error) {
    console.error("Report status update error:", error);
    res.status(500).json({
      error: { message: "Failed to update report status" },
    });
  }
});

// Helper function to get user-friendly status messages
const getStatusMessage = (status) => {
  const messages = {
    pending: "Your report has been received and is awaiting review.",
    reviewing: "Your report is currently being reviewed by our team.",
    resolved: "Your report has been reviewed and resolved.",
    dismissed: "Your report has been reviewed and dismissed.",
  };

  return messages[status] || "Status unknown";
};

export default router;
