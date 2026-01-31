import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
    Button,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import {
    TextFields,
    Contrast,
    Refresh,
    DarkMode,
    LightMode,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../../store';
import {
    setTextSize,
    setContrastMode,
    resetAccessibility,
    TextSize,
    ContrastMode,
} from '../../store/slices/uiSlice';

const AccessibilityPanel = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { textSize, contrastMode } = useSelector(
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
