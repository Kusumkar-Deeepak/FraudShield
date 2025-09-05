import mongoose from "mongoose";

const advisorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    registrationNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "suspended", "cancelled"],
      default: "active",
    },
    firm: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    certifications: [String],
    specializations: [String],
    registrationDate: { type: Date, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Text search index
advisorSchema.index({
  name: "text",
  firm: "text",
  registrationNumber: "text",
});

export default mongoose.model("Advisor", advisorSchema);
