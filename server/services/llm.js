// LLM service with pluggable provider support and mock fallback

const LLM_PROVIDER = process.env.LLM_PROVIDER || "mock";
const LLM_KEY = process.env.LLM_KEY;
const LLM_MODEL = process.env.LLM_MODEL || "gpt-3.5-turbo";

// Classifier prompt template
const CLASSIFIER_PROMPT = `
You are a financial fraud detection expert. Analyze the following text for investment fraud indicators.

Text to analyze:
{TEXT}

Classify the content and provide:
1. Primary fraud categories (if any): ["ponzi_scheme", "pump_dump", "fake_ipo", "advance_fee", "romance_scam", "pyramid_scheme", "fake_advisor", "clone_app"]
2. Confidence score (0-100) for each category
3. Risk level: low/medium/high
4. Brief explanation of findings

Respond only with valid JSON:
{
  "categories": [
    {"name": "category_name", "confidence": 85, "explanation": "brief reason"}
  ],
  "overall_risk": "high",
  "explanation": "Overall assessment explanation",
  "language_detected": "en"
}
`;

// Explainer prompt template
const EXPLAINER_PROMPT = `
You are explaining fraud detection results to a general audience. 

Content analyzed: {TEXT}
Detected flags: {FLAGS}
Risk score: {SCORE}/100

Provide a clear, non-technical explanation of:
1. What makes this content risky
2. Specific red flags found
3. Why these patterns indicate potential fraud
4. Actionable advice for the user

Keep the explanation under 200 words and use simple language.
`;

// Mock LLM responses for offline demo
const mockClassifier = (text) => {
  console.log("🎭 Mock Classifier: Starting analysis...");
  const lowercaseText = text.toLowerCase();
  const categories = [];

  // Deterministic classification based on keywords
  const patterns = {
    ponzi_scheme: ["guaranteed", "fixed return", "recruit others", "pyramid"],
    pump_dump: ["target price", "coordinate", "buy together", "exit strategy"],
    fake_ipo: [
      "pre-ipo",
      "firm allotment",
      "unlisted shares",
      "before listing",
    ],
    advance_fee: [
      "registration fee",
      "processing charges",
      "pay first",
      "token amount",
    ],
    fake_advisor: [
      "sebi registered",
      "certified expert",
      "government approved",
    ],
    clone_app: ["clone app", "duplicate", "mirror app", "fake app"],
  };

  console.log(
    `🔍 Analyzing text against ${
      Object.keys(patterns).length
    } fraud patterns...`
  );

  Object.entries(patterns).forEach(([category, keywords]) => {
    const matches = keywords.filter((keyword) =>
      lowercaseText.includes(keyword)
    );
    if (matches.length > 0) {
      const confidence = Math.min(95, 60 + matches.length * 15);
      console.log(
        `🎯 Found ${category}: ${matches.join(
          ", "
        )} (confidence: ${confidence}%)`
      );
      categories.push({
        name: category,
        confidence,
        explanation: `Detected keywords: ${matches.join(", ")}`,
      });
    }
  });

  // Determine overall risk
  let overallRisk = "low";
  const maxConfidence = Math.max(...categories.map((c) => c.confidence), 0);

  if (maxConfidence >= 80) overallRisk = "high";
  else if (maxConfidence >= 60) overallRisk = "medium";

  console.log(
    `📊 Analysis complete: ${categories.length} categories, risk: ${overallRisk}`
  );

  return {
    categories,
    overall_risk: overallRisk,
    explanation:
      categories.length > 0
        ? `Found ${categories.length} potential fraud indicators with high confidence patterns.`
        : "No significant fraud patterns detected in the content.",
    language_detected: "en",
  };
};

const mockExplainer = (text, flags, score) => {
  console.log(
    `🎭 Mock Explainer: Generating explanation for score ${score}...`
  );

  if (score >= 65) {
    console.log("🚨 Generating HIGH risk explanation");
    return `This content shows HIGH fraud risk (${score}/100). Multiple red flags indicate potential investment scam including unrealistic promises, pressure tactics, and suspicious payment methods. These are classic fraud indicators. Recommendation: Avoid completely and report if contacted directly.`;
  } else if (score >= 35) {
    console.log("⚠️ Generating MEDIUM risk explanation");
    return `This content shows MEDIUM fraud risk (${score}/100). Some concerning elements detected that warrant caution. While not definitively fraudulent, the presence of high-pressure sales tactics or unverified claims suggests careful verification needed before proceeding.`;
  } else {
    console.log("✅ Generating LOW risk explanation");
    return `This content shows LOW fraud risk (${score}/100). Few or no significant fraud indicators detected. However, always verify investment opportunities independently and consult with registered financial advisors before making any investment decisions.`;
  }
};

// Main LLM service functions
export const classifyContent = async (text, language = "en") => {
  const startTime = Date.now();
  console.log("🔍 LLM Classification Starting...");
  console.log(`📝 Text length: ${text.length} characters`);
  console.log(`🌐 Language: ${language}`);
  console.log(`🚀 Provider: ${LLM_PROVIDER}`);
  console.log(`🔑 API Key available: ${LLM_KEY ? "YES" : "NO"}`);

  try {
    if (!LLM_KEY || LLM_PROVIDER === "mock") {
      console.log("🤖 Using mock LLM classifier (no API key provided)");
      console.log("📊 Analyzing text with mock patterns...");
      const result = mockClassifier(text);
      console.log("✅ Mock classification completed");
      console.log(`📋 Categories found: ${result.categories.length}`);
      console.log(`⚠️ Overall risk: ${result.overall_risk}`);
      console.log(`⏱️ Processing time: ${Date.now() - startTime}ms`);
      return {
        ...result,
        mock: true,
        processingTime: Date.now() - startTime,
      };
    }

    // Real LLM integration point
    console.log("🔄 Attempting real LLM integration...");
    switch (LLM_PROVIDER) {
      case "openai":
        console.log("🔥 Calling OpenAI API...");
        return await classifyWithOpenAI(text, language);
      case "anthropic":
        console.log("🧠 Calling Anthropic Claude API...");
        return await classifyWithAnthropic(text, language);
      case "gemini":
        console.log("💎 Calling Google Gemini API...");
        return await classifyWithGemini(text, language);
      default:
        throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
    }
  } catch (error) {
    console.error("❌ LLM classification error:", error.message);
    console.log("🔄 Falling back to mock classifier");

    const result = mockClassifier(text);
    console.log("✅ Fallback classification completed");
    console.log(`📋 Categories found: ${result.categories.length}`);
    console.log(`⚠️ Overall risk: ${result.overall_risk}`);
    console.log(`⏱️ Processing time: ${Date.now() - startTime}ms`);
    return {
      ...result,
      mock: true,
      error: error.message,
      processingTime: Date.now() - startTime,
    };
  }
};

export const explainResults = async (text, flags, score) => {
  const startTime = Date.now();
  console.log("💬 LLM Explanation Starting...");
  console.log(`📝 Text length: ${text.length} characters`);
  console.log(`🚩 Flags count: ${flags.length}`);
  console.log(`📊 Risk score: ${score}`);
  console.log(`🚀 Provider: ${LLM_PROVIDER}`);

  try {
    if (!LLM_KEY || LLM_PROVIDER === "mock") {
      console.log("🤖 Using mock LLM explainer");
      const explanation = mockExplainer(text, flags, score);
      console.log("✅ Mock explanation generated");
      console.log(`📝 Explanation length: ${explanation.length} characters`);
      console.log(`⏱️ Processing time: ${Date.now() - startTime}ms`);
      return {
        explanation,
        mock: true,
        processingTime: Date.now() - startTime,
      };
    }

    // Real LLM integration point for explanations
    console.log("🔄 Attempting real LLM explanation...");
    switch (LLM_PROVIDER) {
      case "openai":
        console.log("🔥 Calling OpenAI for explanation...");
        return await explainWithOpenAI(text, flags, score);
      case "anthropic":
        console.log("🧠 Calling Anthropic for explanation...");
        return await explainWithAnthropic(text, flags, score);
      case "gemini":
        console.log("💎 Calling Gemini for explanation...");
        return await explainWithGemini(text, flags, score);
      default:
        throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
    }
  } catch (error) {
    console.error("❌ LLM explanation error:", error.message);
    console.log("🔄 Falling back to mock explainer");

    const explanation = mockExplainer(text, flags, score);
    console.log("✅ Fallback explanation generated");
    console.log(`📝 Explanation length: ${explanation.length} characters`);
    console.log(`⏱️ Processing time: ${Date.now() - startTime}ms`);
    return {
      explanation,
      mock: true,
      error: error.message,
      processingTime: Date.now() - startTime,
    };
  }
};

// Provider-specific implementations (placeholder for real integration)
const classifyWithOpenAI = async (text, language) => {
  // TODO: Integrate with OpenAI API
  /*
  const openai = new OpenAI({ apiKey: LLM_KEY });
  
  const response = await openai.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a financial fraud detection expert.'
      },
      {
        role: 'user', 
        content: CLASSIFIER_PROMPT.replace('{TEXT}', text)
      }
    ],
    temperature: 0.1,
    max_tokens: 500
  });
  
  return JSON.parse(response.choices[0].message.content);
  */

  throw new Error(
    "OpenAI integration not implemented - add OpenAI SDK and implement above"
  );
};

const classifyWithAnthropic = async (text, language) => {
  // TODO: Integrate with Anthropic Claude API
  throw new Error("Anthropic integration not implemented");
};

const classifyWithGemini = async (text, language) => {
  // TODO: Integrate with Google Gemini API
  throw new Error("Gemini integration not implemented");
};

const explainWithOpenAI = async (text, flags, score) => {
  // TODO: Implement explanation with OpenAI
  throw new Error("OpenAI explanation not implemented");
};

const explainWithAnthropic = async (text, flags, score) => {
  // TODO: Implement explanation with Anthropic
  throw new Error("Anthropic explanation not implemented");
};

const explainWithGemini = async (text, flags, score) => {
  // TODO: Implement explanation with Gemini
  throw new Error("Gemini explanation not implemented");
};

// Utility function to calculate LLM boost score
export const calculateLLMBoost = (llmResult) => {
  console.log("🚀 Calculating LLM boost score...");

  if (!llmResult || !llmResult.categories) {
    console.log("❌ No LLM result or categories found, boost = 0");
    return 0;
  }

  let boost = 0;
  console.log(`📊 Processing ${llmResult.categories.length} LLM categories...`);

  // Add boost based on high-confidence categories
  llmResult.categories.forEach((category) => {
    if (category.confidence >= 80) {
      boost += 15; // High confidence boost
      console.log(
        `✅ High confidence boost: ${category.name} (${category.confidence}%) +15`
      );
    } else if (category.confidence >= 60) {
      boost += 8; // Medium confidence boost
      console.log(
        `⚠️ Medium confidence boost: ${category.name} (${category.confidence}%) +8`
      );
    } else if (category.confidence >= 40) {
      boost += 3; // Low confidence boost
      console.log(
        `📝 Low confidence boost: ${category.name} (${category.confidence}%) +3`
      );
    }
  });

  // Cap the boost to prevent over-scoring
  const finalBoost = Math.min(25, boost);
  console.log(`🎯 Final LLM boost: ${finalBoost} (capped at 25)`);
  return finalBoost;
};
