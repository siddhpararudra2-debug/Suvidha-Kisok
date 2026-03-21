import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Download, PieChart, TrendingUp, Users, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import api from '../utils/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable for TypeScript
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

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
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/reports');
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        const doc = new jsPDF();
        const typeLabel = reportTypes.find(t => t.id === reportType)?.name || 'Executive Report';
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); // primary-900
        doc.text('SUVIDHA ADMIN PORTAL', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(100);
        doc.text(`${typeLabel}`, 105, 30, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 38, { align: 'center' });
        doc.text(`City: Surat, Gujarat`, 105, 44, { align: 'center' });
        
        doc.setDrawColor(200);
        doc.line(20, 50, 190, 50);

        // Content based on report type
        if (reportType === 'complaints') {
            doc.setFontSize(12);
            doc.text('Complaint Distribution by Department', 20, 60);
            
            const tableData = [
                ['Department', 'Resolution Rate', 'Avg Time', 'Total'],
                ['Electricity', '92%', '1.8 Days', '458'],
                ['Water', '88%', '2.2 Days', '312'],
                ['Gas', '95%', '1.2 Days', '186'],
                ['General', '84%', '3.5 Days', '91']
            ];
            
            doc.autoTable({
                startY: 65,
                head: [tableData[0]],
                body: tableData.slice(1),
                theme: 'striped',
                headStyles: { fillColor: [30, 58, 138] }
            });
        } else if (reportType === 'revenue') {
            doc.setFontSize(12);
            doc.text('Revenue Collection Summary', 20, 60);
            
            const tableData = [
                ['Service', 'Collections (INR)', 'Growth', 'Target %'],
                ['Electricity', '₹ 5,80,000', '+8.5%', '98%'],
                ['Water', '₹ 3,20,000', '+4.2%', '95%'],
                ['Gas', '₹ 2,50,000', '+12.1%', '99%'],
                ['Tax/Misc', '₹ 1,30,000', '+2.4%', '88%']
            ];
            
            doc.autoTable({
                startY: 65,
                head: [tableData[0]],
                body: tableData.slice(1),
                theme: 'grid',
                headStyles: { fillColor: [5, 150, 105] } // emerald-600
            });
        } else {
            doc.text('Performance Analytics Summary report content...', 20, 60);
        }

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('This is a system generated report from Suvidha Admin Portal Localization: Surat.', 105, 285, { align: 'center' });
            doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
        }

        doc.save(`Suvidha_Report_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

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
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <RefreshCw className="animate-spin mx-auto mb-2" size={32} />
                            Calculating analytics...
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-xl shadow-sm border">
                                    <p className="text-sm text-gray-500">Total Complaints</p>
                                    <p className="text-2xl font-bold">{reportData?.summary.totalComplaints || '0'}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border">
                                    <p className="text-sm text-gray-500">Resolved</p>
                                    <p className="text-2xl font-bold text-green-600">{reportData?.summary.resolvedComplaints || '0'}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border">
                                    <p className="text-sm text-gray-500">Avg Resolution</p>
                                    <p className="text-2xl font-bold">{reportData?.summary.avgResolutionTime || '0'}</p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border">
                                    <p className="text-sm text-gray-500">SLA Compliance</p>
                                    <p className="text-2xl font-bold text-amber-600">{reportData?.summary.slaCompliance || '0'}%</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                                    <h3 className="font-semibold mb-4">Weekly Complaints</h3>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={reportData?.monthlyTrend || complaintsData}>
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
                                            <RePieChart>
                                                <Pie 
                                                    data={pieData} 
                                                    cx="50%" 
                                                    cy="50%" 
                                                    innerRadius={40} 
                                                    outerRadius={60} 
                                                    dataKey="value"
                                                >
                                                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                                </Pie>
                                                <Tooltip />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'generate' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-semibold mb-4">Report Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Report Type</label>
                            <div className="space-y-2">
                                {reportTypes.map((t) => {
                                    const Icon = t.icon; return (
                                        <button key={t.id} onClick={() => setReportType(t.id)} className={clsx('w-full flex items-center gap-3 px-4 py-3 rounded-lg border', reportType === t.id ? 'bg-primary-50 border-primary-300' : 'hover:bg-gray-50')}>
                                            <Icon size={18} /><span>{t.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm mb-1">From</label><input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm mb-1">To</label><input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                        </div>
                        <button 
                            onClick={handleGenerateReport}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium w-full mt-4"
                        >
                            <Download size={18} /> Generate Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
