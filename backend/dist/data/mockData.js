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
export function getCitizenByAadhaar(aadhaar) {
    return citizensByAadhaar.get(aadhaar) || null;
}
export function getCitizenById(id) {
    return citizensById.get(id) || null;
}
export function getComplaintsForUser(userId) {
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
export function addComplaint(complaint) {
    const newId = `CMP-2026-${String(mockComplaints.length + 1).padStart(3, '0')}`;
    const newComplaint = { ...complaint, id: newId };
    mockComplaints.push(newComplaint);
    return newComplaint;
}
// Update complaint status (for live testing)
export function updateComplaintStatus(id, status, assignedOfficerId) {
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
//# sourceMappingURL=mockData.js.map