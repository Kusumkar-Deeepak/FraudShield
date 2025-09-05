// OCR service with functional implementation for development

export const extractTextFromImage = async (imageBuffer, language = "en") => {
  console.log("📷 OCR Text Extraction Starting...");
  console.log(`📊 Image buffer size: ${imageBuffer.length} bytes`);
  console.log(`🌐 Language: ${language}`);

  try {
    // Validate image format first
    const validation = validateImageFormat(imageBuffer);
    if (!validation.valid) {
      console.error("❌ Invalid image format");
      return {
        success: false,
        error: "Invalid image format. Please upload a valid image file.",
        text: "",
        confidence: 0,
      };
    }

    console.log(`✅ Valid ${validation.format.toUpperCase()} image detected`);

    // For development purposes, simulate OCR processing and return realistic sample text
    // This would be replaced with actual OCR implementation in production
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate processing time

    // Generate realistic sample text based on common fraud patterns
    const sampleTexts = [
      `🚨 URGENT INVESTMENT OPPORTUNITY! 🚨

Guaranteed 300% Returns in 90 Days!
Pre-IPO Shares Available NOW!

✅ Government Approved Scheme
✅ SEBI Registered (Reg No: ABC123456)
✅ Limited Time Offer - Only 50 Slots Left!

💰 Minimum Investment: ₹5,000
💰 Maximum Investment: ₹5,00,000

📱 Contact Immediately:
WhatsApp: +91-9876543210
Email: invest@quickreturns.com

⏰ Offer Valid Till: Today Midnight Only!
💳 Pay Now via UPI: quickreturns@paytm

SEBI Warning: Check all regulatory approvals before investing.
Risk Disclosure: Investments are subject to market risks.`,

      `INVESTMENT ADVISORY SERVICES

We are pleased to offer you our premium investment advisory services for the financial year 2024-25.

Our Services Include:
• Equity Portfolio Management
• Mutual Fund Advisory
• Tax Planning Solutions
• Retirement Planning

Advisor Details:
Name: Rajesh Kumar Sharma
SEBI Reg No: INV000001234
Experience: 15+ Years
Qualification: CFA, MBA Finance

Fee Structure:
• Portfolio Management: 2.5% annually
• Advisory Services: ₹10,000 per annum
• One-time Planning: ₹5,000

Contact Information:
Office: 401, Business Center, Mumbai
Phone: +91-22-12345678
Email: advisor@wealthmanagement.com

Disclaimer: Past performance is not indicative of future results. Please read all scheme documents carefully before investing.`,

      `CRYPTO TRADING OPPORTUNITY

Join our exclusive crypto trading group and earn guaranteed profits daily!

💎 What we offer:
- Daily trading signals
- 95% accuracy rate
- 24/7 support team
- Risk-free trading

💰 Profit Potential:
- Minimum: 5% daily
- Average: 15% daily  
- Maximum: 50% daily

🎯 Joining Fee: ₹25,000 (One-time)
🎯 Monthly Fee: ₹5,000

📞 Contact our expert trader:
Telegram: @cryptoprofit123
WhatsApp: +91-8765432109

⚠️ Limited seats available!
⚠️ Join before price increases!

Note: Cryptocurrency trading involves substantial risk and may not be suitable for all investors.`,
    ];

    // Select a random sample text or use the first one
    const selectedText =
      sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    // Simulate confidence based on image quality (mock calculation)
    const confidence = Math.floor(75 + Math.random() * 20); // Between 75-95%

    console.log(
      `✅ OCR completed: ${selectedText.length} characters extracted`
    );
    console.log(`📊 OCR confidence: ${confidence}%`);
    console.log(
      "🔧 Note: Using development OCR implementation with sample data"
    );

    return {
      success: true,
      text: selectedText.trim(),
      confidence: confidence,
      words: selectedText.split(" ").filter((word) => word.length > 0).length,
      lines: selectedText.split("\n").length,
      meta: {
        language: language,
        processingTime: 1500,
        format: validation.format,
        development_note:
          "This is a sample OCR result for development. In production, this would contain actual extracted text from the uploaded image.",
      },
    };
  } catch (error) {
    console.error("❌ OCR extraction failed:", error);

    return {
      success: false,
      error: "Failed to extract text from image",
      text: "",
      confidence: 0,
      meta: {
        language: language,
        errorDetails: error.message,
      },
    };
  }
};

export const validateImageFormat = (
  buffer,
  allowedFormats = ["jpg", "jpeg", "png", "webp"]
) => {
  console.log("🖼️ Validating Image Format...");
  console.log(`📊 Buffer size: ${buffer.length} bytes`);
  console.log(`✅ Allowed formats: ${allowedFormats.join(", ")}`);

  // Check file signature (magic numbers)
  const signatures = {
    jpg: [0xff, 0xd8, 0xff],
    jpeg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47],
    webp: [0x52, 0x49, 0x46, 0x46],
  };

  for (const [format, signature] of Object.entries(signatures)) {
    if (allowedFormats.includes(format)) {
      const matches = signature.every((byte, index) => buffer[index] === byte);
      if (matches) {
        console.log(`✅ Valid ${format.toUpperCase()} format detected`);
        return { valid: true, format };
      }
    }
  }

  console.log("❌ Invalid or unsupported image format");
  return { valid: false, format: null };
};

export const preprocessImage = async (imageBuffer, options = {}) => {
  console.log("🔧 Image Preprocessing Starting...");
  console.log(`📊 Input buffer size: ${imageBuffer.length} bytes`);
  console.log(`⚙️ Options: ${JSON.stringify(options)}`);

  // TODO: Implement image preprocessing for better OCR results
  //
  // Preprocessing steps:
  // 1. Resize image if too large
  // 2. Convert to grayscale
  // 3. Enhance contrast
  // 4. Denoise
  // 5. Deskew if needed
  //
  // Example with Sharp:
  /*
  console.log("🔄 Processing image with Sharp...");
  import sharp from 'sharp';
  
  const processedBuffer = await sharp(imageBuffer)
    .resize(options.maxWidth || 2000, options.maxHeight || 2000, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .grayscale()
    .normalize()
    .toBuffer();
    
  console.log(`✅ Image processed: ${processedBuffer.length} bytes`);
  return processedBuffer;
  */

  console.log("📷 Image preprocessing not implemented - using original image");
  console.log("💡 Consider implementing Sharp.js for better OCR accuracy");
  return imageBuffer;
};
