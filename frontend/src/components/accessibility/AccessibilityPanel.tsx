import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Slider,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {
    TextFields,
    Contrast,
    VolumeUp,
    Refresh,
    DarkMode,
    LightMode,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import {
    setTextSize,
    setContrastMode,
    toggleVoice,
    setVoiceSpeed,
    resetAccessibility,
    TextSize,
    ContrastMode,
} from '../../store/slices/uiSlice';

const AccessibilityPanel = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { textSize, contrastMode, voiceEnabled, voiceSpeed } = useSelector(
        (state: RootState) => state.ui
    );

    const textSizeOptions: { value: TextSize; label: string }[] = [
        { value: 'normal', label: t('accessibility.normal') },
        { value: 'large', label: t('accessibility.large') },
        { value: 'xlarge', label: t('accessibility.extraLarge') },
    ];

    const contrastOptions: { value: ContrastMode; label: string; icon: React.ReactNode }[] = [
        { value: 'normal', label: t('accessibility.normal'), icon: <LightMode /> },
        { value: 'high', label: t('accessibility.highContrast'), icon: <Contrast /> },
        { value: 'dark', label: t('accessibility.darkMode'), icon: <DarkMode /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Text Size */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TextFields color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t('accessibility.textSize')}
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={textSize}
                    exclusive
                    onChange={(_, value) => value && dispatch(setTextSize(value))}
                    fullWidth
                    sx={{
                        '& .MuiToggleButton-root': {
                            py: 1.5,
                            flex: 1,
                        },
                    }}
                >
                    {textSizeOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            value={option.value}
                            aria-label={option.label}
                        >
                            <Typography
                                sx={{
                                    fontSize:
                                        option.value === 'normal'
                                            ? 14
                                            : option.value === 'large'
                                                ? 18
                                                : 22,
                                }}
                            >
                                {option.label}
                            </Typography>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Contrast Mode */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Contrast color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t('accessibility.contrast')}
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={contrastMode}
                    exclusive
                    onChange={(_, value) => value && dispatch(setContrastMode(value))}
                    fullWidth
                    sx={{
                        '& .MuiToggleButton-root': {
                            py: 1.5,
                            flex: 1,
                        },
                    }}
                >
                    {contrastOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            value={option.value}
                            aria-label={option.label}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {option.icon}
                                <Typography variant="body2">{option.label}</Typography>
                            </Box>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            <Divider />

            {/* Voice Assistance */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <VolumeUp color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t('accessibility.voiceAssistance')}
                    </Typography>
                </Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={voiceEnabled}
                            onChange={() => dispatch(toggleVoice())}
                            color="primary"
                        />
                    }
                    label={voiceEnabled ? 'On' : 'Off'}
                    sx={{ mb: 2 }}
                />
                {voiceEnabled && (
                    <Box sx={{ px: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Voice Speed: {voiceSpeed.toFixed(1)}x
                        </Typography>
                        <Slider
                            value={voiceSpeed}
                            onChange={(_, value) => dispatch(setVoiceSpeed(value as number))}
                            min={0.5}
                            max={2}
                            step={0.1}
                            marks={[
                                { value: 0.5, label: '0.5x' },
                                { value: 1, label: '1x' },
                                { value: 2, label: '2x' },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                )}
            </Box>

            <Divider />

            {/* Reset Button */}
            <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => dispatch(resetAccessibility())}
                fullWidth
                sx={{ minHeight: 48 }}
            >
                {t('accessibility.reset')}
            </Button>
        </Box>
    );
};

export default AccessibilityPanel;
