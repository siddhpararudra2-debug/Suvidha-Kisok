// File: /backend/src/seeds/citizensSeed.js
import mongoose from 'mongoose';

const citizensData = [
  {
    id: "CIT001",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    mobile: "+91-9876543210",
    aadhaarLast4: "1234",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    address: {
      street: "14/A, MG Road",
      locality: "Borivali West",
      city: "Surat",
      state: "Gujarat",
      pincode: "400092"
    },
    connections: {
      electricity: { consumerId: "MH01234567890", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G987654321", provider: "MGL", status: "active" },
      water: { connectionId: "W123456", status: "active" }
    },
    createdAt: "2024-01-15"
  },
  {
    id: "CIT002",
    name: "Rajesh Kumar Singh",
    email: "rajesh.singh@email.com",
    mobile: "+91-9876543211",
    aadhaarLast4: "5678",
    dateOfBirth: "1978-07-22",
    gender: "Male",
    address: {
      street: "45, Nehru Nagar",
      locality: "Andheri East",
      city: "Surat",
      state: "Gujarat",
      pincode: "400069"
    },
    connections: {
      electricity: { consumerId: "MH01234567891", status: "active", sanctionedLoad: "3 kW" },
      gas: { bpNumber: "G987654322", provider: "MGL", status: "active" },
      water: { connectionId: "W123457", status: "active" }
    },
    createdAt: "2024-02-10"
  },
  {
    id: "CIT003",
    name: "Anita Patel",
    email: "anita.patel@email.com",
    mobile: "+91-9876543212",
    aadhaarLast4: "9012",
    dateOfBirth: "1990-11-08",
    gender: "Female",
    address: {
      street: "78, Gandhi Road",
      locality: "Navrangpura",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380009"
    },
    connections: {
      electricity: { consumerId: "GJ09876543210", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G123456789", provider: "Gujarat Gas", status: "active" },
      water: { connectionId: "W234567", status: "active" }
    },
    createdAt: "2024-01-20"
  },
  {
    id: "CIT004",
    name: "Mohammed Irfan Khan",
    email: "irfan.khan@email.com",
    mobile: "+91-9876543213",
    aadhaarLast4: "3456",
    dateOfBirth: "1982-05-30",
    gender: "Male",
    address: {
      street: "23, Jubilee Hills",
      locality: "Road No. 5",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033"
    },
    connections: {
      electricity: { consumerId: "TS05678901234", status: "active", sanctionedLoad: "6 kW" },
      gas: { bpNumber: "G456789012", provider: "Bhagyanagar Gas", status: "active" },
      water: { connectionId: "W345678", status: "active" }
    },
    createdAt: "2024-03-05"
  },
  {
    id: "CIT005",
    name: "Lakshmi Venkatesh",
    email: "lakshmi.v@email.com",
    mobile: "+91-9876543214",
    aadhaarLast4: "7890",
    dateOfBirth: "1975-09-12",
    gender: "Female",
    address: {
      street: "56, Anna Nagar",
      locality: "West Extension",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040"
    },
    connections: {
      electricity: { consumerId: "TN03456789012", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G789012345", provider: "Indian Oil-Adani Gas", status: "active" },
      water: { connectionId: "W456789", status: "active" }
    },
    createdAt: "2024-02-28"
  },
  {
    id: "CIT006",
    name: "Suresh Reddy",
    email: "suresh.reddy@email.com",
    mobile: "+91-9876543215",
    aadhaarLast4: "2345",
    dateOfBirth: "1988-12-25",
    gender: "Male",
    address: {
      street: "89, Koramangala",
      locality: "4th Block",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560034"
    },
    connections: {
      electricity: { consumerId: "KA07890123456", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G012345678", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W567890", status: "active" }
    },
    createdAt: "2024-01-08"
  },
  {
    id: "CIT007",
    name: "Deepika Nair",
    email: "deepika.nair@email.com",
    mobile: "+91-9876543216",
    aadhaarLast4: "6789",
    dateOfBirth: "1992-04-18",
    gender: "Female",
    address: {
      street: "34, Marine Drive",
      locality: "Ernakulam",
      city: "Kochi",
      state: "Kerala",
      pincode: "682031"
    },
    connections: {
      electricity: { consumerId: "KL04567890123", status: "active", sanctionedLoad: "3 kW" },
      gas: { bpNumber: "G345678901", provider: "Indian Oil", status: "pending" },
      water: { connectionId: "W678901", status: "active" }
    },
    createdAt: "2024-03-15"
  },
  {
    id: "CIT008",
    name: "Amit Joshi",
    email: "amit.joshi@email.com",
    mobile: "+91-9876543217",
    aadhaarLast4: "0123",
    dateOfBirth: "1980-08-05",
    gender: "Male",
    address: {
      street: "67, Civil Lines",
      locality: "Near Clock Tower",
      city: "Delhi",
      state: "Delhi",
      pincode: "110054"
    },
    connections: {
      electricity: { consumerId: "DL01234567890", status: "active", sanctionedLoad: "7 kW" },
      gas: { bpNumber: "G678901234", provider: "IGL", status: "active" },
      water: { connectionId: "W789012", status: "active" }
    },
    createdAt: "2024-02-01"
  },
  {
    id: "CIT009",
    name: "Kavita Deshmukh",
    email: "kavita.d@email.com",
    mobile: "+91-9876543218",
    aadhaarLast4: "4567",
    dateOfBirth: "1987-01-28",
    gender: "Female",
    address: {
      street: "12, Shivaji Nagar",
      locality: "FC Road",
      city: "Pune",
      state: "Gujarat",
      pincode: "411005"
    },
    connections: {
      electricity: { consumerId: "MH02345678901", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G901234567", provider: "MGL", status: "active" },
      water: { connectionId: "W890123", status: "active" }
    },
    createdAt: "2024-01-25"
  },
  {
    id: "CIT010",
    name: "Harpreet Kaur",
    email: "harpreet.kaur@email.com",
    mobile: "+91-9876543219",
    aadhaarLast4: "8901",
    dateOfBirth: "1995-06-10",
    gender: "Female",
    address: {
      street: "45, Model Town",
      locality: "Phase 2",
      city: "Ludhiana",
      state: "Punjab",
      pincode: "141002"
    },
    connections: {
      electricity: { consumerId: "PB03456789012", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G234567890", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W901234", status: "active" }
    },
    createdAt: "2024-03-01"
  },
  {
    id: "CIT011",
    name: "Sanjay Gupta",
    email: "sanjay.gupta@email.com",
    mobile: "+91-9876543220",
    aadhaarLast4: "2346",
    dateOfBirth: "1976-10-20",
    gender: "Male",
    address: {
      street: "78, Gomti Nagar",
      locality: "Sector 12",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226010"
    },
    connections: {
      electricity: { consumerId: "UP04567890123", status: "active", sanctionedLoad: "6 kW" },
      gas: { bpNumber: "G567890123", provider: "Green Gas", status: "active" },
      water: { connectionId: "W012345", status: "active" }
    },
    createdAt: "2024-02-15"
  },
  {
    id: "CIT012",
    name: "Meera Banerjee",
    email: "meera.b@email.com",
    mobile: "+91-9876543221",
    aadhaarLast4: "6790",
    dateOfBirth: "1983-02-14",
    gender: "Female",
    address: {
      street: "23, Salt Lake",
      locality: "Sector V",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091"
    },
    connections: {
      electricity: { consumerId: "WB05678901234", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G890123456", provider: "GAIL Gas", status: "pending" },
      water: { connectionId: "W123456", status: "active" }
    },
    createdAt: "2024-01-30"
  },
  {
    id: "CIT013",
    name: "Vikram Malhotra",
    email: "vikram.m@email.com",
    mobile: "+91-9876543222",
    aadhaarLast4: "0124",
    dateOfBirth: "1979-07-07",
    gender: "Male",
    address: {
      street: "56, Sector 17",
      locality: "Near Plaza",
      city: "Chandigarh",
      state: "Chandigarh",
      pincode: "160017"
    },
    connections: {
      electricity: { consumerId: "CH06789012345", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G123456780", provider: "IGL", status: "active" },
      water: { connectionId: "W234568", status: "active" }
    },
    createdAt: "2024-03-10"
  },
  {
    id: "CIT014",
    name: "Sunita Agarwal",
    email: "sunita.a@email.com",
    mobile: "+91-9876543223",
    aadhaarLast4: "4568",
    dateOfBirth: "1991-11-30",
    gender: "Female",
    address: {
      street: "89, Malviya Nagar",
      locality: "Near Metro",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302017"
    },
    connections: {
      electricity: { consumerId: "RJ07890123456", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G456789013", provider: "Rajasthan State Gas", status: "active" },
      water: { connectionId: "W345679", status: "active" }
    },
    createdAt: "2024-02-20"
  },
  {
    id: "CIT015",
    name: "Arjun Menon",
    email: "arjun.menon@email.com",
    mobile: "+91-9876543224",
    aadhaarLast4: "8902",
    dateOfBirth: "1986-04-25",
    gender: "Male",
    address: {
      street: "34, Vashi",
      locality: "Sector 17",
      city: "Surat",
      state: "Gujarat",
      pincode: "400703"
    },
    connections: {
      electricity: { consumerId: "MH08901234567", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G789012346", provider: "MGL", status: "active" },
      water: { connectionId: "W456780", status: "active" }
    },
    createdAt: "2024-01-12"
  },
  {
    id: "CIT016",
    name: "Pooja Choudhary",
    email: "pooja.c@email.com",
    mobile: "+91-9876543225",
    aadhaarLast4: "2347",
    dateOfBirth: "1993-08-16",
    gender: "Female",
    address: {
      street: "67, Banjara Hills",
      locality: "Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034"
    },
    connections: {
      electricity: { consumerId: "TS09012345678", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G012345679", provider: "Bhagyanagar Gas", status: "active" },
      water: { connectionId: "W567891", status: "active" }
    },
    createdAt: "2024-03-20"
  },
  {
    id: "CIT017",
    name: "Rahul Verma",
    email: "rahul.verma@email.com",
    mobile: "+91-9876543226",
    aadhaarLast4: "6791",
    dateOfBirth: "1984-12-03",
    gender: "Male",
    address: {
      street: "12, Arera Colony",
      locality: "E-5",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462016"
    },
    connections: {
      electricity: { consumerId: "MP00123456789", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G345678902", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W678902", status: "active" }
    },
    createdAt: "2024-02-08"
  },
  {
    id: "CIT018",
    name: "Neha Saxena",
    email: "neha.saxena@email.com",
    mobile: "+91-9876543227",
    aadhaarLast4: "0125",
    dateOfBirth: "1989-05-22",
    gender: "Female",
    address: {
      street: "45, Hazratganj",
      locality: "Near GPO",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226001"
    },
    connections: {
      electricity: { consumerId: "UP01234567891", status: "active", sanctionedLoad: "3 kW" },
      gas: { bpNumber: "G678901235", provider: "Green Gas", status: "active" },
      water: { connectionId: "W789013", status: "active" }
    },
    createdAt: "2024-01-18"
  },
  {
    id: "CIT019",
    name: "Karthik Subramanian",
    email: "karthik.s@email.com",
    mobile: "+91-9876543228",
    aadhaarLast4: "4569",
    dateOfBirth: "1981-09-08",
    gender: "Male",
    address: {
      street: "78, T. Nagar",
      locality: "Usman Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017"
    },
    connections: {
      electricity: { consumerId: "TN02345678902", status: "active", sanctionedLoad: "6 kW" },
      gas: { bpNumber: "G901234568", provider: "Indian Oil-Adani Gas", status: "active" },
      water: { connectionId: "W890124", status: "active" }
    },
    createdAt: "2024-03-25"
  },
  {
    id: "CIT020",
    name: "Divya Sharma",
    email: "divya.sharma@email.com",
    mobile: "+91-9876543229",
    aadhaarLast4: "8903",
    dateOfBirth: "1994-01-14",
    gender: "Female",
    address: {
      street: "23, Vastrapur",
      locality: "Near Lake",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380015"
    },
    connections: {
      electricity: { consumerId: "GJ03456789013", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G234567891", provider: "Gujarat Gas", status: "active" },
      water: { connectionId: "W901235", status: "active" }
    },
    createdAt: "2024-02-25"
  },
  {
    id: "CIT021",
    name: "Manish Tiwari",
    email: "manish.t@email.com",
    mobile: "+91-9876543230",
    aadhaarLast4: "2348",
    dateOfBirth: "1977-06-28",
    gender: "Male",
    address: {
      street: "56, Boring Road",
      locality: "Near Patna Junction",
      city: "Patna",
      state: "Bihar",
      pincode: "800001"
    },
    connections: {
      electricity: { consumerId: "BR04567890124", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G567890124", provider: "GAIL Gas", status: "pending" },
      water: { connectionId: "W012346", status: "active" }
    },
    createdAt: "2024-01-22"
  },
  {
    id: "CIT022",
    name: "Shreya Das",
    email: "shreya.das@email.com",
    mobile: "+91-9876543231",
    aadhaarLast4: "6792",
    dateOfBirth: "1996-03-19",
    gender: "Female",
    address: {
      street: "89, Park Street",
      locality: "Near Metro",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016"
    },
    connections: {
      electricity: { consumerId: "WB05678901235", status: "active", sanctionedLoad: "3 kW" },
      gas: { bpNumber: "G890123457", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W123457", status: "active" }
    },
    createdAt: "2024-03-12"
  },
  {
    id: "CIT023",
    name: "Ashok Yadav",
    email: "ashok.yadav@email.com",
    mobile: "+91-9876543232",
    aadhaarLast4: "0126",
    dateOfBirth: "1972-11-05",
    gender: "Male",
    address: {
      street: "34, Rajendra Nagar",
      locality: "Sector 4",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      pincode: "201002"
    },
    connections: {
      electricity: { consumerId: "UP06789012346", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G123456781", provider: "IGL", status: "active" },
      water: { connectionId: "W234569", status: "active" }
    },
    createdAt: "2024-02-05"
  },
  {
    id: "CIT024",
    name: "Ritu Kapoor",
    email: "ritu.kapoor@email.com",
    mobile: "+91-9876543233",
    aadhaarLast4: "4570",
    dateOfBirth: "1988-07-12",
    gender: "Female",
    address: {
      street: "67, Sector 62",
      locality: "Near IT Park",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201309"
    },
    connections: {
      electricity: { consumerId: "UP07890123457", status: "active", sanctionedLoad: "6 kW" },
      gas: { bpNumber: "G456789014", provider: "IGL", status: "active" },
      water: { connectionId: "W345670", status: "active" }
    },
    createdAt: "2024-01-28"
  },
  {
    id: "CIT025",
    name: "Santosh Mohanty",
    email: "santosh.m@email.com",
    mobile: "+91-9876543234",
    aadhaarLast4: "8904",
    dateOfBirth: "1985-02-08",
    gender: "Male",
    address: {
      street: "12, Saheed Nagar",
      locality: "Unit 4",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751007"
    },
    connections: {
      electricity: { consumerId: "OR08901234568", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G789012347", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W456781", status: "active" }
    },
    createdAt: "2024-03-08"
  },
  {
    id: "CIT026",
    name: "Anjali Mehta",
    email: "anjali.mehta@email.com",
    mobile: "+91-9876543235",
    aadhaarLast4: "2349",
    dateOfBirth: "1990-10-25",
    gender: "Female",
    address: {
      street: "45, CG Road",
      locality: "Near Stadium",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380006"
    },
    connections: {
      electricity: { consumerId: "GJ09012345679", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G012345680", provider: "Gujarat Gas", status: "active" },
      water: { connectionId: "W567892", status: "active" }
    },
    createdAt: "2024-02-18"
  },
  {
    id: "CIT027",
    name: "Prasad Kulkarni",
    email: "prasad.k@email.com",
    mobile: "+91-9876543236",
    aadhaarLast4: "6793",
    dateOfBirth: "1974-04-30",
    gender: "Male",
    address: {
      street: "78, Kothrud",
      locality: "Near MIT",
      city: "Pune",
      state: "Gujarat",
      pincode: "411038"
    },
    connections: {
      electricity: { consumerId: "MH00123456780", status: "active", sanctionedLoad: "5 kW" },
      gas: { bpNumber: "G345678903", provider: "MGL", status: "active" },
      water: { connectionId: "W678903", status: "active" }
    },
    createdAt: "2024-01-05"
  },
  {
    id: "CIT028",
    name: "Swati Jain",
    email: "swati.jain@email.com",
    mobile: "+91-9876543237",
    aadhaarLast4: "0127",
    dateOfBirth: "1997-08-18",
    gender: "Female",
    address: {
      street: "23, Indira Nagar",
      locality: "100 Feet Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038"
    },
    connections: {
      electricity: { consumerId: "KA01234567891", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G678901236", provider: "GAIL Gas", status: "active" },
      water: { connectionId: "W789014", status: "active" }
    },
    createdAt: "2024-03-18"
  },
  {
    id: "CIT029",
    name: "Devendra Chauhan",
    email: "devendra.c@email.com",
    mobile: "+91-9876543238",
    aadhaarLast4: "4571",
    dateOfBirth: "1982-12-10",
    gender: "Male",
    address: {
      street: "56, Vaishali Nagar",
      locality: "Near Temple",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302021"
    },
    connections: {
      electricity: { consumerId: "RJ02345678903", status: "active", sanctionedLoad: "6 kW" },
      gas: { bpNumber: "G901234569", provider: "Rajasthan State Gas", status: "active" },
      water: { connectionId: "W890125", status: "active" }
    },
    createdAt: "2024-02-12"
  },
  {
    id: "CIT030",
    name: "Nisha Pillai",
    email: "nisha.pillai@email.com",
    mobile: "+91-9876543239",
    aadhaarLast4: "8905",
    dateOfBirth: "1986-06-02",
    gender: "Female",
    address: {
      street: "89, Pattom",
      locality: "Near Secretariat",
      city: "Thiruvananthapuram",
      state: "Kerala",
      pincode: "695004"
    },
    connections: {
      electricity: { consumerId: "KL03456789014", status: "active", sanctionedLoad: "4 kW" },
      gas: { bpNumber: "G234567892", provider: "Indian Oil", status: "active" },
      water: { connectionId: "W901236", status: "active" }
    },
    createdAt: "2024-01-15"
  }
];

// Seed function
const seedCitizens = async () => {
  try {
    const db = mongoose.connection.db; // Get current db instance
    await db.collection('citizens').deleteMany({});
    await db.collection('citizens').insertMany(citizensData);
    console.log('✅ 30 Citizens seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding citizens:', error);
  }
};

export { citizensData, seedCitizens };
