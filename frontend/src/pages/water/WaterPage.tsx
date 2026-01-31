import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Paper,
} from '@mui/material';
import {
    Receipt,
    Payment,
    LocalShipping,
    ReportProblem,
    Delete,
    Description,
    Schedule,
    Recycling,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

const WaterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const services = [
        { icon: <Receipt />, title: t('water.waterBill'), color: '#1a73e8' },
        { icon: <Receipt />, title: t('water.waterBill'), color: '#1a73e8' },
        {
            icon: <Payment />,
            title: t('water.propertyTax'),
            color: '#34a853',
            action: () => navigate('/payment', {
                state: {
                    billId: 'BILL-WATER-001',
                    billNumber: 'WAT-2026-001',
                    amount: 450,
                    type: 'water',
                    consumerId: '9988776655',
                    dueDate: '2026-02-15'
                }
            })
        },
        { icon: <LocalShipping />, title: t('water.tankerRequest'), color: '#00bcd4' },
        { icon: <LocalShipping />, title: t('water.tankerRequest'), color: '#00bcd4' },
        { icon: <ReportProblem />, title: t('water.reportLeakage'), color: '#ea4335' },
        { icon: <Delete />, title: t('water.wasteManagement'), color: '#ff9800' },
        { icon: <Description />, title: t('water.certificates'), color: '#673ab7' },
        { icon: <Schedule />, title: t('water.supplySchedule'), color: '#9c27b0' },
        { icon: <Recycling />, title: 'Recycling Centers', color: '#4caf50' },
    ];

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #1a73e8 0%, #00bcd4 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('water.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Water supply, property tax, waste management, and certificates
                </Typography>
            </Paper>

            {/* Water Supply Status */}
            <Card sx={{ mb: 4, borderRadius: 2, bgcolor: 'success.50' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            boxShadow: '0 0 8px #34a853',
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Water Supply: Normal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Next supply: 6:00 AM - 10:00 AM
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Services Grid */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                All Services
            </Typography>
            <Grid container spacing={2}>
                {services.map((service) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={service.title}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                            }}
                        >
                            <CardActionArea
                                sx={{ p: 2, textAlign: 'center' }}
                                onClick={() => service.action && service.action()}
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
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default WaterPage;
