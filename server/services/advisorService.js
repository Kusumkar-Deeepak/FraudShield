import Advisor from "../models/Advisor.js";

// Fuzzy match advisors by name
export const findAdvisorsByName = async (name, limit = 10) => {
  console.log("👤 Advisor Name Search Starting...");
  console.log(`🔍 Search term: "${name}"`);
  console.log(`📊 Limit: ${limit}`);

  try {
    if (!name || name.trim().length < 2) {
      console.log("❌ Search term too short (minimum 2 characters)");
      return [];
    }

    const searchTerm = name.trim();
    console.log(`✅ Processing search term: "${searchTerm}"`);

    // Try exact match first
    console.log("🎯 Attempting exact match...");
    const exactMatches = await Advisor.find({
      name: { $regex: new RegExp(`^${escapeRegex(searchTerm)}$`, "i") },
    }).limit(limit);

    if (exactMatches.length > 0) {
      console.log(`✅ Found ${exactMatches.length} exact matches`);
      return exactMatches.map((advisor) => ({
        advisor,
        matchType: "exact",
        confidence: 100,
      }));
    }

    console.log("📝 No exact matches, trying fuzzy search...");
    // Fuzzy matching with text search
    const fuzzyMatches = await Advisor.find({
      $text: { $search: searchTerm },
    }).limit(limit);

    if (fuzzyMatches.length > 0) {
      console.log(`✅ Found ${fuzzyMatches.length} fuzzy matches`);
      return fuzzyMatches.map((advisor) => ({
        advisor,
        matchType: "fuzzy",
        confidence: calculateMatchConfidence(searchTerm, advisor.name),
      }));
    }

    console.log("🔍 No fuzzy matches, trying substring search...");
    // Substring matching as fallback
    const substringMatches = await Advisor.find({
      name: { $regex: new RegExp(escapeRegex(searchTerm), "i") },
    }).limit(limit);

    console.log(`📊 Found ${substringMatches.length} substring matches`);
    return substringMatches.map((advisor) => ({
      advisor,
      matchType: "fuzzy",
      confidence: calculateMatchConfidence(searchTerm, advisor.name),
    }));
  } catch (error) {
    console.error("❌ Advisor search error:", error.message);
    return [];
  }
};

// Search advisors by registration number
export const findAdvisorByRegistration = async (registrationNumber) => {
  console.log("🆔 Advisor Registration Search Starting...");
  console.log(`📋 Registration number: "${registrationNumber}"`);

  try {
    const advisor = await Advisor.findOne({
      registrationNumber: {
        $regex: new RegExp(`^${escapeRegex(registrationNumber)}$`, "i"),
      },
    });

    if (advisor) {
      console.log(`✅ Found advisor by registration: ${advisor.name}`);
      return {
        advisor,
        matchType: "exact",
        confidence: 100,
      };
    } else {
      console.log("❌ No advisor found with this registration number");
      return null;
    }
  } catch (error) {
    console.error("❌ Advisor registration search error:", error.message);
    return null;
  }
};

// Extract potential advisor names from text
export const extractAdvisorNames = (text) => {
  console.log("👥 Extracting Advisor Names from Text...");
  console.log(`📝 Text length: ${text.length} characters`);

  const advisorNames = [];

  // Patterns that might indicate advisor names
  const patterns = [
    /(?:advisor|adviser|consultant|expert|analyst)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /(?:by|from|contact)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:sir|madam|ji)/gi,
  ];

  console.log(`🎯 Applying ${patterns.length} name extraction patterns...`);

  patterns.forEach((pattern, index) => {
    let match;
    let patternMatches = 0;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1].trim();
      if (name.length > 3 && name.length < 50) {
        advisorNames.push(name);
        patternMatches++;
      }
    }
    console.log(
      `  Pattern ${index + 1}: Found ${patternMatches} potential names`
    );
  });

  // Remove duplicates and common words
  const commonWords = [
    "Investment",
    "Trading",
    "Stock",
    "Market",
    "Financial",
    "Money",
  ];

  const filteredNames = [...new Set(advisorNames)].filter(
    (name) => !commonWords.some((word) => name.includes(word))
  );

  console.log(
    `📊 Extraction complete: ${filteredNames.length} unique advisor names found`
  );
  if (filteredNames.length > 0) {
    console.log(`👤 Names: ${filteredNames.join(", ")}`);
  }

  return filteredNames;
};

// Verify advisor credentials
export const verifyAdvisorCredentials = async (advisorId) => {
  console.log("🔍 Advisor Credentials Verification Starting...");
  console.log(`🆔 Advisor ID: ${advisorId}`);

  try {
    const advisor = await Advisor.findById(advisorId);

    if (!advisor) {
      console.log("❌ Advisor not found in database");
      return {
        verified: false,
        status: "not_found",
        message: "Advisor not found in database",
      };
    }

    console.log(`✅ Found advisor: ${advisor.name}`);
    console.log(`📋 Registration: ${advisor.registrationNumber}`);
    console.log(`⚡ Status: ${advisor.status}`);

    const result = {
      verified: true,
      status: advisor.status,
      advisor: {
        name: advisor.name,
        registrationNumber: advisor.registrationNumber,
        firm: advisor.firm,
        status: advisor.status,
        registrationDate: advisor.registrationDate,
        certifications: advisor.certifications,
        specializations: advisor.specializations,
      },
      message:
        advisor.status === "active"
          ? "Advisor is active and verified"
          : `Advisor status: ${advisor.status}`,
    };

    console.log("✅ Advisor verification completed successfully");
    return result;
  } catch (error) {
    console.error("❌ Advisor verification error:", error.message);
    return {
      verified: false,
      status: "error",
      message: "Error verifying advisor credentials",
    };
  }
};

// Helper function to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Calculate match confidence based on string similarity
const calculateMatchConfidence = (search, target) => {
  const searchLower = search.toLowerCase();
  const targetLower = target.toLowerCase();

  // Exact match
  if (searchLower === targetLower) return 100;

  // One contains the other
  if (targetLower.includes(searchLower) || searchLower.includes(targetLower)) {
    const ratio =
      Math.min(searchLower.length, targetLower.length) /
      Math.max(searchLower.length, targetLower.length);
    return Math.round(ratio * 90);
  }

  // Levenshtein distance based similarity
  const distance = levenshteinDistance(searchLower, targetLower);
  const maxLength = Math.max(searchLower.length, targetLower.length);
  const similarity = 1 - distance / maxLength;

  return Math.round(similarity * 80);
};

// Simple Levenshtein distance implementation
const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};
