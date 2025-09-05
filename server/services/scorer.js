// Risk scoring service with explainable weighted scoring

export const calculateRiskScore = (redFlags, llmLabels = [], llmBoost = 0) => {
  console.log("📊 Risk Score Calculation Starting...");
  console.log(`🚩 Red flags count: ${redFlags.length}`);
  console.log(`🤖 LLM labels count: ${llmLabels.length}`);
  console.log(`⚡ LLM boost: ${llmBoost}`);

  // Base score from red flags
  const baseScore = redFlags.reduce((total, flag) => {
    console.log(`  📌 ${flag.label}: +${flag.weight} (${flag.severity})`);
    return total + flag.weight;
  }, 0);

  console.log(`📈 Base score from flags: ${baseScore}`);

  // Apply LLM boost (if available)
  const finalScore = Math.min(100, baseScore + llmBoost);

  console.log(`🎯 Final score: ${finalScore} (capped at 100)`);

  // Determine risk band
  let riskBand;
  if (finalScore <= 34) {
    riskBand = "LOW";
  } else if (finalScore <= 64) {
    riskBand = "MEDIUM";
  } else {
    riskBand = "HIGH";
  }

  console.log(`⚠️ Risk band: ${riskBand}`);

  const result = {
    riskScore: finalScore,
    riskBand,
    breakdown: {
      baseScore,
      llmBoost,
      flagCount: redFlags.length,
      highSeverityFlags: redFlags.filter((f) => f.severity === "high").length,
    },
  };

  console.log("✅ Risk score calculation completed");
  return result;
};

export const generateExplanation = (
  redFlags,
  riskScore,
  riskBand,
  llmLabels = []
) => {
  console.log("📝 Generating risk explanation...");
  console.log(`🎯 Score: ${riskScore}, Band: ${riskBand}`);

  let explanation = `Risk Assessment: ${riskBand} (Score: ${riskScore}/100)\n\n`;

  if (redFlags.length === 0) {
    console.log("✅ No flags detected - generating clean explanation");
    explanation +=
      "✅ No significant fraud indicators detected in the content.";
    return explanation;
  }

  // Group flags by severity
  const highRiskFlags = redFlags.filter((f) => f.severity === "high");
  const mediumRiskFlags = redFlags.filter((f) => f.severity === "medium");
  const lowRiskFlags = redFlags.filter((f) => f.severity === "low");

  console.log(`🚨 High risk flags: ${highRiskFlags.length}`);
  console.log(`⚠️ Medium risk flags: ${mediumRiskFlags.length}`);
  console.log(`⚡ Low risk flags: ${lowRiskFlags.length}`);

  if (highRiskFlags.length > 0) {
    explanation += "🚨 HIGH RISK INDICATORS:\n";
    highRiskFlags.forEach((flag) => {
      explanation += `• ${flag.label.toUpperCase()}: Found "${flag.evidence.join(
        '", "'
      )}" (Weight: ${flag.weight})\n`;
    });
    explanation += "\n";
  }

  if (mediumRiskFlags.length > 0) {
    explanation += "⚠️ MEDIUM RISK INDICATORS:\n";
    mediumRiskFlags.forEach((flag) => {
      explanation += `• ${flag.label.toUpperCase()}: Found "${flag.evidence.join(
        '", "'
      )}" (Weight: ${flag.weight})\n`;
    });
    explanation += "\n";
  }

  if (lowRiskFlags.length > 0) {
    explanation += "⚡ LOW RISK INDICATORS:\n";
    lowRiskFlags.forEach((flag) => {
      explanation += `• ${flag.label.toUpperCase()}: Found "${flag.evidence.join(
        '", "'
      )}" (Weight: ${flag.weight})\n`;
    });
    explanation += "\n";
  }

  // Add LLM insights if available
  if (llmLabels && llmLabels.length > 0) {
    console.log(`🤖 Adding ${llmLabels.length} LLM insights to explanation`);
    explanation += "🤖 AI ANALYSIS:\n";
    llmLabels.forEach((label) => {
      explanation += `• ${label.category}: ${label.explanation} (Confidence: ${label.confidence}%)\n`;
    });
    explanation += "\n";
  }

  // Add risk band specific advice
  switch (riskBand) {
    case "HIGH":
      explanation +=
        "🛑 RECOMMENDATION: High probability of fraudulent content. Avoid engagement and report if necessary.";
      break;
    case "MEDIUM":
      explanation +=
        "⚠️ RECOMMENDATION: Exercise caution. Verify credentials and seek professional advice before proceeding.";
      break;
    case "LOW":
      explanation +=
        "✅ RECOMMENDATION: Low risk detected, but always verify investment opportunities independently.";
      break;
  }

  console.log("✅ Risk explanation generated successfully");
  return explanation;
};

export const generateRecommendations = (redFlags, riskBand, extractedMeta) => {
  const recommendations = [];

  // Risk-based recommendations
  if (riskBand === "HIGH") {
    recommendations.push("🚨 Do not invest or share personal information");
    recommendations.push("📞 Report to cybercrime authorities if contacted");
    recommendations.push("🔒 Block the sender/source immediately");
  } else if (riskBand === "MEDIUM") {
    recommendations.push("🔍 Verify advisor credentials with SEBI");
    recommendations.push("💼 Consult with registered financial advisors");
    recommendations.push("📋 Request proper documentation and disclosures");
  } else {
    recommendations.push("✅ Still verify credentials independently");
    recommendations.push("📄 Ensure proper documentation");
    recommendations.push("💡 Consider diversified investment approach");
  }

  // Specific flag-based recommendations
  const flagCodes = redFlags.map((f) => f.code);

  if (flagCodes.includes("GUARANTEED_RETURNS")) {
    recommendations.push("⚠️ No legitimate investment guarantees returns");
  }

  if (flagCodes.includes("UNOFFICIAL_CHANNELS")) {
    recommendations.push("📱 Avoid investment advice from social media groups");
  }

  if (flagCodes.includes("ADVANCE_PAYMENT")) {
    recommendations.push(
      "💳 Never pay upfront fees for investment opportunities"
    );
  }

  if (extractedMeta.emails.length > 0) {
    recommendations.push("📧 Verify email domains and sender authenticity");
  }

  return recommendations;
};
