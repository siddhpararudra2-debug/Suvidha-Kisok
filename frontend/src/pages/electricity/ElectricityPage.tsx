import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Chip,
    Paper,
    Divider,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    Receipt,
    Payment,
    TrendingUp,
    AddCircle,
    Settings,
    WbSunny,
    ReportProblem,
    Schedule,
    Download,
} from '@mui/icons-material';

const ElectricityPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const services = [
        { icon: <Receipt />, title: t('services.viewBill'), action: () => navigate('/payment'), color: '#1a73e8' },
        {
            icon: <Payment />,
            title: t('services.payBill'),
            action: () => navigate('/payment', {
                state: {
                    billId: 'BILL-ELEC-001',
                    billNumber: currentBill.consumerId,
                    amount: currentBill.amount,
                    type: 'electricity',
                    consumerId: currentBill.consumerId,
                    dueDate: currentBill.dueDate
                }
            }),
            color: '#34a853'
        },
        { icon: <TrendingUp />, title: t('services.consumption'), path: '/coming-soon', color: '#fbbc04' },
        { icon: <AddCircle />, title: t('services.newConnection'), path: '/coming-soon', color: '#673ab7' },
        { icon: <Settings />, title: t('electricity.loadChange'), path: '/coming-soon', color: '#00bcd4' },
        { icon: <WbSunny />, title: t('electricity.solarNetMetering'), path: '/coming-soon', color: '#ff9800' },
        { icon: <ReportProblem />, title: t('electricity.reportOutage'), path: '/complaints', color: '#ea4335' },
        { icon: <Schedule />, title: t('electricity.plannedOutages'), path: '/coming-soon', color: '#9c27b0' },
    ];

    // Mock current bill data
    const currentBill = {
        consumerId: '123456789',
        name: 'Priya Sharma',
        billDate: '15 Jan 2026',
        dueDate: '05 Feb 2026',
        unitsConsumed: 245,
        previousReading: 12450,
        currentReading: 12695,
        amount: 2847,
        breakdown: [
            { label: t('electricity.energyCharges'), amount: 2200 },
            { label: t('electricity.fixedCharges'), amount: 150 },
            { label: t('electricity.taxes'), amount: 497 },
        ],
    };

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #fbbc04 0%, #ff9800 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('electricity.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Manage your electricity connection, pay bills, and report issues
                </Typography>
            </Paper>

            {/* Current Bill Card */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                        <Box>
                            <Typography variant="overline" color="text.secondary">
                                {t('electricity.consumerId')}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {currentBill.consumerId}
                            </Typography>
                        </Box>
                        <Chip
                            label="Unpaid"
                            color="warning"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 6, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                {t('electricity.billDate')}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {currentBill.billDate}
                            </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                {t('electricity.dueDate')}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'warning.main' }}>
                                {currentBill.dueDate}
                            </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                {t('electricity.unitsConsumed')}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {currentBill.unitsConsumed} kWh
                            </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 6, sm: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                {t('electricity.amountDue')}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ₹{currentBill.amount.toLocaleString('en-IN')}
                            </Typography>
                        </Grid2>
                    </Grid2>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('electricity.tariffBreakdown')}
                    </Typography>
                    {currentBill.breakdown.map((item) => (
                        <Box
                            key={item.label}
                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                ₹{item.amount.toLocaleString('en-IN')}
                            </Typography>
                        </Box>
                    ))}

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Payment />}
                            onClick={() => navigate('/payment', {
                                state: {
                                    billId: 'BILL-ELEC-001',
                                    billNumber: currentBill.consumerId,
                                    amount: currentBill.amount,
                                    type: 'electricity',
                                    consumerId: currentBill.consumerId,
                                    dueDate: currentBill.dueDate
                                }
                            })}
                            sx={{ flex: 1, minHeight: 48 }}
                        >
                            {t('services.payBill')}
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Download />}
                            sx={{ minHeight: 48 }}
                        >
                            {t('common.download')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Services Grid */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                All Services
            </Typography>
            <Grid2 container spacing={2}>
                {services.map((service) => (
                    <Grid2 size={{ xs: 6, sm: 4, md: 3 }} key={service.title}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                            }}
                        >
                            <CardActionArea
                                sx={{ p: 2, textAlign: 'center' }}
                                onClick={() => {
                                    if ((service as any).action) {
                                        (service as any).action();
                                    } else if ((service as any).path) {
                                        navigate((service as any).path);
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: `${service.color}15`,
                                        color: service.color,
                                        mx: 'auto',
                                        mb: 1.5,
                                    }}
                                >
                                    {service.icon}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {service.title}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default ElectricityPage;
