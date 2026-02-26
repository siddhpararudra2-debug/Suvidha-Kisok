import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    Alert,
    Divider,
    LinearProgress,
    IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    ArrowForward,
    ArrowBack,
    CheckCircle,
    Upload,
    Description,
    Home,
    Person,
    Payment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { showNotification } from '../../store/slices/uiSlice';
import { AppDispatch } from '../../store';

const services = [
    { id: 'electricity', label: 'Electricity', icon: <ElectricBolt />, color: '#fbbc04', desc: 'New domestic or commercial electricity connection' },
    { id: 'gas', label: 'Gas (PNG)', icon: <LocalGasStation />, color: '#ea4335', desc: 'Piped Natural Gas connection for your home' },
    { id: 'water', label: 'Water Supply', icon: <WaterDrop />, color: '#1a73e8', desc: 'Municipal water supply connection' },
];

const connectionTypes: Record<string, { label: string; fee: number }[]> = {
    electricity: [
        { label: '1 KW - Domestic (Single Phase)', fee: 2100 },
        { label: '2 KW - Domestic (Single Phase)', fee: 4200 },
        { label: '5 KW - Domestic (Three Phase)', fee: 10500 },
        { label: '10 KW - Commercial', fee: 21000 },
    ],
    gas: [
        { label: 'Domestic PNG Connection', fee: 6500 },
        { label: 'Commercial PNG Connection', fee: 15000 },
    ],
    water: [
        { label: '½ inch - Domestic', fee: 3500 },
        { label: '¾ inch - Semi Commercial', fee: 7000 },
        { label: '1 inch - Commercial', fee: 12000 },
    ],
};

const steps = ['Select Service', 'Personal Details', 'Connection Details', 'Documents', 'Review & Submit'];

const NewConnectionPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [activeStep, setActiveStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [applicationNumber, setApplicationNumber] = useState('');

    // Form state
    const [selectedService, setSelectedService] = useState('');
    const [connectionType, setConnectionType] = useState('');
    const [personalDetails, setPersonalDetails] = useState({
        fullName: '',
        aadhaar: '',
        mobile: '',
        email: '',
        address: '',
        city: 'Surat',
        pincode: '',
    });
    const [premiseType, setPremiseType] = useState('residential');
    const [documents, setDocuments] = useState<{ name: string; uploaded: boolean }[]>([
        { name: 'Aadhaar Card', uploaded: false },
        { name: 'Address Proof', uploaded: false },
        { name: 'Property Ownership Proof', uploaded: false },
        { name: 'Passport Photo', uploaded: false },
    ]);

    const selectedFee = connectionTypes[selectedService]?.find(c => c.label === connectionType)?.fee || 0;

    const handleDocUpload = (index: number) => {
        const newDocs = [...documents];
        newDocs[index].uploaded = true;
        setDocuments(newDocs);
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            // Submit application
            const prefix = selectedService === 'electricity' ? 'ELC' : selectedService === 'gas' ? 'GAS' : 'WTR';
            const appNum = `${prefix}-2026-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
            setApplicationNumber(appNum);
            setSubmitted(true);
            dispatch(showNotification({
                message: `Application ${appNum} submitted successfully! 📱 SMS sent to +91-${personalDetails.mobile || 'XXXXXXXXXX'}`,
                severity: 'success',
            }));
        } else {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => setActiveStep(prev => prev - 1);

    const canProceed = () => {
        switch (activeStep) {
            case 0: return selectedService !== '';
            case 1: return personalDetails.fullName && personalDetails.mobile;
            case 2: return connectionType !== '';
            case 3: return documents.filter(d => d.uploaded).length >= 2;
            case 4: return true;
            default: return false;
        }
    };

    if (submitted) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}>
                    <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Application Submitted!
                </Typography>
                <Paper sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: 'success.50' }}>
                    <Typography variant="overline" color="text.secondary">Application Number</Typography>
                    <Typography variant="h3" fontWeight={800} color="success.main">{applicationNumber}</Typography>
                </Paper>
                <Alert severity="info" sx={{ mb: 2, textAlign: 'left', borderRadius: 2 }}>
                    <strong>📱 SMS sent</strong> to +91-{personalDetails.mobile || 'XXXXXXXXXX'} with application details<br />
                    <strong>📧 Email confirmation</strong> sent to {personalDetails.email || 'your registered email'}<br />
                    <strong>⏱️ Expected timeline:</strong> 15 working days
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => { setSubmitted(false); setActiveStep(0); setSelectedService(''); }}>
                        New Application
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Apply for New Connection
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Apply for a new Electricity, Gas, or Water connection in 5 simple steps
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} sx={{ mb: 3, borderRadius: 2, height: 6 }} />

            <Card sx={{ borderRadius: 3, p: { xs: 2, md: 3 } }}>
                <CardContent>
                    {/* Step 0: Select Service */}
                    {activeStep === 0 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                <ElectricBolt sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Select Utility Service
                            </Typography>
                            <Grid2 container spacing={2} sx={{ mt: 1 }}>
                                {services.map(svc => (
                                    <Grid2 size={{ xs: 12, sm: 4 }} key={svc.id}>
                                        <Card
                                            onClick={() => setSelectedService(svc.id)}
                                            sx={{
                                                cursor: 'pointer',
                                                borderRadius: 2,
                                                border: selectedService === svc.id ? `3px solid ${svc.color}` : '2px solid transparent',
                                                bgcolor: selectedService === svc.id ? `${svc.color}10` : 'background.paper',
                                                transition: 'all 0.2s',
                                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                                            }}
                                        >
                                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                <Box sx={{ color: svc.color, mb: 1 }}>{svc.icon}</Box>
                                                <Typography fontWeight={700}>{svc.label}</Typography>
                                                <Typography variant="caption" color="text.secondary">{svc.desc}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>
                        </Box>
                    )}

                    {/* Step 1: Personal Details */}
                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Personal Details
                            </Typography>
                            <Grid2 container spacing={2} sx={{ mt: 1 }}>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Full Name *" value={personalDetails.fullName}
                                        onChange={e => setPersonalDetails({ ...personalDetails, fullName: e.target.value })} />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Aadhaar Number" value={personalDetails.aadhaar}
                                        onChange={e => setPersonalDetails({ ...personalDetails, aadhaar: e.target.value })}
                                        inputProps={{ maxLength: 12 }} />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Mobile Number *" value={personalDetails.mobile}
                                        onChange={e => setPersonalDetails({ ...personalDetails, mobile: e.target.value })}
                                        inputProps={{ maxLength: 10 }} />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Email" type="email" value={personalDetails.email}
                                        onChange={e => setPersonalDetails({ ...personalDetails, email: e.target.value })} />
                                </Grid2>
                                <Grid2 size={12}>
                                    <TextField fullWidth label="Full Address" multiline rows={2} value={personalDetails.address}
                                        onChange={e => setPersonalDetails({ ...personalDetails, address: e.target.value })} />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="City" value={personalDetails.city}
                                        onChange={e => setPersonalDetails({ ...personalDetails, city: e.target.value })} />
                                </Grid2>
                                <Grid2 size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Pincode" value={personalDetails.pincode}
                                        onChange={e => setPersonalDetails({ ...personalDetails, pincode: e.target.value })}
                                        inputProps={{ maxLength: 6 }} />
                                </Grid2>
                            </Grid2>
                            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                                💡 Tip: Login with DigiLocker to auto-fill your details from government records.
                            </Alert>
                        </Box>
                    )}

                    {/* Step 2: Connection Details */}
                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Connection Details
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Premise Type</Typography>
                            <RadioGroup row value={premiseType} onChange={e => setPremiseType(e.target.value)}>
                                <FormControlLabel value="residential" control={<Radio />} label="Residential" />
                                <FormControlLabel value="commercial" control={<Radio />} label="Commercial" />
                                <FormControlLabel value="industrial" control={<Radio />} label="Industrial" />
                            </RadioGroup>

                            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>Connection Type & Load</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Select Connection Type</InputLabel>
                                <Select
                                    value={connectionType}
                                    label="Select Connection Type"
                                    onChange={e => setConnectionType(e.target.value)}
                                >
                                    {(connectionTypes[selectedService] || []).map(ct => (
                                        <MenuItem key={ct.label} value={ct.label}>
                                            {ct.label} — ₹{ct.fee.toLocaleString('en-IN')}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {connectionType && (
                                <Paper sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                                    <Typography variant="subtitle2">Estimated Fee</Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary.main">
                                        ₹{selectedFee.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Includes connection charges, security deposit, and meter cost
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    )}

                    {/* Step 3: Document Upload */}
                    {activeStep === 3 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Upload Documents
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Upload at least 2 documents to proceed. Accepted formats: PDF, JPG, PNG (Max 5MB each)
                            </Typography>

                            {documents.map((doc, idx) => (
                                <Paper key={doc.name} sx={{
                                    p: 2, mb: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    border: doc.uploaded ? '2px solid #34a853' : '1px solid #e0e0e0',
                                    bgcolor: doc.uploaded ? '#34a85308' : 'background.paper',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {doc.uploaded ? <CheckCircle color="success" /> : <Upload color="action" />}
                                        <Box>
                                            <Typography fontWeight={600}>{doc.name}</Typography>
                                            {doc.uploaded && <Typography variant="caption" color="success.main">Uploaded successfully</Typography>}
                                        </Box>
                                    </Box>
                                    <Button
                                        variant={doc.uploaded ? 'text' : 'outlined'}
                                        size="small"
                                        onClick={() => handleDocUpload(idx)}
                                        disabled={doc.uploaded}
                                    >
                                        {doc.uploaded ? '✓ Done' : 'Upload'}
                                    </Button>
                                </Paper>
                            ))}

                            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                                📋 Import documents directly from <strong>DigiLocker</strong> for faster verification.
                            </Alert>
                        </Box>
                    )}

                    {/* Step 4: Review & Submit */}
                    {activeStep === 4 && (
                        <Box>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Review & Submit
                            </Typography>

                            <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                                <Chip label={services.find(s => s.id === selectedService)?.label || selectedService} color="primary" sx={{ mb: 1 }} />

                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="subtitle2" color="text.secondary">Applicant</Typography>
                                <Typography fontWeight={600}>{personalDetails.fullName}</Typography>
                                <Typography variant="body2">{personalDetails.mobile} • {personalDetails.email}</Typography>
                                <Typography variant="body2">{personalDetails.address}, {personalDetails.city} {personalDetails.pincode}</Typography>

                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="subtitle2" color="text.secondary">Connection</Typography>
                                <Typography fontWeight={600}>{connectionType}</Typography>
                                <Typography variant="body2">Premise: {premiseType}</Typography>

                                <Divider sx={{ my: 1.5 }} />
                                <Typography variant="subtitle2" color="text.secondary">Documents</Typography>
                                <Typography fontWeight={600}>{documents.filter(d => d.uploaded).length} of {documents.length} uploaded</Typography>

                                <Divider sx={{ my: 1.5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Total Fee</Typography>
                                    <Typography variant="h5" fontWeight={700} color="primary.main">₹{selectedFee.toLocaleString('en-IN')}</Typography>
                                </Box>
                            </Paper>

                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                By submitting, you agree to the terms and conditions. Fee will be collected during site inspection.
                            </Alert>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={activeStep === 0 ? () => navigate('/dashboard') : handleBack}
                    size="large"
                >
                    {activeStep === 0 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                    variant="contained"
                    endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
                    onClick={handleNext}
                    disabled={!canProceed()}
                    size="large"
                    sx={{ minWidth: 160 }}
                >
                    {activeStep === steps.length - 1 ? 'Submit Application' : 'Next'}
                </Button>
            </Box>
        </Box>
    );
};

export default NewConnectionPage;
