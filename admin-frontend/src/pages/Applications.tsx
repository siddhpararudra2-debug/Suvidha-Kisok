import React, { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import {
    Search,
    Filter,
    ChevronDown,
    RefreshCw,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Zap,
    Flame,
    Droplets,
    Calendar,
    User,
    AlertCircle,
    ChevronRight,
    X
} from 'lucide-react';
import clsx from 'clsx';

interface Application {
    id: number;
    user_id: string;
    type: string;
    consumer_id: string;
    provider: string;
    status: string;
    created_at: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
    active: { bg: 'bg-green-100', text: 'text-green-700' },
    approved: { bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    inspection: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

const typeIcons: Record<string, React.ReactNode> = {
    electricity: <Zap size={16} className="text-yellow-500" />,
    gas: <Flame size={16} className="text-orange-500" />,
    water: <Droplets size={16} className="text-blue-500" />,
};

const Applications: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/applications');
            setApplications(response.data);
        } catch (error) {
            // Mock data for demonstration
            setApplications([
                { id: 1, user_id: 'USR001', type: 'electricity', consumer_id: 'ELC-2026-00234', provider: 'State Electricity Board', status: 'pending', created_at: new Date().toISOString() },
                { id: 2, user_id: 'USR002', type: 'gas', consumer_id: 'GAS-2026-00187', provider: 'City Gas Distribution', status: 'inspection', created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: 3, user_id: 'USR003', type: 'water', consumer_id: 'WTR-2026-00345', provider: 'Municipal Water Board', status: 'approved', created_at: new Date(Date.now() - 172800000).toISOString() },
                { id: 4, user_id: 'USR004', type: 'electricity', consumer_id: 'ELC-2026-00235', provider: 'State Electricity Board', status: 'pending', created_at: new Date(Date.now() - 259200000).toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
        const interval = setInterval(fetchApplications, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = searchTerm === '' ||
                app.consumer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.user_id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
            const matchesType = typeFilter === 'all' || app.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [applications, searchTerm, statusFilter, typeFilter]);

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/admin/applications/${id}/approve`);
            fetchApplications();
            setShowModal(false);
        } catch (error) {
            console.error('Failed to approve:', error);
        }
    };

    const handleReject = async (id: number) => {
        try {
            await api.put(`/admin/applications/${id}/reject`);
            fetchApplications();
            setShowModal(false);
        } catch (error) {
            console.error('Failed to reject:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const openDetailModal = (app: Application) => {
        setSelectedApp(app);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Application Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredApplications.length} applications • Live data sync
                    </p>
                </div>
                <button
                    onClick={fetchApplications}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Application ID or User ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={clsx(
                            'flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                            showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        )}
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} className={clsx('transition-transform', showFilters && 'rotate-180')} />
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="inspection">Under Inspection</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Service Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Types</option>
                                <option value="electricity">⚡ Electricity</option>
                                <option value="gas">🔥 Gas</option>
                                <option value="water">💧 Water</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                        Loading applications...
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <AlertCircle className="mx-auto mb-2" size={24} />
                        No applications found
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Application #</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <span className="font-mono text-sm text-primary-600 font-medium">
                                            {app.consumer_id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            {typeIcons[app.type] || <FileText size={16} />}
                                            <span className="text-sm capitalize">{app.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-700">{app.user_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-600">{app.provider}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar size={14} />
                                            {formatDate(app.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={clsx(
                                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                            statusColors[app.status]?.bg || 'bg-gray-100',
                                            statusColors[app.status]?.text || 'text-gray-700'
                                        )}>
                                            {app.status === 'pending' && <Clock size={12} />}
                                            {app.status === 'approved' && <CheckCircle size={12} />}
                                            {app.status === 'rejected' && <XCircle size={12} />}
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => openDetailModal(app)}
                                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            <Eye size={14} />
                                            View
                                            <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {showModal && selectedApp && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                                <p className="text-sm text-gray-500">{selectedApp.consumer_id}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Application Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Service Type</p>
                                    <div className="flex items-center gap-2">
                                        {typeIcons[selectedApp.type]}
                                        <span className="font-medium capitalize">{selectedApp.type}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={clsx(
                                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                        statusColors[selectedApp.status]?.bg,
                                        statusColors[selectedApp.status]?.text
                                    )}>
                                        {selectedApp.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Applicant ID</p>
                                    <p className="font-medium">{selectedApp.user_id}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Applied On</p>
                                    <p className="font-medium">{formatDate(selectedApp.created_at)}</p>
                                </div>
                            </div>

                            {/* Provider */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Service Provider</p>
                                <p className="font-medium">{selectedApp.provider}</p>
                            </div>

                            {/* Workflow Progress */}
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Workflow Progress</h4>
                                <div className="flex items-center justify-between">
                                    {['Submitted', 'Documents', 'Inspection', 'Approval', 'Active'].map((step, i) => (
                                        <React.Fragment key={step}>
                                            <div className="flex flex-col items-center">
                                                <div className={clsx(
                                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                                                    i === 0 ? 'bg-green-500 text-white' :
                                                        i === 1 && selectedApp.status !== 'pending' ? 'bg-green-500 text-white' :
                                                            i === 2 && selectedApp.status === 'inspection' ? 'bg-blue-500 text-white' :
                                                                i >= 3 && selectedApp.status === 'approved' ? 'bg-green-500 text-white' :
                                                                    'bg-gray-200 text-gray-500'
                                                )}>
                                                    {i + 1}
                                                </div>
                                                <span className="text-xs mt-1 text-gray-500">{step}</span>
                                            </div>
                                            {i < 4 && <div className="flex-1 h-0.5 bg-gray-200 mx-2" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedApp.status === 'pending' || selectedApp.status === 'inspection' ? (
                                <div className="flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleApprove(selectedApp.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                    >
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedApp.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                        <FileText size={18} />
                                        Request Docs
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                                    This application has been processed.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;
