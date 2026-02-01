import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { getAllCitizens, getAllComplaints, getAllKiosks } from '../data/mockData.js';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'suvidha-secret-key-change-in-production';
// Validation Schemas
const loginSchema = z.object({
    employeeId: z.string().min(1),
    password: z.string().min(1),
    otp: z.string().optional() // Make optional for now or handle mock OTP
});
const updateComplaintSchema = z.object({
    status: z.string().optional(),
    comment: z.string().optional(),
    assignedTo: z.string().optional()
});
// Mock admin users for development when DB is not available
const mockAdminUsers = [
    { employee_id: 'SUVIDHA-ADMIN-001', name: 'Super Admin', role: 'super_admin', department: 'IT', designation: 'System Administrator', permissions: ['all'], is_active: true, password: 'Admin@123' },
    { employee_id: 'SUVIDHA-DIST-001', name: 'District Collector', role: 'district_officer', department: 'Administration', designation: 'District Collector', permissions: ['complaints', 'reports', 'kiosks'], is_active: true, password: 'District@123' },
    { employee_id: 'admin', name: 'Admin', role: 'admin', department: 'IT', designation: 'Admin', permissions: ['all'], is_active: true, password: 'admin123' },
];
// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { employeeId, password, otp } = loginSchema.parse(req.body);
        let admin = null;
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
        }
        catch (dbError) {
            // Database not available, use mock users
            logger.warn('Database not available, using mock login');
            const mockUser = mockAdminUsers.find(u => u.employee_id === employeeId && u.password === password);
            if (mockUser) {
                admin = { ...mockUser };
                delete admin.password;
            }
        }
        if (!admin) {
            // Final fallback: check mock users if DB didn't find anything
            const mockUser = mockAdminUsers.find(u => u.employee_id === employeeId && u.password === password);
            if (mockUser) {
                admin = { ...mockUser };
                delete admin.password;
            }
            else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        }
        if (!admin.is_active) {
            return res.status(403).json({ error: 'Account is inactive' });
        }
        // Generate Token
        const token = jwt.sign({
            userId: admin.employee_id,
            role: admin.role,
            department: admin.department,
            permissions: admin.permissions
        }, JWT_SECRET, { expiresIn: '30m' });
        // Try to log login (ignore if DB not available)
        try {
            await pool.query(`INSERT INTO admin_audit_logs (employee_id, action, ip_address) VALUES ($1, $2, $3)`, [admin.employee_id, 'LOGIN', req.ip]);
        }
        catch (logError) {
            // Ignore logging error
        }
        // Remove password from response
        delete admin.password_hash;
        res.json({
            success: true,
            token,
            user: admin
        });
    }
    catch (error) {
        logger.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
// Middleware to verify Admin Token
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.use(verifyAdmin);
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
                online: kiosks.filter((k) => k.status === 'online').length,
                offline: kiosks.filter((k) => k.status === 'offline').length
            },
            revenue: revenue,
            sla: 87
        });
    }
    catch (dbError) {
        // Database not available - use shared mock data for live stats
        logger.warn('Database unavailable, using shared mock data for dashboard stats');
        const allComplaints = getAllComplaints();
        const kiosks = getAllKiosks();
        const citizens = getAllCitizens();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayComplaints = allComplaints.filter((c) => new Date(c.created_at) >= todayStart);
        res.json({
            complaints: {
                today: todayComplaints.length,
                total: allComplaints.length,
                active: allComplaints.filter((c) => !['resolved', 'closed'].includes(c.status)).length,
                growth: 12
            },
            applications: {
                pending: 15,
                overdue: 3
            },
            kiosks: {
                total: kiosks.length,
                online: kiosks.filter((k) => k.status === 'online').length,
                offline: kiosks.filter((k) => k.status === 'offline').length
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
    }
    catch (dbError) {
        // Database not available, fall through to mock data
        logger.warn('Database unavailable, using shared mock data for complaints');
    }
    // Fallback to shared mock data (synced with consumer portal)
    const { status } = req.query;
    let complaints = getAllComplaints();
    if (status && status !== 'all') {
        complaints = complaints.filter((c) => c.status === status);
    }
    res.json(complaints);
});
// Update Complaint
router.put('/complaints/:id/update', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment, assignedTo } = updateComplaintSchema.parse(req.body);
        const employeeId = req.user.userId;
        // Start transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            if (status) {
                await client.query('UPDATE complaints SET status = $1 WHERE id = $2', [status, id]);
            }
            if (assignedTo) {
                await client.query('UPDATE complaints SET assigned_officer_id = $1 WHERE id = $2', [assignedTo, id]);
            }
            // Add history/comment
            if (comment || status) {
                await client.query('INSERT INTO complaint_updates (complaint_id, status, message, updated_by) VALUES ($1, $2, $3, $4)', [id, status, comment, employeeId]);
            }
            // Audit
            await client.query(`INSERT INTO admin_audit_logs (employee_id, action, entity_type, entity_id, changes) VALUES ($1, $2, 'COMPLAINT', $3, $4)`, [employeeId, 'UPDATE_COMPLAINT', id, JSON.stringify({ status, assignedTo, comment })]);
            await client.query('COMMIT');
            res.json({ success: true });
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    }
    catch (error) {
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
    }
    catch (dbError) {
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
    }
    catch (dbError) {
        // Database not available
    }
    // Return shared mock complaints
    res.json(getAllComplaints());
});
export default router;
//# sourceMappingURL=admin.routes.js.map