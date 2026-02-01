import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
    ClipboardList,
    Monitor,
    TrendingUp,
    AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    // Mock data for chart
    const data = [
        { name: 'Mon', complaints: 40, resolved: 35 },
        { name: 'Tue', complaints: 30, resolved: 28 },
        { name: 'Wed', complaints: 50, resolved: 45 },
        { name: 'Thu', complaints: 45, resolved: 40 },
        { name: 'Fri', complaints: 60, resolved: 55 },
        { name: 'Sat', complaints: 20, resolved: 18 },
        { name: 'Sun', complaints: 25, resolved: 25 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <ClipboardList size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-medium">+{stats?.complaints.growth}%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.complaints.today}</h3>
                    <p className="text-gray-500 text-sm">Today's Complaints</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-red-500 text-sm font-medium">{stats?.applications.overdue} overdue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.applications.pending}</h3>
                    <p className="text-gray-500 text-sm">Pending Applications</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Monitor size={24} />
                        </div>
                        <span className="text-gray-400 text-sm font-medium">/{stats?.kiosks.total} total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stats?.kiosks.online}</h3>
                    <p className="text-gray-500 text-sm">Active Kiosks</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-medium">+{stats?.revenue.growth}%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">₹{(stats?.revenue.total / 100000).toFixed(1)}L</h3>
                    <p className="text-gray-500 text-sm">Daily Revenue</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaint Trends</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line type="monotone" dataKey="complaints" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Feed</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Gas leak reported in Sector 12</p>
                                <p className="text-xs text-red-500 font-semibold mt-1">EMERGENCY • 2 min ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Bill payment received ₹2,500</p>
                                <p className="text-xs text-gray-500 mt-1">Consumer: 123456 • 5 min ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Water Tanker Request #892</p>
                                <p className="text-xs text-gray-500 mt-1">Approved • 12 min ago</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">SLA Compliance</h4>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-3xl font-bold text-gray-900">{stats?.sla}%</span>
                            <span className="text-sm text-gray-500 mb-1">Target: 90%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[87%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
