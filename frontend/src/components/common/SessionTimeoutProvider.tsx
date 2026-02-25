import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { logout, updateActivity } from '../../store/slices/authSlice';
import { showNotification } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

const SESSION_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
const CHECK_INTERVAL_MS = 10 * 1000;        // check every 10 seconds
const WARNING_BEFORE_MS = 30 * 1000;         // warn 30 seconds before

interface SessionTimeoutProviderProps {
    children: React.ReactNode;
}

const SessionTimeoutProvider = ({ children }: SessionTimeoutProviderProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, lastActivityTime } = useSelector((state: RootState) => state.auth);
    const warningShownRef = useRef(false);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        dispatch(showNotification({
            message: 'Session expired due to inactivity. Please login again.',
            severity: 'warning',
        }));
        navigate('/login');
    }, [dispatch, navigate]);

    // Track user activity
    const handleActivity = useCallback(() => {
        if (isAuthenticated) {
            dispatch(updateActivity());
            warningShownRef.current = false;
        }
    }, [isAuthenticated, dispatch]);

    // Set up activity listeners
    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [isAuthenticated, handleActivity]);

    // Check for timeout
    useEffect(() => {
        if (!isAuthenticated || !lastActivityTime) return;

        const interval = setInterval(() => {
            const elapsed = Date.now() - lastActivityTime;

            if (elapsed >= SESSION_TIMEOUT_MS) {
                handleLogout();
            } else if (elapsed >= SESSION_TIMEOUT_MS - WARNING_BEFORE_MS && !warningShownRef.current) {
                warningShownRef.current = true;
                dispatch(showNotification({
                    message: 'Session will expire in 30 seconds due to inactivity.',
                    severity: 'warning',
                }));
            }
        }, CHECK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [isAuthenticated, lastActivityTime, handleLogout, dispatch]);

    return <>{children}</>;
};

export default SessionTimeoutProvider;
