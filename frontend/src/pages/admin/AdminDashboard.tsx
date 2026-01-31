import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid2 from '@mui/material/Grid2';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Button,
    Chip,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People,
    ReportProblem,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    TrendingUp,
    TrendingDown,
    Visibility,
    Search,
    Refresh,
    Download,
    FilterList,
} from '@mui/icons-material';
import ReportsAnalytics from './ReportsAnalytics';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
);

const AdminDashboard = () => {
    const { t } = useTranslation();
    void t; // Suppress unused warning
    const [tabValue, setTabValue] = useState(0);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock statistics
    const stats = {
        totalUsers: 45678,
        activeKiosks: 127,
        totalComplaints: 3456,
        resolvedToday: 234,
        pendingPayments: 12345678,
        avgResolutionTime: 18.5,
    };

    // Mock complaints data
    const complaints = [
        {
            id: 'CMP-2026-001',
            citizen: 'Priya Sharma',
            mobile: '+91 9876543210',
            category: 'electricity',
            subcategory: 'Power Outage',
            location: 'Andheri West, Mumbai',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2026-01-27 06:30',
            assignedTo: 'Rajesh Kumar',
            slaStatus: 'on_track',
        },
        {
            id: 'CMP-2026-002',
            citizen: 'Amit Patel',
            mobile: '+91 9765432109',
            category: 'water',
            subcategory: 'Low Pressure',
            location: 'Borivali East, Mumbai',
            priority: 'medium',
            status: 'registered',
            createdAt: '2026-01-27 08:15',
            assignedTo: null,
            slaStatus: 'on_track',
        },
        {
            id: 'CMP-2026-003',
            citizen: 'Sunita Joshi',
            mobile: '+91 9654321098',
            category: 'gas',
            subcategory: 'Gas Leak',
            location: 'Malad West, Mumbai',
            priority: 'emergency',
            status: 'assigned',
            createdAt: '2026-01-27 09:00',
            assignedTo: 'Amit Shah',
            slaStatus: 'breached',
        },
        {
            id: 'CMP-2026-004',
            citizen: 'Vikas Mehta',
            mobile: '+91 9543210987',
            category: 'electricity',
            subcategory: 'Meter Problem',
            location: 'Bandra West, Mumbai',
            priority: 'low',
            status: 'resolved',
            createdAt: '2026-01-26 14:20',
            assignedTo: 'Priya Gupta',
            slaStatus: 'completed',
        },
    ];

    // Mock kiosks data
    const kiosks = [
        { id: 'KSK-001', location: 'Andheri Station', status: 'online', lastPing: '2 min ago', transactions: 456, uptime: 99.8 },
        { id: 'KSK-002', location: 'Bandra Terminus', status: 'online', lastPing: '1 min ago', transactions: 389, uptime: 99.5 },
        { id: 'KSK-003', location: 'CST Main Hall', status: 'offline', lastPing: '45 min ago', transactions: 0, uptime: 95.2 },
        { id: 'KSK-004', location: 'Dadar East', status: 'online', lastPing: '3 min ago', transactions: 567, uptime: 99.9 },
        { id: 'KSK-005', location: 'Thane West', status: 'maintenance', lastPing: '2 hrs ago', transactions: 0, uptime: 98.1 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registered': return 'info';
            case 'assigned': return 'secondary';
            case 'in_progress': return 'warning';
            case 'resolved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'emergency': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'default';
            default: return 'default';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'electricity': return <ElectricBolt sx={{ color: '#fbbc04' }} />;
            case 'gas': return <LocalGasStation sx={{ color: '#ea4335' }} />;
            case 'water': return <WaterDrop sx={{ color: '#1a73e8' }} />;
            default: return <ReportProblem />;
        }
    };

    const filteredComplaints = complaints.filter((c) => {
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.citizen.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <Box sx={{ p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        SUVIDHA Kiosk Management System
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Download />}>
                        Export Report
                    </Button>
                    <Button variant="contained" startIcon={<Refresh />}>
                        Refresh Data
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid2 container spacing={3} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <People color="primary" />
                                <Typography variant="body2" color="text.secondary">Total Users</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.totalUsers.toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="caption" color="success.main">+12% this month</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <DashboardIcon color="primary" />
                                <Typography variant="body2" color="text.secondary">Active Kiosks</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.activeKiosks}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">5 offline</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <ReportProblem color="warning" />
                                <Typography variant="body2" color="text.secondary">Open Complaints</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.totalComplaints.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{stats.resolvedToday} resolved today</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Pending Payments</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                ₹{(stats.pendingPayments / 10000000).toFixed(1)}Cr
                            </Typography>
                            <Typography variant="caption" color="text.secondary">Across all utilities</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Avg Resolution</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {stats.avgResolutionTime}h
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrendingDown sx={{ fontSize: 16, color: 'success.main' }} />
                                <Typography variant="caption" color="success.main">-2h from last week</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>

            {/* Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Complaints Management" />
                    <Tab label="Kiosk Status" />
                    <Tab label="Reports" />
                </Tabs>

                {/* Complaints Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ p: 2 }}>
                        {/* Filters */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField
                                placeholder="Search by ID, name, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                                }}
                                sx={{ flex: 1 }}
                            />
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>Status</InputLabel>
                                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="registered">Registered</MenuItem>
                                    <MenuItem value="assigned">Assigned</MenuItem>
                                    <MenuItem value="in_progress">In Progress</MenuItem>
                                    <MenuItem value="resolved">Resolved</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="outlined" startIcon={<FilterList />}>
                                More Filters
                            </Button>
                        </Box>

                        {/* Complaints Table */}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Citizen</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Assigned To</TableCell>
                                    <TableCell>SLA</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredComplaints.map((complaint) => (
                                    <TableRow key={complaint.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{complaint.id}</Typography>
                                            <Typography variant="caption" color="text.secondary">{complaint.createdAt}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{complaint.citizen}</Typography>
                                            <Typography variant="caption" color="text.secondary">{complaint.mobile}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getCategoryIcon(complaint.category)}
                                                <Typography variant="body2">{complaint.subcategory}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{complaint.location}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={complaint.priority}
                                                size="small"
                                                color={getPriorityColor(complaint.priority) as any}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={complaint.status.replace('_', ' ')}
                                                size="small"
                                                color={getStatusColor(complaint.status) as any}
                                            />
                                        </TableCell>
                                        <TableCell>{complaint.assignedTo || '-'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={complaint.slaStatus.replace('_', ' ')}
                                                size="small"
                                                color={complaint.slaStatus === 'breached' ? 'error' : 'success'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedComplaint(complaint);
                                                    setComplaintDialogOpen(true);
                                                }}
                                            >
                                                <Visibility />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </TabPanel>

                {/* Kiosk Status Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 2 }}>
                        <Grid2 container spacing={3}>
                            {kiosks.map((kiosk) => (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={kiosk.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            borderLeft: 4,
                                            borderColor: kiosk.status === 'online' ? 'success.main' : kiosk.status === 'offline' ? 'error.main' : 'warning.main',
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{kiosk.id}</Typography>
                                                <Chip
                                                    label={kiosk.status}
                                                    size="small"
                                                    color={kiosk.status === 'online' ? 'success' : kiosk.status === 'offline' ? 'error' : 'warning'}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{ mb: 1 }}>{kiosk.location}</Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Last ping: {kiosk.lastPing}
                                            </Typography>
                                            <Divider sx={{ my: 2 }} />
                                            <Grid2 container spacing={2}>
                                                <Grid2 size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">Today's Txns</Typography>
                                                    <Typography variant="h6">{kiosk.transactions}</Typography>
                                                </Grid2>
                                                <Grid2 size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">Uptime</Typography>
                                                    <Typography variant="h6">{kiosk.uptime}%</Typography>
                                                </Grid2>
                                            </Grid2>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Box>
                </TabPanel>

                {/* Reports Tab */}
                <TabPanel value={tabValue} index={2}>
                    <ReportsAnalytics />
                </TabPanel>
            </Paper>

            {/* Complaint Detail Dialog */}
            <Dialog open={complaintDialogOpen} onClose={() => setComplaintDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Complaint Details - {selectedComplaint?.id}
                </DialogTitle>
                <DialogContent>
                    {selectedComplaint && (
                        <Grid2 container spacing={3} sx={{ mt: 1 }}>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Citizen</Typography>
                                <Typography variant="body1">{selectedComplaint.citizen}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Mobile</Typography>
                                <Typography variant="body1">{selectedComplaint.mobile}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Category</Typography>
                                <Typography variant="body1">{selectedComplaint.subcategory}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Location</Typography>
                                <Typography variant="body1">{selectedComplaint.location}</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Priority</Typography>
                                <Chip label={selectedComplaint.priority} color={getPriorityColor(selectedComplaint.priority) as any} />
                            </Grid2>
                            <Grid2 size={{ xs: 6 }}>
                                <Typography variant="caption" color="text.secondary">Status</Typography>
                                <Chip label={selectedComplaint.status} color={getStatusColor(selectedComplaint.status) as any} />
                            </Grid2>
                        </Grid2>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setComplaintDialogOpen(false)}>Close</Button>
                    <Button variant="outlined" color="warning">Reassign</Button>
                    <Button variant="contained" color="success">Mark Resolved</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;
