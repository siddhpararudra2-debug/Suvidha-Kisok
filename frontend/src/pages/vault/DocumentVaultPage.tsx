import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Paper,
    Chip,
    Button,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    IconButton,
    Divider,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    Search,
    Download,
    Receipt,
    Description,
    Assignment,
    VerifiedUser,
    Visibility,
    ElectricBolt,
    WaterDrop,
    LocalGasStation,
    FolderOpen,
} from '@mui/icons-material';

interface Document {
    id: string;
    name: string;
    type: 'bill' | 'receipt' | 'application' | 'certificate';
    service: string;
    date: string;
    amount?: number;
    status: string;
    size: string;
}

const mockDocuments: Document[] = [
    { id: 'DOC-001', name: 'Electricity Bill - Feb 2026', type: 'bill', service: 'electricity', date: '2026-02-01', amount: 2847, status: 'Due', size: '125 KB' },
    { id: 'DOC-002', name: 'Water Bill - Feb 2026', type: 'bill', service: 'water', date: '2026-02-05', amount: 890, status: 'Due', size: '98 KB' },
    { id: 'DOC-003', name: 'Gas Bill - Jan 2026', type: 'bill', service: 'gas', date: '2026-01-15', amount: 1234, status: 'Paid', size: '110 KB' },
    { id: 'DOC-004', name: 'Payment Receipt - Jan Electricity', type: 'receipt', service: 'electricity', date: '2026-01-28', amount: 2650, status: 'Completed', size: '85 KB' },
    { id: 'DOC-005', name: 'Payment Receipt - Dec Water', type: 'receipt', service: 'water', date: '2025-12-20', amount: 750, status: 'Completed', size: '82 KB' },
    { id: 'DOC-006', name: 'New Gas Connection Application', type: 'application', service: 'gas', date: '2026-02-10', status: 'Under Review', size: '340 KB' },
    { id: 'DOC-007', name: 'Electricity Connection Certificate', type: 'certificate', service: 'electricity', date: '2024-08-15', status: 'Active', size: '520 KB' },
    { id: 'DOC-008', name: 'Water Quality Test Report', type: 'certificate', service: 'water', date: '2025-11-10', status: 'Valid', size: '210 KB' },
    { id: 'DOC-009', name: 'Payment Receipt - Nov Gas', type: 'receipt', service: 'gas', date: '2025-11-25', amount: 980, status: 'Completed', size: '78 KB' },
    { id: 'DOC-010', name: 'Solar Panel Subsidy Application', type: 'application', service: 'electricity', date: '2026-01-20', status: 'Approved', size: '450 KB' },
];

const typeIcons: Record<string, React.ReactNode> = {
    bill: <Receipt color="warning" />,
    receipt: <Description color="success" />,
    application: <Assignment color="info" />,
    certificate: <VerifiedUser color="primary" />,
};

const serviceColors: Record<string, string> = {
    electricity: '#fbbc04',
    water: '#1a73e8',
    gas: '#ea4335',
};

const DocumentVaultPage = () => {
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState('');

    const tabs = ['All', 'Bills', 'Receipts', 'Applications', 'Certificates'];
    const tabTypes = ['all', 'bill', 'receipt', 'application', 'certificate'];

    const filtered = mockDocuments
        .filter(d => tabTypes[tab] === 'all' || d.type === tabTypes[tab])
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    const stats = {
        total: mockDocuments.length,
        bills: mockDocuments.filter(d => d.type === 'bill').length,
        receipts: mockDocuments.filter(d => d.type === 'receipt').length,
        applications: mockDocuments.filter(d => d.type === 'application').length,
        certificates: mockDocuments.filter(d => d.type === 'certificate').length,
    };

    const handleDownload = (doc: Document) => {
        // Simulate download
        const element = window.document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`SUVIDHA KIOSK - ${doc.name}\nDate: ${doc.date}\nStatus: ${doc.status}\n${doc.amount ? `Amount: ₹${doc.amount}` : ''}`));
        element.setAttribute('download', `${doc.id}_${doc.name.replace(/\s/g, '_')}.txt`);
        element.style.display = 'none';
        window.document.body.appendChild(element);
        element.click();
        window.document.body.removeChild(element);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                📁 Document Vault
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                All your bills, receipts, applications, and certificates in one place
            </Typography>

            {/* Stats */}
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: 'Total Documents', count: stats.total, icon: <FolderOpen />, color: 'primary' },
                    { label: 'Bills', count: stats.bills, icon: <Receipt />, color: 'warning' },
                    { label: 'Receipts', count: stats.receipts, icon: <Description />, color: 'success' },
                    { label: 'Applications', count: stats.applications, icon: <Assignment />, color: 'info' },
                ].map(s => (
                    <Grid2 size={{ xs: 6, sm: 3 }} key={s.label}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                            <Box sx={{ color: `${s.color}.main`, mb: 0.5 }}>{s.icon}</Box>
                            <Typography variant="h5" fontWeight={700}>{s.count}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>

            {/* Search + Tabs */}
            <TextField
                fullWidth
                size="small"
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                }}
                sx={{ mb: 2 }}
            />
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                {tabs.map(t => <Tab key={t} label={t} />)}
            </Tabs>

            {/* Document List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {filtered.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                        <Typography color="text.secondary">No documents found</Typography>
                    </Paper>
                )}
                {filtered.map(doc => (
                    <Card key={doc.id} sx={{ borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'grey.100', display: 'flex' }}>
                                {typeIcons[doc.type]}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={600} variant="body2">{doc.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Chip label={doc.service} size="small" sx={{ bgcolor: `${serviceColors[doc.service]}15`, color: serviceColors[doc.service], fontWeight: 600, textTransform: 'capitalize' }} />
                                    <Chip label={doc.status} size="small" variant="outlined" color={doc.status === 'Paid' || doc.status === 'Completed' || doc.status === 'Active' || doc.status === 'Approved' ? 'success' : doc.status === 'Due' ? 'warning' : 'info'} />
                                    <Typography variant="caption" color="text.secondary">{doc.date} • {doc.size}</Typography>
                                </Box>
                            </Box>
                            {doc.amount && (
                                <Typography fontWeight={700} color="text.primary" sx={{ mr: 1 }}>
                                    ₹{doc.amount.toLocaleString('en-IN')}
                                </Typography>
                            )}
                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                            <IconButton size="small" onClick={() => handleDownload(doc)} title="Download">
                                <Download />
                            </IconButton>
                            <IconButton size="small" title="Preview">
                                <Visibility />
                            </IconButton>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default DocumentVaultPage;
