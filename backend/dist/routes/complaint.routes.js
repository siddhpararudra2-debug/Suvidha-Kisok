import { Router } from 'express';
import { z } from 'zod';
import { mockComplaints } from '../data/mockData.js';
const router = Router();
// Validation schema - flexible to accept both nested location and flat lat/lng
const complaintSchema = z.object({
    type: z.string().optional(), // Accept type directly
    category: z.string().optional(), // electricity/gas/water OR subcategory
    subcategory: z.string().optional(),
    description: z.string().min(5),
    priority: z.string().default('medium'),
    // Accept either nested location or flat coordinates
    location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string().optional(),
    }).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    address: z.string().optional(),
    attachments: z.array(z.string()).optional(),
});
// Use shared mockComplaints from mockData (same as admin portal)
// Get all complaints for user
router.get('/', async (req, res) => {
    const { status, category } = req.query;
    let filtered = [...mockComplaints];
    if (status) {
        filtered = filtered.filter((c) => c.status === status);
    }
    if (category) {
        filtered = filtered.filter((c) => c.type === category);
    }
    res.json({
        success: true,
        complaints: filtered,
        summary: {
            total: mockComplaints.length,
            active: mockComplaints.filter((c) => !['resolved', 'closed'].includes(c.status)).length,
            resolved: mockComplaints.filter((c) => c.status === 'resolved').length,
        },
    });
});
// Get single complaint
router.get('/:id', async (req, res) => {
    const complaint = mockComplaints.find((c) => c.id === req.params.id);
    if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
    }
    res.json({ success: true, complaint });
});
// Register new complaint
router.post('/', async (req, res) => {
    try {
        const data = complaintSchema.parse(req.body);
        // Normalize - handle both location formats (nested or flat)
        const lat = data.location?.lat ?? data.latitude ?? 21.1702; // Default to Surat
        const lng = data.location?.lng ?? data.longitude ?? 72.8311;
        const addr = data.location?.address ?? data.address ?? 'Surat, Gujarat';
        // Determine type (electricity/gas/water) - could come from type or category field
        const complaintType = data.type || data.category || 'electricity';
        const categoryName = data.subcategory || data.category || 'General';
        const newComplaint = {
            id: `CMP-${new Date().getFullYear()}-${String(mockComplaints.length + 1).padStart(3, '0')}`,
            user_id: req.user?.userId || 'GUEST',
            type: complaintType,
            category: categoryName,
            subcategory: categoryName,
            description: data.description,
            priority: data.priority === 'emergency' ? 'critical' : data.priority,
            status: 'registered',
            address: addr,
            latitude: lat,
            longitude: lng,
            assigned_officer_id: null,
            estimated_resolution: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            resolved_at: null,
        };
        mockComplaints.push(newComplaint);
        console.log(`✅ New complaint registered: ${newComplaint.id} at (${lat}, ${lng})`);
        // Calculate SLA based on priority
        const slaHours = data.priority === 'emergency' || data.priority === 'critical' ? 4
            : data.priority === 'high' ? 24
                : data.priority === 'medium' ? 48
                    : 72;
        res.status(201).json({
            success: true,
            id: newComplaint.id,
            complaint: newComplaint,
            message: `Complaint registered. Expected resolution within ${slaHours} hours.`,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        }
        else {
            res.status(500).json({ error: 'Failed to register complaint' });
        }
    }
});
// Update complaint (add message/reopen)
router.patch('/:id', async (req, res) => {
    const complaint = mockComplaints.find((c) => c.id === req.params.id);
    if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
    }
    const { message, reopen } = req.body;
    if (reopen && complaint.status === 'resolved') {
        complaint.status = 'registered';
        complaint.resolved_at = null;
    }
    complaint.updated_at = new Date().toISOString();
    res.json({ success: true, complaint });
});
// Rate resolution
router.post('/:id/rate', async (req, res) => {
    const { rating, feedback } = req.body;
    res.json({
        success: true,
        message: 'Thank you for your feedback!',
    });
});
export default router;
//# sourceMappingURL=complaint.routes.js.map