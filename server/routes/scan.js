import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "../utils/uuid.js";
import Scan from "../models/Scan.js";
import { extractRedFlags, extractFromUrl } from "../services/extractor.js";
import {
  calculateRiskScore,
  generateExplanation,
  generateRecommendations,
} from "../services/scorer.js";
import {
  classifyContent,
  explainResults,
  calculateLLMBoost,
} from "../services/llm.js";
import {
  findAdvisorsByName,
  extractAdvisorNames,
} from "../services/advisorService.js";
import { extractTextFromImage } from "../services/ocr.js";
import validator from "validator";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST /api/scan - Main fraud detection endpoint
router.post("/", async (req, res) => {
  const startTime = Date.now();

  try {
    const { inputType, value, lang = "en" } = req.body;

    // Input validation
    if (!inputType || !value) {
      return res.status(400).json({
        error: { message: "inputType and value are required" },
      });
    }

    if (!["text", "url"].includes(inputType)) {
      return res.status(400).json({
        error: { message: 'inputType must be either "text" or "url"' },
      });
    }

    if (!["en", "hi", "mr"].includes(lang)) {
      return res.status(400).json({
        error: { message: "lang must be one of: en, hi, mr" },
      });
    }

    let rawText = "";
    let sourceUrl = null;
    let extractionMeta = {};

    // Extract text content based on input type
    if (inputType === "url") {
      // Validate URL
      if (!validator.isURL(value, { protocols: ["http", "https"] })) {
        return res.status(400).json({
          error: { message: "Invalid URL format" },
        });
      }

      sourceUrl = value;
      console.log(`🔍 Extracting content from URL: ${value}`);

      const urlResult = await extractFromUrl(value);
      if (!urlResult.success) {
        return res.status(400).json({
          error: {
            message: "Failed to extract content from URL",
            details: urlResult.error,
          },
        });
      }

      rawText = urlResult.text;
      extractionMeta = urlResult.meta;
    } else {
      rawText = value.trim();
      if (rawText.length < 10) {
        return res.status(400).json({
          error: { message: "Text content too short (minimum 10 characters)" },
        });
      }
    }

    // Generate unique scan ID
    const scanId = uuidv4();
    console.log(`🔍 Starting scan ${scanId} for ${inputType} input`);

    // Extract red flags and metadata
    const { redFlags, extractedMeta } = extractRedFlags(rawText, lang);
    console.log(`🚩 Found ${redFlags.length} red flags`);

    // Classify content with LLM
    let llmLabels = [];
    let llmBoost = 0;
    let llmUsed = false;

    try {
      console.log("🤖 Running LLM classification...");
      const llmResult = await classifyContent(rawText, lang);

      if (llmResult.categories) {
        llmLabels = llmResult.categories;
        llmBoost = calculateLLMBoost(llmResult);
        llmUsed = !llmResult.mock;
      }

      console.log(
        `🤖 LLM analysis complete. Boost: ${llmBoost}, Mock: ${llmResult.mock}`
      );
    } catch (error) {
      console.error("LLM classification failed:", error);
      // Continue without LLM boost
    }

    // Calculate risk score
    const { riskScore, riskBand, breakdown } = calculateRiskScore(
      redFlags,
      llmLabels,
      llmBoost
    );
    console.log(`📊 Risk assessment: ${riskBand} (${riskScore}/100)`);

    // Generate explanation
    const explanation = generateExplanation(
      redFlags,
      riskScore,
      riskBand,
      llmLabels
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      redFlags,
      riskBand,
      extractedMeta
    );

    // Find advisor matches
    let advisorMatches = [];
    try {
      const potentialNames = extractAdvisorNames(rawText);
      console.log(
        `👤 Checking ${potentialNames.length} potential advisor names`
      );

      for (const name of potentialNames.slice(0, 3)) {
        // Limit to 3 names
        const matches = await findAdvisorsByName(name, 2);
        advisorMatches.push(...matches);
      }

      // Remove duplicates
      advisorMatches = advisorMatches.filter(
        (match, index, self) =>
          index ===
          self.findIndex(
            (m) => m.advisor._id.toString() === match.advisor._id.toString()
          )
      );

      console.log(`👤 Found ${advisorMatches.length} advisor matches`);
    } catch (error) {
      console.error("Advisor matching failed:", error);
    }

    // Prepare scan data
    const scanData = {
      scanId,
      inputType,
      sourceUrl,
      rawText,
      language: lang,
      extractedMeta: {
        ...extractedMeta,
        ...extractionMeta,
      },
      redFlags,
      llmLabels,
      riskScore,
      riskBand,
      explanation,
      advisorMatches: advisorMatches.map((match) => ({
        advisor: match.advisor._id,
        matchType: match.matchType,
        confidence: match.confidence,
      })),
      llmUsed,
      processingTime: Date.now() - startTime,
      userAgent: req.get("User-Agent"),
      ipAddress: req.ip,
    };

    // Save scan to database (unless ephemeral mode)
    // TODO: Add ephemeral mode toggle based on privacy settings
    const savedScan = await Scan.create(scanData);
    console.log(`💾 Scan saved with ID: ${scanId}`);

    // Prepare response
    const response = {
      scanId,
      riskScore,
      riskBand,
      redFlags: redFlags.map((flag) => ({
        code: flag.code,
        label: flag.label,
        severity: flag.severity,
        evidence: flag.evidence.slice(0, 3), // Limit evidence for response size
      })),
      llm: {
        used: llmUsed,
        labels: llmLabels,
        boost: llmBoost,
      },
      advisorMatches: advisorMatches.map((match) => ({
        name: match.advisor.name,
        registrationNumber: match.advisor.registrationNumber,
        firm: match.advisor.firm,
        status: match.advisor.status,
        matchType: match.matchType,
        confidence: match.confidence,
      })),
      explanation,
      recommendations,
      meta: {
        processingTime: Date.now() - startTime,
        flagCount: redFlags.length,
        advisorCount: advisorMatches.length,
        language: lang,
        inputType,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error during scan",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
        }),
      },
    });
  }
});

// POST /api/scan/image - Image fraud detection endpoint with OCR
router.post("/image", upload.single("image"), async (req, res) => {
  const startTime = Date.now();

  try {
    const { lang = "en" } = req.body;

    // Input validation
    if (!req.file) {
      return res.status(400).json({
        error: { message: "Image file is required" },
      });
    }

    if (!["en", "hi", "mr"].includes(lang)) {
      return res.status(400).json({
        error: { message: "lang must be one of: en, hi, mr" },
      });
    }

    console.log(
      `🖼️ Processing image: ${req.file.originalname} (${req.file.size} bytes)`
    );

    // Extract text from image using OCR
    let ocrResult;
    try {
      ocrResult = await extractTextFromImage(req.file.buffer, lang);
      console.log(`🔍 OCR extracted ${ocrResult.text.length} characters`);
    } catch (error) {
      console.error("OCR extraction failed:", error);
      return res.status(400).json({
        error: {
          message: "Failed to extract text from image",
          details: error.message,
        },
      });
    }

    const rawText = ocrResult.text.trim();
    if (rawText.length < 10) {
      return res.status(400).json({
        error: {
          message:
            "Insufficient text content extracted from image (minimum 10 characters)",
          extractedText: rawText,
        },
      });
    }

    // Generate unique scan ID
    const scanId = uuidv4();
    console.log(`🔍 Starting image scan ${scanId}`);

    // Extract red flags and metadata
    const { redFlags, extractedMeta } = extractRedFlags(rawText, lang);
    console.log(`🚩 Found ${redFlags.length} red flags`);

    // Classify content with LLM
    let llmLabels = [];
    let llmBoost = 0;
    let llmUsed = false;

    try {
      console.log("🤖 Running LLM classification...");
      const llmResult = await classifyContent(rawText, lang);

      if (llmResult.categories) {
        llmLabels = llmResult.categories;
        llmBoost = calculateLLMBoost(llmResult);
        llmUsed = !llmResult.mock;
      }

      console.log(
        `🤖 LLM analysis complete. Boost: ${llmBoost}, Mock: ${llmResult.mock}`
      );
    } catch (error) {
      console.error("LLM classification failed:", error);
      // Continue without LLM boost
    }

    // Calculate risk score
    const { riskScore, riskBand, breakdown } = calculateRiskScore(
      redFlags,
      llmLabels,
      llmBoost
    );
    console.log(`📊 Risk assessment: ${riskBand} (${riskScore}/100)`);

    // Generate explanation
    const explanation = generateExplanation(
      redFlags,
      riskScore,
      riskBand,
      llmLabels
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      redFlags,
      riskBand,
      extractedMeta
    );

    // Find advisor matches
    let advisorMatches = [];
    try {
      const potentialNames = extractAdvisorNames(rawText);
      console.log(
        `👤 Checking ${potentialNames.length} potential advisor names`
      );

      for (const name of potentialNames.slice(0, 3)) {
        // Limit to 3 names
        const matches = await findAdvisorsByName(name, 2);
        advisorMatches.push(...matches);
      }

      // Remove duplicates
      advisorMatches = advisorMatches.filter(
        (match, index, self) =>
          index ===
          self.findIndex(
            (m) => m.advisor._id.toString() === match.advisor._id.toString()
          )
      );

      console.log(`👤 Found ${advisorMatches.length} advisor matches`);
    } catch (error) {
      console.error("Advisor matching failed:", error);
    }

    // Prepare scan data
    const scanData = {
      scanId,
      inputType: "image",
      sourceUrl: null,
      rawText,
      language: lang,
      extractedMeta: {
        ...extractedMeta,
        imageInfo: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          confidence: ocrResult.confidence,
          ocrWords: ocrResult.words?.length || 0,
        },
      },
      redFlags,
      llmLabels,
      riskScore,
      riskBand,
      explanation,
      advisorMatches: advisorMatches.map((match) => ({
        advisor: match.advisor._id,
        matchType: match.matchType,
        confidence: match.confidence,
      })),
      llmUsed,
      processingTime: Date.now() - startTime,
      userAgent: req.get("User-Agent"),
      ipAddress: req.ip,
    };

    // Save scan to database
    const savedScan = await Scan.create(scanData);
    console.log(`💾 Image scan saved with ID: ${scanId}`);

    // Prepare response
    const response = {
      scanId,
      riskScore,
      riskBand,
      redFlags: redFlags.map((flag) => ({
        code: flag.code,
        label: flag.label,
        severity: flag.severity,
        evidence: flag.evidence.slice(0, 3), // Limit evidence for response size
      })),
      llm: {
        used: llmUsed,
        labels: llmLabels,
        boost: llmBoost,
      },
      advisorMatches: advisorMatches.map((match) => ({
        name: match.advisor.name,
        registrationNumber: match.advisor.registrationNumber,
        firm: match.advisor.firm,
        status: match.advisor.status,
        matchType: match.matchType,
        confidence: match.confidence,
      })),
      explanation,
      recommendations,
      ocr: {
        extractedText: rawText,
        confidence: ocrResult.confidence,
        wordCount: ocrResult.words?.length || 0,
      },
      meta: {
        processingTime: Date.now() - startTime,
        flagCount: redFlags.length,
        advisorCount: advisorMatches.length,
        language: lang,
        inputType: "image",
        imageSize: req.file.size,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Image scan error:", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: { message: "File size too large (maximum 10MB)" },
        });
      }
    }

    res.status(500).json({
      error: {
        message: "Internal server error during image scan",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
        }),
      },
    });
  }
});

// GET /api/scan/:scanId - Retrieve scan results
router.get("/:scanId", async (req, res) => {
  try {
    const { scanId } = req.params;

    if (!validator.isUUID(scanId)) {
      return res.status(400).json({
        error: { message: "Invalid scan ID format" },
      });
    }

    const scan = await Scan.findOne({ scanId }).populate(
      "advisorMatches.advisor"
    );

    if (!scan) {
      return res.status(404).json({
        error: { message: "Scan not found" },
      });
    }

    res.json({
      scanId: scan.scanId,
      riskScore: scan.riskScore,
      riskBand: scan.riskBand,
      redFlags: scan.redFlags,
      llmLabels: scan.llmLabels,
      advisorMatches: scan.advisorMatches,
      explanation: scan.explanation,
      meta: {
        inputType: scan.inputType,
        language: scan.language,
        createdAt: scan.createdAt,
        processingTime: scan.processingTime,
      },
    });
  } catch (error) {
    console.error("Scan retrieval error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve scan results" },
    });
  }
});

// GET /api/scan - List recent scans (for history/dashboard)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, riskBand, sort = "-createdAt" } = req.query;

    const query = {};
    if (riskBand && ["LOW", "MEDIUM", "HIGH"].includes(riskBand)) {
      query.riskBand = riskBand;
    }

    const scans = await Scan.find(query)
      .sort(sort)
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select(
        "scanId riskScore riskBand inputType language createdAt processingTime"
      )
      .lean();

    const total = await Scan.countDocuments(query);

    res.json({
      scans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Scan list error:", error);
    res.status(500).json({
      error: { message: "Failed to retrieve scan list" },
    });
  }
});

export default router;
