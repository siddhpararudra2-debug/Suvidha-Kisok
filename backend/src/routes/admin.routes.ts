import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool, query } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getAllCitizens, getAllComplaints, getAllKiosks, updateComplaintStatus, mockComplaints } from '../data/mockData.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'suvidha-secret-key-change-in-production';

// Validation Schemas
const loginSchema = z.object({
    employeeId: z.string().min(1),
    password: z.string().min(1),
    otp: z.string().optional()
});

const updateComplaintSchema = z.object({
    status: z.string().optional(),
    comment: z.string().optional(),
    assignedTo: z.string().optional()
});

// ===== In-Memory Audit Log =====
interface AuditEntry {
    id: string;
    timestamp: string;
    employeeId: string;
    employeeName: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    ip: string;
}
const auditLog: AuditEntry[] = [];

function addAuditEntry(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    auditLog.unshift({
        id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...entry,
    });
    // Keep last 200 entries
    if (auditLog.length > 200) auditLog.length = 200;
}

// ===== Bcrypt-hashed mock admin passwords =====
// Pre-computed hashes: Admin@123, District@123, admin123
const HASH_ADMIN = bcrypt.hashSync('Admin@123', 10);
const HASH_DISTRICT = bcrypt.hashSync('District@123', 10);
const HASH_ADMIN2 = bcrypt.hashSync('admin123', 10);

const mockAdminUsers = [
    { employee_id: 'SUVIDHA-ADMIN-001', name: 'Super Admin', role: 'super_admin', department: 'IT', designation: 'System Administrator', permissions: ['all'], is_active: true, password_hash: HASH_ADMIN },
    { employee_id: 'SUVIDHA-DIST-001', name: 'District Collector', role: 'district_officer', department: 'Administration', designation: 'District Collector', permissions: ['complaints', 'reports', 'kiosks'], is_active: true, password_hash: HASH_DISTRICT },
    { employee_id: 'admin', name: 'Admin', role: 'admin', department: 'IT', designation: 'Admin', permissions: ['all'], is_active: true, password_hash: HASH_ADMIN2 },
];

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { employeeId, password, otp } = loginSchema.parse(req.body);

        let admin: any = null;

        // Try database first
        try {
            const result = await pool.query('SELECT * FROM admin_users WHERE employee_id = $1', [employeeId]);
            admin = result.rows[0];

            if (admin) {
                // Verify password from DB
                const isMatch = await bcrypt.compare(password, admin.password_hash);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
            }
        } catch (dbError: any) {
            // Database not available, use mock users with bcrypt
            logger.warn('Database not available, using mock login');
            const mockUser = mockAdminUsers.find(u => u.employee_id === employeeId);
            if (mockUser && await bcrypt.compare(password, mockUser.password_hash)) {
                admin = { ...mockUser };
                delete (admin as any).password_hash;
            }
        }

        if (!admin) {
            // Final fallback: check mock users with bcrypt
            const mockUser = mockAdminUsers.find(u => u.employee_id === employeeId);
            if (mockUser && await bcrypt.compare(password, mockUser.password_hash)) {
                admin = { ...mockUser };
                delete (admin as any).password_hash;
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }

        if (!admin.is_active) {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        // Generate Token
        const token = jwt.sign(
            {
                userId: admin.employee_id,
                role: admin.role,
                department: admin.department,
                permissions: admin.permissions
            },
            JWT_SECRET,
            { expiresIn: '30m' }
        );

        // Audit log: login
        addAuditEntry({
            employeeId: admin.employee_id,
            employeeName: admin.name,
            action: 'LOGIN',
            entityType: 'SESSION',
            entityId: admin.employee_id,
            details: 'Admin logged in successfully',
            ip: req.ip || 'unknown',
        });

        // Try DB audit log too
        try {
            await pool.query(
                `INSERT INTO admin_audit_logs (employee_id, action, ip_address) VALUES ($1, $2, $3)`,
                [admin.employee_id, 'LOGIN', req.ip]
            );
        } catch (logError) { /* ignore */ }

        // Remove password from response
        delete admin.password_hash;

        res.json({
            success: true,
            token,
            user: admin
        });

    } catch (error) {
        logger.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Middleware to verify Admin Token
const verifyAdmin = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.use(verifyAdmin);

// ===== RBAC Middleware =====
function requireRole(...roles: string[]) {
    return (req: any, res: any, next: any) => {
        const userRole = req.user?.role;
        const userPerms = req.user?.permissions || [];
        if (userPerms.includes('all') || roles.includes(userRole)) {
            return next();
        }
        return res.status(403).json({ error: 'Insufficient permissions', required: roles, your_role: userRole });
    };
}

// ===== Audit Log API =====
router.get('/audit-log', requireRole('super_admin', 'admin'), (req, res) => {
    const { limit = 50, action } = req.query;
    let logs = [...auditLog];
    if (action && action !== 'all') {
        logs = logs.filter(l => l.action === action);
    }
    res.json(logs.slice(0, Number(limit)));
});

// Dashboard Stats (with fallback to shared mock data)
router.get('/dashboard/stats', async (req, res) => {
    try {
        // Try database first
        const complaints = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE date_trunc('day', created_at) = CURRENT_DATE) as today
            FROM complaints
        `);

        const applications = await pool.query(`
            SELECT COUNT(*) as pending FROM connections WHERE status = 'pending'
        `);

        const kiosks = getAllKiosks();
        const revenue = { total: 1280000, growth: 8 };

        res.json({
            complaints: {
                today: parseInt(complaints.rows[0].today || 0),
                total: parseInt(complaints.rows[0].total || 0),
                growth: 12
            },
            applications: {
                pending: parseInt(applications.rows[0].pending || 0),
                overdue: 23
            },
            kiosks: {
                total: kiosks.length,
                online: kiosks.filter((k: any) => k.status === 'online').length,
                offline: kiosks.filter((k: any) => k.status === 'offline').length
            },
            revenue: revenue,
            sla: 87
        });
    } catch (dbError) {
        // Database not available - use shared mock data for live stats
        logger.warn('Database unavailable, using shared mock data for dashboard stats');

        const allComplaints = getAllComplaints();
        const kiosks = getAllKiosks();
        const citizens = getAllCitizens();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayComplaints = allComplaints.filter((c: any) => new Date(c.created_at) >= todayStart);

        res.json({
            complaints: {
                today: todayComplaints.length,
                total: allComplaints.length,
                active: allComplaints.filter((c: any) => !['resolved', 'closed'].includes(c.status)).length,
                growth: 12
            },
            applications: {
                pending: 15,
                overdue: 3
            },
            kiosks: {
                total: kiosks.length,
                online: kiosks.filter((k: any) => k.status === 'online').length,
                offline: kiosks.filter((k: any) => k.status === 'offline').length
            },
            citizens: {
                total: citizens.length
            },
            revenue: { total: 1280000, growth: 8 },
            sla: 87
        });
    }
});

// Get Complaints (with fallback to shared mock data for live sync)
router.get('/complaints', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        let queryText = 'SELECT * FROM complaints';
        const params = [];

        if (status) {
            queryText += ' WHERE status = $1';
            params.push(status);
        }

        queryText += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
        params.push(limit);

        const result = await pool.query(queryText, params);
        if (result.rows.length > 0) {
            res.json(result.rows);
            return;
        }
    } catch (dbError) {
        // Database not available, fall through to mock data
        logger.warn('Database unavailable, using shared mock data for complaints');
    }

    // Fallback to shared mock data (synced with consumer portal)
    const { status } = req.query;
    let complaints = getAllComplaints();
    if (status && status !== 'all') {
        complaints = complaints.filter((c: any) => c.status === status);
    }
    res.json(complaints);
});

// Update Complaint
router.put('/complaints/:id/update', async (req: any, res) => {
    try {
        const { id } = req.params;
        const { status, comment, assignedTo } = updateComplaintSchema.parse(req.body);
        const employeeId = req.user.userId;

        // Update shared mock data (Real-time sync to consumer portal)
        const mockComplaint = mockComplaints.find((c: any) => c.id === id);
        if (mockComplaint) {
            if (status) (mockComplaint as any).status = status;
            if (assignedTo) (mockComplaint as any).assigned_officer_id = assignedTo;
            (mockComplaint as any).updated_at = new Date().toISOString();

            // If resolved, set resolved_at
            if (status === 'resolved') {
                (mockComplaint as any).resolved_at = new Date().toISOString();
            }
            // If reopened, clear resolved_at
            if (status === 'in_progress' || status === 'assigned') {
                (mockComplaint as any).resolved_at = null;
            }

            console.log(`✅ Synced update for ${id} to mock data: Status=${status}, Assigned=${assignedTo}`);
        }

        // Audit log: complaint update
        addAuditEntry({
            employeeId: employeeId,
            employeeName: req.user?.role || 'admin',
            action: 'UPDATE_COMPLAINT',
            entityType: 'COMPLAINT',
            entityId: id,
            details: `Status: ${status || 'unchanged'}, Assigned: ${assignedTo || 'unchanged'}, Comment: ${comment || 'none'}`,
            ip: req.ip || 'unknown',
        });

        // Try database update
        try {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                if (status) {
                    await client.query('UPDATE complaints SET status = $1 WHERE id = $2', [status, id]);
                }
                if (assignedTo) {
                    await client.query('UPDATE complaints SET assigned_officer_id = $1 WHERE id = $2', [assignedTo, id]);
                }

                if (comment || status) {
                    await client.query(
                        'INSERT INTO complaint_updates (complaint_id, status, message, updated_by) VALUES ($1, $2, $3, $4)',
                        [id, status, comment, employeeId]
                    );
                }

                await client.query(
                    `INSERT INTO admin_audit_logs (employee_id, action, entity_type, entity_id, changes) VALUES ($1, $2, 'COMPLAINT', $3, $4)`,
                    [employeeId, 'UPDATE_COMPLAINT', id, JSON.stringify({ status, assignedTo, comment })]
                );

                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                // Don't throw here if we want to fallback to mock data only
                logger.warn('Database update failed, but mock data updated:', e);
            } finally {
                client.release();
            }
        } catch (dbError) {
            logger.warn('Database unavailable, using mock data only');
        }

        res.json({ success: true, message: 'Complaint updated successfully' });
    } catch (error) {
        logger.error('Update complaint error:', error);
        res.status(500).json({ error: 'Failed to update complaint' });
    }
});

// Basic Kiosks - now using shared data
router.get('/kiosks', async (req, res) => {
    // Return shared mock data with real-time info
    res.json(getAllKiosks());
});

// Get all citizens - for admin to monitor all users
router.get('/citizens', async (req, res) => {
    try {
        // Try database first
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        if (result.rows.length > 0) {
            res.json(result.rows);
            return;
        }
    } catch (dbError) {
        // Database not available, use mock data
    }
    // Return shared mock citizens (includes new registrations)
    res.json(getAllCitizens());
});

// Get all complaints (with fallback to shared mock data)
router.get('/all-complaints', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM complaints ORDER BY created_at DESC');
        if (result.rows.length > 0) {
            res.json(result.rows);
            return;
        }
    } catch (dbError) {
        // Database not available
    }
    // Return shared mock complaints
    res.json(getAllComplaints());
});

// ===== Applications Management =====
const mockApplications = [
    { id: 'APP-001', citizenName: 'Rajesh Kumar', type: 'new_connection', service: 'electricity', status: 'pending', submittedAt: '2026-02-20T10:30:00Z', priority: 'medium', address: 'Adajan, Surat' },
    { id: 'APP-002', citizenName: 'Priya Sharma', type: 'transfer', service: 'water', status: 'approved', submittedAt: '2026-02-19T14:15:00Z', priority: 'low', address: 'Vesu, Surat' },
    { id: 'APP-003', citizenName: 'Amit Patel', type: 'new_connection', service: 'gas', status: 'under_review', submittedAt: '2026-02-21T09:00:00Z', priority: 'high', address: 'Varachha, Surat' },
    { id: 'APP-004', citizenName: 'Sunita Devi', type: 'meter_change', service: 'electricity', status: 'pending', submittedAt: '2026-02-22T16:45:00Z', priority: 'medium', address: 'Rander, Surat' },
    { id: 'APP-005', citizenName: 'Mohammed Ali', type: 'disconnection', service: 'gas', status: 'rejected', submittedAt: '2026-02-18T11:20:00Z', priority: 'low', address: 'Katargam, Surat' },
];

router.get('/applications', (req, res) => {
    const { status, service } = req.query;
    let apps = [...mockApplications];
    if (status && status !== 'all') apps = apps.filter(a => a.status === status);
    if (service && service !== 'all') apps = apps.filter(a => a.service === service);
    res.json(apps);
});

router.patch('/applications/:id', requireRole('super_admin', 'admin', 'dept_admin'), (req: any, res) => {
    const { id } = req.params;
    const app = mockApplications.find(a => a.id === id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    const { status, priority } = req.body;
    if (status) app.status = status;
    if (priority) app.priority = priority;

    addAuditEntry({
        employeeId: req.user?.userId || 'unknown',
        employeeName: req.user?.role || 'admin',
        action: 'UPDATE_APPLICATION',
        entityType: 'APPLICATION',
        entityId: id,
        details: `Status: ${status || 'unchanged'}, Priority: ${priority || 'unchanged'}`,
        ip: req.ip || 'unknown',
    });

    res.json({ success: true, application: app });
});

// ===== Infrastructure Monitoring =====
const mockInfrastructure = [
    { id: 'INF-001', name: 'Adajan Substation', type: 'electricity', status: 'operational', capacity: '85%', lastMaintenance: '2026-01-15', nextMaintenance: '2026-04-15', location: { lat: 21.1959, lng: 72.7933 } },
    { id: 'INF-002', name: 'Varachha Water Plant', type: 'water', status: 'operational', capacity: '72%', lastMaintenance: '2026-02-01', nextMaintenance: '2026-05-01', location: { lat: 21.2089, lng: 72.8577 } },
    { id: 'INF-003', name: 'Katargam Gas Station', type: 'gas', status: 'maintenance', capacity: '0%', lastMaintenance: '2026-02-20', nextMaintenance: '2026-02-28', location: { lat: 21.2267, lng: 72.8312 } },
    { id: 'INF-004', name: 'Udhna Power Grid', type: 'electricity', status: 'operational', capacity: '91%', lastMaintenance: '2026-01-25', nextMaintenance: '2026-04-25', location: { lat: 21.1702, lng: 72.8411 } },
    { id: 'INF-005', name: 'Vesu Pipeline Hub', type: 'gas', status: 'operational', capacity: '68%', lastMaintenance: '2025-12-10', nextMaintenance: '2026-03-10', location: { lat: 21.1553, lng: 72.7717 } },
];

router.get('/infrastructure', (req, res) => {
    const { type, status } = req.query;
    let infra = [...mockInfrastructure];
    if (type && type !== 'all') infra = infra.filter(i => i.type === type);
    if (status && status !== 'all') infra = infra.filter(i => i.status === status);
    res.json(infra);
});

// ===== Reports & Analytics =====
router.get('/reports', (req, res) => {
    const allComplaints = getAllComplaints();
    const kiosks = getAllKiosks();
    const citizens = getAllCitizens();

    const reportData = {
        summary: {
            totalComplaints: allComplaints.length,
            resolvedComplaints: allComplaints.filter((c: any) => c.status === 'resolved').length,
            activeComplaints: allComplaints.filter((c: any) => !['resolved', 'closed'].includes(c.status)).length,
            totalCitizens: citizens.length,
            totalKiosks: kiosks.length,
            onlineKiosks: kiosks.filter((k: any) => k.status === 'online').length,
            avgResolutionTime: '2.5 days',
            slaCompliance: 87,
        },
        complaintsByType: [
            { type: 'electricity', count: allComplaints.filter((c: any) => c.type === 'electricity').length },
            { type: 'water', count: allComplaints.filter((c: any) => c.type === 'water').length },
            { type: 'gas', count: allComplaints.filter((c: any) => c.type === 'gas').length },
            { type: 'roads', count: allComplaints.filter((c: any) => c.type === 'roads').length },
        ],
        monthlyTrend: [
            { month: 'Sep', complaints: 42, resolved: 38 },
            { month: 'Oct', complaints: 55, resolved: 50 },
            { month: 'Nov', complaints: 48, resolved: 45 },
            { month: 'Dec', complaints: 60, resolved: 52 },
            { month: 'Jan', complaints: 53, resolved: 48 },
            { month: 'Feb', complaints: allComplaints.length, resolved: allComplaints.filter((c: any) => c.status === 'resolved').length },
        ],
        revenueByService: [
            { service: 'Electricity', amount: 580000 },
            { service: 'Water', amount: 320000 },
            { service: 'Gas', amount: 250000 },
            { service: 'Others', amount: 130000 },
        ],
    };

    res.json(reportData);
});

// ===== Content Management =====
let mockContent = [
    { id: 'CNT-001', title: 'Water Supply Schedule Update', type: 'announcement', status: 'published', author: 'Admin', createdAt: '2026-02-20T10:00:00Z', content: 'Updated water supply timings for ward 5-12.' },
    { id: 'CNT-002', title: 'Gas Safety Guidelines', type: 'notice', status: 'published', author: 'Safety Dept', createdAt: '2026-02-18T14:30:00Z', content: 'New safety protocols for PNG connections.' },
    { id: 'CNT-003', title: 'Electricity Rate Revision', type: 'announcement', status: 'draft', author: 'Admin', createdAt: '2026-02-22T09:15:00Z', content: 'Proposed rate changes for domestic consumers.' },
];

router.get('/content', (req, res) => {
    res.json(mockContent);
});

router.post('/content', (req, res) => {
    const { title, type, content, status } = req.body;
    const newContent = {
        id: `CNT-${String(mockContent.length + 1).padStart(3, '0')}`,
        title: title || 'Untitled',
        type: type || 'announcement',
        status: status || 'draft',
        author: 'Admin',
        createdAt: new Date().toISOString(),
        content: content || '',
    };
    mockContent.push(newContent);
    res.status(201).json({ success: true, content: newContent });
});

// ===== Settings =====
let systemSettings = {
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

router.get('/settings', (req, res) => {
    res.json(systemSettings);
});

router.put('/settings', requireRole('super_admin', 'admin'), (req: any, res) => {
    const oldSettings = { ...systemSettings };
    systemSettings = { ...systemSettings, ...req.body };

    addAuditEntry({
        employeeId: req.user?.userId || 'unknown',
        employeeName: req.user?.role || 'admin',
        action: 'UPDATE_SETTINGS',
        entityType: 'SETTINGS',
        entityId: 'system',
        details: `Changed: ${Object.keys(req.body).join(', ')}`,
        ip: req.ip || 'unknown',
    });

    res.json({ success: true, settings: systemSettings });
});

// ===== Utility Data =====
router.get('/utility-data', (req, res) => {
    const utilityData = {
        electricity: {
            totalConnections: 185400,
            activeConnections: 178200,
            totalRevenue: 58000000,
            avgConsumption: '245 kWh',
            outages: 3,
            distribuntionLoss: '8.2%',
        },
        water: {
            totalConnections: 142000,
            activeConnections: 138500,
            totalRevenue: 32000000,
            avgConsumption: '15 KL',
            supplyHours: 18,
            qualityIndex: 92,
        },
        gas: {
            totalConnections: 98000,
            activeConnections: 95200,
            totalRevenue: 25000000,
            avgConsumption: '12 SCM',
            pngPrice: 32.5,
            cngPrice: 78.9,
        },
    };
    res.json(utilityData);
});

export default router;
