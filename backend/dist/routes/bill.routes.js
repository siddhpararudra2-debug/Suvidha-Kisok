import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Mock bills database
const bills = [
    {
        id: 'BILL-001',
        type: 'electricity',
        consumerId: '123456789',
        billNumber: 'ELEC-2026-001',
        billDate: '2026-01-15',
        dueDate: '2026-02-05',
        amount: 2847,
        unitsConsumed: 245,
        unitLabel: 'kWh',
        previousReading: 12450,
        currentReading: 12695,
        status: 'unpaid',
        breakdown: [
            { label: 'Energy Charges', amount: 2200 },
            { label: 'Fixed Charges', amount: 150 },
            { label: 'Taxes & Duties', amount: 497 },
        ],
    },
    {
        id: 'BILL-002',
        type: 'gas',
        consumerId: 'G987654',
        billNumber: 'GAS-2026-001',
        billDate: '2026-01-10',
        dueDate: '2026-02-10',
        amount: 1234,
        unitsConsumed: 28,
        unitLabel: 'SCM',
        previousReading: 3456,
        currentReading: 3484,
        status: 'unpaid',
        breakdown: [
            { label: 'Gas Charges', amount: 1100 },
            { label: 'Pipeline Rent', amount: 50 },
            { label: 'Taxes', amount: 84 },
        ],
    },
    {
        id: 'BILL-003',
        type: 'water',
        consumerId: 'W123456',
        billNumber: 'WATER-2026-001',
        billDate: '2026-01-12',
        dueDate: '2026-02-08',
        amount: 890,
        unitsConsumed: 18,
        unitLabel: 'KL',
        previousReading: 1200,
        currentReading: 1218,
        status: 'unpaid',
        breakdown: [
            { label: 'Water Charges', amount: 720 },
            { label: 'Sewerage Charges', amount: 120 },
            { label: 'Meter Rent', amount: 50 },
        ],
    },
];
// Get all bills for a user
router.get('/', async (req, res) => {
    const { type, status } = req.query;
    let filteredBills = [...bills];
    if (type) {
        filteredBills = filteredBills.filter(b => b.type === type);
    }
    if (status) {
        filteredBills = filteredBills.filter(b => b.status === status);
    }
    res.json({
        success: true,
        bills: filteredBills,
        totalPending: filteredBills
            .filter(b => b.status !== 'paid')
            .reduce((sum, b) => sum + b.amount, 0),
    });
});
// Get single bill
router.get('/:id', async (req, res) => {
    const bill = bills.find(b => b.id === req.params.id);
    if (!bill) {
        res.status(404).json({ error: 'Bill not found' });
        return;
    }
    res.json({ success: true, bill });
});
// Fetch bill by consumer ID (BBPS simulation)
router.post('/fetch', async (req, res) => {
    const { type, consumerId } = req.body;
    // Simulate BBPS bill fetch delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const matchingBills = bills.filter(b => b.type === type && b.consumerId === consumerId);
    res.json({
        success: true,
        bills: matchingBills,
        provider: type === 'electricity' ? 'State Electricity Board'
            : type === 'gas' ? 'Gas Distribution Company'
                : 'Municipal Water Board',
    });
});
// Pay bill (BBPS payment simulation)
router.post('/:id/pay', async (req, res) => {
    const { paymentMethod, upiId, amount } = req.body;
    const billId = req.params.id;
    const bill = bills.find(b => b.id === billId);
    if (!bill) {
        res.status(404).json({ error: 'Bill not found' });
        return;
    }
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Update bill status
    bill.status = 'paid';
    // Generate receipt
    const receipt = {
        receiptNumber: `RCP-${uuidv4().slice(0, 8).toUpperCase()}`,
        transactionId: `TXN${Date.now()}`,
        billId: bill.id,
        billNumber: bill.billNumber,
        amount: amount || bill.amount,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        paidAt: new Date().toISOString(),
        status: 'success',
    };
    res.json({
        success: true,
        message: 'Payment successful',
        receipt,
    });
});
// Get payment history
router.get('/history/:consumerId', async (req, res) => {
    const history = [
        {
            receiptNumber: 'RCP-ABC12345',
            billNumber: 'ELEC-2025-012',
            amount: 2450,
            paidAt: '2025-12-15T10:30:00Z',
            paymentMethod: 'upi',
        },
        {
            receiptNumber: 'RCP-DEF67890',
            billNumber: 'ELEC-2025-011',
            amount: 2890,
            paidAt: '2025-11-16T14:20:00Z',
            paymentMethod: 'card',
        },
    ];
    res.json({ success: true, history });
});
export default router;
//# sourceMappingURL=bill.routes.js.map