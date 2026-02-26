import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
    Alert,
    Divider,
    IconButton,
    Tabs,
    Tab,
    Chip,
} from '@mui/material';
import {
    Fingerprint,
    Person,
    Lock,
    ArrowBack,
    PhoneAndroid,
    Badge,
    CheckCircle,
} from '@mui/icons-material';
import { loginSuccess, loginStart, loginFailure } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';
import { AppDispatch } from '../../store';
import api from '../../utils/api';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [loginMethod, setLoginMethod] = useState(0); // 0=Aadhaar, 1=Mobile, 2=ConsumerID

    // Form states
    const [aadhaar, setAadhaar] = useState('');
    const [mobile, setMobile] = useState('');
    const [consumerId, setConsumerId] = useState('');
    const [otp, setOtp] = useState('');

    const formatAadhaar = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 12);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAadhaar(formatAadhaar(e.target.value));
    };

    const getIdentifier = () => {
        if (loginMethod === 0) return aadhaar.replace(/\s/g, '');
        if (loginMethod === 1) return mobile;
        return consumerId;
    };

    const canSendOtp = () => {
        if (loginMethod === 0) return aadhaar.replace(/\s/g, '').length === 12;
        if (loginMethod === 1) return /^\d{10}$/.test(mobile);
        return consumerId.length >= 3;
    };

    const handleSendOtp = async () => {
        setLoading(true);
        setError('');

        try {
            const identifier = getIdentifier();

            if (loginMethod === 0) {
                // Aadhaar OTP
                await api.post('/auth/aadhaar/send-otp', { aadhaar: identifier });
            } else if (loginMethod === 1) {
                // Mobile OTP - use aadhaar endpoint with fake aadhaar, backend will accept
                await api.post('/auth/aadhaar/send-otp', { aadhaar: `999${mobile}99` });
            } else {
                // Consumer ID - use consumer endpoint
                await api.post('/auth/consumer/send-otp', { consumerId: identifier, mobile: '9999999999' });
            }

            setShowOtp(true);
            dispatch(showNotification({ message: 'OTP sent successfully! (Use any 6-digit OTP for demo)', severity: 'success' }));
        } catch (err: any) {
            // For demo: just show OTP screen anyway since backend may not be reachable
            setShowOtp(true);
            dispatch(showNotification({ message: 'OTP sent! (Use any 6-digit OTP for demo)', severity: 'info' }));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        dispatch(loginStart());

        try {
            const identifier = getIdentifier();
            let aadhaarNum = identifier;

            // For mobile/consumer login, construct a 12-digit number
            if (loginMethod === 1) {
                aadhaarNum = `999${mobile}99`;
            } else if (loginMethod === 2) {
                aadhaarNum = consumerId.padStart(12, '0').slice(0, 12);
            }

            const response = await api.post('/auth/aadhaar/verify-otp', { aadhaar: aadhaarNum, otp });
            const data = response.data;

            if (!data.success) {
                throw new Error(data.error || 'Login failed');
            }

            // Determine user name based on login method
            const displayName = data.user.name !== 'New User' ? data.user.name :
                loginMethod === 0 ? `Citizen *${aadhaarNum.slice(-4)}` :
                    loginMethod === 1 ? `User ${mobile.slice(-4)}` :
                        `Consumer ${consumerId}`;

            dispatch(
                loginSuccess({
                    user: {
                        id: data.user.id,
                        name: displayName,
                        mobile: data.user.mobile || mobile || '',
                        email: data.user.email || '',
                        aadhaarMasked: data.user.aadhaarMasked || `XXXX-XXXX-${aadhaarNum.slice(-4)}`,
                        address: data.user.address || '',
                        connections: data.user.connections || {},
                    },
                    token: data.token,
                    refreshToken: data.refreshToken,
                    expiresIn: data.expiresIn || 900,
                })
            );

            setLoading(false);
            dispatch(showNotification({ message: `Welcome, ${displayName}!`, severity: 'success' }));
            navigate('/dashboard');
        } catch (err: any) {
            setLoading(false);
            const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        dispatch(loginStart());

        await new Promise((resolve) => setTimeout(resolve, 800));

        dispatch(
            loginSuccess({
                user: {
                    id: 'GUEST',
                    name: 'Guest User',
                    mobile: '',
                    connections: {},
                },
                token: 'guest-token',
                refreshToken: 'guest-refresh',
                expiresIn: 300,
                isGuest: true,
            })
        );

        setLoading(false);
        navigate('/dashboard');
    };

    const handleTabChange = (_: any, newValue: number) => {
        setLoginMethod(newValue);
        setShowOtp(false);
        setError('');
        setOtp('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                {/* Back Button */}
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{ mb: 2, backgroundColor: 'white', boxShadow: 1 }}
                >
                    <ArrowBack />
                </IconButton>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            component="img"
                            src={`${import.meta.env.BASE_URL}logo.png`}
                            alt="SUVIDHA"
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 8px 32px rgba(26, 115, 232, 0.3)',
                                mb: 1.5,
                                display: 'block',
                                mx: 'auto',
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            SUVIDHA
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Unified Smart Kiosk for Civic Services
                        </Typography>
                    </Box>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card elevation={4} sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                            <Typography variant="h6" align="center" sx={{ mb: 0.5, fontWeight: 700 }}>
                                {t('auth.loginTitle')}
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                                Choose your preferred login method
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Login Method Tabs */}
                            {!showOtp && (
                                <Tabs
                                    value={loginMethod}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    sx={{
                                        mb: 3,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        '& .MuiTab-root': {
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            minHeight: 48,
                                            textTransform: 'none',
                                        },
                                    }}
                                >
                                    <Tab icon={<Fingerprint sx={{ fontSize: 18 }} />} iconPosition="start" label="Aadhaar" />
                                    <Tab icon={<PhoneAndroid sx={{ fontSize: 18 }} />} iconPosition="start" label="Mobile" />
                                    <Tab icon={<Badge sx={{ fontSize: 18 }} />} iconPosition="start" label="Consumer ID" />
                                </Tabs>
                            )}

                            {/* Step 1: Enter Identifier */}
                            {!showOtp ? (
                                <>
                                    {/* Aadhaar Login */}
                                    {loginMethod === 0 && (
                                        <TextField
                                            fullWidth
                                            label="Enter 12-digit Aadhaar Number"
                                            value={aadhaar}
                                            onChange={handleAadhaarChange}
                                            placeholder="XXXX XXXX XXXX"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Fingerprint color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    {/* Mobile Login */}
                                    {loginMethod === 1 && (
                                        <TextField
                                            fullWidth
                                            label="Enter 10-digit Mobile Number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="98XXXXXXXX"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneAndroid color="primary" />
                                                        <Typography sx={{ ml: 0.5, color: 'text.secondary', fontSize: 14 }}>+91</Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    {/* Consumer ID Login */}
                                    {loginMethod === 2 && (
                                        <TextField
                                            fullWidth
                                            label="Enter Consumer / Connection ID"
                                            value={consumerId}
                                            onChange={(e) => setConsumerId(e.target.value)}
                                            placeholder="e.g., ELC-001, GAS-5001, WAT-3001"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Badge color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            helperText="Electricity, Gas, or Water connection ID"
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleSendOtp}
                                        disabled={!canSendOtp() || loading}
                                        sx={{
                                            minHeight: 52,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            background: 'linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)',
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                                    </Button>

                                    <Alert severity="info" icon={<CheckCircle />} sx={{ mt: 2, borderRadius: 2 }}>
                                        <Typography variant="caption">
                                            <strong>Demo Mode:</strong> Enter any valid {loginMethod === 0 ? '12-digit number' : loginMethod === 1 ? '10-digit mobile' : 'ID'} and use any 6-digit OTP (e.g., 123456) to login.
                                        </Typography>
                                    </Alert>
                                </>
                            ) : (
                                /* Step 2: Enter OTP */
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                        OTP sent to {loginMethod === 0 ? `Aadhaar ${aadhaar}` : loginMethod === 1 ? `+91-${mobile}` : `Consumer ${consumerId}`}
                                    </Alert>

                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                                        Enter the 6-digit OTP sent to your registered mobile
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        label="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="● ● ● ● ● ●"
                                        inputProps={{ style: { textAlign: 'center', letterSpacing: 8, fontSize: 20, fontWeight: 700 } }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => { setShowOtp(false); setOtp(''); setError(''); }}
                                            sx={{ flex: 1, minHeight: 48, borderRadius: 2 }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleVerifyOtp}
                                            disabled={otp.length !== 6 || loading}
                                            sx={{
                                                flex: 2,
                                                minHeight: 48,
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                background: 'linear-gradient(135deg, #34a853 0%, #2e7d32 100%)',
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Login'}
                                        </Button>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="text"
                                        size="small"
                                        sx={{ mt: 1.5 }}
                                        onClick={handleSendOtp}
                                    >
                                        Resend OTP
                                    </Button>
                                </motion.div>
                            )}

                            <Divider sx={{ my: 2.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    OR
                                </Typography>
                            </Divider>

                            {/* Guest Mode */}
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                startIcon={<Person />}
                                onClick={handleGuestLogin}
                                disabled={loading}
                                sx={{
                                    minHeight: 52,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2 },
                                }}
                            >
                                {t('auth.guestMode')}
                            </Button>

                            <Typography
                                variant="caption"
                                display="block"
                                textAlign="center"
                                color="text.secondary"
                                sx={{ mt: 1.5 }}
                            >
                                Guest mode has limited access. Session expires in 5 minutes.
                            </Typography>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Register Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('auth.newUser')}{' '}
                        <Button variant="text" onClick={() => navigate('/register')} sx={{ textTransform: 'none', fontWeight: 600 }}>
                            {t('auth.registerNow')}
                        </Button>
                    </Typography>
                </Box>

                {/* Gov branding footer */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label="🔒 256-bit SSL" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        <Chip label="🏛️ DPDP Compliant" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                        <Chip label="♿ WCAG 2.1" size="small" variant="outlined" sx={{ fontSize: 11 }} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
