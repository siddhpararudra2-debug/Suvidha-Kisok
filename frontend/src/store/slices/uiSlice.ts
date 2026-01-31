import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language =
    | 'en' | 'hi' | 'gu' | 'mr' | 'ta'
    | 'kn' | 'ml' | 'pa' | 'bn' | 'te'
    | 'or' | 'ur';

export type TextSize = 'normal' | 'large' | 'xlarge';
export type ContrastMode = 'normal' | 'high' | 'dark';

export interface UiState {
    language: Language;
    textSize: TextSize;
    contrastMode: ContrastMode;
    voiceEnabled: boolean;
    voiceSpeed: number; // 0.5 to 2.0
    screenReaderMode: boolean;
    sidebarOpen: boolean;
    showAccessibilityPanel: boolean;
    sessionTimeoutWarning: boolean;
    emergencyAlert: string | null;
    loading: {
        global: boolean;
        message: string | null;
    };
    notification: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    };
    currentLocation: {
        lat: number;
        lng: number;
        address: string | null;
    } | null;
}

const initialState: UiState = {
    language: 'en',
    textSize: 'normal',
    contrastMode: 'normal',
    voiceEnabled: false,
    voiceSpeed: 1.0,
    screenReaderMode: false,
    sidebarOpen: true,
    showAccessibilityPanel: false,
    sessionTimeoutWarning: false,
    emergencyAlert: null,
    loading: {
        global: false,
        message: null,
    },
    notification: {
        open: false,
        message: '',
        severity: 'info',
    },
    currentLocation: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLanguage(state, action: PayloadAction<Language>) {
            state.language = action.payload;
        },
        setTextSize(state, action: PayloadAction<TextSize>) {
            state.textSize = action.payload;
        },
        setContrastMode(state, action: PayloadAction<ContrastMode>) {
            state.contrastMode = action.payload;
        },
        toggleVoice(state) {
            state.voiceEnabled = !state.voiceEnabled;
        },
        setVoiceSpeed(state, action: PayloadAction<number>) {
            state.voiceSpeed = Math.max(0.5, Math.min(2.0, action.payload));
        },
        toggleScreenReaderMode(state) {
            state.screenReaderMode = !state.screenReaderMode;
        },
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen(state, action: PayloadAction<boolean>) {
            state.sidebarOpen = action.payload;
        },
        toggleAccessibilityPanel(state) {
            state.showAccessibilityPanel = !state.showAccessibilityPanel;
        },
        setAccessibilityPanelOpen(state, action: PayloadAction<boolean>) {
            state.showAccessibilityPanel = action.payload;
        },
        showSessionTimeoutWarning(state) {
            state.sessionTimeoutWarning = true;
        },
        hideSessionTimeoutWarning(state) {
            state.sessionTimeoutWarning = false;
        },
        setEmergencyAlert(state, action: PayloadAction<string | null>) {
            state.emergencyAlert = action.payload;
        },
        setGlobalLoading(
            state,
            action: PayloadAction<{ loading: boolean; message?: string }>
        ) {
            state.loading.global = action.payload.loading;
            state.loading.message = action.payload.message || null;
        },
        showNotification(
            state,
            action: PayloadAction<{
                message: string;
                severity: 'success' | 'error' | 'warning' | 'info';
            }>
        ) {
            state.notification = {
                open: true,
                message: action.payload.message,
                severity: action.payload.severity,
            };
        },
        hideNotification(state) {
            state.notification.open = false;
        },
        setCurrentLocation(
            state,
            action: PayloadAction<{ lat: number; lng: number; address: string | null }>
        ) {
            state.currentLocation = action.payload;
        },
        clearLocation(state) {
            state.currentLocation = null;
        },
        resetAccessibility(state) {
            state.textSize = 'normal';
            state.contrastMode = 'normal';
            state.voiceEnabled = false;
            state.voiceSpeed = 1.0;
            state.screenReaderMode = false;
        },
    },
});

export const {
    setLanguage,
    setTextSize,
    setContrastMode,
    toggleVoice,
    setVoiceSpeed,
    toggleScreenReaderMode,
    toggleSidebar,
    setSidebarOpen,
    toggleAccessibilityPanel,
    setAccessibilityPanelOpen,
    showSessionTimeoutWarning,
    hideSessionTimeoutWarning,
    setEmergencyAlert,
    setGlobalLoading,
    showNotification,
    hideNotification,
    setCurrentLocation,
    clearLocation,
    resetAccessibility,
} = uiSlice.actions;

export default uiSlice.reducer;
