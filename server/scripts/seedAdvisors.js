import mongoose from "mongoose";
import dotenv from "dotenv";
import Advisor from "../models/Advisor.js";

// Load environment variables
dotenv.config();

// Sample advisor data
const advisors = [
  {
    name: "Rajesh Kumar Sharma",
    registrationNumber: "INH000001234",
    status: "active",
    firm: "SecureWealth Financial Advisors",
    email: "rajesh.sharma@securewealth.in",
    phone: "+91-9876543210",
    address: {
      street: "123 Business Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    certifications: ["CFP", "CFA", "SEBI Investment Advisor"],
    specializations: ["Equity Investments", "Mutual Funds", "Tax Planning"],
    registrationDate: new Date("2018-03-15"),
  },
  {
    name: "Priya Singh",
    registrationNumber: "INH000002345",
    status: "active",
    firm: "WealthMax Advisory Services",
    email: "priya.singh@wealthmax.in",
    phone: "+91-9876543211",
    address: {
      street: "456 Financial District",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    certifications: ["CFP", "SEBI Investment Advisor"],
    specializations: [
      "Portfolio Management",
      "Retirement Planning",
      "Insurance",
    ],
    registrationDate: new Date("2019-07-22"),
  },
  {
    name: "Amit Patel",
    registrationNumber: "INH000003456",
    status: "suspended",
    firm: "InvestSmart Solutions",
    email: "amit.patel@investsmart.in",
    phone: "+91-9876543212",
    address: {
      street: "789 Trade Center",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
    },
    certifications: ["SEBI Investment Advisor"],
    specializations: ["Stock Market", "Derivatives"],
    registrationDate: new Date("2017-11-08"),
  },
  {
    name: "Deepika Gupta",
    registrationNumber: "INH000004567",
    status: "active",
    firm: "FinanceFirst Advisory",
    email: "deepika.gupta@financefirst.in",
    phone: "+91-9876543213",
    address: {
      street: "321 Corporate Avenue",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
    certifications: ["CFA", "CFP", "SEBI Investment Advisor", "FRM"],
    specializations: ["Alternative Investments", "Real Estate", "Commodities"],
    registrationDate: new Date("2020-01-10"),
  },
  {
    name: "Sandeep Joshi",
    registrationNumber: "INH000005678",
    status: "active",
    firm: "MoneyWise Consultants",
    email: "sandeep.joshi@moneywise.in",
    phone: "+91-9876543214",
    address: {
      street: "654 Finance Hub",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
    certifications: ["CFP", "SEBI Investment Advisor"],
    specializations: [
      "Financial Planning",
      "Goal-based Investing",
      "SIP Advisory",
    ],
    registrationDate: new Date("2019-04-18"),
  },
  {
    name: "Kavitha Nair",
    registrationNumber: "INH000006789",
    status: "cancelled",
    firm: "SmartInvest Advisory",
    email: "kavitha.nair@smartinvest.in",
    phone: "+91-9876543215",
    address: {
      street: "987 Investment Plaza",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
    certifications: ["SEBI Investment Advisor"],
    specializations: ["Mutual Funds", "ELSS"],
    registrationDate: new Date("2016-09-05"),
  },
];

const seedAdvisors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/fraudshield"
    );
    console.log("🗄️  Connected to MongoDB");

    // Clear existing advisors
    await Advisor.deleteMany({});
    console.log("🧹 Cleared existing advisor data");

    // Insert new advisors
    const insertedAdvisors = await Advisor.insertMany(advisors);
    console.log(`✅ Successfully seeded ${insertedAdvisors.length} advisors:`);

    insertedAdvisors.forEach((advisor) => {
      console.log(
        `   📋 ${advisor.name} (${advisor.registrationNumber}) - ${advisor.status}`
      );
    });

    // Create text search index
    await Advisor.collection.createIndex({
      name: "text",
      firm: "text",
      registrationNumber: "text",
    });
    console.log("🔍 Created text search index");

    console.log("\n🎉 Seeding completed successfully!");
    console.log("\nAdvisor Summary:");
    console.log(`   📊 Total: ${insertedAdvisors.length}`);
    console.log(
      `   ✅ Active: ${
        insertedAdvisors.filter((a) => a.status === "active").length
      }`
    );
    console.log(
      `   ⚠️  Suspended: ${
        insertedAdvisors.filter((a) => a.status === "suspended").length
      }`
    );
    console.log(
      `   ❌ Cancelled: ${
        insertedAdvisors.filter((a) => a.status === "cancelled").length
      }`
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run the seed function
seedAdvisors();
