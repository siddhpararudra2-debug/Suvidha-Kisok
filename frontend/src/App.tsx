import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense, lazy } from 'react';
import { RootState } from './store';
import MainLayout from './components/layout/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy load pages for better performance
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ElectricityPage = lazy(() => import('./pages/electricity/ElectricityPage'));
const GasPage = lazy(() => import('./pages/gas/GasPage'));
const WaterPage = lazy(() => import('./pages/water/WaterPage'));
const ComplaintsPage = lazy(() => import('./pages/complaints/ComplaintsPage'));
const MapExplorerPage = lazy(() => import('./pages/maps/MapExplorerPage'));
const SchemesPage = lazy(() => import('./pages/schemes/SchemesPage'));
const DirectoryPage = lazy(() => import('./pages/directory/DirectoryPage'));
const PaymentPage = lazy(() => import('./pages/payment/PaymentPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isGuest } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated && !isGuest) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    const { language, textSize, contrastMode } = useSelector((state: RootState) => state.ui);

    // Set document attributes for accessibility
    const dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-text-size', textSize);
    document.documentElement.setAttribute('data-contrast', contrastMode);

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes with Layout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DashboardPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/electricity/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ElectricityPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/gas/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <GasPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/water/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <WaterPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/complaints/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ComplaintsPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/maps"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <MapExplorerPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/schemes/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <SchemesPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/directory"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <DirectoryPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <PaymentPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/coming-soon"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <ComingSoonPage />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Registration (Public) */}
                <Route path="/register" element={<RegisterPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
