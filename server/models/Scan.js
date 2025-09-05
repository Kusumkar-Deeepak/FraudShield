import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    scanId: { type: String, required: true, unique: true },
    inputType: { type: String, required: true, enum: ["text", "url"] },
    sourceUrl: { type: String }, // Only for URL inputs
    rawText: { type: String, required: true },
    language: { type: String, default: "en", enum: ["en", "hi", "mr"] },

    // Extracted metadata
    extractedMeta: {
      emails: [String],
      phones: [String],
      websites: [String],
      socialMedia: [String],
      paymentMethods: [String],
    },

    // Risk analysis results
    redFlags: [
      {
        code: { type: String, required: true },
        label: { type: String, required: true },
        weight: { type: Number, required: true },
        evidence: [String],
        severity: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
      },
    ],

    llmLabels: [
      {
        category: String,
        confidence: Number,
        explanation: String,
      },
    ],

    riskScore: { type: Number, required: true, min: 0, max: 100 },
    riskBand: { type: String, required: true, enum: ["LOW", "MEDIUM", "HIGH"] },
    explanation: { type: String, required: true },

    // Advisor verification results
    advisorMatches: [
      {
        advisor: { type: mongoose.Schema.Types.ObjectId, ref: "Advisor" },
        matchType: { type: String, enum: ["exact", "fuzzy"] },
        confidence: Number,
      },
    ],

    // Processing metadata
    llmUsed: { type: Boolean, default: false },
    processingTime: { type: Number }, // in milliseconds
    userAgent: String,
    ipAddress: String, // For demo only - in production, consider privacy

    // Privacy toggle - set to true for ephemeral scans (not saved to DB)
    ephemeral: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
scanSchema.index({ scanId: 1 });
scanSchema.index({ createdAt: -1 });
scanSchema.index({ riskScore: -1 });
scanSchema.index({ riskBand: 1 });

export default mongoose.model("Scan", scanSchema);
