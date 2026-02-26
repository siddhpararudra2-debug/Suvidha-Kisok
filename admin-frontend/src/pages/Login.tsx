import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';
import api from '../utils/api';
import { Building2, Lock, User, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const response = await api.post('/admin/login', { employeeId, password });
            dispatch(loginSuccess(response.data));
            navigate('/dashboard');
        } catch (err: any) {
            dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-primary-900 p-8 text-center text-white">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Building2 size={32} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-1">SUVIDHA</h1>
                    <p className="text-primary-200">Government Admin Portal</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-3 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Employee ID
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="SUVIDHA-XXXX-XXXX"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                        <p className="font-semibold mb-1">🔑 Demo Mode</p>
                        <p>Enter any Employee ID and use password: <span className="font-mono font-bold">admin123</span></p>
                    </div>

                    <div className="mt-4 text-center text-xs text-gray-500">
                        <p>Restricted Access - Govt Officials Only</p>
                        <p className="mt-1">© 2026 Suvidha Department</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
