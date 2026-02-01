import { useState, useRef, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import api from '../../utils/api';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    Chip,
    Paper,
    Avatar,
    LinearProgress,
    Divider,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Alert,
    CircularProgress,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    LocationOn,
    CameraAlt,
    Check,
    Schedule,
    Person,
    Delete,
    VideoLibrary,
    MyLocation,
    Upload,
} from '@mui/icons-material';
import { showNotification } from '../../store/slices/uiSlice';
import { addComplaint } from '../../store/slices/servicesSlice';
import { AppDispatch } from '../../store';

const ComplaintsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeStep, setActiveStep] = useState(0);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [priority, setPriority] = useState('medium');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [attachments, setAttachments] = useState<{ file: File; preview: string; type: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [complaintNumber, setComplaintNumber] = useState('');

    const steps = [t('complaints.selectCategory'), 'Location & Details', t('complaints.uploadPhotos'), 'Review & Submit'];

    const categories = [
        {
            id: 'electricity',
            icon: <ElectricBolt />,
            label: t('services.electricity'),
            color: '#fbbc04',
            subcategories: ['Power Outage', 'Voltage Fluctuation', 'Meter Problem', 'Street Light Issue', 'Billing Dispute', 'Illegal Connection', 'Transformer Issue'],
        },
        {
            id: 'gas',
            icon: <LocalGasStation />,
            label: t('services.gas'),
            color: '#ea4335',
            subcategories: ['Gas Leak (EMERGENCY)', 'Low Pressure', 'Meter Issue', 'Billing Dispute', 'PNG Connection Problem', 'Pipeline Damage'],
        },
        {
            id: 'water',
            icon: <WaterDrop />,
            label: t('services.water'),
            color: '#1a73e8',
            subcategories: ['No Water Supply', 'Low Pressure', 'Water Quality Issue', 'Pipeline Leakage', 'Sewage Overflow', 'Meter Problem', 'Billing Dispute'],
        },
    ];

    // Mock existing complaints
    const existingComplaints = [
        {
            id: 'CMP-2026-001',
            category: 'electricity',
            subcategory: 'Power Outage',
            status: 'in_progress',
            createdAt: '25 Jan 2026',
            estimatedResolution: '28 Jan 2026',
            officer: { name: 'Rajesh Kumar', designation: 'Junior Engineer', phone: '+91 22 1234 5678' },
        },
        {
            id: 'CMP-2026-002',
            category: 'water',
            subcategory: 'Low Pressure',
            status: 'resolved',
            createdAt: '20 Jan 2026',
            resolvedAt: '23 Jan 2026',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registered': return 'info';
            case 'assigned': return 'secondary';
            case 'in_progress': return 'warning';
            case 'resolved': return 'success';
            default: return 'default';
        }
    };

    const handleGetLocation = () => {
        setLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });

                    // Reverse geocode to get address (mock)
                    setAddress(`Near coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    setLocating(false);
                    dispatch(showNotification({ message: 'Location captured successfully', severity: 'success' }));
                },
                (error) => {
                    setLocating(false);
                    dispatch(showNotification({ message: 'Could not get location', severity: 'error' }));
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setLocating(false);
            dispatch(showNotification({ message: 'Geolocation not supported', severity: 'error' }));
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newAttachments: { file: File; preview: string; type: string }[] = [];

        Array.from(files).forEach((file) => {
            if (attachments.length + newAttachments.length >= 5) {
                dispatch(showNotification({ message: 'Maximum 5 files allowed', severity: 'warning' }));
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                dispatch(showNotification({ message: `${file.name} is too large (max 10MB)`, severity: 'error' }));
                return;
            }

            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            if (!isImage && !isVideo) {
                dispatch(showNotification({ message: 'Only images and videos allowed', severity: 'error' }));
                return;
            }

            const preview = URL.createObjectURL(file);
            newAttachments.push({
                file,
                preview,
                type: isImage ? 'image' : 'video',
            });
        });

        setAttachments([...attachments, ...newAttachments]);
    };

    const handleRemoveAttachment = (index: number) => {
        const updated = [...attachments];
        URL.revokeObjectURL(updated[index].preview);
        updated.splice(index, 1);
        setAttachments(updated);
    };

    const handleSubmit = async () => {
        setUploading(true);

        try {
            // POST complaint to backend API for real-time sync with admin portal
            const complaintData = {
                type: category,
                category: subcategory,
                subcategory,
                description,
                address: address || 'Surat, Gujarat',
                latitude: location?.lat || 21.1702, // Default to Surat coordinates
                longitude: location?.lng || 72.8311,
                priority: priority === 'emergency' ? 'critical' : priority,
            };

            const response = await api.post('/complaints', complaintData);
            const newComplaintId = response.data.id || `CMP-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
            setComplaintNumber(newComplaintId);

            // Also update local Redux state
            dispatch(addComplaint({
                id: newComplaintId,
                type: category as 'electricity' | 'gas' | 'water',
                category: subcategory,
                subcategory,
                description,
                location: location ? { ...location, address } : { lat: 21.1702, lng: 72.8311, address: 'Surat, Gujarat' },
                priority: priority as 'low' | 'medium' | 'high' | 'emergency',
                status: 'registered',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attachments: attachments.map((a) => a.file.name),
                updates: [
                    {
                        timestamp: new Date().toISOString(),
                        status: 'registered',
                        message: 'Complaint registered successfully',
                        by: 'System',
                    },
                ],
            }));

            setUploading(false);
            setSubmitted(true);
            dispatch(showNotification({ message: 'Complaint submitted successfully!', severity: 'success' }));
        } catch (error) {
            console.error('Failed to submit complaint:', error);
            setUploading(false);
            dispatch(showNotification({ message: 'Failed to submit complaint. Please try again.', severity: 'error' }));
        }
    };

    const handleEscalate = (complaintId: string) => {
        dispatch(showNotification({
            message: `Complaint ${complaintId} escalated to senior officer`,
            severity: 'success'
        }));
    };

    if (submitted) {
        return (
            <Box>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #34a853 0%, #1e8e3e 100%)',
                        borderRadius: 3,
                        color: 'white',
                    }}
                >
                    <Check sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        Complaint Registered Successfully!
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        {t('complaints.complaintNumber')}: <strong>{complaintNumber}</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                        You will receive SMS updates on your registered mobile number
                    </Typography>
                    <Typography variant="body2">
                        {t('complaints.estimatedResolution')}: 48 hours
                    </Typography>
                </Paper>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSubmitted(false);
                            setActiveStep(0);
                            setCategory('');
                            setSubcategory('');
                            setDescription('');
                            setAddress('');
                            setLocation(null);
                            setAttachments([]);
                        }}
                    >
                        Register Another Complaint
                    </Button>
                    <Button variant="outlined" onClick={() => window.location.reload()}>
                        View My Complaints
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #e37400 0%, #ff9800 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('complaints.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Register new complaints and track existing ones
                </Typography>
            </Paper>

            <Grid2 container spacing={4}>
                {/* New Complaint Form */}
                <Grid2 size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Register New Complaint
                            </Typography>

                            <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {/* Step 1: Category Selection */}
                            {activeStep === 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                        Select Service Type
                                    </Typography>
                                    <Grid2 container spacing={2} sx={{ mb: 3 }}>
                                        {categories.map((cat) => (
                                            <Grid2 size={{ xs: 4 }} key={cat.id}>
                                                <Card
                                                    variant={category === cat.id ? 'elevation' : 'outlined'}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        borderColor: category === cat.id ? cat.color : 'divider',
                                                        borderWidth: category === cat.id ? 2 : 1,
                                                        transition: 'all 0.2s',
                                                        '&:hover': { transform: 'scale(1.02)' },
                                                    }}
                                                    onClick={() => {
                                                        setCategory(cat.id);
                                                        setSubcategory('');
                                                    }}
                                                >
                                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                        <Box sx={{ color: cat.color, mb: 1 }}>{cat.icon}</Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {cat.label}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid2>
                                        ))}
                                    </Grid2>

                                    {category && (
                                        <>
                                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                                Select Issue Type
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {categories
                                                    .find((c) => c.id === category)
                                                    ?.subcategories.map((sub) => (
                                                        <Chip
                                                            key={sub}
                                                            label={sub}
                                                            onClick={() => setSubcategory(sub)}
                                                            color={subcategory === sub ? 'primary' : 'default'}
                                                            variant={subcategory === sub ? 'filled' : 'outlined'}
                                                            sx={{
                                                                cursor: 'pointer',
                                                                fontSize: sub.includes('EMERGENCY') ? 14 : 13,
                                                                color: sub.includes('EMERGENCY') && subcategory !== sub ? 'error.main' : undefined,
                                                                borderColor: sub.includes('EMERGENCY') ? 'error.main' : undefined,
                                                            }}
                                                        />
                                                    ))}
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            )}

                            {/* Step 2: Location & Details */}
                            {activeStep === 1 && (
                                <Box>
                                    <Button
                                        variant="outlined"
                                        startIcon={locating ? <CircularProgress size={20} /> : <MyLocation />}
                                        fullWidth
                                        onClick={handleGetLocation}
                                        disabled={locating}
                                        sx={{ mb: 2, minHeight: 56 }}
                                    >
                                        {locating ? 'Getting Location...' : t('complaints.autoDetect')}
                                    </Button>

                                    {location && (
                                        <Alert severity="success" sx={{ mb: 2 }}>
                                            Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                        </Alert>
                                    )}

                                    <TextField
                                        fullWidth
                                        label="Address / Landmark"
                                        placeholder="Enter your address or nearby landmark"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        sx={{ mb: 3 }}
                                    />

                                    <TextField
                                        fullWidth
                                        label={t('complaints.describeIssue')}
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your issue in detail..."
                                        sx={{ mb: 3 }}
                                    />

                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                        {t('complaints.priority')}
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                    >
                                        <FormControlLabel value="low" control={<Radio />} label={t('complaints.low')} />
                                        <FormControlLabel value="medium" control={<Radio />} label={t('complaints.medium')} />
                                        <FormControlLabel value="high" control={<Radio color="error" />} label={t('complaints.high')} />
                                        <FormControlLabel value="emergency" control={<Radio color="error" />} label={t('complaints.emergency')} />
                                    </RadioGroup>
                                </Box>
                            )}

                            {/* Step 3: Photo/Video Upload */}
                            {activeStep === 2 && (
                                <Box>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,video/*"
                                        multiple
                                        style={{ display: 'none' }}
                                    />

                                    <Button
                                        variant="outlined"
                                        startIcon={<Upload />}
                                        fullWidth
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{ mb: 3, minHeight: 80, borderStyle: 'dashed' }}
                                    >
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography>{t('complaints.uploadPhotos')}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Max 5 files, 10MB each (Images or Videos)
                                            </Typography>
                                        </Box>
                                    </Button>

                                    {attachments.length > 0 && (
                                        <>
                                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                                                Uploaded Files ({attachments.length}/5)
                                            </Typography>
                                            <ImageList cols={3} rowHeight={120} gap={8}>
                                                {attachments.map((att, index) => (
                                                    <ImageListItem key={index}>
                                                        {att.type === 'image' ? (
                                                            <img
                                                                src={att.preview}
                                                                alt={`Attachment ${index + 1}`}
                                                                style={{ height: 120, objectFit: 'cover', borderRadius: 8 }}
                                                            />
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    height: 120,
                                                                    bgcolor: 'grey.200',
                                                                    borderRadius: 2,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <VideoLibrary sx={{ fontSize: 40, color: 'grey.500' }} />
                                                            </Box>
                                                        )}
                                                        <ImageListItemBar
                                                            subtitle={att.file.name.slice(0, 15) + '...'}
                                                            actionIcon={
                                                                <IconButton
                                                                    sx={{ color: 'white' }}
                                                                    onClick={() => handleRemoveAttachment(index)}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            }
                                                        />
                                                    </ImageListItem>
                                                ))}
                                            </ImageList>
                                        </>
                                    )}

                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Photos/videos help us understand and resolve your issue faster
                                    </Alert>
                                </Box>
                            )}

                            {/* Step 4: Review */}
                            {activeStep === 3 && (
                                <Box>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                                        <Grid2 container spacing={2}>
                                            <Grid2 size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">Category</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{category}</Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">Issue Type</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{subcategory}</Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">Priority</Typography>
                                                <Chip
                                                    label={priority}
                                                    size="small"
                                                    color={priority === 'high' || priority === 'emergency' ? 'error' : priority === 'medium' ? 'warning' : 'default'}
                                                />
                                            </Grid2>
                                            <Grid2 size={{ xs: 6 }}>
                                                <Typography variant="caption" color="text.secondary">Attachments</Typography>
                                                <Typography variant="body1">{attachments.length} files</Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 12 }}>
                                                <Typography variant="caption" color="text.secondary">Location</Typography>
                                                <Typography variant="body2">{address || 'Not provided'}</Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 12 }}>
                                                <Typography variant="caption" color="text.secondary">Description</Typography>
                                                <Typography variant="body2">{description}</Typography>
                                            </Grid2>
                                        </Grid2>
                                    </Paper>

                                    <Alert severity="info">
                                        Expected resolution time: {priority === 'emergency' ? '4 hours' : priority === 'high' ? '24 hours' : '48 hours'}
                                    </Alert>
                                </Box>
                            )}

                            {/* Navigation Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    disabled={activeStep === 0}
                                    onClick={() => setActiveStep((prev) => prev - 1)}
                                    sx={{ flex: 1, minHeight: 48 }}
                                >
                                    {t('common.back')}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (activeStep === 3) {
                                            handleSubmit();
                                        } else {
                                            setActiveStep((prev) => prev + 1);
                                        }
                                    }}
                                    disabled={
                                        (activeStep === 0 && (!category || !subcategory)) ||
                                        (activeStep === 1 && !description) ||
                                        uploading
                                    }
                                    sx={{ flex: 2, minHeight: 48 }}
                                >
                                    {uploading ? (
                                        <CircularProgress size={24} />
                                    ) : activeStep === 3 ? (
                                        t('complaints.submitComplaint')
                                    ) : (
                                        t('common.next')
                                    )}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Existing Complaints */}
                <Grid2 size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Your Complaints
                    </Typography>
                    {existingComplaints.map((complaint) => (
                        <Card key={complaint.id} sx={{ mb: 2, borderRadius: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {complaint.id}
                                    </Typography>
                                    <Chip
                                        label={t(`complaints.status.${complaint.status}`)}
                                        size="small"
                                        color={getStatusColor(complaint.status) as any}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {complaint.subcategory}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Created: {complaint.createdAt}
                                    </Typography>
                                </Box>
                                {complaint.officer && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Assigned to: {complaint.officer.name}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Escalation Button */}
                                {complaint.status === 'in_progress' && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        size="small"
                                        fullWidth
                                        onClick={() => handleEscalate(complaint.id)}
                                        sx={{ mt: 1 }}
                                    >
                                        Escalate to Senior Officer
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default ComplaintsPage;
