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
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(26, 115, 232, 0.3)',
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '2.5rem',
                    }}
                >
                    S
                </Typography>
            </Box>
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
