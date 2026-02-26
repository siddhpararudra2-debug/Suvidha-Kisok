import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Button,
    Checkbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Divider,
    Chip,
} from '@mui/material';
import {
    ExpandMore,
    Security,
    CheckCircle,
    Delete,
    PrivacyTip,
    Gavel,
    DataUsage,
    Shield,
} from '@mui/icons-material';

const dataCategories = [
    {
        title: 'Personal Identification',
        items: ['Name', 'Aadhaar Number (masked)', 'Mobile Number', 'Email Address'],
        purpose: 'Account creation, authentication, and communication',
        retention: '5 years after account closure',
    },
    {
        title: 'Service Data',
        items: ['Connection IDs', 'Bill History', 'Payment Records', 'Complaint History'],
        purpose: 'Bill management, complaint tracking, and service improvement',
        retention: '7 years as per regulatory requirement',
    },
    {
        title: 'Location Data',
        items: ['GPS coordinates (for complaints)', 'Service area / Ward'],
        purpose: 'Complaint geo-tagging and infrastructure mapping',
        retention: '1 year after complaint resolution',
    },
    {
        title: 'Usage Analytics',
        items: ['Consumption patterns', 'Peak usage times', 'Peer comparison data'],
        purpose: 'Personalized recommendations and energy saving tips',
        retention: '2 years for trend analysis',
    },
];

const ConsentPage = () => {
    const navigate = useNavigate();
    const [consents, setConsents] = useState<Record<string, boolean>>({
        essential: true,
        analytics: false,
        communications: false,
        allRead: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [deleteRequested, setDeleteRequested] = useState(false);

    const handleConsent = (key: string) => {
        setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleDeleteRequest = () => {
        setDeleteRequested(true);
    };

    if (submitted) {
        return (
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} gutterBottom>Consent Preferences Saved</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Your data privacy preferences have been recorded. You can change them anytime from Settings.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>Continue to Dashboard</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Shield sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Data Privacy & Consent
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        As per the Digital Personal Data Protection Act (DPDP), 2023
                    </Typography>
                </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <strong>Your data, your choice.</strong> SUVIDHA Kiosk collects only the data necessary to provide utility services.
                You can review, modify, or request deletion of your data at any time.
            </Alert>

            {/* What We Collect */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                <DataUsage sx={{ mr: 1, verticalAlign: 'middle' }} />
                What Data We Collect
            </Typography>
            {dataCategories.map((cat, i) => (
                <Accordion key={i} sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }} defaultExpanded={i === 0}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography fontWeight={600}>{cat.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                            {cat.items.map(item => <Chip key={item} label={item} size="small" variant="outlined" />)}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Purpose:</strong> {cat.purpose}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Retention:</strong> {cat.retention}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}

            <Divider sx={{ my: 3 }} />

            {/* Consent Options */}
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
                Your Consent Choices
            </Typography>
            <Card sx={{ borderRadius: 2, mb: 2 }}>
                <CardContent>
                    <FormControlLabel
                        control={<Checkbox checked={consents.essential} disabled />}
                        label={
                            <Box>
                                <Typography fontWeight={600}>Essential Services <Chip label="Required" size="small" color="primary" sx={{ ml: 1 }} /></Typography>
                                <Typography variant="caption" color="text.secondary">Required for login, bill view/pay, complaint registration</Typography>
                            </Box>
                        }
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel
                        control={<Checkbox checked={consents.analytics} onChange={() => handleConsent('analytics')} />}
                        label={
                            <Box>
                                <Typography fontWeight={600}>Usage Analytics & Recommendations</Typography>
                                <Typography variant="caption" color="text.secondary">Consumption analysis, peer comparison, AI saving tips</Typography>
                            </Box>
                        }
                    />
                    <Divider sx={{ my: 1 }} />
                    <FormControlLabel
                        control={<Checkbox checked={consents.communications} onChange={() => handleConsent('communications')} />}
                        label={
                            <Box>
                                <Typography fontWeight={600}>SMS & Email Notifications</Typography>
                                <Typography variant="caption" color="text.secondary">Bill reminders, outage alerts, scheme notifications</Typography>
                            </Box>
                        }
                    />
                </CardContent>
            </Card>

            <FormControlLabel
                control={<Checkbox checked={consents.allRead} onChange={() => handleConsent('allRead')} />}
                label={<Typography variant="body2">I have read and understood the data collection practices above</Typography>}
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button variant="contained" size="large" onClick={handleSubmit} disabled={!consents.allRead} fullWidth>
                    Save Preferences
                </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Data Deletion */}
            <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'error.light', bgcolor: 'error.50' }}>
                <Typography variant="h6" fontWeight={600} color="error.main" gutterBottom>
                    <Delete sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Request Data Deletion
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Under DPDP Act 2023, you have the right to request erasure of your personal data. This will:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                    <li><Typography variant="body2">Delete all personal identification data</Typography></li>
                    <li><Typography variant="body2">Anonymize your billing and complaint history</Typography></li>
                    <li><Typography variant="body2">Remove all consumption analytics</Typography></li>
                </Box>
                {deleteRequested ? (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                        ✅ Data deletion request submitted. You will receive confirmation at your registered email within 72 hours.
                        Reference: DEL-{Date.now().toString().slice(-8)}
                    </Alert>
                ) : (
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteRequest}>
                        Request My Data Deletion
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default ConsentPage;
