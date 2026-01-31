import { useState, useRef } from 'react';
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
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Person,
    Phone,
    Email,
    Home,
    Fingerprint,
    Lock,
    ArrowBack,
    Check,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
} from '@mui/icons-material';
import { loginSuccess, loginStart } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';
import { AppDispatch } from '../../store';

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        aadhaar: '',
        otp: '',
        address: '',
        city: 'Mumbai',
        pincode: '',
        // Optional existing connections
        electricityId: '',
        gasId: '',
        waterId: '',
    });

    const steps = ['Personal Details', 'Verify Mobile', 'Link Connections'];

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Format specific fields
        if (field === 'mobile') {
            value = value.replace(/\D/g, '').slice(0, 10);
        } else if (field === 'aadhaar') {
            const digits = value.replace(/\D/g, '').slice(0, 12);
            value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (field === 'pincode') {
            value = value.replace(/\D/g, '').slice(0, 6);
        } else if (field === 'otp') {
            value = value.replace(/\D/g, '').slice(0, 6);
        }

        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSendOtp = async () => {
        if (formData.mobile.length !== 10) {
            dispatch(showNotification({ message: 'Please enter valid mobile number', severity: 'error' }));
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLoading(false);
        setOtpSent(true);
        dispatch(showNotification({ message: 'OTP sent to your mobile', severity: 'success' }));
    };

    const handleVerifyOtp = async () => {
        if (formData.otp.length !== 6) {
            dispatch(showNotification({ message: 'Please enter 6-digit OTP', severity: 'error' }));
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        setActiveStep(2);
    };

    const handleCompleteRegistration = async () => {
        setLoading(true);
        dispatch(loginStart());

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create new user and login
        const connections: any = {};
        if (formData.electricityId) connections.electricity = [formData.electricityId];
        if (formData.gasId) connections.gas = [formData.gasId];
        if (formData.waterId) connections.water = [formData.waterId];

        dispatch(
            loginSuccess({
                user: {
                    id: `USR${Date.now()}`,
                    name: formData.fullName,
                    mobile: `+91-${formData.mobile}`,
                    email: formData.email,
                    aadhaarMasked: formData.aadhaar ? `XXXX-XXXX-${formData.aadhaar.slice(-4)}` : undefined,
                    address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                    connections,
                },
                token: 'new-user-token',
                refreshToken: 'new-refresh-token',
                expiresIn: 900,
            })
        );

        setLoading(false);
        dispatch(showNotification({ message: 'Registration successful! Welcome to SUVIDHA', severity: 'success' }));
        navigate('/dashboard');
    };

    const isStep1Valid = formData.fullName.length >= 2 && formData.mobile.length === 10;
    const isStep2Valid = formData.otp.length === 6;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="md">
                {/* Back Button */}
                <IconButton
                    onClick={() => navigate('/login')}
                    sx={{ mb: 2, backgroundColor: 'white', boxShadow: 1 }}
                >
                    <ArrowBack />
                </IconButton>

                {/* Header */}
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
                                background: 'white',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 700 }}>
                                S
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                            Create Your Account
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
                            Register to access all civic services
                        </Typography>
                    </Box>
                </motion.div>

                {/* Registration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card elevation={8} sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                {steps.map((label, index) => (
                                    <Step key={label} completed={activeStep > index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {/* Step 1: Personal Details */}
                            {activeStep === 0 && (
                                <Box>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                value={formData.fullName}
                                                onChange={handleChange('fullName')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Mobile Number"
                                                value={formData.mobile}
                                                onChange={handleChange('mobile')}
                                                placeholder="10-digit mobile"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone color="primary" />
                                                            <Typography sx={{ ml: 0.5 }}>+91</Typography>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Email (Optional)"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange('email')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Aadhaar Number (Optional but recommended)"
                                                value={formData.aadhaar}
                                                onChange={handleChange('aadhaar')}
                                                placeholder="XXXX XXXX XXXX"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Fingerprint color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                helperText="Link Aadhaar for faster verification"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                value={formData.address}
                                                onChange={handleChange('address')}
                                                multiline
                                                rows={2}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Home color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <FormControl fullWidth>
                                                <InputLabel>City</InputLabel>
                                                <Select
                                                    value={formData.city}
                                                    label="City"
                                                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                                                >
                                                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                                                    <MenuItem value="Delhi">Delhi</MenuItem>
                                                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                                                    <MenuItem value="Chennai">Chennai</MenuItem>
                                                    <MenuItem value="Kolkata">Kolkata</MenuItem>
                                                    <MenuItem value="Pune">Pune</MenuItem>
                                                    <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Pincode"
                                                value={formData.pincode}
                                                onChange={handleChange('pincode')}
                                                placeholder="6-digit pincode"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={() => setActiveStep(1)}
                                        disabled={!isStep1Valid}
                                        sx={{ mt: 4, minHeight: 56 }}
                                    >
                                        Continue
                                    </Button>
                                </Box>
                            )}

                            {/* Step 2: Verify Mobile */}
                            {activeStep === 1 && (
                                <Box>
                                    <Alert severity="info" sx={{ mb: 3 }}>
                                        We'll send an OTP to verify your mobile number: <strong>+91-{formData.mobile}</strong>
                                    </Alert>

                                    {!otpSent ? (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            sx={{ minHeight: 56 }}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                                        </Button>
                                    ) : (
                                        <>
                                            <TextField
                                                fullWidth
                                                label="Enter 6-digit OTP"
                                                value={formData.otp}
                                                onChange={handleChange('otp')}
                                                placeholder="------"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 3 }}
                                            />
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => setOtpSent(false)}
                                                    sx={{ flex: 1, minHeight: 48 }}
                                                >
                                                    Resend OTP
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleVerifyOtp}
                                                    disabled={!isStep2Valid || loading}
                                                    sx={{ flex: 2, minHeight: 48 }}
                                                >
                                                    {loading ? <CircularProgress size={24} /> : 'Verify & Continue'}
                                                </Button>
                                            </Box>
                                        </>
                                    )}

                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => setActiveStep(0)}
                                        sx={{ mt: 2 }}
                                    >
                                        ← Back to Details
                                    </Button>
                                </Box>
                            )}

                            {/* Step 3: Link Connections */}
                            {activeStep === 2 && (
                                <Box>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        <Check sx={{ mr: 1 }} /> Mobile verified successfully!
                                    </Alert>

                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                        Link Your Existing Connections (Optional)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        You can add these later from your dashboard
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Electricity Consumer ID"
                                                value={formData.electricityId}
                                                onChange={handleChange('electricityId')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <ElectricBolt sx={{ color: '#fbbc04' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                placeholder="Found on your electricity bill"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Gas BP Number"
                                                value={formData.gasId}
                                                onChange={handleChange('gasId')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LocalGasStation sx={{ color: '#ea4335' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                placeholder="Found on your gas bill"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Water Connection ID"
                                                value={formData.waterId}
                                                onChange={handleChange('waterId')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <WaterDrop sx={{ color: '#1a73e8' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                placeholder="Found on your water bill"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setActiveStep(1)}
                                            sx={{ flex: 1, minHeight: 48 }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleCompleteRegistration}
                                            disabled={loading}
                                            sx={{ flex: 2, minHeight: 56 }}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
};

export default RegisterPage;
