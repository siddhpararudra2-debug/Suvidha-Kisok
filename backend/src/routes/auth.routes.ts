import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { getCitizenByAadhaar, mockCitizens, citizensByAadhaar } from '../data/mockData.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'suvidha-secret-key-change-in-production';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

// Validation schemas
const aadhaarOtpSchema = z.object({
    aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
});

const verifyOtpSchema = z.object({
    aadhaar: z.string().regex(/^\d{12}$/),
    otp: z.string().length(6),
});

const consumerLoginSchema = z.object({
    consumerId: z.string().min(1),
    mobile: z.string().regex(/^\d{10}$/),
});

// Mock OTP storage (in production, use Redis)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Use shared mock citizens instead of local users Map

// Send Aadhaar OTP
router.post('/aadhaar/send-otp', async (req, res) => {
    try {
        const { aadhaar } = aadhaarOtpSchema.parse(req.body);

        // Generate mock OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(aadhaar, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

        console.log(`[DEV] OTP for ${aadhaar}: ${otp}`); // For development

        res.json({
            success: true,
            message: 'OTP sent to registered mobile number',
            // In dev mode, include OTP for testing
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'Failed to send OTP' });
        }
    }
});

// Verify Aadhaar OTP
router.post('/aadhaar/verify-otp', async (req, res) => {
    try {
        const { aadhaar, otp } = verifyOtpSchema.parse(req.body);

        const stored = otpStore.get(aadhaar);

        // In development, accept any 6-digit OTP
        const isValidOtp = process.env.NODE_ENV === 'development'
            ? otp.length === 6
            : stored && stored.otp === otp && Date.now() < stored.expires;

        if (!isValidOtp) {
            res.status(401).json({ error: 'Invalid or expired OTP' });
            return;
        }

        // Clear OTP
        otpStore.delete(aadhaar);

        // Get or create user from shared mock data
        let user = getCitizenByAadhaar(aadhaar);
        if (!user) {
            // Create new user and add to shared data
            user = {
                id: `USR${uuidv4().slice(0, 8)}`,
                aadhaar: aadhaar,
                name: 'New User',
                mobile: '',
                email: '',
                aadhaarMasked: `XXXX-XXXX-${aadhaar.slice(-4)}`,
                address: '',
                city: '',
                pincode: '',
                created_at: new Date().toISOString(),
                connections: {
                    electricity: [],
                    gas: [],
                    water: [],
                },
            };
            // Add to shared map so admin can see new registrations
            citizensByAadhaar.set(aadhaar, user);
            mockCitizens.push(user);
        }

        // Generate tokens
        const token = jwt.sign({ userId: user!.id, aadhaar }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user!.id }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

        res.json({
            success: true,
            user,
            token,
            refreshToken,
            expiresIn: 900, // 15 minutes in seconds
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'Authentication failed' });
        }
    }
});

// Consumer ID Login (send OTP)
router.post('/consumer/send-otp', async (req, res) => {
    try {
        const { consumerId, mobile } = consumerLoginSchema.parse(req.body);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(`${consumerId}:${mobile}`, { otp, expires: Date.now() + 5 * 60 * 1000 });

        console.log(`[DEV] OTP for ${consumerId}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent to mobile number',
            ...(process.env.NODE_ENV === 'development' && { devOtp: otp }),
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors[0].message });
        } else {
            res.status(500).json({ error: 'Failed to send OTP' });
        }
    }
});

// Guest login
router.post('/guest', async (req, res) => {
    const guestUser = {
        id: `GUEST-${uuidv4().slice(0, 8)}`,
        name: 'Guest User',
        mobile: '',
        connections: {},
    };

    const token = jwt.sign({ userId: guestUser.id, isGuest: true }, JWT_SECRET, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: guestUser.id, isGuest: true }, JWT_SECRET, { expiresIn: '5m' });

    res.json({
        success: true,
        user: guestUser,
        token,
        refreshToken,
        expiresIn: 300, // 5 minutes
        isGuest: true,
    });
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }

        const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
        const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            success: true,
            token: newToken,
            expiresIn: 900,
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout (client-side token removal, but can be used for audit logging)
router.post('/logout', async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
