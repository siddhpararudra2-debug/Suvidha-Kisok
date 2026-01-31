import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Divider,
    TextField,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    Alert,
    Chip,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    ArrowBack,
    CreditCard,
    AccountBalance,
    PhoneAndroid,
    QrCode2,
    Check,
    Download,
    Print,
    Share,
    Receipt,
    CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { showNotification } from '../../store/slices/uiSlice';
import { updateBillStatus } from '../../store/slices/servicesSlice';
import { AppDispatch } from '../../store';

interface PaymentState {
    billId: string;
    billNumber: string;
    amount: number;
    type: 'electricity' | 'gas' | 'water';
    consumerId: string;
    dueDate: string;
}

const PaymentPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    // Get bill data from navigation state or use mock
    const billData = (location.state as PaymentState) || {
        billId: 'BILL-001',
        billNumber: 'ELEC-2026-001',
        amount: 2847,
        type: 'electricity',
        consumerId: '123456789',
        dueDate: '2026-02-05',
    };

    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [bank, setBank] = useState('');
    const [processing, setProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [receipt, setReceipt] = useState<any>(null);
    const [showQrDialog, setShowQrDialog] = useState(false);

    const paymentMethods = [
        { id: 'upi', label: t('payment.upi'), icon: <PhoneAndroid />, description: 'Pay via UPI apps' },
        { id: 'card', label: t('payment.cards'), icon: <CreditCard />, description: 'Credit/Debit Card' },
        { id: 'netbanking', label: t('payment.netBanking'), icon: <AccountBalance />, description: 'All major banks' },
        { id: 'qr', label: t('payment.scanQr'), icon: <QrCode2 />, description: 'Scan & Pay' },
    ];

    const banks = [
        'State Bank of India',
        'HDFC Bank',
        'ICICI Bank',
        'Axis Bank',
        'Bank of Baroda',
        'Punjab National Bank',
        'Kotak Mahindra Bank',
    ];

    const handlePayment = async () => {
        // Validate payment details
        if (paymentMethod === 'upi' && !upiId.includes('@')) {
            dispatch(showNotification({ message: 'Please enter valid UPI ID', severity: 'error' }));
            return;
        }
        if (paymentMethod === 'card' && cardNumber.length < 16) {
            dispatch(showNotification({ message: 'Please enter valid card number', severity: 'error' }));
            return;
        }
        if (paymentMethod === 'netbanking' && !bank) {
            dispatch(showNotification({ message: 'Please select a bank', severity: 'error' }));
            return;
        }

        setProcessing(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Generate receipt
        const newReceipt = {
            receiptNumber: `RCP-${Date.now().toString(36).toUpperCase()}`,
            transactionId: `TXN${Date.now()}`,
            billNumber: billData.billNumber,
            consumerId: billData.consumerId,
            amount: billData.amount,
            convenienceFee: 0,
            totalPaid: billData.amount,
            paymentMethod: paymentMethod.toUpperCase(),
            upiId: paymentMethod === 'upi' ? upiId : undefined,
            paidAt: new Date().toLocaleString('en-IN'),
            status: 'SUCCESS',
        };

        setReceipt(newReceipt);
        setProcessing(false);
        setPaymentComplete(true);

        // Update bill status in store
        dispatch(updateBillStatus({ billId: billData.billId, status: 'paid' }));
        dispatch(showNotification({ message: 'Payment successful!', severity: 'success' }));
    };

    const handleDownloadReceipt = () => {
        // In production, generate PDF
        const receiptText = `
SUVIDHA PAYMENT RECEIPT
=======================
Receipt No: ${receipt.receiptNumber}
Transaction ID: ${receipt.transactionId}
Date: ${receipt.paidAt}

Bill Number: ${receipt.billNumber}
Consumer ID: ${receipt.consumerId}
Amount Paid: ₹${receipt.totalPaid}
Payment Method: ${receipt.paymentMethod}

Status: ${receipt.status}
=======================
Thank you for using SUVIDHA!
    `;

        const blob = new Blob([receiptText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SUVIDHA_Receipt_${receipt.receiptNumber}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        dispatch(showNotification({ message: 'Receipt downloaded!', severity: 'success' }));
    };

    if (paymentComplete && receipt) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)',
                    py: 4,
                }}
            >
                <Container maxWidth="sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card elevation={8} sx={{ borderRadius: 4, overflow: 'visible' }}>
                            {/* Success Icon */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: -5,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 20px rgba(52, 168, 83, 0.4)',
                                    }}
                                >
                                    <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
                                </Box>
                            </Box>

                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                                    {t('payment.success')}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    Your payment has been processed successfully
                                </Typography>

                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Amount Paid</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                ₹{receipt.totalPaid.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {receipt.transactionId}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Divider sx={{ my: 1 }} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Bill Number</Typography>
                                            <Typography variant="body2">{receipt.billNumber}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                                            <Typography variant="body2">{receipt.paymentMethod}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="caption" color="text.secondary">Date & Time</Typography>
                                            <Typography variant="body2">{receipt.paidAt}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Download />}
                                        onClick={handleDownloadReceipt}
                                        sx={{ flex: 1, minHeight: 48 }}
                                    >
                                        {t('payment.receipt')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share />}
                                        sx={{ flex: 1, minHeight: 48 }}
                                    >
                                        Share
                                    </Button>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/dashboard')}
                                    sx={{ minHeight: 56 }}
                                >
                                    Back to Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                    <ArrowBack />
                </IconButton>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                    {t('payment.title')}
                </Typography>

                <Grid container spacing={3}>
                    {/* Bill Summary */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ borderRadius: 2, position: 'sticky', top: 100 }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Bill Summary
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={billData.type.charAt(0).toUpperCase() + billData.type.slice(1)}
                                        color={billData.type === 'electricity' ? 'warning' : billData.type === 'gas' ? 'error' : 'primary'}
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {billData.billNumber}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Bill Amount</Typography>
                                    <Typography>₹{billData.amount.toLocaleString('en-IN')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Convenience Fee</Typography>
                                    <Typography sx={{ color: 'success.main' }}>FREE</Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        ₹{billData.amount.toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Payment Methods */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3 }}>
                                    {t('payment.selectMethod')}
                                </Typography>

                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    {paymentMethods.map((method) => (
                                        <Paper
                                            key={method.id}
                                            variant={paymentMethod === method.id ? 'elevation' : 'outlined'}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                borderColor: paymentMethod === method.id ? 'primary.main' : 'divider',
                                                borderWidth: paymentMethod === method.id ? 2 : 1,
                                            }}
                                            onClick={() => setPaymentMethod(method.id)}
                                        >
                                            <FormControlLabel
                                                value={method.id}
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                                                        <Box sx={{ color: 'primary.main' }}>{method.icon}</Box>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600 }}>{method.label}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {method.description}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                                sx={{ width: '100%', m: 0 }}
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>

                                <Divider sx={{ my: 3 }} />

                                {/* UPI Input */}
                                {paymentMethod === 'upi' && (
                                    <TextField
                                        fullWidth
                                        label={t('payment.enterUpiId')}
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneAndroid color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                {/* Card Inputs */}
                                {paymentMethod === 'card' && (
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Card Number"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                placeholder="1234 5678 9012 3456"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CreditCard color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Expiry"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="CVV"
                                                type="password"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                placeholder="***"
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                                {/* Net Banking */}
                                {paymentMethod === 'netbanking' && (
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 2 }}>Select Your Bank</Typography>
                                        <Grid container spacing={1}>
                                            {banks.map((bankName) => (
                                                <Grid size={{ xs: 6 }} key={bankName}>
                                                    <Button
                                                        variant={bank === bankName ? 'contained' : 'outlined'}
                                                        fullWidth
                                                        onClick={() => setBank(bankName)}
                                                        sx={{ justifyContent: 'flex-start', py: 1.5 }}
                                                    >
                                                        {bankName}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* QR Code */}
                                {paymentMethod === 'qr' && (
                                    <Box sx={{ textAlign: 'center', py: 3 }}>
                                        <Box
                                            sx={{
                                                width: 250,
                                                height: 250,
                                                mx: 'auto',
                                                mb: 2,
                                                p: 1,
                                                border: '2px solid',
                                                borderColor: 'primary.main',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'white',
                                            }}
                                        >
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                                                    `upi://pay?pa=jasanidhruv@okicici&pn=SuvidhaKiosk&am=${billData.amount}&cu=INR`
                                                )}`}
                                                alt="Payment QR Code"
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Scan with any UPI app to pay <strong>{t('payment.upi')}</strong>
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                            UPI ID: jasanidhruv@okicici
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, color: 'primary.main' }}>
                                            ₹{billData.amount.toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handlePayment}
                                    disabled={processing}
                                    sx={{ mt: 3, minHeight: 56 }}
                                >
                                    {processing ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CircularProgress size={24} color="inherit" />
                                            {t('payment.processing')}
                                        </Box>
                                    ) : (
                                        `Pay ₹${billData.amount.toLocaleString('en-IN')}`
                                    )}
                                </Button>

                                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
                                    🔒 Your payment is secured with end-to-end encryption
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default PaymentPage;
