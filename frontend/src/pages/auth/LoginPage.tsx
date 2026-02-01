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
    Tabs,
    Tab,
    InputAdornment,
    CircularProgress,
    Alert,
    Divider,
    IconButton,
} from '@mui/material';
import {
    Fingerprint,
    Badge,
    AccountBalanceWallet,
    Person,
    Phone,
    Lock,
    ArrowBack,
} from '@mui/icons-material';
import { loginSuccess, loginStart, loginFailure } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';
import { AppDispatch } from '../../store';
import api from '../../utils/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
);

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    // Form states
    const [aadhaar, setAadhaar] = useState('');
    const [consumerId, setConsumerId] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');

    const formatAadhaar = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 12);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAadhaar(formatAadhaar(e.target.value));
    };

    const handleSendOtp = async () => {
        setLoading(true);
        setError('');

        try {
            const cleanAadhaar = aadhaar.replace(/\s/g, '');
            await api.post('/auth/aadhaar/send-otp', { aadhaar: cleanAadhaar });
            setShowOtp(true);
            dispatch(showNotification({ message: t('auth.otpSent'), severity: 'success' }));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send OTP');
            dispatch(showNotification({ message: err.response?.data?.error || 'Failed to send OTP', severity: 'error' }));
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
            const cleanAadhaar = aadhaar.replace(/\s/g, '');
            const response = await api.post('/auth/aadhaar/verify-otp', { aadhaar: cleanAadhaar, otp });
            const data = response.data;

            if (!data.success) {
                throw new Error(data.error || 'Login failed');
            }

            // Use actual user data from API response
            dispatch(
                loginSuccess({
                    user: {
                        id: data.user.id,
                        name: data.user.name,
                        mobile: data.user.mobile || '',
                        email: data.user.email || '',
                        aadhaarMasked: data.user.aadhaarMasked || `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
                        address: data.user.address || '',
                        connections: data.user.connections || {},
                    },
                    token: data.token,
                    refreshToken: data.refreshToken,
                    expiresIn: data.expiresIn || 900,
                })
            );

            setLoading(false);
            dispatch(showNotification({ message: `Welcome, ${data.user.name}!`, severity: 'success' }));
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

        await new Promise((resolve) => setTimeout(resolve, 1000));

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
                expiresIn: 300, // 5 minutes for guest
                isGuest: true,
            })
        );

        setLoading(false);
        navigate('/dashboard');
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
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
                                boxShadow: '0 8px 32px rgba(26, 115, 232, 0.3)',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                                S
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            SUVIDHA
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
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" align="center" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('auth.loginTitle')}
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                {t('auth.loginSubtitle')}
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Tabs
                                value={tabValue}
                                onChange={(_, newValue) => {
                                    setTabValue(newValue);
                                    setShowOtp(false);
                                    setError('');
                                }}
                                variant="fullWidth"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab
                                    icon={<Fingerprint />}
                                    label="Aadhaar"
                                    sx={{ minHeight: 72 }}
                                />
                                <Tab
                                    icon={<Badge />}
                                    label="Consumer ID"
                                    sx={{ minHeight: 72 }}
                                />
                                <Tab
                                    icon={<AccountBalanceWallet />}
                                    label="DigiLocker"
                                    sx={{ minHeight: 72 }}
                                />
                            </Tabs>

                            {/* Aadhaar Login */}
                            <TabPanel value={tabValue} index={0}>
                                {!showOtp ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            label={t('auth.enterAadhaar')}
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
                                            sx={{ mb: 3 }}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleSendOtp}
                                            disabled={aadhaar.replace(/\s/g, '').length !== 12 || loading}
                                            sx={{ minHeight: 56 }}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            {t('auth.otpSent')}
                                        </Alert>
                                        <TextField
                                            fullWidth
                                            label={t('auth.enterOtp')}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="------"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ mb: 2 }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setShowOtp(false)}
                                                sx={{ flex: 1, minHeight: 48 }}
                                            >
                                                {t('common.back')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleVerifyOtp}
                                                disabled={otp.length !== 6 || loading}
                                                sx={{ flex: 2, minHeight: 48 }}
                                            >
                                                {loading ? <CircularProgress size={24} /> : t('auth.verifyOtp')}
                                            </Button>
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="text"
                                            sx={{ mt: 2 }}
                                            onClick={handleSendOtp}
                                        >
                                            {t('auth.resendOtp')}
                                        </Button>
                                    </>
                                )}
                            </TabPanel>

                            {/* Consumer ID Login */}
                            <TabPanel value={tabValue} index={1}>
                                <TextField
                                    fullWidth
                                    label={t('auth.enterConsumerId')}
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Badge color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label={t('auth.enterMobile')}
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleSendOtp}
                                    disabled={!consumerId || mobile.length !== 10 || loading}
                                    sx={{ minHeight: 56 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                                </Button>
                            </TabPanel>

                            {/* DigiLocker Login */}
                            <TabPanel value={tabValue} index={2}>
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <AccountBalanceWallet
                                        sx={{ fontSize: 64, color: 'primary.main', mb: 2 }}
                                    />
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        Login securely using your DigiLocker account
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        sx={{ minHeight: 56 }}
                                        onClick={() => {
                                            // In real app, redirect to DigiLocker OAuth
                                            handleVerifyOtp();
                                        }}
                                    >
                                        Continue with DigiLocker
                                    </Button>
                                </Box>
                            </TabPanel>

                            <Divider sx={{ my: 3 }}>
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
                                sx={{ minHeight: 56 }}
                            >
                                {t('auth.guestMode')}
                            </Button>

                            <Typography
                                variant="caption"
                                display="block"
                                textAlign="center"
                                color="text.secondary"
                                sx={{ mt: 2 }}
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
                        <Button variant="text" sx={{ textTransform: 'none' }}>
                            {t('auth.registerNow')}
                        </Button>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default LoginPage;
