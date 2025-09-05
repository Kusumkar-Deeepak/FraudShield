import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ["fraud", "false_positive", "feedback", "advisor_issue"],
    },

    // Reference to original scan (if applicable)
    scanId: { type: String },

    // Report details
    subject: { type: String, required: true },
    description: { type: String, required: true },
    evidence: {
      urls: [String],
      screenshots: [String], // base64 or file paths
      documents: [String],
    },

    // Reporter information (minimal for privacy)
    reporter: {
      email: String, // optional
      userAgent: String,
      timestamp: { type: Date, default: Date.now },
    },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved", "dismissed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    // Administrative
    assignedTo: String,
    internalNotes: [String],
    resolution: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ reportId: 1 });
reportSchema.index({ status: 1, priority: -1 });
reportSchema.index({ createdAt: -1 });

export default mongoose.model("Report", reportSchema);
