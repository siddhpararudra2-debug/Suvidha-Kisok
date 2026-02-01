import React, { useEffect, useState } from 'react';
import {
    Map as MapIcon,
    Zap,
    Flame,
    Droplets,
    RefreshCw,
    Search,
    Edit,
    CheckCircle,
    AlertTriangle,
    X,
    Activity
} from 'lucide-react';
import clsx from 'clsx';

interface Asset {
    id: string;
    name: string;
    type: 'substation' | 'transformer' | 'pipeline' | 'pump_station' | 'gas_station';
    service: 'electricity' | 'gas' | 'water';
    capacity: string;
    currentLoad: number;
    status: 'operational' | 'maintenance' | 'offline';
    lastMaintenance: string;
    nextMaintenance: string;
    location: string;
}

const mockAssets: Asset[] = [
    { id: 'SUB-001', name: 'Central Substation 33/11 kV', type: 'substation', service: 'electricity', capacity: '2×15 MVA', currentLoad: 72, status: 'operational', lastMaintenance: '2025-12-15', nextMaintenance: '2026-03-15', location: 'Sector 12' },
    { id: 'TRF-023', name: 'Distribution Transformer #23', type: 'transformer', service: 'electricity', capacity: '630 KVA', currentLoad: 85, status: 'operational', lastMaintenance: '2026-01-10', nextMaintenance: '2026-04-10', location: 'Sector 15' },
    { id: 'TRF-044', name: 'Distribution Transformer #44', type: 'transformer', service: 'electricity', capacity: '400 KVA', currentLoad: 45, status: 'maintenance', lastMaintenance: '2026-01-28', nextMaintenance: '2026-02-05', location: 'Sector 8' },
    { id: 'PMP-001', name: 'Main Pump Station A', type: 'pump_station', service: 'water', capacity: '500 KL/hr', currentLoad: 68, status: 'operational', lastMaintenance: '2026-01-05', nextMaintenance: '2026-04-05', location: 'Water Works' },
    { id: 'GAS-001', name: 'CNG Compressor Station', type: 'gas_station', service: 'gas', capacity: '10000 SCMD', currentLoad: 55, status: 'operational', lastMaintenance: '2025-11-20', nextMaintenance: '2026-02-20', location: 'Industrial Area' },
];

const Infrastructure: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAssets(mockAssets);
            setLoading(false);
        }, 500);
    }, []);

    const filteredAssets = assets.filter(a => {
        const matchesSearch = searchTerm === '' ||
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesService = serviceFilter === 'all' || a.service === serviceFilter;
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchesSearch && matchesService && matchesStatus;
    });

    const getServiceIcon = (service: string) => {
        switch (service) {
            case 'electricity': return <Zap size={16} className="text-yellow-500" />;
            case 'gas': return <Flame size={16} className="text-orange-500" />;
            case 'water': return <Droplets size={16} className="text-blue-500" />;
            default: return <MapIcon size={16} className="text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; text: string }> = {
            operational: { bg: 'bg-green-100', text: 'text-green-700' },
            maintenance: { bg: 'bg-amber-100', text: 'text-amber-700' },
            offline: { bg: 'bg-red-100', text: 'text-red-700' },
        };
        return (
            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', config[status]?.bg, config[status]?.text)}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getLoadColor = (load: number) => {
        if (load < 60) return 'bg-green-500';
        if (load < 80) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Infrastructure Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredAssets.length} assets • Real-time monitoring
                    </p>
                </div>
                <button
                    onClick={() => setLoading(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{assets.filter(a => a.status === 'operational').length}</p>
                            <p className="text-sm text-gray-500">Operational</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <AlertTriangle size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{assets.filter(a => a.status === 'maintenance').length}</p>
                            <p className="text-sm text-gray-500">Under Maintenance</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <Zap size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{assets.filter(a => a.service === 'electricity').length}</p>
                            <p className="text-sm text-gray-500">Electrical Assets</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Activity size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{Math.round(assets.reduce((sum, a) => sum + a.currentLoad, 0) / assets.length)}%</p>
                            <p className="text-sm text-gray-500">Avg Load</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                    <option value="all">All Services</option>
                    <option value="electricity">⚡ Electricity</option>
                    <option value="gas">🔥 Gas</option>
                    <option value="water">💧 Water</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                </select>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                        Loading assets...
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Asset ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Capacity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Current Load</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-mono text-primary-600 font-medium">{asset.id}</td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{asset.name}</p>
                                            <p className="text-sm text-gray-500">{asset.location}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            {getServiceIcon(asset.service)}
                                            <span className="capitalize">{asset.service}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{asset.capacity}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={clsx('h-full rounded-full', getLoadColor(asset.currentLoad))}
                                                    style={{ width: `${asset.currentLoad}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{asset.currentLoad}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{getStatusBadge(asset.status)}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={() => { setSelectedAsset(asset); setShowModal(true); }}
                                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {showModal && selectedAsset && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Edit Asset</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Asset ID</label>
                                <input type="text" value={selectedAsset.id} disabled className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                <select defaultValue={selectedAsset.status} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                    <option value="operational">Operational</option>
                                    <option value="maintenance">Under Maintenance</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Current Load (%)</label>
                                <input type="number" defaultValue={selectedAsset.currentLoad} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Next Maintenance</label>
                                <input type="date" defaultValue={selectedAsset.nextMaintenance} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                                    Cancel
                                </button>
                                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Infrastructure;
