import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Chip,
    Button,
    IconButton,
    LinearProgress,
    Avatar,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ThumbUp,
    ThumbUpOutlined,
    LocationOn,
    ElectricBolt,
    WaterDrop,
    LocalGasStation,
    Construction,
    TrendingUp,
    CheckCircle,
    Schedule,
    Map,
    ArrowForward,
} from '@mui/icons-material';

// Mock community complaint data (anonymized)
const communityComplaints = [
    { id: 'CC-001', type: 'electricity', area: 'Adajan', title: 'Frequent power cuts in ward 12', upvotes: 47, status: 'in_progress', reportedBy: 'Citizens (3)', date: '2026-02-22', daysActive: 4 },
    { id: 'CC-002', type: 'water', area: 'Varachha', title: 'Low water pressure since 3 days', upvotes: 89, status: 'assigned', reportedBy: 'Citizens (7)', date: '2026-02-20', daysActive: 6 },
    { id: 'CC-003', type: 'gas', area: 'Katargam', title: 'Gas smell near Katargam junction', upvotes: 122, status: 'in_progress', reportedBy: 'Citizens (12)', date: '2026-02-21', daysActive: 5 },
    { id: 'CC-004', type: 'roads', area: 'Rander', title: 'Pothole on main road near school', upvotes: 65, status: 'resolved', reportedBy: 'Citizens (5)', date: '2026-02-15', daysActive: 0, resolvedIn: '4 days' },
    { id: 'CC-005', type: 'electricity', area: 'Vesu', title: 'Streetlights not working on ring road', upvotes: 34, status: 'pending', reportedBy: 'Citizens (2)', date: '2026-02-24', daysActive: 2 },
    { id: 'CC-006', type: 'water', area: 'Udhna', title: 'Contaminated water supply', upvotes: 156, status: 'in_progress', reportedBy: 'Citizens (15)', date: '2026-02-19', daysActive: 7 },
];

const areaStats = [
    { area: 'Varachha', complaints: 23, resolved: 18, avgDays: 3.2 },
    { area: 'Adajan', complaints: 15, resolved: 12, avgDays: 2.8 },
    { area: 'Katargam', complaints: 19, resolved: 14, avgDays: 4.1 },
    { area: 'Rander', complaints: 12, resolved: 11, avgDays: 2.5 },
    { area: 'Vesu', complaints: 8, resolved: 7, avgDays: 1.9 },
    { area: 'Udhna', complaints: 17, resolved: 13, avgDays: 3.6 },
];

const typeIcons: Record<string, React.ReactNode> = {
    electricity: <ElectricBolt sx={{ color: '#fbbc04' }} />,
    water: <WaterDrop sx={{ color: '#1a73e8' }} />,
    gas: <LocalGasStation sx={{ color: '#ea4335' }} />,
    roads: <Construction sx={{ color: '#9e9e9e' }} />,
};

const statusColors: Record<string, string> = {
    pending: '#ff9800',
    assigned: '#2196f3',
    in_progress: '#7c4dff',
    resolved: '#4caf50',
};

const CommunityPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [upvoted, setUpvoted] = useState<string[]>([]);

    const handleUpvote = (id: string) => {
        setUpvoted(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
    };

    const filtered = filter === 'all' ? communityComplaints : communityComplaints.filter(c => c.type === filter);
    const totalResolved = areaStats.reduce((s, a) => s + a.resolved, 0);
    const totalComplaints = areaStats.reduce((s, a) => s + a.complaints, 0);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                🏘️ Community Transparency Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                See what issues your community is facing and track resolution progress
            </Typography>

            {/* Stats Row */}
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="primary.main">{totalComplaints}</Typography>
                        <Typography variant="caption" color="text.secondary">Total Reports</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="success.main">{totalResolved}</Typography>
                        <Typography variant="caption" color="text.secondary">Resolved</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="warning.main">{totalComplaints - totalResolved}</Typography>
                        <Typography variant="caption" color="text.secondary">Active Issues</Typography>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 6, sm: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700}>3.0d</Typography>
                        <Typography variant="caption" color="text.secondary">Avg Resolution</Typography>
                    </Paper>
                </Grid2>
            </Grid2>

            {/* Filter */}
            <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small" sx={{ mb: 3 }}>
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="electricity">⚡ Electricity</ToggleButton>
                <ToggleButton value="water">💧 Water</ToggleButton>
                <ToggleButton value="gas">🔥 Gas</ToggleButton>
                <ToggleButton value="roads">🛣️ Roads</ToggleButton>
            </ToggleButtonGroup>

            {/* Complaints List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {filtered.map(c => (
                    <Card key={c.id} sx={{ borderRadius: 2, borderLeft: `4px solid ${statusColors[c.status]}` }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                                <IconButton onClick={() => handleUpvote(c.id)} size="small">
                                    {upvoted.includes(c.id) ? <ThumbUp color="primary" /> : <ThumbUpOutlined />}
                                </IconButton>
                                <Typography variant="body2" fontWeight={700} color={upvoted.includes(c.id) ? 'primary.main' : 'text.secondary'}>
                                    {c.upvotes + (upvoted.includes(c.id) ? 1 : 0)}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    {typeIcons[c.type]}
                                    <Typography fontWeight={600}>{c.title}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Chip icon={<LocationOn />} label={c.area} size="small" variant="outlined" />
                                    <Chip label={c.status.replace('_', ' ')} size="small" sx={{ bgcolor: `${statusColors[c.status]}20`, color: statusColors[c.status], fontWeight: 600 }} />
                                    <Typography variant="caption" color="text.secondary">{c.reportedBy} • {c.date}</Typography>
                                    {c.status === 'resolved' && <Chip icon={<CheckCircle />} label={`Resolved in ${c.resolvedIn}`} size="small" color="success" variant="outlined" />}
                                    {c.daysActive > 0 && <Chip icon={<Schedule />} label={`${c.daysActive}d active`} size="small" color={c.daysActive > 5 ? 'error' : 'default'} variant="outlined" />}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Area-wise Stats */}
            <Typography variant="h6" fontWeight={600} gutterBottom>📊 Area-wise Resolution</Typography>
            <Grid2 container spacing={2}>
                {areaStats.map(a => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={a.area}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography fontWeight={600}>{a.area}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">{a.resolved}/{a.complaints} resolved</Typography>
                                <Typography variant="body2" fontWeight={600}>{Math.round((a.resolved / a.complaints) * 100)}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={(a.resolved / a.complaints) * 100} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
                            <Typography variant="caption" color="text.secondary">Avg resolution: {a.avgDays} days</Typography>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button variant="contained" endIcon={<Map />} onClick={() => navigate('/maps')} size="large">
                    View Issues on Map
                </Button>
            </Box>
        </Box>
    );
};

export default CommunityPage;
