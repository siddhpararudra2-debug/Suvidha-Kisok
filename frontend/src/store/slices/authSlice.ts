import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    aadhaarMasked?: string;
    address?: string;
    profilePhoto?: string;
    connections: {
        electricity?: string[];
        gas?: string[];
        water?: string[];
    };
}

export interface AuthState {
    isAuthenticated: boolean;
    isGuest: boolean;
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    tokenExpiry: number | null;
    sessionStartTime: number | null;
    lastActivityTime: number | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isGuest: false,
    user: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
    sessionStartTime: null,
    lastActivityTime: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(
            state,
            action: PayloadAction<{
                user: User;
                token: string;
                refreshToken: string;
                expiresIn: number;
                isGuest?: boolean;
            }>
        ) {
            state.isAuthenticated = true;
            state.isGuest = action.payload.isGuest || false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.tokenExpiry = Date.now() + action.payload.expiresIn * 1000;
            state.sessionStartTime = Date.now();
            state.lastActivityTime = Date.now();
            state.loading = false;
            state.error = null;
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.isGuest = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.tokenExpiry = null;
            state.sessionStartTime = null;
            state.lastActivityTime = null;
            state.loading = false;
            state.error = null;
        },
        updateActivity(state) {
            state.lastActivityTime = Date.now();
        },
        refreshTokenSuccess(
            state,
            action: PayloadAction<{ token: string; expiresIn: number }>
        ) {
            state.token = action.payload.token;
            state.tokenExpiry = Date.now() + action.payload.expiresIn * 1000;
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        addConnection(
            state,
            action: PayloadAction<{
                type: 'electricity' | 'gas' | 'water';
                connectionId: string;
            }>
        ) {
            if (state.user) {
                const { type, connectionId } = action.payload;
                if (!state.user.connections[type]) {
                    state.user.connections[type] = [];
                }
                if (!state.user.connections[type]!.includes(connectionId)) {
                    state.user.connections[type]!.push(connectionId);
                }
            }
        },
        clearError(state) {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateActivity,
    refreshTokenSuccess,
    updateUser,
    addConnection,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;
