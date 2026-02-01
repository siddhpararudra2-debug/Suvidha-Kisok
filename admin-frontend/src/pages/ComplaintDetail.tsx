import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import api from '../utils/api';
import {
    ArrowLeft,
    User,
    MapPin,
    Clock,
    Phone,
    Mail,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Send,
    UserPlus,
    AlertCircle,
    Zap,
    Flame,
    Droplets,
    FileText,
    Camera
} from 'lucide-react';
import clsx from 'clsx';

interface ComplaintDetail {
    id: string;
    type: string;
    category: string;
    subcategory: string;
    description: string;
    priority: string;
    status: string;
    address: string;
    latitude: number;
    longitude: number;
    user_id: string;
    assigned_officer_id: string | null;
    estimated_resolution: string;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}

interface ComplaintUpdate {
    id: number;
    status: string;
    message: string;
    updated_by: string;
    created_at: string;
}

const statusSteps = ['registered', 'assigned', 'in_progress', 'resolved', 'closed'];

const ComplaintDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    useSelector((state: RootState) => state.auth); // maintain auth check

    const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
    const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [newStatus, setNewStatus] = useState('');
    const [comment, setComment] = useState('');
    const [assignTo, setAssignTo] = useState('');

    useEffect(() => {
        fetchComplaintDetail();
        // Auto-refresh every 15 seconds for live updates
        const interval = setInterval(fetchComplaintDetail, 15000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchComplaintDetail = async () => {
        try {
            // Fetch complaint details
            const response = await api.get(`/admin/complaints`);
            const found = response.data.find((c: ComplaintDetail) => c.id === id);
            if (found) {
                setComplaint(found);
                setNewStatus(found.status);
            }
            // Mock updates for now - in production, fetch from complaint_updates table
            setUpdates([
                { id: 1, status: 'registered', message: 'Complaint registered via kiosk', updated_by: 'System', created_at: found?.created_at || new Date().toISOString() },
                ...(found?.assigned_officer_id ? [{ id: 2, status: 'assigned', message: `Assigned to ${found.assigned_officer_id}`, updated_by: 'Admin', created_at: found.updated_at }] : [])
            ]);
        } catch (error) {
            console.error('Failed to fetch complaint:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!newStatus && !comment) return;

        setUpdating(true);
        try {
            await api.put(`/admin/complaints/${id}/update`, {
                status: newStatus !== complaint?.status ? newStatus : undefined,
                comment: comment || undefined,
                assignedTo: assignTo || undefined
            });

            setComment('');
            setAssignTo('');
            await fetchComplaintDetail();
        } catch (error) {
            console.error('Failed to update complaint:', error);
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'electricity': return <Zap className="text-yellow-500" size={20} />;
            case 'gas': return <Flame className="text-orange-500" size={20} />;
            case 'water': return <Droplets className="text-blue-500" size={20} />;
            default: return <FileText className="text-gray-500" size={20} />;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            critical: 'bg-red-100 text-red-700 border-red-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            low: 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return (
            <span className={clsx('px-3 py-1 rounded-full text-sm font-medium border', colors[priority] || colors.medium)}>
                {priority === 'critical' && '🔴 '}
                {priority === 'high' && '🟠 '}
                {priority?.toUpperCase() || 'NORMAL'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <AlertCircle size={48} className="mb-4" />
                <p>Complaint not found</p>
                <button onClick={() => navigate('/complaints')} className="mt-4 text-primary-600 hover:underline">
                    Back to Complaints
                </button>
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(complaint.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/complaints')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Complaint #{complaint.id.slice(-6)}
                            </h1>
                            {getPriorityBadge(complaint.priority)}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Created {formatDate(complaint.created_at)} • Auto-refreshes
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Complaint Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {getTypeIcon(complaint.type)}
                            <div>
                                <h3 className="font-semibold text-gray-800 capitalize">{complaint.type} - {complaint.category}</h3>
                                <p className="text-sm text-gray-500">{complaint.subcategory}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg mb-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
                            <p className="text-gray-800">{complaint.description || 'No description provided'}</p>
                        </div>

                        <div className="flex items-start gap-2 text-gray-600">
                            <MapPin size={18} className="mt-0.5 text-gray-400" />
                            <div>
                                <p className="font-medium">{complaint.address || 'No address'}</p>
                                {complaint.latitude && (
                                    <p className="text-sm text-gray-500">
                                        Lat: {complaint.latitude}, Lng: {complaint.longitude}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Progress */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-6">Status Progress</h3>
                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className="flex flex-col items-center">
                                        <div className={clsx(
                                            'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm',
                                            index <= currentStepIndex
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        )}>
                                            {index < currentStepIndex ? (
                                                <CheckCircle size={20} />
                                            ) : index === currentStepIndex ? (
                                                <RefreshCw size={16} className="animate-spin" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <span className={clsx(
                                            'text-xs mt-2 capitalize',
                                            index <= currentStepIndex ? 'text-green-600 font-medium' : 'text-gray-500'
                                        )}>
                                            {step.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {index < statusSteps.length - 1 && (
                                        <div className={clsx(
                                            'flex-1 h-1 mx-2',
                                            index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                                        )} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Timeline</h3>
                        <div className="space-y-4">
                            {updates.map((update, index) => (
                                <div key={update.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={clsx(
                                            'w-8 h-8 rounded-full flex items-center justify-center',
                                            index === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                        )}>
                                            <CheckCircle size={16} />
                                        </div>
                                        {index < updates.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 my-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-medium text-gray-800 capitalize">
                                            {update.status.replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-gray-600">{update.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(update.created_at)} by {update.updated_by}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Update */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Add Update</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    {statusSteps.map(s => (
                                        <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Assign To (Employee ID)</label>
                                <input
                                    type="text"
                                    value={assignTo}
                                    onChange={(e) => setAssignTo(e.target.value)}
                                    placeholder="SUVIDHA-FIELD-0001"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                placeholder="Add notes or update details..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                <Send size={16} />
                                {updating ? 'Updating...' : 'Submit Update'}
                            </button>
                            {complaint.status === 'in_progress' && (
                                <button
                                    onClick={() => { setNewStatus('resolved'); handleUpdate(); }}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <CheckCircle size={16} />
                                    Mark Resolved
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Citizen Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <User size={18} />
                            Citizen Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">User ID</p>
                                <p className="font-medium text-gray-800">{complaint.user_id || 'Anonymous'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium">
                                    <Phone size={14} />
                                    Call
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                                    <Mail size={14} />
                                    SMS
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Assignment */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <UserPlus size={18} />
                            Assigned Officer
                        </h3>
                        {complaint.assigned_officer_id ? (
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="font-medium text-green-800">{complaint.assigned_officer_id}</p>
                                <p className="text-sm text-green-600">Currently assigned</p>
                            </div>
                        ) : (
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <p className="font-medium text-amber-800 flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    Not Assigned
                                </p>
                                <p className="text-sm text-amber-600">Use the form below to assign</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 text-sm font-medium">
                                <AlertTriangle size={16} />
                                Escalate
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">
                                <Camera size={16} />
                                Request Photos
                            </button>
                        </div>
                    </div>

                    {/* SLA Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock size={18} />
                            SLA Status
                        </h3>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600">
                                {complaint.estimated_resolution
                                    ? Math.ceil((new Date(complaint.estimated_resolution).getTime() - Date.now()) / (1000 * 60 * 60))
                                    : 48
                                }h
                            </div>
                            <p className="text-sm text-gray-500">Time Remaining</p>
                            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-3/4 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetailPage;
