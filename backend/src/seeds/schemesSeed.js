// File: /backend/src/seeds/schemesSeed.js
import mongoose from 'mongoose';

const schemesData = [
  // ELECTRICITY SCHEMES
  {
    id: "SCH001",
    name: "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
    category: "Electricity",
    subcategory: "Solar",
    description: "Scheme for farmers to set up solar pumps and sell surplus solar power to DISCOMs",
    benefits: [
      "Subsidy up to 60% for solar pumps",
      "Additional income from solar power sale",
      "Reduced electricity bills",
      "Grid-connected solar plants on barren land"
    ],
    eligibility: {
      criteria: [
        "Must be a farmer with agricultural land",
        "Land should be within 5km of sub-station",
        "Valid Aadhaar and land documents required"
      ],
      applicableStates: ["All States"],
      maxBenefit: "₹3,00,000 or 60% of cost, whichever is lower"
    },
    requiredDocuments: [
      "Aadhaar Card",
      "Land ownership documents",
      "Bank passbook",
      "Electricity bill (if existing connection)"
    ],
    applicationProcess: "Apply through state nodal agency or DISCOM office",
    deadline: "2026-03-31",
    status: "Active",
    ministry: "Ministry of New and Renewable Energy",
    website: "https://pmkusum.mnre.gov.in"
  },
  {
    id: "SCH002",
    name: "Rooftop Solar Subsidy Scheme (Phase II)",
    category: "Electricity",
    subcategory: "Solar",
    description: "Central government subsidy for residential rooftop solar installations",
    benefits: [
      "40% subsidy for systems up to 3 kW",
      "20% subsidy for systems 3-10 kW",
      "Reduced electricity bills up to 80%",
      "Net metering benefits"
    ],
    eligibility: {
      criteria: [
        "Residential consumers only",
        "Valid electricity connection",
        "Adequate rooftop space",
        "Structural stability certificate"
      ],
      applicableStates: ["All States"],
      maxBenefit: "₹78,000 for 3 kW system"
    },
    requiredDocuments: [
      "Electricity bill",
      "Aadhaar Card",
      "Property documents",
      "Bank account details"
    ],
    applicationProcess: "Apply through national portal or empaneled vendors",
    deadline: "2026-12-31",
    status: "Active",
    ministry: "Ministry of New and Renewable Energy",
    website: "https://solarrooftop.gov.in"
  },
  {
    id: "SCH003",
    name: "Senior Citizen Electricity Tariff Concession",
    category: "Electricity",
    subcategory: "Subsidy",
    description: "Concessional electricity tariff for senior citizens",
    benefits: [
      "10-20% rebate on electricity charges",
      "Reduced fixed charges",
      "Priority complaint resolution"
    ],
    eligibility: {
      criteria: [
        "Age 60 years or above",
        "Domestic connection in own name",
        "Monthly consumption below 200 units"
      ],
      applicableStates: ["Most States (varies by state)"],
      maxBenefit: "Up to ₹500/month depending on consumption"
    },
    requiredDocuments: [
      "Age proof (Aadhaar/PAN)",
      "Electricity bill",
      "Application form"
    ],
    applicationProcess: "Apply at local electricity office",
    deadline: "Ongoing",
    status: "Active",
    ministry: "State Electricity Regulatory Commissions",
    website: "Check respective state DISCOM website"
  },
  {
    id: "SCH004",
    name: "BPL Household Free Electricity Scheme",
    category: "Electricity",
    subcategory: "Subsidy",
    description: "Free electricity for Below Poverty Line households",
    benefits: [
      "Free electricity up to 50-100 units/month",
      "Waiver of fixed charges",
      "Free LED bulbs distribution"
    ],
    eligibility: {
      criteria: [
        "Valid BPL ration card",
        "Single domestic connection",
        "Monthly consumption within limit"
      ],
      applicableStates: ["Delhi", "Punjab", "Tamil Nadu", "Karnataka", "Others"],
      maxBenefit: "100 units free per month"
    },
    requiredDocuments: [
      "BPL ration card",
      "Aadhaar Card",
      "Electricity connection proof"
    ],
    applicationProcess: "Auto-applied based on BPL status in some states",
    deadline: "Ongoing",
    status: "Active",
    ministry: "State Governments",
    website: "Check respective state portal"
  },
  {
    id: "SCH005",
    name: "Saubhagya - Pradhan Mantri Sahaj Bijli Har Ghar Yojana",
    category: "Electricity",
    subcategory: "New Connection",
    description: "Free electricity connection to all remaining unelectrified households",
    benefits: [
      "Free electricity connection",
      "Free energy meter",
      "Free wiring up to 5 points",
      "1 LED bulb, 1 DC fan provided"
    ],
    eligibility: {
      criteria: [
        "Household without electricity connection",
        "Rural or urban poor household",
        "Not covered under other schemes"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Complete free electrification"
    },
    requiredDocuments: [
      "Identity proof",
      "Address proof",
      "No existing connection declaration"
    ],
    applicationProcess: "Apply at gram panchayat or DISCOM office",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Power",
    website: "https://saubhagya.gov.in"
  },

  // GAS SCHEMES
  {
    id: "SCH006",
    name: "Pradhan Mantri Ujjwala Yojana 2.0",
    category: "Gas",
    subcategory: "LPG Connection",
    description: "Free LPG connection for BPL women and migrant workers",
    benefits: [
      "Free LPG connection",
      "First cylinder free",
      "₹200 subsidy per refill (subject to DBT)",
      "Free pressure regulator and hose"
    ],
    eligibility: {
      criteria: [
        "Adult woman from BPL household",
        "No existing LPG connection in household",
        "Valid Aadhaar and bank account"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Free connection worth ₹1,600 + subsidized refills"
    },
    requiredDocuments: [
      "Aadhaar Card",
      "BPL/Ration card",
      "Bank passbook",
      "Passport photo"
    ],
    applicationProcess: "Apply at nearest LPG distributor",
    deadline: "2026-03-31",
    status: "Active",
    ministry: "Ministry of Petroleum and Natural Gas",
    website: "https://www.pmuy.gov.in"
  },
  {
    id: "SCH007",
    name: "PNG Connection Subsidy for LPG Consumers",
    category: "Gas",
    subcategory: "PNG Connection",
    description: "Subsidy for LPG consumers switching to Piped Natural Gas",
    benefits: [
      "50% subsidy on PNG connection charges",
      "Lower monthly gas bills",
      "Continuous gas supply without cylinder booking",
      "Safer than LPG"
    ],
    eligibility: {
      criteria: [
        "Existing LPG consumer",
        "Area covered by PNG network",
        "Valid address proof",
        "Kitchen infrastructure suitable for PNG"
      ],
      applicableStates: ["States with PNG coverage"],
      maxBenefit: "₹2,500 subsidy on connection"
    },
    requiredDocuments: [
      "LPG consumer number",
      "Aadhaar Card",
      "Property documents/NOC",
      "Electricity bill"
    ],
    applicationProcess: "Apply through local PNG provider",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Petroleum and Natural Gas",
    website: "Check local PNG provider website"
  },
  {
    id: "SCH008",
    name: "CNG Vehicle Conversion Subsidy",
    category: "Gas",
    subcategory: "CNG",
    description: "Subsidy for converting petrol/diesel vehicles to CNG",
    benefits: [
      "Subsidy up to ₹15,000 on CNG kit",
      "Reduced fuel costs (30-40% savings)",
      "Lower emissions",
      "Road tax exemption in some states"
    ],
    eligibility: {
      criteria: [
        "Vehicle registered in eligible city",
        "Vehicle age less than 15 years",
        "Petrol/Diesel vehicle only"
      ],
      applicableStates: ["Delhi NCR", "Maharashtra", "Gujarat", "Others"],
      maxBenefit: "₹15,000 or 50% of kit cost"
    },
    requiredDocuments: [
      "Vehicle RC",
      "Aadhaar Card",
      "PUC certificate",
      "Bank account details"
    ],
    applicationProcess: "Apply at authorized CNG kit installer",
    deadline: "Ongoing",
    status: "Active",
    ministry: "State Transport Departments",
    website: "Check state transport portal"
  },

  // WATER SCHEMES
  {
    id: "SCH009",
    name: "Jal Jeevan Mission - Har Ghar Jal",
    category: "Water",
    subcategory: "Connection",
    description: "Tap water connection to every rural household by 2024",
    benefits: [
      "Free tap water connection",
      "55 litres per capita per day assured",
      "Quality monitoring",
      "Community-managed water supply"
    ],
    eligibility: {
      criteria: [
        "Rural household without tap connection",
        "Included in gram panchayat survey",
        "Willing to contribute nominal amount"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Free tap water connection"
    },
    requiredDocuments: [
      "Household survey inclusion",
      "Aadhaar Card",
      "Village residence proof"
    ],
    applicationProcess: "Contact gram panchayat or PHE department",
    deadline: "2026-12-31",
    status: "Active",
    ministry: "Ministry of Jal Shakti",
    website: "https://jaljeevanmission.gov.in"
  },
  {
    id: "SCH010",
    name: "Atal Mission for Rejuvenation and Urban Transformation (AMRUT) 2.0",
    category: "Water",
    subcategory: "Urban Water",
    description: "Universal water supply coverage in urban areas",
    benefits: [
      "Household tap connection",
      "Sewerage/septage management",
      "Rejuvenation of water bodies",
      "24x7 water supply"
    ],
    eligibility: {
      criteria: [
        "Resident of AMRUT city",
        "Urban household without connection",
        "Valid property/tenancy documents"
      ],
      applicableStates: ["500 AMRUT cities"],
      maxBenefit: "Subsidized water connection"
    },
    requiredDocuments: [
      "Property tax receipt",
      "Aadhaar Card",
      "Address proof"
    ],
    applicationProcess: "Apply at municipal corporation office",
    deadline: "2026-03-31",
    status: "Active",
    ministry: "Ministry of Housing and Urban Affairs",
    website: "https://amrut.gov.in"
  },
  {
    id: "SCH011",
    name: "Rainwater Harvesting Rebate Scheme",
    category: "Water",
    subcategory: "Conservation",
    description: "Property tax rebate for installing rainwater harvesting systems",
    benefits: [
      "5-10% rebate on property tax",
      "Reduced water bills",
      "Groundwater recharge",
      "Compliance with building rules"
    ],
    eligibility: {
      criteria: [
        "Property with RWH system installed",
        "System certified by competent authority",
        "Property tax account holder"
      ],
      applicableStates: ["Most urban areas"],
      maxBenefit: "10% property tax rebate"
    },
    requiredDocuments: [
      "RWH installation certificate",
      "Property tax receipt",
      "Application form"
    ],
    applicationProcess: "Apply at municipal corporation",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Municipal Corporations",
    website: "Check local municipal portal"
  },

  // MUNICIPAL/SANITATION SCHEMES
  {
    id: "SCH012",
    name: "Swachh Bharat Mission - Urban 2.0",
    category: "Municipal",
    subcategory: "Sanitation",
    description: "Comprehensive sanitation and waste management in urban areas",
    benefits: [
      "Free household toilet construction",
      "Door-to-door garbage collection",
      "Waste segregation support",
      "Community toilets in public places"
    ],
    eligibility: {
      criteria: [
        "Urban household without toilet",
        "Below Poverty Line preferred",
        "Open defecation-free commitment"
      ],
      applicableStates: ["All Urban Areas"],
      maxBenefit: "₹15,000 for toilet construction"
    },
    requiredDocuments: [
      "Aadhaar Card",
      "BPL card (if applicable)",
      "Address proof"
    ],
    applicationProcess: "Apply at ward office or online portal",
    deadline: "2026-03-31",
    status: "Active",
    ministry: "Ministry of Housing and Urban Affairs",
    website: "https://sbmurban.org"
  },
  {
    id: "SCH013",
    name: "GOBAR-DHAN (Galvanizing Organic Bio-Agro Resources)",
    category: "Municipal",
    subcategory: "Waste Management",
    description: "Converting cattle waste and organic waste to biogas and organic manure",
    benefits: [
      "Additional income from waste",
      "Free biogas connection",
      "Organic manure production",
      "Rural employment"
    ],
    eligibility: {
      criteria: [
        "Cattle owners",
        "Village panchayats",
        "Farmer Producer Organizations"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Varies by project size"
    },
    requiredDocuments: [
      "Cattle ownership proof",
      "Land documents",
      "Bank account"
    ],
    applicationProcess: "Contact district agriculture officer",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Jal Shakti",
    website: "https://sbm.gov.in/gbdw20"
  },
  {
    id: "SCH014",
    name: "Property Tax Rebate for Green Buildings",
    category: "Municipal",
    subcategory: "Environment",
    description: "Property tax concession for eco-friendly/green certified buildings",
    benefits: [
      "10-20% property tax rebate",
      "Faster building approvals",
      "Reduced utility costs",
      "Environmental contribution"
    ],
    eligibility: {
      criteria: [
        "GRIHA/IGBC certified building",
        "Minimum 3-star rating",
        "Solar/renewable energy integration"
      ],
      applicableStates: ["Major cities"],
      maxBenefit: "20% property tax rebate"
    },
    requiredDocuments: [
      "Green building certificate",
      "Property documents",
      "Building plan approval"
    ],
    applicationProcess: "Apply at municipal corporation",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Municipal Corporations",
    website: "Check local municipal portal"
  },

  // GENERAL WELFARE SCHEMES
  {
    id: "SCH015",
    name: "LiFE (Lifestyle for Environment) Mission",
    category: "General",
    subcategory: "Environment",
    description: "Incentives for adopting sustainable lifestyle practices",
    benefits: [
      "LED bulb distribution",
      "Energy efficient appliance subsidies",
      "Water conservation incentives",
      "Recognition for eco-warriors"
    ],
    eligibility: {
      criteria: [
        "Indian citizen",
        "Commitment to sustainable practices",
        "Registration on LiFE portal"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Various incentives and recognition"
    },
    requiredDocuments: [
      "Aadhaar Card",
      "Mobile number"
    ],
    applicationProcess: "Register on mygov.in/life",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Environment",
    website: "https://mygov.in/life"
  },
  {
    id: "SCH016",
    name: "Smart Meter Installation Program",
    category: "Electricity",
    subcategory: "Metering",
    description: "Free smart meter upgrade for better billing accuracy and prepaid options",
    benefits: [
      "Free smart meter installation",
      "Real-time consumption monitoring",
      "Prepaid billing option",
      "No meter reading disputes"
    ],
    eligibility: {
      criteria: [
        "Existing electricity consumer",
        "Area covered under smart metering",
        "Consent for smart meter"
      ],
      applicableStates: ["Phased rollout in all states"],
      maxBenefit: "Free smart meter worth ₹3,000-5,000"
    },
    requiredDocuments: [
      "Electricity bill",
      "Aadhaar Card",
      "Mobile number for app"
    ],
    applicationProcess: "Auto-selection by DISCOM or opt-in",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Power",
    website: "Check state DISCOM portal"
  },
  {
    id: "SCH017",
    name: "Electric Vehicle Charging Infrastructure Subsidy",
    category: "Electricity",
    subcategory: "EV Infrastructure",
    description: "Subsidy for setting up EV charging stations",
    benefits: [
      "40% capital subsidy for charging infrastructure",
      "Concessional electricity tariff",
      "Priority grid connection",
      "Land lease at subsidized rates"
    ],
    eligibility: {
      criteria: [
        "Registered business entity",
        "Compliant with BIS standards",
        "Minimum number of chargers"
      ],
      applicableStates: ["All States under FAME II"],
      maxBenefit: "40% of equipment cost"
    },
    requiredDocuments: [
      "Business registration",
      "Site details",
      "Technical specifications"
    ],
    applicationProcess: "Apply through state nodal agency",
    deadline: "2026-03-31",
    status: "Active",
    ministry: "Ministry of Heavy Industries",
    website: "https://fame2.heavyindustries.gov.in"
  },
  {
    id: "SCH018",
    name: "Widow/Single Woman Electricity Concession",
    category: "Electricity",
    subcategory: "Subsidy",
    description: "Concessional electricity tariff for widows and single women",
    benefits: [
      "50% rebate on electricity charges",
      "Reduced fixed charges",
      "Priority new connection"
    ],
    eligibility: {
      criteria: [
        "Widow or legally single woman",
        "Connection in own name",
        "Monthly consumption below 100 units"
      ],
      applicableStates: ["Select states"],
      maxBenefit: "50% rebate on bills"
    },
    requiredDocuments: [
      "Death certificate of spouse / Divorce decree",
      "Aadhaar Card",
      "Electricity bill"
    ],
    applicationProcess: "Apply at local electricity office",
    deadline: "Ongoing",
    status: "Active",
    ministry: "State Electricity Boards",
    website: "Check state DISCOM portal"
  },
  {
    id: "SCH019",
    name: "Industrial Water Recycling Incentive",
    category: "Water",
    subcategory: "Industrial",
    description: "Incentives for industries implementing water recycling systems",
    benefits: [
      "20% subsidy on STP/ETP",
      "Reduced water cess",
      "Priority environmental clearances",
      "Green industry recognition"
    ],
    eligibility: {
      criteria: [
        "Registered industrial unit",
        "Water consumption above threshold",
        "Commitment to zero liquid discharge"
      ],
      applicableStates: ["All States"],
      maxBenefit: "20% capital subsidy up to ₹50 lakhs"
    },
    requiredDocuments: [
      "Industrial registration",
      "Water consumption data",
      "Proposed recycling system design"
    ],
    applicationProcess: "Apply at State Pollution Control Board",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Ministry of Environment",
    website: "Check state PCB portal"
  },
  {
    id: "SCH020",
    name: "Disability Friendly Utility Services Scheme",
    category: "General",
    subcategory: "Accessibility",
    description: "Special provisions and concessions for persons with disabilities",
    benefits: [
      "100% waiver of security deposit",
      "Priority new connection",
      "Home visit for bill payment",
      "Accessible complaint registration"
    ],
    eligibility: {
      criteria: [
        "UDID card holder",
        "40% or more disability",
        "Valid disability certificate"
      ],
      applicableStates: ["All States"],
      maxBenefit: "Full security deposit waiver + priority services"
    },
    requiredDocuments: [
      "UDID Card",
      "Disability certificate",
      "Aadhaar Card"
    ],
    applicationProcess: "Apply with disability certificate at utility office",
    deadline: "Ongoing",
    status: "Active",
    ministry: "Department of Empowerment of PwD",
    website: "https://disabilityaffairs.gov.in"
  }
];

// Seed function
const seedSchemes = async () => {
  try {
    const db = mongoose.connection.db; // Get current db instance
    await db.collection('schemes').deleteMany({});
    await db.collection('schemes').insertMany(schemesData);
    console.log('✅ 20 Schemes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding schemes:', error);
  }
};

export { schemesData, seedSchemes };
