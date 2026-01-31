
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ComingSoonPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 3,
                    mt: 4
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: 'primary.50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.main',
                            mb: 2
                        }}
                    >
                        <Construction sx={{ fontSize: 60 }} />
                    </Box>
                </motion.div>

                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Coming Soon
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    We are working hard to bring you this feature.
                    Please check back later or contact support if you need immediate assistance.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        </Container>
    );
};

export default ComingSoonPage;
