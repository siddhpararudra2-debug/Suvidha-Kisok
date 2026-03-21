import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Avatar,
    Chip,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    LinearProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    Search,
    Phone,
    Email,
    LocationOn,
    AccessTime,
} from '@mui/icons-material';
import api from '../../utils/api';

interface Official {
    id: string;
    name: string;
    designation: string;
    department: string;
    area: string;
    phone: string;
    email: string;
    officeHours: string;
    photo: string;
}

const DirectoryPage = () => {
    const [department, setDepartment] = useState('all');
    const [search, setSearch] = useState('');
    const [officials, setOfficials] = useState<Official[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOfficials = async () => {
        setLoading(true);
        try {
            const response = await api.get('/public/officials');
            setOfficials(response.data);
        } catch (error) {
            console.error('Failed to fetch officials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficials();
    }, []);

    const filteredOfficials = (officials || []).filter((official) => {
        const matchesDept = department === 'all' || official.department?.toLowerCase() === department;
        const matchesSearch = official.name?.toLowerCase().includes(search.toLowerCase()) ||
            official.designation?.toLowerCase().includes(search.toLowerCase()) ||
            official.area?.toLowerCase().includes(search.toLowerCase());
        return matchesDept && matchesSearch;
    });

    const getDepartmentColor = (dept: string) => {
        switch (dept.toLowerCase()) {
            case 'electricity': return '#fbbc04';
            case 'gas': return '#ea4335';
            case 'water': return '#1a73e8';
            default: return '#5f6368';
        }
    };

    return (
        <Box>
            {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000 }} />}
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #5f6368 0%, #3c4043 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Official Directory
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Contact department officials for your area
                </Typography>
            </Paper>

            {/* Search and Filter */}
            <Grid2 container spacing={2} sx={{ mb: 4 }}>
                <Grid2 size={{ xs: 12, sm: 8 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name, designation, or area..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={department}
                            label="Department"
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <MenuItem value="all">All Departments</MenuItem>
                            <MenuItem value="electricity">Electricity</MenuItem>
                            <MenuItem value="gas">Gas</MenuItem>
                            <MenuItem value="water">Water</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            {/* Officials Grid */}
            <Grid2 container spacing={3}>
                {filteredOfficials.map((official) => (
                    <Grid2 size={{ xs: 12, sm: 6 }} key={official.id}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: getDepartmentColor(official.department),
                                            fontSize: 20,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {official.photo}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {official.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {official.designation}
                                        </Typography>
                                        <Chip
                                            label={official.department}
                                            size="small"
                                            sx={{
                                                mt: 0.5,
                                                bgcolor: `${getDepartmentColor(official.department)}15`,
                                                color: getDepartmentColor(official.department),
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">{official.area}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">{official.phone}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">{official.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTime sx={{ fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">{official.officeHours}</Typography>
                                    </Box>
                                </Box>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 2, minHeight: 44 }}
                                >
                                    Contact Official
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default DirectoryPage;
