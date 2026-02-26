import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    Button,
    Chip,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import {
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    Phone,
    LocalFireDepartment,
    LocalHospital,
} from '@mui/icons-material';
import { setLanguage, Language } from '../store/slices/uiSlice';
import { languages } from '../i18n';

const WelcomePage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedLang, setSelectedLang] = useState<Language>('en');

    const handleLanguageSelect = (code: Language) => {
        setSelectedLang(code);
        i18n.changeLanguage(code);
        dispatch(setLanguage(code));
    };

    const handleContinue = () => {
        navigate('/login');
    };

    const emergencyContacts = [
        { icon: <Phone />, number: '100', label: t('emergency.police'), color: '#1a73e8' },
        { icon: <LocalFireDepartment />, number: '101', label: t('emergency.fire'), color: '#ea4335' },
        { icon: <LocalHospital />, number: '102', label: t('emergency.ambulance'), color: '#34a853' },
    ];

    const services = [
        { icon: <ElectricBolt />, label: t('services.electricity'), color: '#fbbc04' },
        { icon: <LocalGasStation />, label: t('services.gas'), color: '#ea4335' },
        { icon: <WaterDrop />, label: t('services.water'), color: '#1a73e8' },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', py: 4 }}>
                {/* Emergency Contacts Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 3,
                        mb: 4,
                        flexWrap: 'wrap',
                    }}
                >
                    {emergencyContacts.map((contact) => (
                        <Chip
                            key={contact.number}
                            icon={contact.icon}
                            label={`${contact.label}: ${contact.number}`}
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                fontWeight: 600,
                                fontSize: 14,
                                py: 2.5,
                                px: 1,
                                '& .MuiChip-icon': {
                                    color: contact.color,
                                },
                            }}
                        />
                    ))}
                </Box>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            component="img"
                            src={`${import.meta.env.BASE_URL}logo.png`}
                            alt="SUVIDHA"
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                mb: 3,
                            }}
                        />
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 1,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            {t('common.welcome')}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 400,
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            {t('common.tagline')}
                        </Typography>
                    </Box>
                </motion.div>

                {/* Services Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3,
                            mb: 5,
                            flexWrap: 'wrap',
                        }}
                    >
                        {services.map((service) => (
                            <Box
                                key={service.label}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Box sx={{ color: service.color }}>{service.icon}</Box>
                                <Typography sx={{ color: 'white', fontWeight: 500 }}>
                                    {service.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </motion.div>

                {/* Language Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <Card
                        elevation={8}
                        sx={{
                            maxWidth: 900,
                            mx: 'auto',
                            borderRadius: 4,
                            overflow: 'visible',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
                            >
                                {t('common.selectLanguage')}
                            </Typography>

                            <Grid2 container spacing={2}>
                                {languages.map((lang) => (
                                    <Grid2 size={{ xs: 6, sm: 4, md: 3 }} key={lang.code}>
                                        <Card
                                            variant={selectedLang === lang.code ? 'elevation' : 'outlined'}
                                            sx={{
                                                borderColor:
                                                    selectedLang === lang.code ? 'primary.main' : 'divider',
                                                borderWidth: selectedLang === lang.code ? 2 : 1,
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <CardActionArea
                                                onClick={() => handleLanguageSelect(lang.code as Language)}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    minHeight: 100,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color:
                                                            selectedLang === lang.code
                                                                ? 'primary.main'
                                                                : 'text.primary',
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {lang.native}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {lang.name}
                                                </Typography>
                                            </CardActionArea>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Grid2>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleContinue}
                                    sx={{
                                        minWidth: 250,
                                        minHeight: 56,
                                        fontSize: 18,
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        background: 'linear-gradient(90deg, #1a73e8 0%, #34a853 100%)',
                                        boxShadow: '0 4px 20px rgba(26, 115, 232, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #1967d2 0%, #1e8e3e 100%)',
                                            boxShadow: '0 6px 25px rgba(26, 115, 232, 0.5)',
                                        },
                                    }}
                                >
                                    {t('common.continue')}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Date/Time Display */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mt: 4,
                        color: 'rgba(255,255,255,0.8)',
                    }}
                >
                    <Typography variant="body1">
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default WelcomePage;
