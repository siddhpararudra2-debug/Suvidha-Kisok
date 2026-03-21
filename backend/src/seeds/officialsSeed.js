// File: /backend/src/seeds/officialsSeed.js
import mongoose from 'mongoose';

const officialsData = [
  // ELECTRICITY DEPARTMENT OFFICIALS
  {
    id: "OFF001",
    name: "Shri Ramesh Chandra Mishra",
    designation: "Chief Engineer",
    department: "Electricity",
    jurisdiction: "Gujarat Circle",
    level: 5,
    photo: "/images/officials/off001.jpg",
    contact: {
      office: "+91-22-2654-1234",
      mobile: "+91-9820012345",
      email: "ce.Gujarat@electricity.gov.in",
      whatsapp: "+91-9820012345"
    },
    officeAddress: "Electricity Board HQ, Colaba, Surat - 400001",
    officeHours: "10:00 AM - 5:00 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["State-level power planning", "Policy implementation", "Major projects approval"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF002",
    name: "Smt. Kavita Sharma",
    designation: "Superintendent Engineer",
    department: "Electricity",
    jurisdiction: "Surat Suburban Division",
    level: 4,
    photo: "/images/officials/off002.jpg",
    contact: {
      office: "+91-22-2654-2345",
      mobile: "+91-9820023456",
      email: "se.Suratsuburban@electricity.gov.in"
    },
    officeAddress: "SE Office, Andheri East, Surat - 400069",
    officeHours: "10:00 AM - 5:00 PM (Mon-Fri)",
    reportingTo: "OFF001",
    responsibilities: ["Division-level operations", "Budget management", "Staff supervision"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF003",
    name: "Shri Ajay Kumar Singh",
    designation: "Executive Engineer",
    department: "Electricity",
    jurisdiction: "Borivali Sub-Division",
    level: 3,
    photo: "/images/officials/off003.jpg",
    contact: {
      office: "+91-22-2654-3456",
      mobile: "+91-9820034567",
      email: "ee.borivali@electricity.gov.in"
    },
    officeAddress: "EE Office, Borivali West, Surat - 400092",
    officeHours: "10:00 AM - 5:00 PM (Mon-Sat)",
    reportingTo: "OFF002",
    responsibilities: ["Sub-division operations", "Project execution", "Complaint escalation"],
    languages: ["Hindi", "English"]
  },
  {
    id: "OFF004",
    name: "Shri Prakash Deshmukh",
    designation: "Assistant Engineer",
    department: "Electricity",
    jurisdiction: "Borivali West Section",
    level: 2,
    photo: "/images/officials/off004.jpg",
    contact: {
      office: "+91-22-2654-4567",
      mobile: "+91-9820045678",
      email: "ae.borivaliwest@electricity.gov.in"
    },
    officeAddress: "AE Office, MG Road, Borivali West - 400092",
    officeHours: "9:00 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF003",
    responsibilities: ["Section maintenance", "New connections", "Field inspections"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF005",
    name: "Shri Santosh Patil",
    designation: "Junior Engineer",
    department: "Electricity",
    jurisdiction: "Borivali West - Ward 1",
    level: 1,
    photo: "/images/officials/off005.jpg",
    contact: {
      office: "+91-22-2654-5678",
      mobile: "+91-9820056789",
      email: "je.borivaliw1@electricity.gov.in"
    },
    officeAddress: "Local Office, IC Colony, Borivali West - 400103",
    officeHours: "9:00 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF004",
    responsibilities: ["Field work", "Complaint resolution", "Meter reading"],
    languages: ["Hindi", "Marathi"]
  },
  {
    id: "OFF006",
    name: "Shri Venkatesh Iyer",
    designation: "Executive Engineer",
    department: "Electricity",
    jurisdiction: "Chennai North Division",
    level: 3,
    photo: "/images/officials/off006.jpg",
    contact: {
      office: "+91-44-2534-1234",
      mobile: "+91-9840012345",
      email: "ee.chennainorth@tangedco.gov.in"
    },
    officeAddress: "TANGEDCO Office, Anna Nagar, Chennai - 600040",
    officeHours: "10:00 AM - 5:45 PM (Mon-Sat)",
    reportingTo: null,
    responsibilities: ["Division operations", "Load management", "Infrastructure planning"],
    languages: ["Tamil", "English", "Hindi"]
  },
  {
    id: "OFF007",
    name: "Smt. Lakshmi Narayanan",
    designation: "Assistant Engineer",
    department: "Electricity",
    jurisdiction: "Anna Nagar Section",
    level: 2,
    photo: "/images/officials/off007.jpg",
    contact: {
      office: "+91-44-2534-2345",
      mobile: "+91-9840023456",
      email: "ae.annanagar@tangedco.gov.in"
    },
    officeAddress: "Section Office, 2nd Avenue, Anna Nagar - 600040",
    officeHours: "10:00 AM - 5:45 PM (Mon-Sat)",
    reportingTo: "OFF006",
    responsibilities: ["Section maintenance", "Customer grievances", "New connections"],
    languages: ["Tamil", "English"]
  },

  // GAS DEPARTMENT OFFICIALS
  {
    id: "OFF008",
    name: "Shri Rajendra Prasad",
    designation: "General Manager",
    department: "Gas",
    jurisdiction: "MGL - Surat Region",
    level: 5,
    photo: "/images/officials/off008.jpg",
    contact: {
      office: "+91-22-2654-8888",
      mobile: "+91-9821012345",
      email: "gm.Surat@mgl.gov.in"
    },
    officeAddress: "MGL Head Office, Bandra Kurla Complex, Surat - 400051",
    officeHours: "9:30 AM - 6:00 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["Regional operations", "Business development", "Safety compliance"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF009",
    name: "Shri Mahesh Sharma",
    designation: "Deputy General Manager",
    department: "Gas",
    jurisdiction: "MGL - Western Suburbs",
    level: 4,
    photo: "/images/officials/off009.jpg",
    contact: {
      office: "+91-22-2654-8889",
      mobile: "+91-9821023456",
      email: "dgm.westsuburbs@mgl.gov.in"
    },
    officeAddress: "MGL Office, Andheri West, Surat - 400053",
    officeHours: "9:30 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF008",
    responsibilities: ["Suburban operations", "Pipeline expansion", "Customer service"],
    languages: ["Hindi", "English"]
  },
  {
    id: "OFF010",
    name: "Shri Anil Kapoor",
    designation: "Area Manager",
    department: "Gas",
    jurisdiction: "MGL - Borivali Area",
    level: 3,
    photo: "/images/officials/off010.jpg",
    contact: {
      office: "+91-22-2654-8890",
      mobile: "+91-9821034567",
      email: "am.borivali@mgl.gov.in"
    },
    officeAddress: "MGL Office, Borivali East, Surat - 400066",
    officeHours: "9:00 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF009",
    responsibilities: ["Area operations", "New connections", "Safety inspections"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF011",
    name: "Shri Vivek Tiwari",
    designation: "Field Engineer",
    department: "Gas",
    jurisdiction: "Borivali West Zone",
    level: 2,
    photo: "/images/officials/off011.jpg",
    contact: {
      office: "+91-22-2654-8891",
      mobile: "+91-9821045678",
      email: "fe.borivaliwest@mgl.gov.in"
    },
    officeAddress: "Field Office, MG Road, Borivali West - 400092",
    officeHours: "8:00 AM - 5:00 PM (Mon-Sat)",
    reportingTo: "OFF010",
    responsibilities: ["Field inspections", "Meter installation", "Emergency response"],
    languages: ["Hindi", "Marathi"]
  },
  {
    id: "OFF012",
    name: "Shri Suresh Menon",
    designation: "General Manager - Operations",
    department: "Gas",
    jurisdiction: "IGL - Delhi NCR",
    level: 5,
    photo: "/images/officials/off012.jpg",
    contact: {
      office: "+91-11-2345-6789",
      mobile: "+91-9811012345",
      email: "gm.operations@igl.gov.in"
    },
    officeAddress: "IGL Bhawan, Connaught Place, New Delhi - 110001",
    officeHours: "9:30 AM - 6:00 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["NCR operations", "CNG stations", "Industrial supply"],
    languages: ["Hindi", "English"]
  },
  {
    id: "OFF013",
    name: "Smt. Priya Singh",
    designation: "Area Manager",
    department: "Gas",
    jurisdiction: "IGL - South Delhi",
    level: 3,
    photo: "/images/officials/off013.jpg",
    contact: {
      office: "+91-11-2345-7890",
      mobile: "+91-9811023456",
      email: "am.southdelhi@igl.gov.in"
    },
    officeAddress: "IGL Office, Greater Kailash, New Delhi - 110048",
    officeHours: "9:30 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF012",
    responsibilities: ["South Delhi operations", "Customer service", "Pipeline maintenance"],
    languages: ["Hindi", "English"]
  },

  // WATER & MUNICIPAL OFFICIALS
  {
    id: "OFF014",
    name: "Shri Ashok Kumar",
    designation: "Chief Engineer - Water Supply",
    department: "Water",
    jurisdiction: "BMC - Greater Surat",
    level: 5,
    photo: "/images/officials/off014.jpg",
    contact: {
      office: "+91-22-2262-1234",
      mobile: "+91-9822012345",
      email: "ce.watersupply@mcgm.gov.in"
    },
    officeAddress: "BMC HQ, Fort, Surat - 400001",
    officeHours: "10:00 AM - 5:30 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["Water supply planning", "Infrastructure development", "Quality control"],
    languages: ["Hindi", "English", "Marathi"]
  },
  {
    id: "OFF015",
    name: "Shri Dinesh Patil",
    designation: "Superintendent Engineer",
    department: "Water",
    jurisdiction: "BMC - R Ward (Borivali)",
    level: 4,
    photo: "/images/officials/off015.jpg",
    contact: {
      office: "+91-22-2262-2345",
      mobile: "+91-9822023456",
      email: "se.rward@mcgm.gov.in"
    },
    officeAddress: "R Ward Office, Borivali East, Surat - 400066",
    officeHours: "10:00 AM - 5:30 PM (Mon-Sat)",
    reportingTo: "OFF014",
    responsibilities: ["Ward water supply", "Maintenance", "Tanker management"],
    languages: ["Hindi", "Marathi"]
  },
  {
    id: "OFF016",
    name: "Shri Manoj Jadhav",
    designation: "Executive Engineer",
    department: "Water",
    jurisdiction: "R Central Ward",
    level: 3,
    photo: "/images/officials/off016.jpg",
    contact: {
      office: "+91-22-2262-3456",
      mobile: "+91-9822034567",
      email: "ee.rcentral@mcgm.gov.in"
    },
    officeAddress: "Sub-Ward Office, Dahisar, Surat - 400068",
    officeHours: "10:00 AM - 5:30 PM (Mon-Sat)",
    reportingTo: "OFF015",
    responsibilities: ["Area operations", "Pipeline repairs", "New connections"],
    languages: ["Hindi", "Marathi"]
  },
  {
    id: "OFF017",
    name: "Shri Sunil Bhosale",
    designation: "Assistant Engineer",
    department: "Water",
    jurisdiction: "Borivali West - Water",
    level: 2,
    photo: "/images/officials/off017.jpg",
    contact: {
      office: "+91-22-2262-4567",
      mobile: "+91-9822045678",
      email: "ae.borivaliwater@mcgm.gov.in"
    },
    officeAddress: "Local Office, Borivali West, Surat - 400092",
    officeHours: "9:00 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF016",
    responsibilities: ["Local maintenance", "Complaint resolution", "Meter reading"],
    languages: ["Marathi", "Hindi"]
  },
  {
    id: "OFF018",
    name: "Smt. Rekha Gupta",
    designation: "Ward Officer",
    department: "Municipal",
    jurisdiction: "R Ward - Sanitation",
    level: 3,
    photo: "/images/officials/off018.jpg",
    contact: {
      office: "+91-22-2262-5678",
      mobile: "+91-9822056789",
      email: "wo.rward@mcgm.gov.in"
    },
    officeAddress: "Ward Office, Kandivali, Surat - 400067",
    officeHours: "10:00 AM - 5:30 PM (Mon-Sat)",
    reportingTo: "OFF015",
    responsibilities: ["Sanitation management", "Waste collection", "Street cleaning"],
    languages: ["Hindi", "Marathi", "English"]
  },
  {
    id: "OFF019",
    name: "Shri Ramakrishnan S",
    designation: "Chief Engineer",
    department: "Water",
    jurisdiction: "Chennai Metro Water",
    level: 5,
    photo: "/images/officials/off019.jpg",
    contact: {
      office: "+91-44-2852-1234",
      mobile: "+91-9841012345",
      email: "ce@chennaiwater.gov.in"
    },
    officeAddress: "CMWSSB HQ, Chintadripet, Chennai - 600002",
    officeHours: "10:00 AM - 5:45 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["City water supply", "Sewerage management", "Project planning"],
    languages: ["Tamil", "English", "Hindi"]
  },
  {
    id: "OFF020",
    name: "Shri Murugan K",
    designation: "Superintendent Engineer",
    department: "Water",
    jurisdiction: "Chennai North Zone",
    level: 4,
    photo: "/images/officials/off020.jpg",
    contact: {
      office: "+91-44-2852-2345",
      mobile: "+91-9841023456",
      email: "se.north@chennaiwater.gov.in"
    },
    officeAddress: "Zone Office, Kilpauk, Chennai - 600010",
    officeHours: "10:00 AM - 5:45 PM (Mon-Sat)",
    reportingTo: "OFF019",
    responsibilities: ["Zonal operations", "Water distribution", "Quality monitoring"],
    languages: ["Tamil", "English"]
  },
  {
    id: "OFF021",
    name: "Shri Balaji N",
    designation: "Assistant Engineer",
    department: "Water",
    jurisdiction: "Anna Nagar Area",
    level: 2,
    photo: "/images/officials/off021.jpg",
    contact: {
      office: "+91-44-2852-3456",
      mobile: "+91-9841034567",
      email: "ae.annanagar@chennaiwater.gov.in"
    },
    officeAddress: "Area Office, Anna Nagar West, Chennai - 600040",
    officeHours: "9:00 AM - 6:00 PM (Mon-Sat)",
    reportingTo: "OFF020",
    responsibilities: ["Area maintenance", "Customer complaints", "Meter services"],
    languages: ["Tamil"]
  },
  {
    id: "OFF022",
    name: "Shri Arvind Kejriwal Kumar",
    designation: "Chief Engineer",
    department: "Water",
    jurisdiction: "Delhi Jal Board",
    level: 5,
    photo: "/images/officials/off022.jpg",
    contact: {
      office: "+91-11-2398-1234",
      mobile: "+91-9810012345",
      email: "ce@delhijalboard.gov.in"
    },
    officeAddress: "DJB HQ, Varunalaya, ITO, New Delhi - 110002",
    officeHours: "9:30 AM - 5:30 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["Delhi water supply", "Sewerage network", "Treatment plants"],
    languages: ["Hindi", "English"]
  },
  {
    id: "OFF023",
    name: "Smt. Anita Sharma",
    designation: "Superintendent Engineer",
    department: "Water",
    jurisdiction: "DJB - South Delhi Zone",
    level: 4,
    photo: "/images/officials/off023.jpg",
    contact: {
      office: "+91-11-2398-2345",
      mobile: "+91-9810023456",
      email: "se.south@delhijalboard.gov.in"
    },
    officeAddress: "Zone Office, Nehru Place, New Delhi - 110019",
    officeHours: "9:30 AM - 5:30 PM (Mon-Sat)",
    reportingTo: "OFF022",
    responsibilities: ["South zone operations", "Pipeline network", "Tanker services"],
    languages: ["Hindi", "English"]
  },
  {
    id: "OFF024",
    name: "Shri Pankaj Verma",
    designation: "Executive Engineer",
    department: "Water",
    jurisdiction: "Greater Kailash Division",
    level: 3,
    photo: "/images/officials/off024.jpg",
    contact: {
      office: "+91-11-2398-3456",
      mobile: "+91-9810034567",
      email: "ee.gk@delhijalboard.gov.in"
    },
    officeAddress: "Division Office, Greater Kailash II, New Delhi - 110048",
    officeHours: "9:30 AM - 5:30 PM (Mon-Sat)",
    reportingTo: "OFF023",
    responsibilities: ["Division operations", "Infrastructure maintenance", "Billing"],
    languages: ["Hindi"]
  },

  // ADDITIONAL OFFICIALS FOR OTHER STATES
  {
    id: "OFF025",
    name: "Shri Yogesh Patel",
    designation: "Chief Engineer",
    department: "Electricity",
    jurisdiction: "UGVCL - North Gujarat",
    level: 5,
    photo: "/images/officials/off025.jpg",
    contact: {
      office: "+91-79-2323-1234",
      mobile: "+91-9825012345",
      email: "ce@ugvcl.gov.in"
    },
    officeAddress: "UGVCL HQ, Mehsana, Gujarat - 384002",
    officeHours: "10:30 AM - 6:00 PM (Mon-Sat)",
    reportingTo: null,
    responsibilities: ["North Gujarat electricity", "Rural electrification", "Solar projects"],
    languages: ["Gujarati", "Hindi", "English"]
  },
  {
    id: "OFF026",
    name: "Shri Harish Rawat",
    designation: "Superintendent Engineer",
    department: "Electricity",
    jurisdiction: "PSPCL - Ludhiana Circle",
    level: 4,
    photo: "/images/officials/off026.jpg",
    contact: {
      office: "+91-161-2301-234",
      mobile: "+91-9815012345",
      email: "se.ludhiana@pspcl.gov.in"
    },
    officeAddress: "SE Office, Civil Lines, Ludhiana - 141001",
    officeHours: "10:00 AM - 5:00 PM (Mon-Sat)",
    reportingTo: null,
    responsibilities: ["Circle operations", "Industrial connections", "Load management"],
    languages: ["Punjabi", "Hindi", "English"]
  },
  {
    id: "OFF027",
    name: "Shri Samir Das",
    designation: "Chief Engineer",
    department: "Water",
    jurisdiction: "Kolkata Municipal Corporation",
    level: 5,
    photo: "/images/officials/off027.jpg",
    contact: {
      office: "+91-33-2286-1234",
      mobile: "+91-9830012345",
      email: "ce.water@kmcgov.in"
    },
    officeAddress: "KMC HQ, S.N. Banerjee Road, Kolkata - 700013",
    officeHours: "10:00 AM - 5:00 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["Kolkata water supply", "Pumping stations", "Quality control"],
    languages: ["Bengali", "Hindi", "English"]
  },
  {
    id: "OFF028",
    name: "Smt. Geetha Reddy",
    designation: "Managing Director",
    department: "Water",
    jurisdiction: "HMWSSB - Hyderabad",
    level: 5,
    photo: "/images/officials/off028.jpg",
    contact: {
      office: "+91-40-2323-1234",
      mobile: "+91-9848012345",
      email: "md@hmwssb.gov.in"
    },
    officeAddress: "HMWSSB HQ, Khairatabad, Hyderabad - 500004",
    officeHours: "10:00 AM - 5:30 PM (Mon-Sat)",
    reportingTo: null,
    responsibilities: ["Hyderabad water supply", "Musi river projects", "Sewerage"],
    languages: ["Telugu", "Hindi", "English"]
  },
  {
    id: "OFF029",
    name: "Shri Arun Mohan",
    designation: "Chief Engineer",
    department: "Electricity",
    jurisdiction: "KSEB - Kerala State",
    level: 5,
    photo: "/images/officials/off029.jpg",
    contact: {
      office: "+91-471-2514-123",
      mobile: "+91-9447012345",
      email: "ce@kseb.gov.in"
    },
    officeAddress: "Vydyuthi Bhavanam, Pattom, Thiruvananthapuram - 695004",
    officeHours: "10:00 AM - 5:00 PM (Mon-Sat)",
    reportingTo: null,
    responsibilities: ["Kerala state electricity", "Hydel projects", "Distribution"],
    languages: ["Malayalam", "English", "Hindi"]
  },
  {
    id: "OFF030",
    name: "Shri Naveen Kumar",
    designation: "Commissioner",
    department: "Municipal",
    jurisdiction: "BBMP - Bangalore",
    level: 5,
    photo: "/images/officials/off030.jpg",
    contact: {
      office: "+91-80-2297-1234",
      mobile: "+91-9845012345",
      email: "commissioner@bbmp.gov.in"
    },
    officeAddress: "BBMP HQ, Hudson Circle, Bangalore - 560001",
    officeHours: "10:00 AM - 5:30 PM (Mon-Fri)",
    reportingTo: null,
    responsibilities: ["Bangalore civic administration", "Infrastructure", "Public services"],
    languages: ["Kannada", "English", "Hindi"]
  }
];

// Seed function
const seedOfficials = async () => {
  try {
    const db = mongoose.connection.db; // Get current db instance
    await db.collection('officials').deleteMany({});
    await db.collection('officials').insertMany(officialsData);
    console.log('✅ 30 Officials seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding officials:', error);
  }
};

export { officialsData, seedOfficials };
