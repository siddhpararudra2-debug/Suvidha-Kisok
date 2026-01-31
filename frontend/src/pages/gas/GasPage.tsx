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
    Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    Receipt,
    Payment,
    Speed,
    AddCircle,
    Warning,
    LocalGasStation,
    Security,
    Info,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

const GasPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const services = [
        { icon: <Receipt />, title: t('gas.pngBill'), color: '#1a73e8' },
        { icon: <Receipt />, title: t('gas.pngBill'), color: '#1a73e8' },
        {
            icon: <Payment />,
            title: t('services.payBill'),
            color: '#34a853',
            action: () => navigate('/payment', {
                state: {
                    billId: 'BILL-GAS-001',
                    billNumber: 'GAS-2026-001',
                    amount: 850,
                    type: 'gas',
                    consumerId: '5566778899',
                    dueDate: '2026-02-10'
                }
            })
        },
        { icon: <Speed />, title: t('gas.meterReading'), color: '#fbbc04' },
        { icon: <Speed />, title: t('gas.meterReading'), color: '#fbbc04' },
        { icon: <AddCircle />, title: t('services.newConnection'), color: '#673ab7' },
        { icon: <LocalGasStation />, title: t('gas.cngLocator'), color: '#00bcd4' },
        { icon: <Security />, title: t('gas.safetyInfo'), color: '#ff9800' },
    ];

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #ea4335 0%, #ff5722 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('gas.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    PNG billing, CNG services, and safety information
                </Typography>
            </Paper>

            {/* Emergency Gas Leak Button */}
            <Alert
                severity="error"
                icon={<Warning />}
                action={
                    <Button color="error" variant="contained" size="small">
                        {t('gas.gasLeak')}
                    </Button>
                }
                sx={{ mb: 4, borderRadius: 2 }}
            >
                <Typography sx={{ fontWeight: 600 }}>
                    Smell gas? Report immediately!
                </Typography>
                Emergency: 1800-XXX-XXXX
            </Alert>

            {/* Current Prices */}
            <Grid2 container spacing={2} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 6 }}>
                    <Card sx={{ borderRadius: 2, bgcolor: 'primary.50' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">
                                {t('gas.pngPrice')}
                            </Typography>
                            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                                ₹45.25
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                per SCM
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                    <Card sx={{ borderRadius: 2, bgcolor: 'success.50' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">
                                {t('gas.cngPrice')}
                            </Typography>
                            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                ₹76.59
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                per kg
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {/* Services Grid */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                All Services
            </Typography>
            <Grid2 container spacing={2}>
                {services.map((service) => (
                    <Grid2 size={{ xs: 6, sm: 4 }} key={service.title}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                            }}
                        >
                            <CardActionArea
                                sx={{ p: 3, textAlign: 'center' }}
                                onClick={() => service.action && service.action()}
                            >
                                <Box
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: `${service.color}15`,
                                        color: service.color,
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    {service.icon}
                                </Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
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

export default GasPage;
