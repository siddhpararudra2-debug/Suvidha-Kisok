import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                gap: 3,
            }}
        >
            <Box
                component="img"
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="SUVIDHA"
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 8px 32px rgba(26, 115, 232, 0.3)',
                }}
            />
            <CircularProgress
                size={48}
                thickness={4}
                sx={{ color: 'primary.main' }}
            />
            <Typography
                variant="h6"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                }}
            >
                {t('common.loading')}
            </Typography>
        </Box>
    );
};

export default LoadingScreen;
