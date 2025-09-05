// Fraud pattern extractor using regex and heuristics
// Extracts red flags, contact info, and suspicious patterns

export const extractRedFlags = (text, language = "en") => {
  console.log("🔍 Red Flag Extraction Starting...");
  console.log(`📝 Text length: ${text.length} characters`);
  console.log(`🌐 Language: ${language}`);

  const redFlags = [];
  const extractedMeta = {
    emails: [],
    phones: [],
    websites: [],
    socialMedia: [],
    paymentMethods: [],
  };

  // Normalize text for analysis
  const normalizedText = text.toLowerCase().replace(/\s+/g, " ").trim();
  console.log(`📏 Normalized text length: ${normalizedText.length} characters`);

  // Email extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  extractedMeta.emails = [...new Set(emails)];
  console.log(`📧 Emails found: ${extractedMeta.emails.length}`);

  // Phone number extraction (Indian format)
  const phoneRegex =
    /(?:\+91[-.\s]?)?(?:\d{5}[-.\s]?\d{5}|\d{4}[-.\s]?\d{3}[-.\s]?\d{3}|\d{10})/g;
  const phones = text.match(phoneRegex) || [];
  extractedMeta.phones = [...new Set(phones)];
  console.log(`📱 Phone numbers found: ${extractedMeta.phones.length}`);

  // Website extraction
  const websiteRegex =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  const websites = text.match(websiteRegex) || [];
  extractedMeta.websites = [...new Set(websites)];
  console.log(`🌐 Websites found: ${extractedMeta.websites.length}`);

  // Red flag patterns with weights
  const patterns = [
    // High-risk financial promises
    {
      code: "GUARANTEED_RETURNS",
      patterns: [
        "guaranteed",
        "guarantee",
        "assured returns",
        "fixed profit",
        "no risk",
      ],
      weight: 25,
      severity: "high",
    },
    {
      code: "UNREALISTIC_RETURNS",
      patterns: [
        "double your money",
        "100% profit",
        "200% return",
        "multiply your investment",
        "triple your money",
      ],
      weight: 30,
      severity: "high",
    },
    {
      code: "URGENCY_PRESSURE",
      patterns: [
        "limited time",
        "offer expires",
        "act now",
        "hurry up",
        "last chance",
        "only today",
      ],
      weight: 20,
      severity: "medium",
    },
    {
      code: "INSIDER_CLAIMS",
      patterns: [
        "insider information",
        "secret tip",
        "confidential",
        "exclusive access",
        "inside knowledge",
      ],
      weight: 25,
      severity: "high",
    },

    // IPO and trading scams
    {
      code: "PRE_IPO_SCAM",
      patterns: [
        "pre-ipo",
        "pre ipo",
        "before listing",
        "unlisted shares",
        "firm allotment",
      ],
      weight: 30,
      severity: "high",
    },
    {
      code: "PUMP_DUMP",
      patterns: [
        "pump and dump",
        "coordinate buying",
        "target price",
        "exit strategy",
        "book profit",
      ],
      weight: 35,
      severity: "high",
    },

    // Communication red flags
    {
      code: "UNOFFICIAL_CHANNELS",
      patterns: [
        "telegram",
        "whatsapp",
        "signal app",
        "discord",
        "private group",
      ],
      weight: 15,
      severity: "medium",
    },
    {
      code: "CLONE_APP_WARNING",
      patterns: [
        "clone app",
        "fake app",
        "duplicate app",
        "mirror app",
        "copy trading",
      ],
      weight: 25,
      severity: "high",
    },

    // Payment red flags
    {
      code: "SUSPICIOUS_PAYMENT",
      patterns: [
        "upi",
        "paytm",
        "googlepay",
        "phonepe",
        "cash only",
        "cryptocurrency",
        "bitcoin",
      ],
      weight: 15,
      severity: "medium",
    },
    {
      code: "ADVANCE_PAYMENT",
      patterns: [
        "pay first",
        "advance payment",
        "registration fee",
        "processing charges",
        "token amount",
      ],
      weight: 20,
      severity: "medium",
    },

    // Regulatory red flags
    {
      code: "NO_REGULATION",
      patterns: [
        "no sebi",
        "unregulated",
        "offshore",
        "tax free",
        "black money",
      ],
      weight: 30,
      severity: "high",
    },
    {
      code: "FAKE_CREDENTIALS",
      patterns: [
        "certified advisor",
        "sebi registered",
        "rbi approved",
        "government scheme",
      ],
      weight: 20,
      severity: "medium",
    },
  ];

  console.log(`🎯 Analyzing against ${patterns.length} fraud patterns...`);

  // Language-specific patterns
  if (language === "hi" || language === "mr") {
    console.log("🌐 Adding Hindi/Marathi specific patterns...");
    patterns.push({
      code: "HINDI_SCAM_PHRASES",
      patterns: [
        "पक्का मुनाफा",
        "गारंटी",
        "जल्दी करें",
        "सिर्फ आज",
        "दोगुना पैसा",
      ],
      weight: 25,
      severity: "high",
    });
  }

  // Extract red flags
  let totalMatches = 0;
  patterns.forEach((pattern) => {
    const matches = [];
    pattern.patterns.forEach((phrase) => {
      if (normalizedText.includes(phrase)) {
        const regex = new RegExp(
          phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        const phraseMatches = text.match(regex) || [];
        matches.push(...phraseMatches);
      }
    });

    if (matches.length > 0) {
      console.log(
        `🚩 Found ${pattern.code}: ${matches.length} matches - ${matches.join(
          ", "
        )}`
      );
      redFlags.push({
        code: pattern.code,
        label: pattern.code.replace(/_/g, " ").toLowerCase(),
        weight: pattern.weight,
        evidence: [...new Set(matches)],
        severity: pattern.severity,
      });
      totalMatches += matches.length;
    }
  });

  console.log(
    `📊 Red flags analysis complete: ${redFlags.length} flags found, ${totalMatches} total matches`
  );

  // Extract social media mentions
  const socialPatterns = [
    "telegram",
    "whatsapp",
    "instagram",
    "facebook",
    "twitter",
  ];
  socialPatterns.forEach((platform) => {
    if (normalizedText.includes(platform)) {
      extractedMeta.socialMedia.push(platform);
    }
  });
  console.log(
    `📱 Social media platforms found: ${extractedMeta.socialMedia.length}`
  );

  // Extract payment method mentions
  const paymentPatterns = [
    "upi",
    "paytm",
    "googlepay",
    "phonepe",
    "paypal",
    "bitcoin",
    "crypto",
  ];
  paymentPatterns.forEach((method) => {
    if (normalizedText.includes(method)) {
      extractedMeta.paymentMethods.push(method);
    }
  });
  console.log(
    `💳 Payment methods found: ${extractedMeta.paymentMethods.length}`
  );

  console.log("✅ Red flag extraction completed successfully");
  return {
    redFlags,
    extractedMeta,
  };
};

// URL content extractor (basic implementation)
import axios from "axios";

export const extractFromUrl = async (url) => {
  console.log("🌐 URL Content Extraction Starting...");
  console.log(`🔗 URL: ${url}`);

  try {
    // Basic URL validation
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      console.log("❌ Invalid URL format");
      throw new Error("Invalid URL format");
    }

    console.log("✅ URL format valid, fetching content...");

    // Use axios instead of fetch for better compatibility
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FraudShield/1.0; +https://fraudshield.example.com/bot)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 300; // default
      },
    });

    console.log(`📡 HTTP Response: ${response.status} ${response.statusText}`);

    const html = response.data;
    console.log(`📄 HTML content length: ${html.length} characters`);

    // Basic text extraction (remove HTML tags)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`📝 Extracted text length: ${textContent.length} characters`);

    // Extract basic metadata
    const title = extractTitle(html);
    const description = extractDescription(html);

    if (textContent.length < 50) {
      console.warn(
        "⚠️ Very little text content extracted, might be dynamic content"
      );
    }

    const result = {
      success: true,
      text: textContent,
      meta: {
        url,
        title: title,
        description: description,
        contentLength: textContent.length,
        htmlLength: html.length,
        extractedAt: new Date().toISOString(),
        statusCode: response.status,
      },
    };

    console.log(
      `✅ URL extraction successful: "${title}" (${textContent.length} chars)`
    );
    return result;
  } catch (error) {
    console.error("❌ URL extraction error:", error.message);

    // Provide more detailed error information
    let errorMessage = error.message;
    if (error.code === "ENOTFOUND") {
      errorMessage = "Website not found or network error";
    } else if (error.code === "ECONNREFUSED") {
      errorMessage = "Connection refused by the website";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Request timed out - website took too long to respond";
    } else if (error.response?.status) {
      errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
    }

    return {
      success: false,
      error: errorMessage,
      text: "",
      meta: {
        url,
        errorCode: error.code,
        statusCode: error.response?.status,
        extractedAt: new Date().toISOString(),
      },
    };
  }
};

// Helper function to extract page title
const extractTitle = (html) => {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : "Untitled";
};

// Helper function to extract page description
const extractDescription = (html) => {
  const descMatch = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
  );
  return descMatch ? descMatch[1].trim() : "";
};
