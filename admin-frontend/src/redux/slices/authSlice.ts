import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AdminUser {
    employee_id: string;
    name: string;
    role: string;
    department: string;
    designation: string;
    permissions: string[];
}

interface AuthState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null, // load from localStorage if needed, but for security maybe not
    token: localStorage.getItem('adminToken'),
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: AdminUser; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('adminToken', action.payload.token);
            localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        },
        // Rehydrate user from local storage
        restoreUser: (state) => {
            const userStr = localStorage.getItem('adminUser');
            if (userStr && state.token) {
                try {
                    state.user = JSON.parse(userStr);
                    state.isAuthenticated = true;
                } catch (e) {
                    state.user = null;
                }
            }
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;
