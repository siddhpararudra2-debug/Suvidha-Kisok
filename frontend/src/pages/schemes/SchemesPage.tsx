import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    Paper,
    Button,
    Stepper,
    Step,
    StepLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    Divider,
    LinearProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    WbSunny,
    ElderlyWoman,
    FamilyRestroom,
    Home,
    Savings,
    ArrowForward,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';

interface SchemeResult {
    scheme: typeof schemes[0];
    eligible: boolean;
    reason?: string;
}

const schemes = [
    {
        id: 1,
        title: 'PM-KUSUM Solar Scheme',
        description: 'Subsidy up to 60% on rooftop solar panel installation for farmers and residential consumers',
        icon: <WbSunny />,
        color: '#ff9800',
        category: 'Solar',
        eligibility: { ownProperty: true, minBill: 0, maxIncome: 1500000 },
        benefit: 'Up to ₹78,000 subsidy',
        documents: ['Electricity Bill', 'Property Documents', 'ID Proof'],
    },
    {
        id: 2,
        title: 'Senior Citizen Electricity Discount',
        description: '20% discount on electricity bills for citizens above 60 years of age',
        icon: <ElderlyWoman />,
        color: '#673ab7',
        category: 'Electricity',
        eligibility: { minAge: 60 },
        benefit: '20% bill discount',
        documents: ['Age Proof', 'Electricity Bill', 'Aadhaar'],
    },
    {
        id: 3,
        title: 'BPL Household Utility Subsidy',
        description: 'Free water connection and reduced tariff for Below Poverty Line families',
        icon: <FamilyRestroom />,
        color: '#1a73e8',
        category: 'Water',
        eligibility: { hasBPLCard: true },
        benefit: 'Free connection + 50% tariff',
        documents: ['BPL Card', 'Ration Card', 'Address Proof'],
    },
    {
        id: 4,
        title: 'PNG Connection Interest-Free EMI',
        description: 'Zero interest EMI for Piped Natural Gas pipeline installation',
        icon: <Home />,
        color: '#ea4335',
        category: 'Gas',
        eligibility: { inPNGArea: true, ownProperty: true },
        benefit: '0% EMI for 24 months',
        documents: ['Property Document', 'ID Proof', 'Address Proof'],
    },
    {
        id: 5,
        title: 'Energy Conservation Rebate',
        description: 'Rebate for consumers who reduce electricity consumption by 10% or more compared to previous year',
        icon: <Savings />,
        color: '#34a853',
        category: 'Electricity',
        eligibility: { reducedConsumption: true },
        benefit: 'Up to 5% rebate',
        documents: ['Last 12 months bills'],
    },
];

const SchemesPage = () => {

    const [showChecker, setShowChecker] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [answers, setAnswers] = useState({
        age: '',
        ownProperty: '',
        hasBPLCard: '',
        inPNGArea: '',
        avgMonthlyBill: '',
        annualIncome: '',
    });
    const [results, setResults] = useState<SchemeResult[]>([]);
    const [checking, setChecking] = useState(false);

    const questions = [
        {
            id: 'age',
            question: 'What is your age?',
            type: 'radio',
            options: [
                { value: 'below60', label: 'Below 60 years' },
                { value: '60plus', label: '60 years or above' },
            ],
        },
        {
            id: 'ownProperty',
            question: 'Do you own the property where you live?',
            type: 'radio',
            options: [
                { value: 'yes', label: 'Yes, I own it' },
                { value: 'no', label: 'No, I am renting' },
            ],
        },
        {
            id: 'hasBPLCard',
            question: 'Do you have a Below Poverty Line (BPL) card?',
            type: 'radio',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
            ],
        },
        {
            id: 'inPNGArea',
            question: 'Is Piped Natural Gas (PNG) available in your area?',
            type: 'radio',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'notSure', label: 'Not sure' },
            ],
        },
        {
            id: 'annualIncome',
            question: 'What is your annual household income?',
            type: 'radio',
            options: [
                { value: 'below5L', label: 'Below ₹5 Lakhs' },
                { value: '5to10L', label: '₹5-10 Lakhs' },
                { value: '10to15L', label: '₹10-15 Lakhs' },
                { value: 'above15L', label: 'Above ₹15 Lakhs' },
            ],
        },
    ];

    const handleAnswer = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const checkEligibility = () => {
        setChecking(true);

        // Simulate processing
        setTimeout(() => {
            const schemeResults: SchemeResult[] = schemes.map((scheme) => {
                let eligible = true;
                let reason = '';

                // Check age for senior citizen scheme
                if (scheme.eligibility.minAge && answers.age !== '60plus') {
                    eligible = false;
                    reason = 'Age requirement not met (60+)';
                }

                // Check property ownership
                if (scheme.eligibility.ownProperty && answers.ownProperty !== 'yes') {
                    eligible = false;
                    reason = 'Property ownership required';
                }

                // Check BPL card
                if (scheme.eligibility.hasBPLCard && answers.hasBPLCard !== 'yes') {
                    eligible = false;
                    reason = 'BPL card required';
                }

                // Check PNG area
                if (scheme.eligibility.inPNGArea && answers.inPNGArea !== 'yes') {
                    eligible = false;
                    reason = 'PNG network not available in area';
                }

                // Check income for solar scheme
                if (scheme.eligibility.maxIncome) {
                    if (answers.annualIncome === 'above15L') {
                        eligible = false;
                        reason = 'Income exceeds eligibility limit';
                    }
                }

                return { scheme, eligible, reason };
            });

            setResults(schemeResults);
            setChecking(false);
            setActiveStep(questions.length);
        }, 1500);
    };

    const eligibleCount = results.filter((r) => r.eligible).length;

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Government Schemes & Subsidies
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Discover schemes you're eligible for and apply online
                </Typography>
            </Paper>

            {/* Eligibility Checker CTA or Form */}
            {!showChecker ? (
                <Card sx={{ mb: 4, borderRadius: 2, bgcolor: 'primary.50' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Check Your Eligibility
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Answer a few questions to find schemes you can apply for
                            </Typography>
                        </Box>
                        <Button variant="contained" endIcon={<ArrowForward />} onClick={() => setShowChecker(true)}>
                            Start Check
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card sx={{ mb: 4, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            Eligibility Checker
                        </Typography>

                        {/* Progress */}
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
                            {questions.map((q, index) => (
                                <Step key={q.id} completed={!!answers[q.id as keyof typeof answers]}>
                                    <StepLabel>Q{index + 1}</StepLabel>
                                </Step>
                            ))}
                            <Step>
                                <StepLabel>Results</StepLabel>
                            </Step>
                        </Stepper>

                        {/* Questions */}
                        {activeStep < questions.length && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 3 }}>
                                    {questions[activeStep].question}
                                </Typography>
                                <RadioGroup
                                    value={answers[questions[activeStep].id as keyof typeof answers]}
                                    onChange={(e) => handleAnswer(questions[activeStep].id, e.target.value)}
                                >
                                    {questions[activeStep].options.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={<Radio />}
                                            label={option.label}
                                            sx={{
                                                mb: 1,
                                                p: 2,
                                                border: 1,
                                                borderColor: answers[questions[activeStep].id as keyof typeof answers] === option.value ? 'primary.main' : 'divider',
                                                borderRadius: 2,
                                                mx: 0,
                                                width: '100%',
                                            }}
                                        />
                                    ))}
                                </RadioGroup>

                                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                    <Button
                                        variant="outlined"
                                        disabled={activeStep === 0}
                                        onClick={() => setActiveStep((prev) => prev - 1)}
                                        sx={{ flex: 1, minHeight: 48 }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={!answers[questions[activeStep].id as keyof typeof answers]}
                                        onClick={() => {
                                            if (activeStep === questions.length - 1) {
                                                checkEligibility();
                                            } else {
                                                setActiveStep((prev) => prev + 1);
                                            }
                                        }}
                                        sx={{ flex: 2, minHeight: 48 }}
                                    >
                                        {activeStep === questions.length - 1 ? 'Check Eligibility' : 'Next'}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Checking Animation */}
                        {checking && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <LinearProgress sx={{ mb: 3 }} />
                                <Typography variant="h6">Checking your eligibility...</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Analyzing {schemes.length} government schemes
                                </Typography>
                            </Box>
                        )}

                        {/* Results */}
                        {activeStep === questions.length && !checking && results.length > 0 && (
                            <Box>
                                <Alert
                                    severity={eligibleCount > 0 ? 'success' : 'info'}
                                    sx={{ mb: 3 }}
                                >
                                    You are eligible for <strong>{eligibleCount} out of {schemes.length}</strong> schemes!
                                </Alert>

                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                    Eligible Schemes
                                </Typography>
                                {results.filter((r) => r.eligible).map((result) => (
                                    <Card key={result.scheme.id} sx={{ mb: 2, borderLeft: 4, borderColor: 'success.main' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <CheckCircle color="success" />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        {result.scheme.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {result.scheme.description}
                                                    </Typography>
                                                    <Chip
                                                        label={result.scheme.benefit}
                                                        size="small"
                                                        color="success"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                                <Button variant="contained" size="small">
                                                    Apply Now
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}

                                {results.filter((r) => !r.eligible).length > 0 && (
                                    <>
                                        <Typography variant="subtitle1" sx={{ mb: 2, mt: 3, fontWeight: 600 }}>
                                            Not Eligible
                                        </Typography>
                                        {results.filter((r) => !r.eligible).map((result) => (
                                            <Card key={result.scheme.id} sx={{ mb: 2, opacity: 0.7 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Cancel color="disabled" />
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                {result.scheme.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="error">
                                                                {result.reason}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </>
                                )}

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        setShowChecker(false);
                                        setActiveStep(0);
                                        setAnswers({
                                            age: '',
                                            ownProperty: '',
                                            hasBPLCard: '',
                                            inPNGArea: '',
                                            avgMonthlyBill: '',
                                            annualIncome: '',
                                        });
                                        setResults([]);
                                    }}
                                    sx={{ mt: 3, minHeight: 48 }}
                                >
                                    Check Again
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* All Schemes Grid */}
            {!showChecker && (
                <>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Available Schemes
                    </Typography>
                    <Grid2 container spacing={3}>
                        {schemes.map((scheme) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={scheme.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                                    }}
                                >
                                    <CardActionArea sx={{ height: '100%', p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: `${scheme.color}15`,
                                                    color: scheme.color,
                                                }}
                                            >
                                                {scheme.icon}
                                            </Box>
                                            <Chip label={scheme.category} size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                            {scheme.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {scheme.description}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Benefit
                                                </Typography>
                                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                                    {scheme.benefit}
                                                </Typography>
                                            </Box>
                                            <Button size="small" endIcon={<ArrowForward />}>
                                                Details
                                            </Button>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </>
            )}
        </Box>
    );
};

export default SchemesPage;
