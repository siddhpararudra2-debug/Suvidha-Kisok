import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                p: 5,
                                textAlign: 'center',
                                borderRadius: 4,
                                background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
                            }}
                        >
                            <ErrorOutline
                                sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Something Went Wrong
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                An unexpected error occurred. Please try again or return to the home page.
                            </Typography>
                            {this.state.error && (
                                <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={{
                                        display: 'block',
                                        mb: 3,
                                        fontFamily: 'monospace',
                                        backgroundColor: '#f5f5f5',
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    {this.state.error.message}
                                </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={this.handleRetry}
                                    size="large"
                                    sx={{ minHeight: 48 }}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={this.handleGoHome}
                                    size="large"
                                    sx={{ minHeight: 48 }}
                                >
                                    Go Home
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
