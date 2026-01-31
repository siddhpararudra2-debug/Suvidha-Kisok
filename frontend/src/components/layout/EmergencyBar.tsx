import { Box, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';

interface EmergencyBarProps {
    message: string;
}

const EmergencyBar = ({ message }: EmergencyBarProps) => {
    return (
        <Box
            role="alert"
            aria-live="assertive"
            sx={{
                background: 'linear-gradient(90deg, #ea4335 0%, #d93025 100%)',
                color: 'white',
                py: 1,
                px: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.85 },
                },
            }}
        >
            <Warning sx={{ animation: 'blink 1s infinite' }} />
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 600,
                    letterSpacing: 0.5,
                }}
            >
                {message}
            </Typography>
            <Warning sx={{ animation: 'blink 1s infinite' }} />
        </Box>
    );
};

export default EmergencyBar;
