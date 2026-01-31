import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Grid2 from '@mui/material/Grid2';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    LinearProgress,
    Chip,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    Download,
    CalendarMonth,
    Assessment,
} from '@mui/icons-material';

// Mock analytics data
const generateAnalyticsData = (period: string) => ({
    overview: {
        totalTransactions: period === 'week' ? 4523 : period === 'month' ? 18934 : 67234,
        totalRevenue: period === 'week' ? 12340000 : period === 'month' ? 48560000 : 178900000,
        activeUsers: period === 'week' ? 8934 : period === 'month' ? 24567 : 45678,
        complaintsResolved: period === 'week' ? 234 : period === 'month' ? 892 : 3456,
        avgResolutionTime: 18.5,
    },
    trends: {
        transactions: { change: 12.5, direction: 'up' },
        revenue: { change: 8.3, direction: 'up' },
        users: { change: 15.2, direction: 'up' },
        complaints: { change: -5.4, direction: 'down' },
    },
    byService: [
        { service: 'Electricity', transactions: 45, revenue: 52, complaints: 48 },
        { service: 'Gas', transactions: 28, revenue: 25, complaints: 22 },
        { service: 'Water', transactions: 27, revenue: 23, complaints: 30 },
    ],
    resolutionByPriority: [
        { priority: 'Emergency', count: 45, avgTime: 3.2, slaCompliance: 98 },
        { priority: 'High', count: 234, avgTime: 12.5, slaCompliance: 94 },
        { priority: 'Medium', count: 567, avgTime: 24.3, slaCompliance: 89 },
        { priority: 'Low', count: 346, avgTime: 48.7, slaCompliance: 95 },
    ],
    topLocations: [
        { area: 'Andheri', complaints: 234, resolved: 212 },
        { area: 'Borivali', complaints: 198, resolved: 189 },
        { area: 'Bandra', complaints: 156, resolved: 145 },
        { area: 'Thane', complaints: 143, resolved: 138 },
        { area: 'Powai', complaints: 112, resolved: 108 },
    ],
    dailyTrend: Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        transactions: Math.floor(500 + Math.random() * 300),
        complaints: Math.floor(30 + Math.random() * 20),
    })),
});

const ReportsAnalytics = () => {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('month');
    const [data, setData] = useState(generateAnalyticsData('month'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setData(generateAnalyticsData(period));
            setLoading(false);
        }, 500);
    }, [period]);

    const formatCurrency = (amount: number) =>
        `â‚¹${(amount / 100000).toFixed(1)}L`;

    const formatNumber = (num: number) =>
        num.toLocaleString('en-IN');

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Reports & Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Performance metrics and insights
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Period</InputLabel>
                        <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
                            <MenuItem value="week">Last 7 Days</MenuItem>
                            <MenuItem value="month">Last 30 Days</MenuItem>
                            <MenuItem value="year">This Year</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="outlined" startIcon={<Download />}>
                        Export PDF
                    </Button>
                </Box>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Overview Cards */}
            <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Total Transactions</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                                {formatNumber(data.overview.totalTransactions)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {data.trends.transactions.direction === 'up' ? (
                                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                ) : (
                                    <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                                )}
                                <Typography
                                    variant="caption"
                                    color={data.trends.transactions.direction === 'up' ? 'success.main' : 'error.main'}
                                >
                                    {data.trends.transactions.change}% vs last period
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                                {formatCurrency(data.overview.totalRevenue)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="caption" color="success.main">
                                    {data.trends.revenue.change}% vs last period
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Active Users</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                                {formatNumber(data.overview.activeUsers)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="caption" color="success.main">
                                    {data.trends.users.change}% vs last period
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Complaints Resolved</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                                {formatNumber(data.overview.complaintsResolved)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Avg. {data.overview.avgResolutionTime}h resolution
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={3}>
                {/* Service Distribution */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                                Distribution by Service
                            </Typography>
                            {data.byService.map((service) => (
                                <Box key={service.service} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        {service.service === 'Electricity' && <ElectricBolt sx={{ color: '#fbbc04' }} />}
                                        {service.service === 'Gas' && <LocalGasStation sx={{ color: '#ea4335' }} />}
                                        {service.service === 'Water' && <WaterDrop sx={{ color: '#1a73e8' }} />}
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{service.service}</Typography>
                                    </Box>
                                    <Grid2 container spacing={2}>
                                        <Grid2 size={{ xs: 4 }}>
                                            <Typography variant="caption" color="text.secondary">Transactions</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={service.transactions}
                                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                                />
                                                <Typography variant="body2">{service.transactions}%</Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 size={{ xs: 4 }}>
                                            <Typography variant="caption" color="text.secondary">Revenue</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={service.revenue}
                                                    color="success"
                                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                                />
                                                <Typography variant="body2">{service.revenue}%</Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 size={{ xs: 4 }}>
                                            <Typography variant="caption" color="text.secondary">Complaints</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={service.complaints}
                                                    color="warning"
                                                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                                />
                                                <Typography variant="body2">{service.complaints}%</Typography>
                                            </Box>
                                        </Grid2>
                                    </Grid2>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Resolution by Priority */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Resolution Performance by Priority
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Priority</TableCell>
                                        <TableCell align="right">Count</TableCell>
                                        <TableCell align="right">Avg Time</TableCell>
                                        <TableCell align="right">SLA</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.resolutionByPriority.map((row) => (
                                        <TableRow key={row.priority}>
                                            <TableCell>
                                                <Chip
                                                    label={row.priority}
                                                    size="small"
                                                    color={
                                                        row.priority === 'Emergency' ? 'error' :
                                                            row.priority === 'High' ? 'warning' :
                                                                row.priority === 'Medium' ? 'info' : 'default'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="right">{row.count}</TableCell>
                                            <TableCell align="right">{row.avgTime}h</TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    color={row.slaCompliance >= 90 ? 'success.main' : 'warning.main'}
                                                >
                                                    {row.slaCompliance}%
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Top Complaint Locations */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Top Complaint Areas
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Area</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="right">Resolved</TableCell>
                                        <TableCell align="right">Rate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.topLocations.map((loc) => (
                                        <TableRow key={loc.area}>
                                            <TableCell>{loc.area}</TableCell>
                                            <TableCell align="right">{loc.complaints}</TableCell>
                                            <TableCell align="right">{loc.resolved}</TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    color={
                                                        (loc.resolved / loc.complaints) * 100 >= 90
                                                            ? 'success.main'
                                                            : 'warning.main'
                                                    }
                                                >
                                                    {((loc.resolved / loc.complaints) * 100).toFixed(0)}%
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Daily Trend */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Daily Trend (Last 7 Days)
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                {data.dailyTrend.map((day) => (
                                    <Box key={day.day} sx={{ textAlign: 'center', flex: 1 }}>
                                        <Box
                                            sx={{
                                                height: Math.min(100, day.transactions / 8),
                                                bgcolor: 'primary.main',
                                                borderRadius: 1,
                                                mb: 1,
                                                mx: 0.5,
                                            }}
                                        />
                                        <Typography variant="caption" display="block">{day.day}</Typography>
                                        <Typography variant="caption" color="text.secondary">{day.transactions}</Typography>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', gap: 4 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Total Transactions</Typography>
                                    <Typography variant="h6">
                                        {formatNumber(data.dailyTrend.reduce((sum, d) => sum + d.transactions, 0))}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Total Complaints</Typography>
                                    <Typography variant="h6">
                                        {formatNumber(data.dailyTrend.reduce((sum, d) => sum + d.complaints, 0))}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ReportsAnalytics;

