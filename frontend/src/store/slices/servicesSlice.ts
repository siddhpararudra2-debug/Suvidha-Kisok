import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Bill {
    id: string;
    type: 'electricity' | 'gas' | 'water';
    consumerId: string;
    billNumber: string;
    billDate: string;
    dueDate: string;
    amount: number;
    unitsConsumed: number;
    unitLabel: string; // kWh, SCM, KL
    previousReading: number;
    currentReading: number;
    status: 'unpaid' | 'paid' | 'overdue' | 'partial';
    breakdown: {
        label: string;
        amount: number;
    }[];
}

export interface Complaint {
    id: string;
    type: 'electricity' | 'gas' | 'water';
    category: string;
    subcategory: string;
    description: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    priority: 'low' | 'medium' | 'high' | 'emergency';
    status: 'registered' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    createdAt: string;
    updatedAt: string;
    assignedOfficer?: {
        name: string;
        designation: string;
        phone: string;
    };
    estimatedResolution?: string;
    attachments: string[];
    updates: {
        timestamp: string;
        status: string;
        message: string;
        by: string;
    }[];
}

export interface LiveStatus {
    electricity: {
        gridStatus: 'operational' | 'warning' | 'critical';
        gridLoad: number; // percentage
        lastUpdated: string;
    };
    gas: {
        pngPrice: number;
        cngPrice: number;
        lastUpdated: string;
    };
    water: {
        supplyStatus: 'normal' | 'limited' | 'disrupted';
        nextSupplyTime?: string;
        lastUpdated: string;
    };
}

export interface ServicesState {
    bills: Bill[];
    pendingAmount: number;
    complaints: Complaint[];
    activeComplaints: number;
    liveStatus: LiveStatus;
    selectedBill: Bill | null;
    selectedComplaint: Complaint | null;
    loading: boolean;
    error: string | null;
}

const initialState: ServicesState = {
    bills: [],
    pendingAmount: 0,
    complaints: [],
    activeComplaints: 0,
    liveStatus: {
        electricity: {
            gridStatus: 'operational',
            gridLoad: 72,
            lastUpdated: new Date().toISOString(),
        },
        gas: {
            pngPrice: 45.25,
            cngPrice: 76.59,
            lastUpdated: new Date().toISOString(),
        },
        water: {
            supplyStatus: 'normal',
            lastUpdated: new Date().toISOString(),
        },
    },
    selectedBill: null,
    selectedComplaint: null,
    loading: false,
    error: null,
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setBills(state, action: PayloadAction<Bill[]>) {
            state.bills = action.payload;
            state.pendingAmount = action.payload
                .filter((b) => b.status !== 'paid')
                .reduce((sum, b) => sum + b.amount, 0);
        },
        addBill(state, action: PayloadAction<Bill>) {
            state.bills.push(action.payload);
            if (action.payload.status !== 'paid') {
                state.pendingAmount += action.payload.amount;
            }
        },
        updateBillStatus(
            state,
            action: PayloadAction<{ billId: string; status: Bill['status'] }>
        ) {
            const bill = state.bills.find((b) => b.id === action.payload.billId);
            if (bill) {
                const wasPending = bill.status !== 'paid';
                bill.status = action.payload.status;
                if (wasPending && action.payload.status === 'paid') {
                    state.pendingAmount -= bill.amount;
                }
            }
        },
        setSelectedBill(state, action: PayloadAction<Bill | null>) {
            state.selectedBill = action.payload;
        },
        setComplaints(state, action: PayloadAction<Complaint[]>) {
            state.complaints = action.payload;
            state.activeComplaints = action.payload.filter(
                (c) => !['resolved', 'closed'].includes(c.status)
            ).length;
        },
        addComplaint(state, action: PayloadAction<Complaint>) {
            state.complaints.unshift(action.payload);
            if (!['resolved', 'closed'].includes(action.payload.status)) {
                state.activeComplaints += 1;
            }
        },
        updateComplaint(state, action: PayloadAction<Complaint>) {
            const index = state.complaints.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                const oldStatus = state.complaints[index].status;
                const newStatus = action.payload.status;
                state.complaints[index] = action.payload;

                // Update active count
                const wasActive = !['resolved', 'closed'].includes(oldStatus);
                const isActive = !['resolved', 'closed'].includes(newStatus);
                if (wasActive && !isActive) {
                    state.activeComplaints -= 1;
                } else if (!wasActive && isActive) {
                    state.activeComplaints += 1;
                }
            }
        },
        setSelectedComplaint(state, action: PayloadAction<Complaint | null>) {
            state.selectedComplaint = action.payload;
        },
        updateLiveStatus(state, action: PayloadAction<Partial<LiveStatus>>) {
            state.liveStatus = { ...state.liveStatus, ...action.payload };
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearServices(state) {
            state.bills = [];
            state.pendingAmount = 0;
            state.complaints = [];
            state.activeComplaints = 0;
            state.selectedBill = null;
            state.selectedComplaint = null;
        },
    },
});

export const {
    setBills,
    addBill,
    updateBillStatus,
    setSelectedBill,
    setComplaints,
    addComplaint,
    updateComplaint,
    setSelectedComplaint,
    updateLiveStatus,
    setLoading,
    setError,
    clearServices,
} = servicesSlice.actions;

export default servicesSlice.reducer;
