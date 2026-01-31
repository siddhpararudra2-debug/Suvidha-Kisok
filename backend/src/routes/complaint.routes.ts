import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

// Validation schema
const complaintSchema = z.object({
    category: z.enum(['electricity', 'gas', 'water']),
    subcategory: z.string().min(1),
    description: z.string().min(10),
    priority: z.enum(['low', 'medium', 'high', 'emergency']),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
    }),
    attachments: z.array(z.string()).optional(),
});

// Mock complaints database
const complaints = [
    {
        id: 'CMP-2026-001',
        category: 'electricity',
        subcategory: 'Power Outage',
        description: 'No power supply since 6 AM in our building',
        priority: 'high',
        location: {
            lat: 19.0760,
            lng: 72.8777,
            address: '14/A, MG Road, Andheri West, Mumbai',
        },
        status: 'in_progress',
        createdAt: '2026-01-25T06:30:00Z',
        updatedAt: '2026-01-25T08:15:00Z',
        assignedOfficer: {
            name: 'Rajesh Kumar',
            designation: 'Junior Engineer',
            phone: '+91 22 1234 5678',
        },
        estimatedResolution: '2026-01-25T18:00:00Z',
        attachments: [],
        updates: [
            {
                timestamp: '2026-01-25T06:30:00Z',
                status: 'registered',
                message: 'Complaint registered successfully',
                by: 'System',
            },
            {
                timestamp: '2026-01-25T07:00:00Z',
                status: 'assigned',
                message: 'Assigned to field engineer',
                by: 'Control Room',
            },
            {
                timestamp: '2026-01-25T08:15:00Z',
                status: 'in_progress',
                message: 'Team dispatched to location',
                by: 'Rajesh Kumar',
            },
        ],
    },
    {
        id: 'CMP-2026-002',
        category: 'water',
        subcategory: 'Low Pressure',
        description: 'Very low water pressure on 3rd floor',
        priority: 'medium',
        location: {
            lat: 19.0820,
            lng: 72.8890,
            address: 'B-45, Lokhandwala Complex, Mumbai',
        },
        status: 'resolved',
        createdAt: '2026-01-20T09:00:00Z',
        updatedAt: '2026-01-23T11:30:00Z',
        resolvedAt: '2026-01-23T11:30:00Z',
        attachments: [],
        updates: [
            {
                timestamp: '2026-01-20T09:00:00Z',
                status: 'registered',
                message: 'Complaint registered',
                by: 'System',
            },
            {
                timestamp: '2026-01-23T11:30:00Z',
                status: 'resolved',
                message: 'Pump pressure adjusted. Issue resolved.',
                by: 'Water Board',
            },
        ],
    },
];

// Get all complaints for user
router.get('/', async (req, res) => {
    const { status, category } = req.query;

    let filtered = [...complaints];

    if (status) {
        filtered = filtered.filter(c => c.status === status);
    }
    if (category) {
        filtered = filtered.filter(c => c.category === category);
    }

    res.json({
        success: true,
        complaints: filtered,
        summary: {
            total: complaints.length,
            active: complaints.filter(c => !['resolved', 'closed'].includes(c.status)).length,
            resolved: complaints.filter(c => c.status === 'resolved').length,
        },
    });
});

// Get single complaint
router.get('/:id', async (req, res) => {
    const complaint = complaints.find(c => c.id === req.params.id);

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

        const newComplaint = {
            id: `CMP-${new Date().getFullYear()}-${String(complaints.length + 1).padStart(3, '0')}`,
            ...data,
            status: 'registered',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedResolution: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
            attachments: data.attachments || [],
            updates: [
                {
                    timestamp: new Date().toISOString(),
                    status: 'registered',
                    message: 'Complaint registered successfully. You will receive updates via SMS.',
                    by: 'System',
                },
            ],
        };

        complaints.push(newComplaint as any);

        // Calculate SLA based on priority
        const slaHours = data.priority === 'emergency' ? 4
            : data.priority === 'high' ? 24
                : data.priority === 'medium' ? 48
                    : 72;

        res.status(201).json({
            success: true,
            complaint: newComplaint,
            message: `Complaint registered. Expected resolution within ${slaHours} hours.`,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'Failed to register complaint' });
        }
    }
});

// Update complaint (add message/reopen)
router.patch('/:id', async (req, res) => {
    const complaint = complaints.find(c => c.id === req.params.id);

    if (!complaint) {
        res.status(404).json({ error: 'Complaint not found' });
        return;
    }

    const { message, reopen } = req.body;

    if (reopen && complaint.status === 'resolved') {
        complaint.status = 'registered';
        complaint.updates.push({
            timestamp: new Date().toISOString(),
            status: 'registered',
            message: 'Complaint reopened by citizen',
            by: 'Citizen',
        });
    }

    if (message) {
        complaint.updates.push({
            timestamp: new Date().toISOString(),
            status: complaint.status,
            message,
            by: 'Citizen',
        });
    }

    complaint.updatedAt = new Date().toISOString();

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
