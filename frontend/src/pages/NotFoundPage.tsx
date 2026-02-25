import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { SearchOff, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 4,
                        }}
                    >
                        <SearchOff
                            sx={{
                                fontSize: 100,
                                color: 'primary.main',
                                mb: 2,
                                opacity: 0.7,
                            }}
                        />
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: '5rem',
                                background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            404
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Page Not Found
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            The page you're looking for doesn't exist or has been moved.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                            sx={{
                                minHeight: 56,
                                px: 4,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                            }}
                        >
                            Back to Home
                        </Button>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default NotFoundPage;
