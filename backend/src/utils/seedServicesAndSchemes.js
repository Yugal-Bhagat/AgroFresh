import Service from "../models/Service.js";
import Scheme from "../models/Scheme.js";

const defaultServices = [
  { icon: "📍", title: "Nearby Farmer Marketplace", desc: "Find farmers and buyers near your location with district wise filtering for easy trading." },
  { icon: "⭐", title: "Product Ratings & Reviews", desc: "Users can rate and review products to maintain quality and trust in the marketplace." },
  { icon: "💳", title: "Secure Payment Integration", desc: "Safe and secure digital payments for buying agricultural products online." },
  { icon: "🧾", title: "Automatic Bill Generation", desc: "Instant invoice generation after order confirmation for transparency." },
  { icon: "🛒", title: "Add to Cart & Order System", desc: "Simple shopping cart system to place orders directly from farmers." },
  { icon: "📞", title: "Direct Farmer Contact", desc: "Contact farmers directly from each product page for negotiation and queries." },
  { icon: "🌦", title: "Weather Information", desc: "Real-time weather updates to help farmers plan their agricultural activities." },
  { icon: "🌱", title: "Farming Guidance", desc: "Expert tips and agriculture guidance for better crop production." },
  { icon: "🏛", title: "Government Schemes", desc: "Latest government agriculture schemes and benefits for farmers." },
  { icon: "🧑‍🌾", title: "Farmer Verification", desc: "Seller verification using Aadhaar to ensure trusted farmers on the platform." },
  { icon: "📊", title: "Buyer & Seller Dashboard", desc: "Separate dashboards for buyers and farmers to manage orders and products." },
  { icon: "📩", title: "Query & Support System", desc: "Users can ask farming related questions and get expert support." },
];

const defaultSchemes = [
  {
    type: "main",
    title: "PM Kisan Samman Nidhi (PM-KISAN)",
    category: "Income Support",
    description: "Financial benefit of ₹6,000 per year in three equal installments of ₹2,000 each for small and marginal farmers.",
    benefit: "₹6,000/year",
    deadline: "March 13, 2026 (22nd Installment)",
    status: "active",
    icon: "💰",
    link: "https://pmkisan.gov.in",
    details: "22nd installment releasing on March 13, 2026. Ensure e-KYC completed and Aadhaar linked to bank account.",
  },
  {
    type: "main",
    title: "PM Fasal Bima Yojana (PMFBY)",
    category: "Crop Insurance",
    description: "Comprehensive crop insurance against natural disasters, pests, and diseases from pre-sowing to post-harvest.",
    benefit: "Premium subsidy up to 90%",
    deadline: "Seasonal (Kharif/Rabi)",
    status: "active",
    icon: "🌾",
    details: "States now allowed add-on cover for wild animal damage. YES-TECH technology for yield estimation now covers soybean.",
  },
  {
    type: "main",
    title: "Kisan Credit Card (KCC)",
    category: "Credit Support",
    description: "Composite credit facility with 6-year tenure covering crop cultivation, allied activities, and investment needs.",
    benefit: "Limit up to ₹2 lakh (collateral-free)",
    deadline: "Ongoing",
    status: "active",
    icon: "💳",
    details: "Flexi KCC of ₹10,000-50,000 for marginal farmers. Covers animal husbandry, fisheries, post-harvest expenses, and more.",
  },
  {
    type: "main",
    title: "Maharashtra Solar Agri-Feeder Scheme",
    category: "State Scheme",
    description: "Daytime solar electricity for irrigation; 8 lakh farmers already benefiting with plans to add 10,000 MW capacity.",
    benefit: "10 hours daytime power",
    deadline: "Expanding 2026-27",
    status: "active",
    icon: "☀️",
    details: "International Solar Alliance recognized flagship project. Next phase focuses on battery storage for 24/7 utilization.",
  },
  {
    type: "main",
    title: "Formation & Promotion of FPOs",
    category: "Farmer Collectives",
    description: "Financial assistance up to ₹18 lakh per FPO for management, matching equity grants, and credit guarantee.",
    benefit: "₹18 lakh assistance + equity grant",
    deadline: "Ongoing",
    status: "active",
    icon: "👥",
    details: "10,000 FPOs registered as of Dec 2025. ₹430.77 Cr distributed as matching equity to 6,557 FPOs.",
  },
  {
    type: "main",
    title: "Maharashtra Loan Waiver Scheme",
    category: "Debt Relief",
    description: "Eligible farmers with overdue crop loans receive relief up to ₹2 lakh. ₹50,000 incentive for regular repayers.",
    benefit: "₹2 lakh waiver / ₹50k incentive",
    deadline: "FY 2026-27",
    status: "active",
    icon: "🏦",
    details: "Part of Maharashtra Budget 2026-27. Aimed at supporting farmers with crop loan overdue.",
  },
  {
    type: "new",
    title: "Coconut Promotion Scheme",
    description: "Replace old trees with new saplings in major coconut-growing states. India is world's largest coconut producer with 30 million livelihoods dependent.",
    benefit: "Productivity enhancement",
    source: "Union Budget 2026-27",
  },
  {
    type: "new",
    title: "Bharat-VISTAAR",
    description: "Multilingual AI tool integrating AgriStack portals and ICAR practices for customized advisory support to farmers.",
    benefit: "AI-powered farm advisory",
    source: "Union Budget 2026-27",
  },
  {
    type: "new",
    title: "Programme for Cashew & Cocoa",
    description: "Make India self-reliant in raw cashew and cocoa production, enhance export competitiveness by 2030.",
    benefit: "Self-reliance & exports",
    source: "Union Budget 2026-27",
  },
  {
    type: "new",
    title: "Dedicated Programme for Walnuts, Almonds & Pine Nuts",
    description: "Rejuvenate old orchards and expand high-density cultivation in hilly regions.",
    benefit: "Value addition & youth engagement",
    source: "Union Budget 2026-27",
  },
];

const seedServicesAndSchemes = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(
        defaultServices.map((s, i) => ({ ...s, order: i })),
      );
      console.log(`🌱 Seeded ${defaultServices.length} services`);
    }

    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      await Scheme.insertMany(
        defaultSchemes.map((s, i) => ({ ...s, order: i })),
      );
      console.log(`🌱 Seeded ${defaultSchemes.length} schemes`);
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

export default seedServicesAndSchemes;
