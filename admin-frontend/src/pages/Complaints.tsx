import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    Search,
    Filter,
    Download,
    ChevronDown,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    Zap,
    Flame,
    Droplets,
    MapPin,
    User,
    Calendar,
    Map,
    List,
} from 'lucide-react';
import clsx from 'clsx';

// Lazy load map component for performance
const ComplaintsMap = lazy(() => import('../components/ComplaintsMap'));

interface Complaint {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
    status: string;
    address: string;
    user_id: string;
    assigned_officer_id: string | null;
    created_at: string;
    updated_at: string;
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    registered: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={14} /> },
    assigned: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <User size={14} /> },
    in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <RefreshCw size={14} /> },
    resolved: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} /> },
    closed: { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle size={14} /> },
};

const priorityColors: Record<string, string> = {
    low: 'text-gray-500',
    medium: 'text-amber-500',
    high: 'text-orange-500',
    critical: 'text-red-600',
};

const typeIcons: Record<string, React.ReactNode> = {
    electricity: <Zap size={16} className="text-yellow-500" />,
    gas: <Flame size={16} className="text-orange-500" />,
    water: <Droplets size={16} className="text-blue-500" />,
};

const Complaints: React.FC = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            const response = await api.get('/admin/complaints', { params });
            setComplaints(response.data);
        } catch (error) {
            console.error('Failed to fetch complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
        // Auto-refresh every 30 seconds for live data
        const interval = setInterval(fetchComplaints, 30000);
        return () => clearInterval(interval);
    }, [statusFilter]);

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const matchesSearch = searchTerm === '' ||
                c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.address?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || c.type === typeFilter;
            const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
            return matchesSearch && matchesType && matchesPriority;
        });
    }, [complaints, searchTerm, typeFilter, priorityFilter]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedComplaints(filteredComplaints.map(c => c.id));
        } else {
            setSelectedComplaints([]);
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedComplaints(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleExport = () => {
        const csv = [
            ['ID', 'Type', 'Category', 'Priority', 'Status', 'Address', 'Created'].join(','),
            ...filteredComplaints.map(c =>
                [c.id, c.type, c.category, c.priority, c.status, `"${c.address || ''}"`, c.created_at].join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const config = statusColors[status] || statusColors.registered;
        return (
            <span className={clsx('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.bg, config.text)}>
                {config.icon}
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Complaint Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredComplaints.length} complaints • Auto-refreshes every 30s
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx(
                                'flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-800'
                            )}
                        >
                            <List size={16} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={clsx(
                                'flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                viewMode === 'map' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600 hover:text-gray-800'
                            )}
                        >
                            <Map size={16} />
                            Map
                        </button>
                    </div>
                    <button
                        onClick={fetchComplaints}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, description, or address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>

                    {/* Filter Toggle */}
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

                {/* Filter Options */}
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
                                <option value="registered">Registered</option>
                                <option value="assigned">Assigned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
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
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Priorities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedComplaints.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm text-primary-700 font-medium">
                        {selectedComplaints.length} complaint(s) selected
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-white border border-primary-300 text-primary-700 rounded-md text-sm font-medium hover:bg-primary-100">
                            Assign Officer
                        </button>
                        <button
                            onClick={() => setSelectedComplaints([])}
                            className="px-3 py-1.5 text-primary-600 text-sm font-medium hover:underline"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
                <Suspense fallback={
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                        Loading map...
                    </div>
                }>
                    <ComplaintsMap
                        complaints={filteredComplaints}
                        onComplaintClick={(id) => navigate(`/complaints/${id}`)}
                    />
                </Suspense>
            )}

            {/* List View - Complaints Table */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                            Loading complaints...
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <AlertCircle className="mx-auto mb-2" size={24} />
                            No complaints found
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedComplaints.length === filteredComplaints.length}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ticket #</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredComplaints.map((complaint) => (
                                    <tr
                                        key={complaint.id}
                                        onClick={() => navigate(`/complaints/${complaint.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedComplaints.includes(complaint.id)}
                                                onChange={() => handleSelectOne(complaint.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-mono text-sm text-primary-600 font-medium">
                                                #{complaint.id.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {typeIcons[complaint.type] || <Zap size={16} />}
                                                <span className="text-sm capitalize">{complaint.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-700">{complaint.category || '-'}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-600 max-w-[200px] truncate">
                                                <MapPin size={14} className="text-gray-400 shrink-0" />
                                                {complaint.address || 'No address'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={clsx('text-sm font-semibold capitalize', priorityColors[complaint.priority] || 'text-gray-500')}>
                                                {complaint.priority === 'critical' && '🔴 '}
                                                {complaint.priority === 'high' && '🟠 '}
                                                {complaint.priority || 'Normal'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {getStatusBadge(complaint.status)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                {formatDate(complaint.created_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default Complaints;
