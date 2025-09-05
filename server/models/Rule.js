import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["financial", "social", "technical", "linguistic", "behavioral"],
    },
    weight: { type: Number, required: true, min: 0, max: 50 },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },

    // Pattern matching
    patterns: [
      {
        type: { type: String, enum: ["regex", "keyword", "phrase"] },
        value: String,
        flags: String, // for regex flags
        language: {
          type: String,
          enum: ["en", "hi", "mr", "all"],
          default: "all",
        },
      },
    ],

    // Conditions for triggering
    conditions: {
      minMatches: { type: Number, default: 1 },
      context: [String], // required context words nearby
      exclusions: [String], // patterns that invalidate the match
    },

    // Rule metadata
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
    createdBy: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
ruleSchema.index({ category: 1, isActive: 1 });
ruleSchema.index({ code: 1 });

export default mongoose.model("Rule", ruleSchema);
