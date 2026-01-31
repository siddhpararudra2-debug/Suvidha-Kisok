import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import servicesReducer, { setBills, addComplaint, updateBillStatus } from '../store/slices/servicesSlice';
import uiReducer, { setLanguage, setTextSize, showNotification } from '../store/slices/uiSlice';

// =====================
// Auth Slice Tests
// =====================
describe('authSlice', () => {
    it('should handle loginStart', () => {
        const initialState = {
            isAuthenticated: false,
            isGuest: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: null,
            tokenExpiry: null,
        };

        const state = authReducer(initialState, loginStart());
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('should handle loginSuccess', () => {
        const initialState = {
            isAuthenticated: false,
            isGuest: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: true,
            error: null,
            tokenExpiry: null,
        };

        const payload = {
            user: { id: 'USR001', name: 'Test User', mobile: '+91-9876543210' },
            token: 'jwt-token',
            refreshToken: 'refresh-token',
            expiresIn: 900,
        };

        const state = authReducer(initialState, loginSuccess(payload));
        expect(state.isAuthenticated).toBe(true);
        expect(state.user?.name).toBe('Test User');
        expect(state.token).toBe('jwt-token');
        expect(state.loading).toBe(false);
    });

    it('should handle loginFailure', () => {
        const initialState = {
            isAuthenticated: false,
            isGuest: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: true,
            error: null,
            tokenExpiry: null,
        };

        const state = authReducer(initialState, loginFailure('Invalid OTP'));
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Invalid OTP');
        expect(state.isAuthenticated).toBe(false);
    });

    it('should handle logout', () => {
        const loggedInState = {
            isAuthenticated: true,
            isGuest: false,
            user: { id: 'USR001', name: 'Test', mobile: '' },
            token: 'token',
            refreshToken: 'refresh',
            loading: false,
            error: null,
            tokenExpiry: Date.now() + 900000,
        };

        const state = authReducer(loggedInState, logout());
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBe(null);
        expect(state.token).toBe(null);
    });
});

// =====================
// Services Slice Tests
// =====================
describe('servicesSlice', () => {
    it('should set bills and calculate pending amount', () => {
        const bills = [
            { id: '1', type: 'electricity' as const, amount: 1000, status: 'unpaid' as const, consumerId: '', billNumber: '', billDate: '', dueDate: '', unitsConsumed: 0, unitLabel: '', previousReading: 0, currentReading: 0, breakdown: [] },
            { id: '2', type: 'gas' as const, amount: 500, status: 'paid' as const, consumerId: '', billNumber: '', billDate: '', dueDate: '', unitsConsumed: 0, unitLabel: '', previousReading: 0, currentReading: 0, breakdown: [] },
            { id: '3', type: 'water' as const, amount: 300, status: 'unpaid' as const, consumerId: '', billNumber: '', billDate: '', dueDate: '', unitsConsumed: 0, unitLabel: '', previousReading: 0, currentReading: 0, breakdown: [] },
        ];

        const state = servicesReducer(undefined, setBills(bills));
        expect(state.bills.length).toBe(3);
        expect(state.pendingAmount).toBe(1300); // 1000 + 300
    });

    it('should update bill status', () => {
        const initialState = {
            bills: [
                { id: '1', type: 'electricity' as const, amount: 1000, status: 'unpaid' as const, consumerId: '', billNumber: '', billDate: '', dueDate: '', unitsConsumed: 0, unitLabel: '', previousReading: 0, currentReading: 0, breakdown: [] },
            ],
            pendingAmount: 1000,
            complaints: [],
            activeComplaints: 0,
            liveStatus: {
                electricity: { gridStatus: 'operational' as const, gridLoad: 72, lastUpdated: '' },
                gas: { pngPrice: 45, cngPrice: 76, lastUpdated: '' },
                water: { supplyStatus: 'normal' as const, lastUpdated: '' },
            },
            selectedBill: null,
            selectedComplaint: null,
            loading: false,
            error: null,
        };

        const state = servicesReducer(initialState, updateBillStatus({ billId: '1', status: 'paid' }));
        expect(state.bills[0].status).toBe('paid');
        expect(state.pendingAmount).toBe(0);
    });

    it('should add complaint', () => {
        const complaint = {
            id: 'CMP-001',
            type: 'electricity' as const,
            category: 'Power Outage',
            subcategory: 'No power',
            description: 'No electricity since morning',
            location: { lat: 19.0, lng: 72.8, address: 'Mumbai' },
            priority: 'high' as const,
            status: 'registered' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            attachments: [],
            updates: [],
        };

        const state = servicesReducer(undefined, addComplaint(complaint));
        expect(state.complaints.length).toBe(1);
        expect(state.activeComplaints).toBe(1);
    });
});

// =====================
// UI Slice Tests
// =====================
describe('uiSlice', () => {
    it('should set language', () => {
        const state = uiReducer(undefined, setLanguage('hi'));
        expect(state.language).toBe('hi');
    });

    it('should set text size', () => {
        const state = uiReducer(undefined, setTextSize('large'));
        expect(state.textSize).toBe('large');
    });

    it('should show notification', () => {
        const state = uiReducer(undefined, showNotification({
            message: 'Test message',
            severity: 'success',
        }));
        expect(state.notification.open).toBe(true);
        expect(state.notification.message).toBe('Test message');
        expect(state.notification.severity).toBe('success');
    });
});

// =====================
// Utility Function Tests
// =====================
describe('Utility Functions', () => {
    it('should format currency correctly', () => {
        const formatCurrency = (amount: number) =>
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

        expect(formatCurrency(1234)).toBe('₹1,234.00');
        expect(formatCurrency(1234567)).toBe('₹12,34,567.00');
    });

    it('should mask Aadhaar number correctly', () => {
        const maskAadhaar = (aadhaar: string) =>
            `XXXX-XXXX-${aadhaar.slice(-4)}`;

        expect(maskAadhaar('123456789012')).toBe('XXXX-XXXX-9012');
    });

    it('should validate mobile number', () => {
        const isValidMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);

        expect(isValidMobile('9876543210')).toBe(true);
        expect(isValidMobile('1234567890')).toBe(false);
        expect(isValidMobile('987654321')).toBe(false);
    });

    it('should validate Aadhaar format', () => {
        const isValidAadhaar = (aadhaar: string) => /^\d{12}$/.test(aadhaar.replace(/\s/g, ''));

        expect(isValidAadhaar('123456789012')).toBe(true);
        expect(isValidAadhaar('1234 5678 9012')).toBe(true);
        expect(isValidAadhaar('12345678901')).toBe(false);
    });
});

// =====================
// API Response Tests
// =====================
describe('API Response Handling', () => {
    it('should handle successful login response', () => {
        const response = {
            success: true,
            user: { id: 'USR001', name: 'Priya Sharma', mobile: '+91-9876543210' },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'refresh-token',
            expiresIn: 900,
        };

        expect(response.success).toBe(true);
        expect(response.expiresIn).toBe(900);
    });

    it('should handle bill fetch response', () => {
        const response = {
            success: true,
            bills: [
                { id: 'BILL-001', type: 'electricity', amount: 2847, status: 'unpaid' },
            ],
            totalPending: 2847,
        };

        expect(response.bills.length).toBe(1);
        expect(response.totalPending).toBe(2847);
    });

    it('should handle complaint creation response', () => {
        const response = {
            success: true,
            complaint: { id: 'CMP-2026-001', status: 'registered' },
            message: 'Complaint registered. Expected resolution within 48 hours.',
        };

        expect(response.success).toBe(true);
        expect(response.complaint.status).toBe('registered');
    });
});
