import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Chip,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Alert,
    Divider,
    LinearProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ElectricBolt,
    WaterDrop,
    LocalGasStation,
    TrendingDown,
    TrendingUp,
    EmojiObjects,
    Speed,
    Groups,
} from '@mui/icons-material';

// Mock consumption data for charts (rendered as bar visualizations)
const monthlyData = [
    { month: 'Sep', electricity: 220, water: 12, gas: 10 },
    { month: 'Oct', electricity: 245, water: 14, gas: 11 },
    { month: 'Nov', electricity: 198, water: 11, gas: 13 },
    { month: 'Dec', electricity: 280, water: 15, gas: 14 },
    { month: 'Jan', electricity: 265, water: 13, gas: 12 },
    { month: 'Feb', electricity: 210, water: 11, gas: 10 },
];

const peerComparison = {
    electricity: { yours: 245, avg: 212, percentile: 67 },
    water: { yours: 13, avg: 11, percentile: 72 },
    gas: { yours: 11.5, avg: 10, percentile: 60 },
};

const savingTips = [
    { service: 'electricity', tip: 'Switch to LED bulbs to save up to 80% on lighting costs', savings: '₹450/month', icon: <EmojiObjects /> },
    { service: 'electricity', tip: 'Set AC to 24°C — each degree lower increases consumption by 6%', savings: '₹600/month', icon: <Speed /> },
    { service: 'water', tip: 'Fix leaking taps — a dripping tap wastes 15L/day', savings: '₹120/month', icon: <WaterDrop /> },
    { service: 'gas', tip: 'Use pressure cooker — reduces gas consumption by 70%', savings: '₹200/month', icon: <LocalGasStation /> },
];

const UsageAnalyticsPage = () => {
    const [service, setService] = useState('electricity');

    const units: Record<string, string> = { electricity: 'kWh', water: 'KL', gas: 'SCM' };
    const colors: Record<string, string> = { electricity: '#fbbc04', water: '#1a73e8', gas: '#ea4335' };
    const currentData = peerComparison[service as keyof typeof peerComparison];
    const maxVal = Math.max(...monthlyData.map(d => d[service as keyof typeof d] as number));

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                📊 Usage Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track your consumption, compare with peers, and discover savings
            </Typography>

            {/* Service Selector */}
            <ToggleButtonGroup value={service} exclusive onChange={(_, v) => v && setService(v)} sx={{ mb: 3 }}>
                <ToggleButton value="electricity"><ElectricBolt sx={{ mr: 0.5, color: '#fbbc04' }} /> Electricity</ToggleButton>
                <ToggleButton value="water"><WaterDrop sx={{ mr: 0.5, color: '#1a73e8' }} /> Water</ToggleButton>
                <ToggleButton value="gas"><LocalGasStation sx={{ mr: 0.5, color: '#ea4335' }} /> Gas</ToggleButton>
            </ToggleButtonGroup>

            {/* Current Month Stats */}
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2.5, borderRadius: 2, borderLeft: `4px solid ${colors[service]}` }}>
                        <Typography variant="overline" color="text.secondary">Your Usage (This Month)</Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ color: colors[service] }}>
                            {currentData.yours} <Typography component="span" variant="body1">{units[service]}</Typography>
                        </Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                        <Typography variant="overline" color="text.secondary">Area Average</Typography>
                        <Typography variant="h3" fontWeight={800} color="text.secondary">
                            {currentData.avg} <Typography component="span" variant="body1">{units[service]}</Typography>
                        </Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2.5, borderRadius: 2, bgcolor: currentData.yours > currentData.avg ? 'error.50' : 'success.50' }}>
                        <Typography variant="overline" color="text.secondary">Peer Comparison</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {currentData.yours > currentData.avg ? (
                                <TrendingUp sx={{ color: 'error.main', fontSize: 32 }} />
                            ) : (
                                <TrendingDown sx={{ color: 'success.main', fontSize: 32 }} />
                            )}
                            <Typography variant="h4" fontWeight={700} color={currentData.yours > currentData.avg ? 'error.main' : 'success.main'}>
                                {Math.abs(Math.round(((currentData.yours - currentData.avg) / currentData.avg) * 100))}%
                            </Typography>
                            <Typography variant="body2">
                                {currentData.yours > currentData.avg ? 'above' : 'below'} average
                            </Typography>
                        </Box>
                    </Paper>
                </Grid2>
            </Grid2>

            {/* Monthly Bar Chart (CSS-based) */}
            <Card sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Monthly Consumption Trend</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 200, mt: 2 }}>
                    {monthlyData.map((d, i) => {
                        const val = d[service as keyof typeof d] as number;
                        const height = (val / maxVal) * 160;
                        return (
                            <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
                                <Typography variant="caption" fontWeight={600}>{val}</Typography>
                                <Box sx={{
                                    height: height,
                                    bgcolor: colors[service],
                                    opacity: i === monthlyData.length - 1 ? 1 : 0.5 + (i * 0.08),
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.5s ease',
                                    mx: 'auto',
                                    width: '80%',
                                }} />
                                <Typography variant="caption" color="text.secondary">{d.month}</Typography>
                            </Box>
                        );
                    })}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">← Past 6 months</Typography>
                    <Chip icon={<Groups />} label={`Your percentile: Top ${currentData.percentile}%`} size="small" color="primary" variant="outlined" />
                </Box>
            </Card>

            {/* Peer Comparison Bar */}
            <Card sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                    How You Compare
                </Typography>
                <Alert severity={currentData.yours > currentData.avg ? 'warning' : 'success'} sx={{ mb: 2, borderRadius: 2 }}>
                    {currentData.yours > currentData.avg
                        ? `You use ${Math.round(((currentData.yours - currentData.avg) / currentData.avg) * 100)}% more ${service} than similar households in your area. See tips below to reduce usage!`
                        : `Great job! You use ${Math.round(((currentData.avg - currentData.yours) / currentData.avg) * 100)}% less ${service} than similar households. Keep it up!`
                    }
                </Alert>
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={600}>You</Typography>
                        <Typography variant="body2">{currentData.yours} {units[service]}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min((currentData.yours / Math.max(currentData.yours, currentData.avg * 1.5)) * 100, 100)}
                        sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: colors[service] } }}
                    />
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight={600}>Area Average</Typography>
                        <Typography variant="body2">{currentData.avg} {units[service]}</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min((currentData.avg / Math.max(currentData.yours, currentData.avg * 1.5)) * 100, 100)}
                        sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: 'grey.500' } }}
                    />
                </Box>
            </Card>

            {/* AI Saving Tips */}
            <Typography variant="h6" fontWeight={600} gutterBottom>
                💡 AI-Powered Saving Tips
            </Typography>
            <Grid2 container spacing={2}>
                {savingTips.filter(t => service === 'electricity' ? true : t.service === service).map((tip, i) => (
                    <Grid2 size={{ xs: 12, sm: 6 }} key={i}>
                        <Card sx={{ borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
                            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main' }}>
                                    {tip.icon}
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>{tip.tip}</Typography>
                                    <Chip label={`Save ${tip.savings}`} size="small" color="success" sx={{ mt: 0.5 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default UsageAnalyticsPage;
