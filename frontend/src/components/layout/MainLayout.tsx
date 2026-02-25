import { ReactNode, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Chip,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    ReportProblem,
    Map,
    AccountBalance,
    People,
    Accessibility,
    Logout,
    Close,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../store';
import { logout, updateActivity } from '../../store/slices/authSlice';
import {
    toggleSidebar,
    hideNotification,
    showSessionTimeoutWarning,
    hideSessionTimeoutWarning,
    toggleAccessibilityPanel,
} from '../../store/slices/uiSlice';
import AccessibilityPanel from '../accessibility/AccessibilityPanel';
import EmergencyBar from './EmergencyBar';
import LiveStatusBar from './LiveStatusBar';

const DRAWER_WIDTH = 280;
const SESSION_TIMEOUT = 3 * 60 * 1000; // 3 minutes
const WARNING_BEFORE = 30 * 1000; // 30 seconds warning

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { user, lastActivityTime, isGuest } = useSelector((state: RootState) => state.auth);
    const {
        sidebarOpen,
        notification,
        sessionTimeoutWarning,
        emergencyAlert,
        showAccessibilityPanel,
    } = useSelector((state: RootState) => state.ui);

    // Session timeout handling
    useEffect(() => {
        if (!lastActivityTime) return;

        const checkTimeout = () => {
            const elapsed = Date.now() - lastActivityTime;

            if (elapsed >= SESSION_TIMEOUT) {
                dispatch(logout());
                navigate('/login');
            } else if (elapsed >= SESSION_TIMEOUT - WARNING_BEFORE) {
                dispatch(showSessionTimeoutWarning());
            }
        };

        const interval = setInterval(checkTimeout, 1000);
        return () => clearInterval(interval);
    }, [lastActivityTime, dispatch, navigate]);

    // Update activity on user interaction
    const handleActivity = useCallback(() => {
        dispatch(updateActivity());
        dispatch(hideSessionTimeoutWarning());
    }, [dispatch]);

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach((event) => window.addEventListener(event, handleActivity));
        return () => {
            events.forEach((event) => window.removeEventListener(event, handleActivity));
        };
    }, [handleActivity]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleExtendSession = () => {
        dispatch(updateActivity());
        dispatch(hideSessionTimeoutWarning());
    };

    const menuItems = [
        { path: '/dashboard', icon: <Home />, label: t('common.home') },
        { path: '/electricity', icon: <ElectricBolt />, label: t('services.electricity') },
        { path: '/gas', icon: <LocalGasStation />, label: t('services.gas') },
        { path: '/water', icon: <WaterDrop />, label: t('services.water') },
        { path: '/complaints', icon: <ReportProblem />, label: t('services.complaints') },
        { path: '/maps', icon: <Map />, label: t('maps.title') },
        { path: '/schemes', icon: <AccountBalance />, label: 'Schemes' },
        { path: '/directory', icon: <People />, label: 'Directory' },
    ];

    const remainingSeconds = lastActivityTime
        ? Math.max(0, Math.ceil((SESSION_TIMEOUT - (Date.now() - lastActivityTime)) / 1000))
        : 0;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'white',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                {emergencyAlert && <EmergencyBar message={emergencyAlert} />}
                <Toolbar sx={{ height: { xs: 56, md: 80 }, minHeight: { xs: 56, md: 80 }, px: { xs: 1, md: 2 } }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => dispatch(toggleSidebar())}
                        sx={{ mr: { xs: 0.5, md: 2 } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, minWidth: 0 }}>
                        <Box
                            sx={{
                                width: { xs: 36, md: 48 },
                                height: { xs: 36, md: 48 },
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1a73e8 0%, #34a853 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: { xs: 14, md: 20 } }}>
                                S
                            </Typography>
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: { xs: '0.95rem', md: '1.25rem' }, lineHeight: 1.2 }}>
                                SUVIDHA
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t('common.tagline')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <LiveStatusBar />
                    </Box>

                    <IconButton
                        color="inherit"
                        onClick={() => dispatch(toggleAccessibilityPanel())}
                        sx={{ mx: { xs: 0, md: 1 } }}
                        aria-label={t('accessibility.title')}
                    >
                        <Accessibility />
                    </IconButton>

                    {user && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 2 }, ml: { xs: 0.5, md: 2 } }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, fontSize: { xs: 14, md: 20 } }}>
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </Typography>
                                {isGuest && (
                                    <Chip label="Guest" size="small" color="warning" />
                                )}
                            </Box>
                            <IconButton color="inherit" onClick={handleLogout} size="small">
                                <Logout sx={{ fontSize: { xs: 20, md: 24 } }} />
                            </IconButton>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer
                variant={isMobile ? 'temporary' : 'persistent'}
                open={sidebarOpen}
                onClose={() => dispatch(toggleSidebar())}
                sx={{
                    width: sidebarOpen ? DRAWER_WIDTH : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        top: isMobile ? 0 : (emergencyAlert ? 120 : 80),
                        height: isMobile ? '100%' : `calc(100% - ${emergencyAlert ? 120 : 80}px)`,
                        overflowX: 'hidden',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        zIndex: (theme) => isMobile ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
                    },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="overline" color="text.secondary">
                        {t('dashboard.quickActions')}
                    </Typography>
                </Box>
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) dispatch(toggleSidebar());
                            }}
                            sx={{
                                mx: 1,
                                borderRadius: 2,
                                '&:hover': { backgroundColor: 'primary.50' },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ px: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{ minHeight: 48 }}
                    >
                        {t('common.logout')}
                    </Button>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1.5, sm: 2, md: 3 },
                    mt: { xs: '56px', md: emergencyAlert ? '120px' : '80px' },
                    ml: isMobile ? 0 : (sidebarOpen ? 0 : `-${DRAWER_WIDTH}px`),
                    transition: 'margin 0.3s',
                    backgroundColor: 'background.default',
                    minHeight: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 80px)' },
                    width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)`,
                    overflow: 'hidden',
                }}
            >
                {children}
            </Box>

            {/* Accessibility Panel */}
            <Drawer
                anchor="right"
                open={showAccessibilityPanel}
                onClose={() => dispatch(toggleAccessibilityPanel())}
            >
                <Box sx={{ width: 360, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">{t('accessibility.title')}</Typography>
                        <IconButton onClick={() => dispatch(toggleAccessibilityPanel())}>
                            <Close />
                        </IconButton>
                    </Box>
                    <AccessibilityPanel />
                </Box>
            </Drawer>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => dispatch(hideNotification())}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={notification.severity}
                    onClose={() => dispatch(hideNotification())}
                    sx={{ minWidth: 300 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            {/* Session Timeout Warning Dialog */}
            <Dialog open={sessionTimeoutWarning} onClose={handleExtendSession}>
                <DialogTitle>{t('auth.sessionTimeout', { seconds: remainingSeconds })}</DialogTitle>
                <DialogContent>
                    <Typography>
                        Your session is about to expire due to inactivity.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout} color="inherit">
                        {t('common.logout')}
                    </Button>
                    <Button onClick={handleExtendSession} variant="contained" color="primary">
                        {t('auth.extendSession')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MainLayout;
