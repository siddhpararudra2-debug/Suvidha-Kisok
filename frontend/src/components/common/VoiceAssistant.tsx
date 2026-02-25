import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Chip,
    IconButton,
    Paper,
    Tooltip,
} from '@mui/material';
import {
    Mic,
    MicOff,
    VolumeUp,
    VolumeOff,
    Close,
    Home,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    ReportProblem,
    Map,
    AccountBalance,
    People,
    RecordVoiceOver,
} from '@mui/icons-material';
import { AppDispatch } from '../../store';
import { showNotification } from '../../store/slices/uiSlice';

// Voice command definitions
const VOICE_COMMANDS = [
    { phrases: ['go home', 'home', 'dashboard', 'go to home', 'go to dashboard'], action: '/dashboard', label: 'Go Home', icon: <Home /> },
    { phrases: ['electricity', 'electric', 'light bill', 'bijli', 'go to electricity'], action: '/electricity', label: 'Electricity', icon: <ElectricBolt /> },
    { phrases: ['gas', 'gas bill', 'png', 'cng', 'go to gas'], action: '/gas', label: 'Gas Services', icon: <LocalGasStation /> },
    { phrases: ['water', 'water bill', 'pani', 'go to water'], action: '/water', label: 'Water Services', icon: <WaterDrop /> },
    { phrases: ['complaint', 'complain', 'register complaint', 'shikayat', 'go to complaints'], action: '/complaints', label: 'Complaints', icon: <ReportProblem /> },
    { phrases: ['map', 'maps', 'infrastructure', 'go to map'], action: '/map', label: 'Infrastructure Map', icon: <Map /> },
    { phrases: ['schemes', 'scheme', 'government scheme', 'yojana', 'go to schemes'], action: '/schemes', label: 'Government Schemes', icon: <AccountBalance /> },
    { phrases: ['directory', 'service directory', 'contacts', 'go to directory'], action: '/directory', label: 'Service Directory', icon: <People /> },
    { phrases: ['pay', 'pay bill', 'payment', 'go to payment'], action: '/payment', label: 'Pay Bill', icon: <ElectricBolt /> },
];

const PAGE_DESCRIPTIONS: Record<string, string> = {
    '/dashboard': 'You are on the Dashboard. Here you can see your outstanding bills, quick actions, and active complaints. Say a service name to navigate.',
    '/electricity': 'You are on the Electricity page. You can view your latest bill, pay bills, check consumption, report outages, and more.',
    '/gas': 'You are on the Gas Services page. You can view PNG bills, find CNG stations, submit meter readings, and check gas prices.',
    '/water': 'You are on the Water Services page. You can view water bills, request water tankers, report leakage, and check supply schedules.',
    '/complaints': 'You are on the Complaints page. You can register a new complaint by selecting a category, describing the issue, and providing your location.',
    '/map': 'You are on the Infrastructure Map. You can view electricity, gas, and water network layers, find nearby stations, and check outages.',
    '/schemes': 'You are on the Government Schemes page. Browse available welfare schemes, check eligibility, and apply online.',
    '/directory': 'You are on the Service Directory. Find emergency contacts, government offices, and utility service centers near you.',
    '/payment': 'You are on the Payment page. Choose your payment method: UPI, card, net banking, or scan the QR code to pay.',
};

const VoiceAssistant = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;
        return () => {
            if (synthRef.current) synthRef.current.cancel();
            if (recognitionRef.current) recognitionRef.current.abort();
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = 'en-IN';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current) synthRef.current.cancel();
        setIsSpeaking(false);
    }, []);

    const processCommand = useCallback((text: string) => {
        const lower = text.toLowerCase().trim();
        setTranscript(text);

        // Check for read page command
        if (lower.includes('read') || lower.includes('help') || lower.includes('what is this')) {
            const currentPath = location.pathname;
            const desc = PAGE_DESCRIPTIONS[currentPath] || 'You are on the SUVIDHA kiosk. Say a service name like Electricity, Gas, Water, or Complaints to navigate.';
            setFeedback(desc);
            speak(desc);
            return;
        }

        // Check for stop command
        if (lower.includes('stop') || lower.includes('quiet') || lower.includes('silence')) {
            stopSpeaking();
            setFeedback('Stopped.');
            return;
        }

        // Match navigation commands
        for (const cmd of VOICE_COMMANDS) {
            for (const phrase of cmd.phrases) {
                if (lower.includes(phrase)) {
                    navigate(cmd.action);
                    const msg = `Navigating to ${cmd.label}`;
                    setFeedback(msg);
                    speak(msg);
                    dispatch(showNotification({ message: `🎤 ${msg}`, severity: 'info' }));
                    return;
                }
            }
        }

        setFeedback(`I didn't understand "${text}". Try saying a service name like "Electricity" or "Water".`);
        speak(`I didn't understand. Try saying a service name like Electricity, Gas, or Water.`);
    }, [location.pathname, navigate, speak, stopSpeaking, dispatch]);

    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            dispatch(showNotification({ message: 'Voice recognition not supported in this browser', severity: 'error' }));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback('Listening... Speak now.');
        };

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            processCommand(text);
        };

        recognition.onerror = (event: any) => {
            setIsListening(false);
            if (event.error === 'not-allowed') {
                setFeedback('Microphone access denied. Please allow microphone in browser settings.');
            } else {
                setFeedback('Could not hear you. Please try again.');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [processCommand, dispatch]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
        setIsListening(false);
    }, []);

    const readCurrentPage = () => {
        const currentPath = location.pathname;
        const desc = PAGE_DESCRIPTIONS[currentPath] || 'Welcome to SUVIDHA. Say a service name to navigate.';
        setFeedback(desc);
        speak(desc);
    };

    return (
        <>
            {/* Floating Mic Button */}
            <Tooltip title="Voice Assistant" placement="left">
                <Fab
                    color={isListening ? 'error' : 'primary'}
                    onClick={() => setDialogOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1300,
                        width: 64,
                        height: 64,
                        animation: isListening ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(234, 67, 53, 0.7)' },
                            '70%': { boxShadow: '0 0 0 20px rgba(234, 67, 53, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(234, 67, 53, 0)' },
                        },
                    }}
                >
                    {isListening ? <MicOff /> : <RecordVoiceOver />}
                </Fab>
            </Tooltip>

            {/* Voice Assistant Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); stopListening(); stopSpeaking(); }}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                    <RecordVoiceOver color="primary" />
                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>Voice Assistant</Typography>
                    <IconButton onClick={() => { setDialogOpen(false); stopListening(); stopSpeaking(); }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 0 }}>
                    {/* Status */}
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                mx: 'auto',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: isListening ? 'error.light' : isSpeaking ? 'success.light' : 'primary.light',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                animation: isListening ? 'pulse 1.5s infinite' : 'none',
                            }}
                            onClick={isListening ? stopListening : startListening}
                        >
                            {isListening ? (
                                <MicOff sx={{ fontSize: 48, color: 'white' }} />
                            ) : isSpeaking ? (
                                <VolumeUp sx={{ fontSize: 48, color: 'white' }} />
                            ) : (
                                <Mic sx={{ fontSize: 48, color: 'white' }} />
                            )}
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {isListening ? '🔴 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Tap the mic to speak'}
                        </Typography>
                        {transcript && (
                            <Chip label={`"${transcript}"`} sx={{ mt: 1 }} color="primary" variant="outlined" />
                        )}
                    </Box>

                    {/* Feedback */}
                    {feedback && (
                        <Paper sx={{ p: 2, mb: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                            <Typography variant="body2">{feedback}</Typography>
                        </Paper>
                    )}

                    {/* Quick Actions */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Quick Voice Commands:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        <Chip label='"Go Home"' size="small" onClick={() => processCommand('go home')} />
                        <Chip label='"Electricity"' size="small" onClick={() => processCommand('electricity')} />
                        <Chip label='"Pay Bill"' size="small" onClick={() => processCommand('pay bill')} />
                        <Chip label='"Complaint"' size="small" onClick={() => processCommand('complaint')} />
                        <Chip label='"Read Page"' size="small" onClick={() => processCommand('read this page')} />
                    </Box>

                    {/* Navigation List */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Say any of these to navigate:
                    </Typography>
                    <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {VOICE_COMMANDS.map((cmd) => (
                            <ListItemButton
                                key={cmd.action}
                                onClick={() => { navigate(cmd.action); setDialogOpen(false); }}
                                sx={{ borderRadius: 1 }}
                            >
                                <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
                                    {cmd.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={cmd.label}
                                    secondary={cmd.phrases.slice(0, 3).join(', ')}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={isSpeaking ? <VolumeOff /> : <VolumeUp />}
                        onClick={isSpeaking ? stopSpeaking : readCurrentPage}
                    >
                        {isSpeaking ? 'Stop' : 'Read Page'}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={isListening ? <MicOff /> : <Mic />}
                        color={isListening ? 'error' : 'primary'}
                        onClick={isListening ? stopListening : startListening}
                    >
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VoiceAssistant;
