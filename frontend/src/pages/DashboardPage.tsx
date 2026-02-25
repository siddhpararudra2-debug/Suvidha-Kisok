import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Avatar,
    Chip,
    Paper,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    ReportProblem,
    Map,
    AccountBalance,
    People,
    Schedule,
    ArrowForward,
} from '@mui/icons-material';
import { RootState } from '../store';

const DashboardPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const serviceCards = [
        {
            icon: <ElectricBolt sx={{ fontSize: 40 }} />,
            title: t('services.electricity'),
            color: '#fbbc04',
            path: '/electricity',
            actions: [t('services.viewBill'), t('services.payBill'), t('electricity.reportOutage')],
        },
        {
            icon: <LocalGasStation sx={{ fontSize: 40 }} />,
            title: t('services.gas'),
            color: '#ea4335',
            path: '/gas',
            actions: [t('services.viewBill'), t('gas.meterReading'), t('gas.cngLocator')],
        },
        {
            icon: <WaterDrop sx={{ fontSize: 40 }} />,
            title: t('services.water'),
            color: '#1a73e8',
            path: '/water',
            actions: [t('services.viewBill'), t('water.tankerRequest'), t('water.reportLeakage')],
        },
        {
            icon: <ReportProblem sx={{ fontSize: 40 }} />,
            title: t('services.complaints'),
            color: '#e37400',
            path: '/complaints',
            actions: [t('complaints.submitComplaint'), t('complaints.trackStatus')],
        },
    ];

    const quickActions = [
        { icon: <Map />, label: t('maps.title'), path: '/maps' },
        { icon: <AccountBalance />, label: t('nav.schemes'), path: '/schemes' },
        { icon: <People />, label: t('nav.directory'), path: '/directory' },
    ];

    // Mock bills for demo
    const pendingBills = [
        { type: 'electricity', id: 'ELEC-2026-001', amount: 2847, dueIn: 5 },
        { type: 'gas', id: 'GAS-2026-001', amount: 1234, dueIn: 12 },
        { type: 'water', id: 'WATER-2026-001', amount: 890, dueIn: 8 },
    ];

    const totalDue = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

    const handlePayBill = (bill: typeof pendingBills[0]) => {
        navigate('/payment', {
            state: {
                billId: bill.id,
                billNumber: bill.id,
                amount: bill.amount,
                type: bill.type,
                consumerId: '123456789', // Mock ID
                dueDate: new Date(Date.now() + bill.dueIn * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
        });
    };

    const handlePayAll = () => {
        navigate('/payment', {
            state: {
                billId: 'ALL-BILLS',
                billNumber: 'CONSOLIDATED-' + new Date().getFullYear(),
                amount: totalDue,
                type: 'electricity', // Default to electricity or generic
                consumerId: user?.id || '123456789',
                dueDate: new Date().toISOString().split('T')[0],
            },
        });
    };

    return (
        <Box>
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 },
                        mb: 4,
                        background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
                        borderRadius: 3,
                        color: 'white',
                    }}
                >
                    <Grid2 container alignItems="center" spacing={3}>
                        <Grid2 size={{ xs: 12, md: 8 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: { xs: 48, md: 64 },
                                        height: { xs: 48, md: 64 },
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        fontSize: { xs: 20, md: 28 },
                                        fontWeight: 700,
                                    }}
                                >
                                    {user?.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' }, lineHeight: 1.2 }}>
                                        {t('dashboard.welcome', { name: user?.name })}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {t('dashboard.subtitle')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 4 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: { xs: 'flex-start', md: 'flex-end' },
                                }}
                            >
                                <Typography variant="overline" sx={{ opacity: 0.8 }}>
                                    {t('dashboard.totalDue')}
                                </Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', md: '3rem' } }}>
                                    ₹{totalDue.toLocaleString('en-IN')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 1,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                                    }}
                                    endIcon={<ArrowForward />}
                                    onClick={handlePayAll}
                                >
                                    {t('dashboard.payAll')}
                                </Button>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Paper>
            </motion.div>

            {/* Outstanding Bills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('dashboard.outstandingBills')}
                </Typography>
                <Grid2 container spacing={2} sx={{ mb: 4 }}>
                    {pendingBills.map((bill) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={bill.id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    borderLeft: 4,
                                    borderColor:
                                        bill.type === 'electricity'
                                            ? 'warning.main'
                                            : bill.type === 'gas'
                                                ? 'error.main'
                                                : 'primary.main',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {t(`services.${bill.type}`)} {t('dashboard.bill')}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            icon={<Schedule sx={{ fontSize: 14 }} />}
                                            label={`${bill.dueIn} ${t('common.days')}`}
                                            color={bill.dueIn <= 5 ? 'error' : 'default'}
                                        />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        ₹{bill.amount.toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {bill.id}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            fullWidth
                                            color={
                                                bill.type === 'electricity'
                                                    ? 'warning'
                                                    : bill.type === 'gas'
                                                        ? 'error'
                                                        : 'primary'
                                            }
                                            onClick={() => handlePayBill(bill)}
                                        >    {t('services.payBill')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>

            {/* Service Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('dashboard.quickActions')}
                </Typography>
                <Grid2 container spacing={3} sx={{ mb: 4 }}>
                    {serviceCards.map((service) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={service.title}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(service.path)}
                                    sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}
                                >
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: `${service.color}15`,
                                            color: service.color,
                                            mb: 2,
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {service.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {service.actions.map((action) => (
                                            <Chip
                                                key={action}
                                                label={action}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: 11 }}
                                            />
                                        ))}
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>

            {/* Quick Actions Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <Grid2 container spacing={2} sx={{ mb: 4 }}>
                    {quickActions.map((action) => (
                        <Grid2 size={{ xs: 12, sm: 4 }} key={action.label}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: 3 },
                                }}
                                onClick={() => navigate(action.path)}
                            >
                                <CardContent
                                    sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'primary.50',
                                            color: 'primary.main',
                                        }}
                                    >
                                        {action.icon}
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {action.label}
                                    </Typography>
                                    <ArrowForward sx={{ ml: 'auto', color: 'text.secondary' }} />
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            </motion.div>

            {/* Active Complaints Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {t('dashboard.activeComplaints')}
                            </Typography>
                            <Button
                                variant="text"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/complaints')}
                            >
                                {t('dashboard.viewAll')}
                            </Button>
                        </Box>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', borderRadius: 2 }}>
                                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                                        2
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('complaints.status.in_progress')}
                                    </Typography>
                                </Box>
                            </Grid2>
                            <Grid2 size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                                        1
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('complaints.status.assigned')}
                                    </Typography>
                                </Box>
                            </Grid2>
                            <Grid2 size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                                        5
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('complaints.status.resolved')}
                                    </Typography>
                                </Box>
                            </Grid2>
                            <Grid2 size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'neutral.100', borderRadius: 2 }}>
                                    <Typography variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
                                        8
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('common.total')}
                                    </Typography>
                                </Box>
                            </Grid2>
                        </Grid2>
                    </CardContent>
                </Card>
            </motion.div>
        </Box >
    );
};

export default DashboardPage;
