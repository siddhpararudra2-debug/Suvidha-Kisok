/**
 * Shared Mock Data for SUVIDHA
 * This module provides consistent mock data across both Admin and Consumer portals
 * to enable testing of live data sync
 */

// ============ MOCK CITIZENS (5 Test Users with Aadhaar in Surat) ============
export const mockCitizens = [
    {
        id: 'USR001',
        aadhaar: '123456789012',
        name: 'Priya Sharma',
        mobile: '+91-9876543210',
        email: 'priya@example.com',
        aadhaarMasked: 'XXXX-XXXX-9012',
        address: '14/A, Athwa Lines, Near Parle Point',
        city: 'Surat',
        pincode: '395007',
        created_at: '2025-06-15T10:30:00Z',
        connections: {
            electricity: ['ELEC-GJ-123456789'],
            gas: ['GAS-GJ-987654'],
            water: ['WAT-GJ-456789'],
        },
    },
    {
        id: 'USR002',
        aadhaar: '234567890123',
        name: 'Rajesh Kumar',
        mobile: '+91-9876543211',
        email: 'rajesh@example.com',
        aadhaarMasked: 'XXXX-XXXX-0123',
        address: '45/B, Adajan, Near D-Mart',
        city: 'Surat',
        pincode: '395009',
        created_at: '2025-07-20T14:45:00Z',
        connections: {
            electricity: ['ELEC-GJ-234567890'],
            gas: ['GAS-GJ-876543'],
            water: ['WAT-GJ-345678'],
        },
    },
    {
        id: 'USR003',
        aadhaar: '345678901234',
        name: 'Anjali Patel',
        mobile: '+91-9876543212',
        email: 'anjali@example.com',
        aadhaarMasked: 'XXXX-XXXX-1234',
        address: '78/C, Vesu, Near VR Mall',
        city: 'Surat',
        pincode: '395007',
        created_at: '2025-08-10T09:15:00Z',
        connections: {
            electricity: ['ELEC-GJ-345678901'],
            gas: [],
            water: ['WAT-GJ-567890'],
        },
    },
    {
        id: 'USR004',
        aadhaar: '456789012345',
        name: 'Mohammed Khan',
        mobile: '+91-9876543213',
        email: 'mohammed@example.com',
        aadhaarMasked: 'XXXX-XXXX-2345',
        address: '23/D, Katargam, Near SVNIT',
        city: 'Surat',
        pincode: '395004',
        created_at: '2025-09-05T16:20:00Z',
        connections: {
            electricity: ['ELEC-GJ-456789012'],
            gas: ['GAS-GJ-765432'],
            water: ['WAT-GJ-678901'],
        },
    },
    {
        id: 'USR005',
        aadhaar: '567890123456',
        name: 'Sneha Reddy',
        mobile: '+91-9876543214',
        email: 'sneha@example.com',
        aadhaarMasked: 'XXXX-XXXX-3456',
        address: '56/E, Piplod, Near Science Center',
        city: 'Surat',
        pincode: '395007',
        created_at: '2025-10-12T11:00:00Z',
        connections: {
            electricity: ['ELEC-GJ-567890123'],
            gas: ['GAS-GJ-654321'],
            water: [],
        },
    },
    ...Array.from({ length: 25 }, (_, i) => {
        const firstNames = ['Vikram', 'Anjali', 'Ramesh', 'Pooja', 'Karan', 'Kavita', 'Suresh', 'Anita', 'Rahul', 'Neha', 'Vijay', 'Deepa', 'Sanjay', 'Meera', 'Arun'];
        const lastNames = ['Mehta', 'Desai', 'Chauhan', 'Bhagat', 'Trivedi', 'Gandhi', 'Joshi', 'Shah'];
        return {
            id: `USR${String(i + 6).padStart(3, '0')}`,
            aadhaar: `987654${String(i).padStart(6, '0')}`,
            name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
            mobile: `+91-9876543${String(i + 20).padStart(3, '0')}`,
            email: `citizen_${i + 6}@example.com`,
            aadhaarMasked: `XXXX-XXXX-${String(i).padStart(4, '0')}`,
            address: `Block ${i+1}, Surat Adajan/Vesu Limits`,
            city: 'Surat',
            pincode: '395009',
            created_at: `2025-11-${String(Math.max(1, i)).padStart(2, '0')}T10:30:00Z`,
            connections: {
                electricity: [`ELEC-GJ-${Math.floor(100000 + Math.random() * 900000)}`],
                gas: i % 2 === 0 ? [] : [`GAS-GJ-${Math.floor(100000 + Math.random() * 900000)}`],
                water: [`WAT-GJ-${Math.floor(100000 + Math.random() * 900000)}`],
            },
        };
    })
];

// Convert to Map for quick lookup by Aadhaar
export const citizensByAadhaar = new Map(mockCitizens.map(c => [c.aadhaar, c]));
export const citizensById = new Map(mockCitizens.map(c => [c.id, c]));

// ============ MOCK COMPLAINTS (Linked to Citizens - All in Surat) ============
export const mockComplaints = [
    {
        id: 'CMP-2026-001',
        user_id: 'USR001',
        type: 'electricity',
        category: 'Power Outage',
        subcategory: 'Complete Blackout',
        description: 'No power supply since 6 AM in our building. Transformer seems damaged.',
        priority: 'critical',
        status: 'in_progress',
        address: '14/A, Athwa Lines, Surat',
        latitude: 21.1702,
        longitude: 72.8311,
        assigned_officer_id: 'SUVIDHA-FIELD-001',
        estimated_resolution: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
    },
    {
        id: 'CMP-2026-002',
        user_id: 'USR002',
        type: 'water',
        category: 'Water Supply',
        subcategory: 'Low Pressure',
        description: 'Very low water pressure on 3rd floor since last week.',
        priority: 'medium',
        status: 'assigned',
        address: '45/B, Adajan, Near D-Mart, Surat',
        latitude: 21.1959,
        longitude: 72.7933,
        assigned_officer_id: 'SUVIDHA-FIELD-002',
        estimated_resolution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
    },
    {
        id: 'CMP-2026-003',
        user_id: 'USR003',
        type: 'gas',
        category: 'Gas Leak',
        subcategory: 'Minor Leak',
        description: 'Slight gas smell near the meter box.',
        priority: 'high',
        status: 'registered',
        address: '78/C, Vesu, Near VR Mall, Surat',
        latitude: 21.1456,
        longitude: 72.7611,
        assigned_officer_id: null,
        estimated_resolution: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
    },
    {
        id: 'CMP-2026-004',
        user_id: 'USR004',
        type: 'electricity',
        category: 'Billing',
        subcategory: 'Incorrect Bill',
        description: 'Bill amount is double the usual. Meter reading seems wrong.',
        priority: 'low',
        status: 'resolved',
        address: '23/D, Katargam, Near SVNIT, Surat',
        latitude: 21.1818,
        longitude: 72.7880,
        assigned_officer_id: 'SUVIDHA-FIELD-003',
        estimated_resolution: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        resolved_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'CMP-2026-005',
        user_id: 'USR005',
        type: 'water',
        category: 'Water Quality',
        subcategory: 'Contamination',
        description: 'Water has yellowish color and bad smell.',
        priority: 'high',
        status: 'in_progress',
        address: '56/E, Piplod, Near Science Center, Surat',
        latitude: 21.1612,
        longitude: 72.7712,
        assigned_officer_id: 'SUVIDHA-FIELD-004',
        estimated_resolution: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
    },
    {
        id: 'CMP-2026-006',
        user_id: 'USR001',
        type: 'electricity',
        category: 'Street Light',
        subcategory: 'Not Working',
        description: 'Street light outside building not working for 2 weeks.',
        priority: 'low',
        status: 'registered',
        address: '14/A, Athwa Lines, Surat',
        latitude: 21.1690,
        longitude: 72.8300,
        assigned_officer_id: null,
        estimated_resolution: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
    },
];

// ============ MOCK KIOSKS (All in Surat) ============
export const mockKiosks = [
    { id: 'KIOSK001', location: 'Athwa Gate, Surat', lat: 21.1702, lng: 72.8311, status: 'online', heartbeat: '2 min ago', txns: 247, uptime: 99.2, software_version: 'v2.1.5' },
    { id: 'KIOSK002', location: 'Surat Railway Station', lat: 21.2051, lng: 72.8399, status: 'online', heartbeat: '1 min ago', txns: 189, uptime: 98.7, software_version: 'v2.1.5' },
    { id: 'KIOSK003', location: 'SMC Main Office, Muglisara', lat: 21.1970, lng: 72.8200, status: 'offline', heartbeat: '3 hrs ago', txns: 0, uptime: 87.5, software_version: 'v2.1.4' },
    { id: 'KIOSK004', location: 'Adajan Municipal Hospital', lat: 21.1959, lng: 72.7933, status: 'online', heartbeat: '30 sec ago', txns: 156, uptime: 99.8, software_version: 'v2.1.5' },
    { id: 'KIOSK005', location: 'VR Mall, Vesu', lat: 21.1456, lng: 72.7611, status: 'online', heartbeat: '1 min ago', txns: 312, uptime: 99.5, software_version: 'v2.1.5' },
    { id: 'KIOSK006', location: 'Surat Airport', lat: 21.1143, lng: 72.7418, status: 'online', heartbeat: '45 sec ago', txns: 98, uptime: 99.1, software_version: 'v2.1.5' },
];

// ============ HELPER FUNCTIONS ============
export function getCitizenByAadhaar(aadhaar: string) {
    return citizensByAadhaar.get(aadhaar) || null;
}

export function getCitizenById(id: string) {
    return citizensById.get(id) || null;
}

export function getComplaintsForUser(userId: string) {
    return mockComplaints.filter(c => c.user_id === userId);
}

export function getAllComplaints() {
    return mockComplaints;
}

export function getAllCitizens() {
    return mockCitizens;
}

export function getAllKiosks() {
    return mockKiosks;
}

// Add a new complaint (for live testing)
export function addComplaint(complaint: Omit<typeof mockComplaints[0], 'id'>) {
    const newId = `CMP-2026-${String(mockComplaints.length + 1).padStart(3, '0')}`;
    const newComplaint = { ...complaint, id: newId };
    mockComplaints.push(newComplaint as any);
    return newComplaint;
}

// Update complaint status (for live testing)
export function updateComplaintStatus(id: string, status: string, assignedOfficerId?: string) {
    const complaint = mockComplaints.find(c => c.id === id);
    if (complaint) {
        complaint.status = status;
        complaint.updated_at = new Date().toISOString();
        if (assignedOfficerId) {
            complaint.assigned_officer_id = assignedOfficerId;
        }
        if (status === 'resolved') {
            complaint.resolved_at = new Date().toISOString();
        }
    }
    return complaint;
}

export const mockOfficials = Array.from({ length: 30 }, (_, i) => {
    const departments = ['Water Supply', 'Solid Waste', 'Health', 'Town Planning', 'Fire & Emergency', 'Light & Power', 'Drainage', 'Property Tax', 'Slum Improvement', 'Parks & Gardens'];
    const designations = ['Executive Engineer', 'Assistant Commissioner', 'Zonal Chief', 'Superintendent', 'Inspector', 'Deputy Health Officer', 'Town Planner', 'Tax Assessor', 'Chief Fire Officer', 'Horticulturist'];
    const names = ['Rajesh', 'Suresh', 'Amit', 'Priya', 'Neha', 'Vikram', 'Anjali', 'Kiran', 'Rakesh', 'Meera', 'Sunil', 'Kavita', 'Manoj', 'Deepa', 'Sanjay', 'Pooja', 'Ramesh', 'Aarti', 'Mukesh', 'Sheetal', 'Dinesh', 'Swati', 'Prakash', 'Mamta', 'Hitesh', 'Bhavna', 'Girish', 'Varsha', 'Ketan', 'Chetna'];
    const surnames = ['Patel', 'Shah', 'Desai', 'Mehta', 'Chauhan', 'Parikh', 'Bhatt', 'Trivedi', 'Joshi', 'Chaudhary'];

    const dept = departments[i % departments.length];
    const n = names[i];
    const s = surnames[i % surnames.length];

    return {
        id: `EMP-${2026}${String(i + 1).padStart(3, '0')}`,
        name: `${n} ${s}`,
        department: dept,
        designation: designations[i % designations.length],
        contact: `+91-98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        email: `${n.toLowerCase()}.${s.toLowerCase()}@${dept.toLowerCase().replace(/ & /g, '').replace(' ', '')}.surat.gov.in`,
        status: i % 5 === 0 ? 'On Leave' : 'Active'
    };
});

export const mockSchemes = [
    {
        id: 'SCH-001',
        title: 'Mukhyamantri Amrutam (MA) Yojana',
        category: 'Health',
        beneficiaries: 1250000,
        status: 'Active',
        description: 'Health insurance scheme for families below the poverty line.',
        eligibility: 'BPL families',
        benefits: 'Up to Rs. 5 Lakh medical coverage',
    },
    {
        id: 'SCH-002',
        title: 'Vidyalakshmi Scheme',
        category: 'Education',
        beneficiaries: 850000,
        status: 'Active',
        description: 'Encouraging girls education through financial assistance.',
        eligibility: 'Girl students passing standard 8',
        benefits: 'Narmada Nidhi bond of Rs. 2000',
    },
    {
        id: 'SCH-003',
        title: 'Kisan Suryodaya Yojana',
        category: 'Agriculture',
        beneficiaries: 340000,
        status: 'Active',
        description: 'Daytime power supply for farmers for irrigation.',
        eligibility: 'Farmers in Gujarat',
        benefits: '16 hours of daytime electricity',
    },
    {
        id: 'SCH-004',
        title: 'Vahali Dikri Yojana',
        category: 'Welfare',
        beneficiaries: 420000,
        status: 'Active',
        description: 'Financial assistance for the birth and education of a girl child.',
        eligibility: 'First two girl children of a family',
        benefits: 'Financial assistance up to Rs. 1.10 Lakh',
    },
    {
        id: 'SCH-005',
        title: 'Surya Gujarat Scheme',
        category: 'Energy',
        beneficiaries: 180000,
        status: 'Active',
        description: 'Subsidy for installing rooftop solar panels.',
        eligibility: 'Residential property owners',
        benefits: 'Up to 40% subsidy on solar installation',
    },
    {
        id: 'SCH-006',
        title: 'Shravan Tirthdarshan Yojana',
        category: 'Social Welfare',
        beneficiaries: 250000,
        status: 'Active',
        description: 'Assistance for senior citizens for visiting pilgrimage sites.',
        eligibility: 'Senior citizens of Gujarat (60+)',
        benefits: '75% bus fare subsidy for group travel',
    },
    {
        id: 'SCH-007',
        title: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY)',
        category: 'Education',
        beneficiaries: 120000,
        status: 'Active',
        description: 'Scholarship for meritorious students from low income families.',
        eligibility: 'Students with 80+ percentile in 10th/12th',
        benefits: 'Fee reimbursement and hostel allowance',
    },
    {
        id: 'SCH-008',
        title: 'GOG-SMC Housing Scheme',
        category: 'Housing',
        beneficiaries: 75000,
        status: 'Active',
        description: 'Affordable housing for EWS and LIG categories in Surat.',
        eligibility: 'Residents of Surat with verified income',
        benefits: 'Subsidy up to Rs 2.5 Lakh for home purchase',
    },
    {
        id: 'SCH-009',
        title: 'Garib Kalyan Mela',
        category: 'Livelihood',
        beneficiaries: 2000000,
        status: 'Active',
        description: 'Providing direct benefits and tools to rural and urban poor.',
        eligibility: 'BPL and low-income individuals',
        benefits: 'Equipment, tools, and direct cash transfers',
    },
    {
        id: 'SCH-010',
        title: 'Manav Garima Scheme',
        category: 'Employment',
        beneficiaries: 55000,
        status: 'Active',
        description: 'Equipment kits for micro-entrepreneurs and artisans.',
        eligibility: 'Registered artisans and small traders',
        benefits: 'Free toolkits worth Rs. 15,000 for self-employment',
    }
];

export const mockInfrastructure = [
    { id: 'SUB-SRT-01', name: 'Sarthana Main Substation', type: 'substation', service: 'electricity', capacity: '2×50 MVA', currentLoad: 72, status: 'operational', lastMaintenance: '2025-12-15', nextMaintenance: '2026-03-15', location: 'Sarthana' },
    { id: 'TRF-ADJ-05', name: 'Distribution Transformer #05', type: 'transformer', service: 'electricity', capacity: '630 KVA', currentLoad: 85, status: 'operational', lastMaintenance: '2026-01-10', nextMaintenance: '2026-04-10', location: 'Adajan' },
    { id: 'PMP-AMR-01', name: 'Amroli Water Works', type: 'pump_station', service: 'water', capacity: '1500 KL/hr', currentLoad: 68, status: 'operational', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', location: 'Amroli' },
    { id: 'GAS-HAZ-01', name: 'Hazira HP Storage', type: 'gas_station', service: 'gas', capacity: '50000 SCMD', currentLoad: 55, status: 'operational', lastMaintenance: '2025-11-20', nextMaintenance: '2026-02-20', location: 'Hazira Industrial' },
    { id: 'SUB-VES-02', name: 'Vesu Sub-Station', type: 'substation', service: 'electricity', capacity: '20 MVA', currentLoad: 45, status: 'maintenance', lastMaintenance: '2026-01-28', nextMaintenance: '2026-02-05', location: 'Vesu' },
];

export const mockApplications = [
    { id: 'APP-SRT-001', citizenName: 'Rajesh Kumar', type: 'new_connection', service: 'electricity', status: 'pending', submittedAt: '2026-02-20T10:30:00Z', priority: 'medium', address: 'Adajan, Surat' },
    { id: 'APP-SRT-002', citizenName: 'Priya Sharma', type: 'transfer', service: 'water', status: 'approved', submittedAt: '2026-02-19T14:15:00Z', priority: 'low', address: 'Vesu, Surat' },
    { id: 'APP-SRT-003', citizenName: 'Amit Patel', type: 'new_connection', service: 'gas', status: 'under_review', submittedAt: '2026-02-21T09:00:00Z', priority: 'high', address: 'Varachha, Surat' },
    { id: 'APP-SRT-004', citizenName: 'Sunita Devi', type: 'meter_change', service: 'electricity', status: 'pending', submittedAt: '2026-02-22T16:45:00Z', priority: 'medium', address: 'Rander, Surat' },
    { id: 'APP-SRT-005', citizenName: 'Mohammed Ali', type: 'disconnection', service: 'gas', status: 'rejected', submittedAt: '2026-02-18T11:20:00Z', priority: 'low', address: 'Katargam, Surat' },
];

export const mockAnnouncements = [
    { id: 'CNT-001', title: 'Water Supply Schedule Update', type: 'announcement', status: 'published', author: 'Admin', createdAt: '2026-02-20T10:00:00Z', content: 'Updated water supply timings for ward 5-12 in Surat.' },
    { id: 'CNT-002', title: 'Gas Safety Guidelines', type: 'notice', status: 'published', author: 'Safety Dept', createdAt: '2026-02-18T14:30:00Z', content: 'New safety protocols for PNG connections in Hazira.' },
    { id: 'CNT-003', title: 'Electricity Rate Revision', type: 'announcement', status: 'draft', author: 'Admin', createdAt: '2026-02-22T09:15:00Z', content: 'Proposed rate changes for domestic consumers in Surat South.' },
];

export const systemSettings = {
    sessionTimeout: 3,
    maxLoginAttempts: 5,
    maintenanceMode: false,
    notificationsEnabled: true,
    autoAssignComplaints: true,
    slaWarningDays: 3,
    slaEscalationDays: 7,
    defaultLanguage: 'en',
    kioskIdleTimeout: 180,
    backupFrequency: 'daily',
};
