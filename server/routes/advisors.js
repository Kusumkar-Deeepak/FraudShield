import express from "express";
import Advisor from "../models/Advisor.js";
import {
  findAdvisorsByName,
  findAdvisorByRegistration,
  verifyAdvisorCredentials,
} from "../services/advisorService.js";
import validator from "validator";

const router = express.Router();

// GET /api/advisors/verify - Verify advisor by name or registration
router.get("/verify", async (req, res) => {
  try {
    const { name, registration, limit = 10 } = req.query;

    if (!name && !registration) {
      return res.status(400).json({
        error: { message: "Either name or registration parameter is required" },
      });
    }

    let matches = [];

    // Search by registration number (exact match)
    if (registration) {
      console.log(`🔍 Searching advisor by registration: ${registration}`);
      const match = await findAdvisorByRegistration(registration.trim());
      if (match) {
        matches = [match];
      }
    }

    // Search by name (fuzzy match)
    if (name && matches.length === 0) {
      console.log(`🔍 Searching advisor by name: ${name}`);
      matches = await findAdvisorsByName(name.trim(), parseInt(limit));
    }

    // Format response
    const response = {
      query: { name, registration },
      found: matches.length > 0,
      count: matches.length,
      matches: matches.map((match) => ({
        id: match.advisor._id,
        name: match.advisor.name,
        registrationNumber: match.advisor.registrationNumber,
        firm: match.advisor.firm,
        status: match.advisor.status,
        email: match.advisor.email,
        phone: match.advisor.phone,
        specializations: match.advisor.specializations,
        registrationDate: match.advisor.registrationDate,
        matchType: match.matchType,
        confidence: match.confidence,
        verified: match.advisor.status === "active",
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Advisor verification error:", error);
    res.status(500).json({
      error: { message: "Failed to verify advisor credentials" },
    });
  }
});

// GET /api/advisors/:id - Get detailed advisor information
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        error: { message: "Invalid advisor ID format" },
      });
    }

    const verification = await verifyAdvisorCredentials(id);

    if (!verification.verified && verification.status === "not_found") {
      return res.status(404).json({
        error: { message: "Advisor not found" },
      });
    }

    res.json({
      verified: verification.verified,
      status: verification.status,
      message: verification.message,
      advisor: verification.advisor,
    });
  } catch (error) {
    console.error("Advisor details error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve advisor details" },
    });
  }
});

// GET /api/advisors - List advisors with filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      firm,
      specialization,
      search,
      sort = "name",
    } = req.query;

    // Build query
    const query = {};

    if (status && ["active", "suspended", "cancelled"].includes(status)) {
      query.status = status;
    }

    if (firm) {
      query.firm = { $regex: new RegExp(firm, "i") };
    }

    if (specialization) {
      query.specializations = { $in: [new RegExp(specialization, "i")] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { firm: { $regex: new RegExp(search, "i") } },
        { registrationNumber: { $regex: new RegExp(search, "i") } },
      ];
    }

    // Execute query
    const advisors = await Advisor.find(query)
      .sort(sort)
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-__v")
      .lean();

    const total = await Advisor.countDocuments(query);

    // Get statistics
    const stats = await Advisor.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = {};
    stats.forEach((stat) => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      advisors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      statistics: {
        total,
        byStatus: statusStats,
      },
      filters: {
        status,
        firm,
        specialization,
        search,
      },
    });
  } catch (error) {
    console.error("Advisor list error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve advisor list" },
    });
  }
});

// GET /api/advisors/stats/summary - Get advisor statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const stats = await Advisor.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          suspended: {
            $sum: { $cond: [{ $eq: ["$status", "suspended"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const topFirms = await Advisor.aggregate([
      { $group: { _id: "$firm", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topSpecializations = await Advisor.aggregate([
      { $unwind: "$specializations" },
      { $group: { _id: "$specializations", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      overview: stats[0] || { total: 0, active: 0, suspended: 0, cancelled: 0 },
      topFirms: topFirms.map((firm) => ({ name: firm._id, count: firm.count })),
      topSpecializations: topSpecializations.map((spec) => ({
        name: spec._id,
        count: spec.count,
      })),
    });
  } catch (error) {
    console.error("Advisor stats error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve advisor statistics" },
    });
  }
});

export default router;
