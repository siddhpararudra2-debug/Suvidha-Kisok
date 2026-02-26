import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Paper,
    Chip,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    LinearProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    WaterDrop,
    Receipt,
    Payment,
    LocalShipping,
    ReportProblem,
    Description,
    Schedule,
    Recycling,
    DeleteSweep,
    Science,
    VerifiedUser,
    AddCircle,
    CheckCircle,
    Warning,
    LocationOn,
    RestoreFromTrash,
    CleaningServices,
    LocalPolice,
    Link as LinkIcon,
    Circle,
    CalendarMonth,
    Map,
    Assessment,
} from '@mui/icons-material';

// ===== Water Services Data =====
const waterServices = [
    {
        id: 'water-bill',
        icon: <Receipt />,
        title: 'View & Pay Water Bill',
        desc: 'Check current bill, payment history & pay online',
        color: '#1a73e8',
        type: 'payment',
    },
    {
        id: 'water-schedule',
        icon: <Schedule />,
        title: 'Water Supply Schedule',
        desc: 'Area-wise water supply timings',
        color: '#00bcd4',
        type: 'info',
    },
    {
        id: 'water-tanker',
        icon: <LocalShipping />,
        title: 'Request Water Tanker',
        desc: 'Book municipal tanker supply',
        color: '#ff9800',
        type: 'action',
    },
    {
        id: 'water-leakage',
        icon: <ReportProblem />,
        title: 'Report Leakage / Pipe Burst',
        desc: 'Report water leakage or pipe burst in your area',
        color: '#ea4335',
        type: 'complaint',
    },
    {
        id: 'water-connection',
        icon: <AddCircle />,
        title: 'New Water Connection',
        desc: 'Apply for new residential or commercial connection',
        color: '#34a853',
        type: 'application',
    },
    {
        id: 'water-quality',
        icon: <Science />,
        title: 'Water Quality Report',
        desc: 'View latest water testing results for your zone',
        color: '#9c27b0',
        type: 'info',
    },
    {
        id: 'water-certificates',
        icon: <VerifiedUser />,
        title: 'Certificates',
        desc: 'No Dues Certificate, Connection Certificate',
        color: '#673ab7',
        type: 'document',
    },
];

// ===== Waste Management Data =====
const wasteServices = [
    {
        id: 'waste-schedule',
        icon: <CalendarMonth />,
        title: 'Garbage Collection Schedule',
        desc: 'Zone/ward-wise daily collection timings',
        color: '#4caf50',
        type: 'info',
    },
    {
        id: 'waste-pickup',
        icon: <LocalShipping />,
        title: 'Request Special Pickup',
        desc: 'Bulk waste, debris, e-waste pickup request',
        color: '#ff9800',
        type: 'action',
    },
    {
        id: 'waste-dustbin',
        icon: <DeleteSweep />,
        title: 'Report Overflowing Dustbin',
        desc: 'Report missed collection or overflowing bin',
        color: '#ea4335',
        type: 'complaint',
    },
    {
        id: 'waste-segregation',
        icon: <RestoreFromTrash />,
        title: 'Segregation Guide',
        desc: 'Dry / Wet / Hazardous waste classification',
        color: '#2196f3',
        type: 'info',
    },
    {
        id: 'waste-recycling',
        icon: <Recycling />,
        title: 'Recycling Center Locator',
        desc: 'Find nearest recycling center on map',
        color: '#009688',
        type: 'map',
    },
    {
        id: 'waste-complaints',
        icon: <Assessment />,
        title: 'Complaint Tracking',
        desc: 'Track status of your waste management complaints',
        color: '#7c4dff',
        type: 'track',
    },
    {
        id: 'waste-permit',
        icon: <LocalPolice />,
        title: 'Commercial Waste Permit',
        desc: 'Apply for commercial/industrial waste disposal permit',
        color: '#795548',
        type: 'application',
    },
    {
        id: 'waste-swachh',
        icon: <CleaningServices />,
        title: 'Swachh Bharat Portal',
        desc: 'Link to Swachh Bharat Mission grievance portal',
        color: '#ff5722',
        type: 'external',
    },
];

// ===== Mock data for dialogs =====
const waterScheduleData = [
    { zone: 'Zone 1 - Adajan', morning: '6:00 AM - 9:00 AM', evening: '5:00 PM - 7:00 PM', status: 'Normal' },
    { zone: 'Zone 2 - Varachha', morning: '6:30 AM - 9:30 AM', evening: '5:30 PM - 7:30 PM', status: 'Normal' },
    { zone: 'Zone 3 - Katargam', morning: '7:00 AM - 10:00 AM', evening: '6:00 PM - 8:00 PM', status: 'Low Pressure' },
    { zone: 'Zone 4 - Rander', morning: '6:00 AM - 8:30 AM', evening: '5:00 PM - 7:00 PM', status: 'Normal' },
    { zone: 'Zone 5 - Udhna', morning: '7:00 AM - 10:00 AM', evening: '5:30 PM - 8:00 PM', status: 'Normal' },
    { zone: 'Zone 6 - Vesu', morning: '6:30 AM - 9:00 AM', evening: '5:00 PM - 7:30 PM', status: 'Normal' },
];

const garbageSchedule = [
    { zone: 'Zone 1 - Adajan', wet: '7:00 AM', dry: '10:00 AM', vehicle: 'AMC-WM-12', status: 'On Time' },
    { zone: 'Zone 2 - Varachha', wet: '6:30 AM', dry: '9:30 AM', vehicle: 'AMC-WM-08', status: 'On Time' },
    { zone: 'Zone 3 - Katargam', wet: '7:30 AM', dry: '10:30 AM', vehicle: 'AMC-WM-15', status: 'Delayed' },
    { zone: 'Zone 4 - Rander', wet: '6:00 AM', dry: '9:00 AM', vehicle: 'AMC-WM-03', status: 'On Time' },
    { zone: 'Zone 5 - Udhna', wet: '7:00 AM', dry: '10:00 AM', vehicle: 'AMC-WM-21', status: 'On Time' },
];

const waterQualityData = [
    { param: 'pH Level', value: '7.2', standard: '6.5 - 8.5', status: '✅ Safe' },
    { param: 'TDS (mg/L)', value: '280', standard: '< 500', status: '✅ Safe' },
    { param: 'Chlorine (mg/L)', value: '0.4', standard: '0.2 - 1.0', status: '✅ Safe' },
    { param: 'Turbidity (NTU)', value: '1.8', standard: '< 5', status: '✅ Safe' },
    { param: 'Coliform (MPN/100ml)', value: '0', standard: '0', status: '✅ Safe' },
    { param: 'Iron (mg/L)', value: '0.15', standard: '< 0.3', status: '✅ Safe' },
];

const segregationGuide = [
    { type: 'Wet Waste (Green Bin)', items: ['Kitchen waste', 'Fruit/vegetable peels', 'Leftover food', 'Tea/coffee grounds', 'Egg shells', 'Garden waste'], color: '#4caf50' },
    { type: 'Dry Waste (Blue Bin)', items: ['Paper', 'Cardboard', 'Plastic bottles', 'Glass', 'Metal cans', 'Tetra Pak'], color: '#2196f3' },
    { type: 'Hazardous (Red Bin)', items: ['Batteries', 'Medicine strips', 'Paint cans', 'CFL bulbs', 'Electronics', 'Chemical containers'], color: '#ea4335' },
];

const MunicipalPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    const [tankerForm, setTankerForm] = useState({ address: '', zone: '', date: '', reason: '' });
    const [tankerSubmitted, setTankerSubmitted] = useState(false);
    const [reportForm, setReportForm] = useState({ location: '', description: '', type: 'leakage' });
    const [reportSubmitted, setReportSubmitted] = useState(false);
    const [pickupForm, setPickupForm] = useState({ type: 'bulk', address: '', description: '', date: '' });
    const [pickupSubmitted, setPickupSubmitted] = useState(false);
    const [dustbinReport, setDustbinReport] = useState({ location: '', description: '' });
    const [dustbinSubmitted, setDustbinSubmitted] = useState(false);

    const handleServiceClick = (id: string) => {
        switch (id) {
            case 'water-bill':
                navigate('/payment', { state: { billId: 'BILL-WATER-001', billNumber: 'WAT-2026-001', amount: 890, type: 'water', consumerId: '9988776655', dueDate: '2026-03-15' } });
                break;
            case 'water-connection':
                navigate('/connections/new');
                break;
            case 'water-leakage':
                setReportForm({ location: '', description: '', type: 'leakage' });
                setReportSubmitted(false);
                setActiveDialog('report');
                break;
            case 'water-schedule':
                setActiveDialog('water-schedule');
                break;
            case 'water-tanker':
                setTankerForm({ address: '', zone: '', date: '', reason: '' });
                setTankerSubmitted(false);
                setActiveDialog('tanker');
                break;
            case 'water-quality':
                setActiveDialog('water-quality');
                break;
            case 'water-certificates':
                setActiveDialog('certificates');
                break;
            case 'waste-schedule':
                setActiveDialog('garbage-schedule');
                break;
            case 'waste-pickup':
                setPickupForm({ type: 'bulk', address: '', description: '', date: '' });
                setPickupSubmitted(false);
                setActiveDialog('pickup');
                break;
            case 'waste-dustbin':
                setDustbinReport({ location: '', description: '' });
                setDustbinSubmitted(false);
                setActiveDialog('dustbin');
                break;
            case 'waste-segregation':
                setActiveDialog('segregation');
                break;
            case 'waste-recycling':
                navigate('/maps');
                break;
            case 'waste-complaints':
                navigate('/complaints');
                break;
            case 'waste-permit':
                navigate('/connections/new');
                break;
            case 'waste-swachh':
                window.open('https://swachhbharatmission.gov.in/', '_blank');
                break;
        }
    };

    const renderServiceGrid = (services: typeof waterServices) => (
        <Grid2 container spacing={2}>
            {services.map((service) => (
                <Grid2 size={{ xs: 6, sm: 4, md: 3 }} key={service.id}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                        <Card sx={{ borderRadius: 2, height: '100%', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
                            <CardActionArea
                                sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                                onClick={() => handleServiceClick(service.id)}
                            >
                                <Box sx={{
                                    width: 56, height: 56, borderRadius: 2,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: `${service.color}15`, color: service.color,
                                    mx: 'auto', mb: 1.5,
                                }}>
                                    {service.icon}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{service.title}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>{service.desc}</Typography>
                            </CardActionArea>
                        </Card>
                    </motion.div>
                </Grid2>
            ))}
        </Grid2>
    );

    return (
        <Box>
            {/* Hero Banner */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3.5 },
                        mb: 3,
                        background: 'linear-gradient(135deg, #009688 0%, #00bcd4 50%, #1a73e8 100%)',
                        borderRadius: 3,
                        color: 'white',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                        🏛️ Water & Municipal Services
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                        Water supply, waste management, certificates, and civic infrastructure
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<Circle sx={{ fontSize: '10px !important', color: '#76ff03 !important' }} />}
                            label="Water Supply: Normal"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                        />
                        <Chip
                            icon={<Circle sx={{ fontSize: '10px !important', color: '#76ff03 !important' }} />}
                            label="Collection Schedule: On Time"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                        />
                    </Box>
                </Paper>
            </motion.div>

            {/* Tab Switcher */}
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    mb: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    '& .MuiTab-root': { fontWeight: 600, py: 1.5 },
                }}
            >
                <Tab icon={<WaterDrop />} iconPosition="start" label="Water Services" />
                <Tab icon={<DeleteSweep />} iconPosition="start" label="Waste Management" />
            </Tabs>

            {/* Water Services Tab */}
            {tab === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    {/* Water Supply Status */}
                    <Card sx={{ mb: 3, borderRadius: 2, borderLeft: '4px solid #4caf50' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 8px #4caf50' }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Water Supply Status: Normal</Typography>
                                <Typography variant="body2" color="text.secondary">Next supply: 6:00 AM - 10:00 AM (Zone 1)</Typography>
                            </Box>
                            <Button size="small" variant="outlined" onClick={() => setActiveDialog('water-schedule')}>
                                Full Schedule
                            </Button>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>💧 Water Services ({waterServices.length})</Typography>
                    {renderServiceGrid(waterServices)}
                </motion.div>
            )}

            {/* Waste Management Tab */}
            {tab === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    {/* Collection Status */}
                    <Card sx={{ mb: 3, borderRadius: 2, borderLeft: '4px solid #4caf50' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 8px #4caf50' }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Collection Schedule: On Time</Typography>
                                <Typography variant="body2" color="text.secondary">Next collection: 7:00 AM - Wet Waste (Green Bin)</Typography>
                            </Box>
                            <Button size="small" variant="outlined" onClick={() => setActiveDialog('garbage-schedule')}>
                                Full Schedule
                            </Button>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>🗑️ Waste Management ({wasteServices.length})</Typography>
                    {renderServiceGrid(wasteServices)}
                </motion.div>
            )}

            {/* ===== DIALOGS ===== */}

            {/* Water Supply Schedule Dialog */}
            <Dialog open={activeDialog === 'water-schedule'} onClose={() => setActiveDialog(null)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>💧 Water Supply Schedule</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                        Timings may vary during maintenance. Last updated: {new Date().toLocaleDateString()}
                    </Alert>
                    {waterScheduleData.map((zone) => (
                        <Paper key={zone.zone} sx={{ p: 2, mb: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography fontWeight={600}>{zone.zone}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Morning: {zone.morning} • Evening: {zone.evening}
                                </Typography>
                            </Box>
                            <Chip
                                label={zone.status}
                                size="small"
                                color={zone.status === 'Normal' ? 'success' : 'warning'}
                            />
                        </Paper>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Water Tanker Request Dialog */}
            <Dialog open={activeDialog === 'tanker'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>🚛 Request Water Tanker</DialogTitle>
                <DialogContent>
                    {tankerSubmitted ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight={700} gutterBottom>Tanker Request Submitted!</Typography>
                            <Typography color="text.secondary" sx={{ mb: 1 }}>
                                Reference: TKR-{Date.now().toString().slice(-6)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Expected delivery within 4-8 hours. SMS confirmation sent to your registered mobile.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField fullWidth label="Full Address *" value={tankerForm.address}
                                onChange={e => setTankerForm({ ...tankerForm, address: e.target.value })} multiline rows={2} />
                            <FormControl fullWidth>
                                <InputLabel>Zone</InputLabel>
                                <Select value={tankerForm.zone} label="Zone"
                                    onChange={e => setTankerForm({ ...tankerForm, zone: e.target.value })}>
                                    {waterScheduleData.map(z => <MenuItem key={z.zone} value={z.zone}>{z.zone}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField fullWidth label="Preferred Date" type="date" InputLabelProps={{ shrink: true }}
                                value={tankerForm.date} onChange={e => setTankerForm({ ...tankerForm, date: e.target.value })} />
                            <TextField fullWidth label="Reason" value={tankerForm.reason}
                                onChange={e => setTankerForm({ ...tankerForm, reason: e.target.value })} />
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                Municipal tanker (5000L): ₹250 | Private tanker (5000L): ₹500-800
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                    {!tankerSubmitted && (
                        <Button variant="contained" onClick={() => setTankerSubmitted(true)} disabled={!tankerForm.address}>
                            Submit Request
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Report Leakage / Pipe Burst Dialog */}
            <Dialog open={activeDialog === 'report'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>🚨 Report Water Issue</DialogTitle>
                <DialogContent>
                    {reportSubmitted ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight={700} gutterBottom>Report Submitted!</Typography>
                            <Typography color="text.secondary">
                                Complaint ID: WTR-{Date.now().toString().slice(-6)}. Response team deployed within 2 hours for pipe bursts.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Issue Type</InputLabel>
                                <Select value={reportForm.type} label="Issue Type"
                                    onChange={e => setReportForm({ ...reportForm, type: e.target.value })}>
                                    <MenuItem value="leakage">Water Leakage</MenuItem>
                                    <MenuItem value="burst">Pipe Burst (Emergency)</MenuItem>
                                    <MenuItem value="contamination">Water Contamination</MenuItem>
                                    <MenuItem value="no-supply">No Water Supply</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField fullWidth label="Location / Address *" value={reportForm.location}
                                onChange={e => setReportForm({ ...reportForm, location: e.target.value })} />
                            <TextField fullWidth label="Description" multiline rows={3} value={reportForm.description}
                                onChange={e => setReportForm({ ...reportForm, description: e.target.value })} />
                            {reportForm.type === 'burst' && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    ⚠️ Pipe burst reports are treated as **emergency**. Response team deployed within 2 hours.
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                    {!reportSubmitted && (
                        <Button variant="contained" color="error" onClick={() => setReportSubmitted(true)} disabled={!reportForm.location}>
                            Submit Report
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Water Quality Report Dialog */}
            <Dialog open={activeDialog === 'water-quality'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>🔬 Water Quality Report — Zone 1 (Adajan)</DialogTitle>
                <DialogContent>
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                        All parameters within safe limits. Last tested: {new Date().toLocaleDateString()}
                    </Alert>
                    {waterQualityData.map((item) => (
                        <Paper key={item.param} sx={{ p: 1.5, mb: 1, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography fontWeight={600} variant="body2">{item.param}</Typography>
                                <Typography variant="caption" color="text.secondary">Standard: {item.standard}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography fontWeight={700}>{item.value}</Typography>
                                <Typography variant="caption">{item.status}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Certificates Dialog */}
            <Dialog open={activeDialog === 'certificates'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>📜 Water Certificates</DialogTitle>
                <DialogContent>
                    <List>
                        {[
                            { title: 'No Dues Certificate', desc: 'Certifies no pending water bills', status: 'Available', fee: '₹50' },
                            { title: 'Connection Certificate', desc: 'Proof of active water connection', status: 'Available', fee: '₹100' },
                            { title: 'Disconnection Certificate', desc: 'For property transfer or closure', status: 'Apply', fee: '₹200' },
                        ].map(cert => (
                            <ListItem key={cert.title} sx={{ px: 0 }}>
                                <ListItemIcon><VerifiedUser color="primary" /></ListItemIcon>
                                <ListItemText
                                    primary={<Typography fontWeight={600}>{cert.title}</Typography>}
                                    secondary={`${cert.desc} • Fee: ${cert.fee}`}
                                />
                                <Button size="small" variant="outlined">{cert.status === 'Available' ? 'Download' : 'Apply'}</Button>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Garbage Schedule Dialog */}
            <Dialog open={activeDialog === 'garbage-schedule'} onClose={() => setActiveDialog(null)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>🗑️ Garbage Collection Schedule</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                        Please keep segregated waste ready before the scheduled time. Wet waste in Green bin, Dry waste in Blue bin.
                    </Alert>
                    {garbageSchedule.map((zone) => (
                        <Paper key={zone.zone} sx={{ p: 2, mb: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography fontWeight={600}>{zone.zone}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    🟢 Wet: {zone.wet} • 🔵 Dry: {zone.dry} • Vehicle: {zone.vehicle}
                                </Typography>
                            </Box>
                            <Chip label={zone.status} size="small" color={zone.status === 'On Time' ? 'success' : 'warning'} />
                        </Paper>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Special Pickup Request Dialog */}
            <Dialog open={activeDialog === 'pickup'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>📦 Request Special Pickup</DialogTitle>
                <DialogContent>
                    {pickupSubmitted ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight={700} gutterBottom>Pickup Request Submitted!</Typography>
                            <Typography color="text.secondary">
                                Reference: PKP-{Date.now().toString().slice(-6)}. Our team will contact you within 24 hours.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Waste Type</InputLabel>
                                <Select value={pickupForm.type} label="Waste Type"
                                    onChange={e => setPickupForm({ ...pickupForm, type: e.target.value })}>
                                    <MenuItem value="bulk">Bulk Waste (Furniture, Mattress)</MenuItem>
                                    <MenuItem value="debris">Construction Debris</MenuItem>
                                    <MenuItem value="ewaste">E-Waste (Electronics)</MenuItem>
                                    <MenuItem value="garden">Garden Waste</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField fullWidth label="Address *" value={pickupForm.address}
                                onChange={e => setPickupForm({ ...pickupForm, address: e.target.value })} />
                            <TextField fullWidth label="Description" multiline rows={2} value={pickupForm.description}
                                onChange={e => setPickupForm({ ...pickupForm, description: e.target.value })} />
                            <TextField fullWidth label="Preferred Date" type="date" InputLabelProps={{ shrink: true }}
                                value={pickupForm.date} onChange={e => setPickupForm({ ...pickupForm, date: e.target.value })} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                    {!pickupSubmitted && (
                        <Button variant="contained" onClick={() => setPickupSubmitted(true)} disabled={!pickupForm.address}>
                            Submit Request
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Report Overflowing Dustbin Dialog */}
            <Dialog open={activeDialog === 'dustbin'} onClose={() => setActiveDialog(null)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>🚮 Report Overflowing Dustbin / Missed Collection</DialogTitle>
                <DialogContent>
                    {dustbinSubmitted ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight={700} gutterBottom>Report Filed!</Typography>
                            <Typography color="text.secondary">
                                Complaint ID: DST-{Date.now().toString().slice(-6)}. Collection team will visit within 4 hours.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                            <TextField fullWidth label="Location / Nearest Landmark *" value={dustbinReport.location}
                                onChange={e => setDustbinReport({ ...dustbinReport, location: e.target.value })} />
                            <TextField fullWidth label="Description" multiline rows={3} value={dustbinReport.description}
                                onChange={e => setDustbinReport({ ...dustbinReport, description: e.target.value })}
                                placeholder="e.g., Dustbin outside Ward 12 school overflowing since 2 days" />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                    {!dustbinSubmitted && (
                        <Button variant="contained" color="error" onClick={() => setDustbinSubmitted(true)} disabled={!dustbinReport.location}>
                            Report Issue
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Segregation Guide Dialog */}
            <Dialog open={activeDialog === 'segregation'} onClose={() => setActiveDialog(null)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>♻️ Waste Segregation Guide</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                        Proper segregation is mandatory under Solid Waste Management Rules, 2016. Fines may apply for non-compliance.
                    </Alert>
                    <Grid2 container spacing={2}>
                        {segregationGuide.map((cat) => (
                            <Grid2 size={{ xs: 12, md: 4 }} key={cat.type}>
                                <Card sx={{ borderRadius: 2, border: `2px solid ${cat.color}`, height: '100%' }}>
                                    <CardContent>
                                        <Typography fontWeight={700} sx={{ color: cat.color, mb: 1 }}>{cat.type}</Typography>
                                        <List dense>
                                            {cat.items.map(item => (
                                                <ListItem key={item} sx={{ px: 0, py: 0.25 }}>
                                                    <ListItemIcon sx={{ minWidth: 28 }}>
                                                        <Circle sx={{ fontSize: 8, color: cat.color }} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">{item}</Typography>} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setActiveDialog(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MunicipalPage;
