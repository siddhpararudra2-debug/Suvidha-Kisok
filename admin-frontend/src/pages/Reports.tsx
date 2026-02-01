import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Download, PieChart, TrendingUp, Users, AlertTriangle, Clock } from 'lucide-react';
import clsx from 'clsx';

const reportTypes = [
    { id: 'complaints', name: 'Complaint Analysis', icon: AlertTriangle },
    { id: 'revenue', name: 'Revenue Collection', icon: TrendingUp },
    { id: 'sla', name: 'SLA Compliance', icon: Clock },
    { id: 'department', name: 'Department Performance', icon: Users },
];

const complaintsData = [
    { name: 'Mon', electricity: 40, gas: 24, water: 30 },
    { name: 'Tue', electricity: 30, gas: 13, water: 25 },
    { name: 'Wed', electricity: 50, gas: 28, water: 35 },
    { name: 'Thu', electricity: 45, gas: 20, water: 32 },
    { name: 'Fri', electricity: 60, gas: 35, water: 40 },
];

const pieData = [
    { name: 'Electricity', value: 45, color: '#EAB308' },
    { name: 'Water', value: 30, color: '#3B82F6' },
    { name: 'Gas', value: 15, color: '#F97316' },
    { name: 'Other', value: 10, color: '#6B7280' },
];

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'generate' | 'analytics'>('analytics');
    const [reportType, setReportType] = useState('complaints');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Generate reports and view performance analytics</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
                <button onClick={() => setActiveTab('analytics')} className={clsx('flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm', activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                    <PieChart size={18} /> Analytics
                </button>
                <button onClick={() => setActiveTab('generate')} className={clsx('flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm', activeTab === 'generate' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                    <FileText size={18} /> Generate Report
                </button>
            </div>

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Total Complaints</p><p className="text-2xl font-bold">1,247</p></div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Resolved</p><p className="text-2xl font-bold text-green-600">1,089</p></div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">Avg Resolution</p><p className="text-2xl font-bold">2.8d</p></div>
                        <div className="bg-white p-5 rounded-xl shadow-sm border"><p className="text-sm text-gray-500">SLA Compliance</p><p className="text-2xl font-bold text-amber-600">87%</p></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="font-semibold mb-4">Weekly Complaints</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={complaintsData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" /><YAxis />
                                        <Tooltip /><Legend />
                                        <Bar dataKey="electricity" fill="#EAB308" name="Electricity" />
                                        <Bar dataKey="water" fill="#3B82F6" name="Water" />
                                        <Bar dataKey="gas" fill="#F97316" name="Gas" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h3 className="font-semibold mb-4">Distribution</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'generate' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold mb-4">Report Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Report Type</label>
                            {reportTypes.map((t) => {
                                const Icon = t.icon; return (
                                    <button key={t.id} onClick={() => setReportType(t.id)} className={clsx('w-full flex items-center gap-3 px-4 py-3 rounded-lg border mb-2', reportType === t.id ? 'bg-primary-50 border-primary-300' : 'hover:bg-gray-50')}>
                                        <Icon size={18} /><span>{t.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm mb-1">From</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm mb-1">To</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium w-full">
                            <Download size={18} /> Generate Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Reports;
