import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
    Monitor,
    MapPin,
    Clock,
    RefreshCw,
    Wifi,
    WifiOff,
    Cpu,
    Printer,
    CreditCard,
    Activity,
    AlertTriangle,
    CheckCircle,
    X,
    RotateCcw,
    Settings,
    FileText
} from 'lucide-react';
import clsx from 'clsx';

interface Kiosk {
    id: string;
    location: string;
    status: 'online' | 'offline';
    heartbeat: string;
    txns: number;
    uptime?: number;
    software_version?: string;
}

const Kiosks: React.FC = () => {
    const [kiosks, setKiosks] = useState<Kiosk[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchKiosks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/kiosks');
            setKiosks(response.data);
        } catch (error) {
            // Mock data
            setKiosks([
                { id: 'KIOSK001', location: 'Sector 12 Shopping Mall', status: 'online', heartbeat: '2 min ago', txns: 247, uptime: 99.2, software_version: 'v2.1.5' },
                { id: 'KIOSK002', location: 'Central Bus Station', status: 'online', heartbeat: '1 min ago', txns: 189, uptime: 98.7, software_version: 'v2.1.5' },
                { id: 'KIOSK003', location: 'Ward Office Sector 7', status: 'offline', heartbeat: '3 hrs ago', txns: 0, uptime: 87.5, software_version: 'v2.1.4' },
                { id: 'KIOSK004', location: 'Municipal Hospital', status: 'online', heartbeat: '30 sec ago', txns: 156, uptime: 99.8, software_version: 'v2.1.5' },
                { id: 'KIOSK005', location: 'Railway Station', status: 'online', heartbeat: '1 min ago', txns: 312, uptime: 99.5, software_version: 'v2.1.5' },
                { id: 'KIOSK006', location: 'IT Park Building A', status: 'online', heartbeat: '45 sec ago', txns: 98, uptime: 99.1, software_version: 'v2.1.5' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKiosks();
        const interval = setInterval(fetchKiosks, 15000); // Refresh every 15s for real-time
        return () => clearInterval(interval);
    }, []);

    const onlineCount = kiosks.filter(k => k.status === 'online').length;
    const offlineCount = kiosks.filter(k => k.status === 'offline').length;
    const totalTxns = kiosks.reduce((sum, k) => sum + k.txns, 0);

    const openDetail = (kiosk: Kiosk) => {
        setSelectedKiosk(kiosk);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kiosk Management</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Real-time monitoring • Auto-refreshes every 15s
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={clsx('px-3 py-1 rounded text-sm font-medium transition-colors', viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-600')}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx('px-3 py-1 rounded text-sm font-medium transition-colors', viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600')}
                        >
                            List
                        </button>
                    </div>
                    <button
                        onClick={fetchKiosks}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Monitor size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{kiosks.length}</p>
                            <p className="text-sm text-gray-500">Total Kiosks</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Wifi size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
                            <p className="text-sm text-gray-500">Online</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-50 rounded-lg">
                            <WifiOff size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
                            <p className="text-sm text-gray-500">Offline</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Activity size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{totalTxns}</p>
                            <p className="text-sm text-gray-500">Today's Transactions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kiosks Grid/List */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    Loading kiosks...
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kiosks.map((kiosk) => (
                        <div
                            key={kiosk.id}
                            onClick={() => openDetail(kiosk)}
                            className={clsx(
                                'bg-white rounded-xl shadow-sm border p-5 hover:shadow-md cursor-pointer transition-all',
                                kiosk.status === 'online' ? 'border-gray-100' : 'border-red-200 bg-red-50/30'
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        'p-3 rounded-lg',
                                        kiosk.status === 'online' ? 'bg-green-50' : 'bg-red-50'
                                    )}>
                                        <Monitor size={24} className={kiosk.status === 'online' ? 'text-green-600' : 'text-red-600'} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{kiosk.id}</h3>
                                        <span className={clsx(
                                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                                            kiosk.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        )}>
                                            {kiosk.status === 'online' ? <Wifi size={10} /> : <WifiOff size={10} />}
                                            {kiosk.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={14} className="text-gray-400" />
                                    {kiosk.location}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={14} className="text-gray-400" />
                                    Last seen: {kiosk.heartbeat}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-primary-600">{kiosk.txns}</p>
                                    <p className="text-xs text-gray-500">Transactions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-green-600">{kiosk.uptime}%</p>
                                    <p className="text-xs text-gray-500">Uptime</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kiosk ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Heartbeat</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transactions</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uptime</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {kiosks.map((kiosk) => (
                                <tr
                                    key={kiosk.id}
                                    onClick={() => openDetail(kiosk)}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-4 py-4 font-medium text-primary-600">{kiosk.id}</td>
                                    <td className="px-4 py-4 text-gray-700">{kiosk.location}</td>
                                    <td className="px-4 py-4">
                                        <span className={clsx(
                                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                                            kiosk.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        )}>
                                            {kiosk.status === 'online' ? '🟢' : '🔴'} {kiosk.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">{kiosk.heartbeat}</td>
                                    <td className="px-4 py-4 font-medium">{kiosk.txns}</td>
                                    <td className="px-4 py-4 text-green-600 font-medium">{kiosk.uptime}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {showModal && selectedKiosk && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    'p-3 rounded-lg',
                                    selectedKiosk.status === 'online' ? 'bg-green-50' : 'bg-red-50'
                                )}>
                                    <Monitor size={24} className={selectedKiosk.status === 'online' ? 'text-green-600' : 'text-red-600'} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{selectedKiosk.id}</h2>
                                    <p className="text-sm text-gray-500">{selectedKiosk.location}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {selectedKiosk.status === 'online' ? (
                                        <CheckCircle className="text-green-600" size={24} />
                                    ) : (
                                        <AlertTriangle className="text-red-600" size={24} />
                                    )}
                                    <div>
                                        <p className="font-medium">{selectedKiosk.status === 'online' ? 'System Online' : 'System Offline'}</p>
                                        <p className="text-sm text-gray-500">Uptime: {selectedKiosk.uptime}%</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">Last seen: {selectedKiosk.heartbeat}</span>
                            </div>

                            {/* Hardware Status */}
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Hardware Status</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-green-50 rounded-lg text-center">
                                        <Cpu size={24} className="text-green-600 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-green-700">Screen OK</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg text-center">
                                        <Printer size={24} className="text-green-600 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-green-700">Printer OK</p>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg text-center">
                                        <CreditCard size={24} className="text-amber-600 mx-auto mb-1" />
                                        <p className="text-sm font-medium text-amber-700">Cash: ₹15k</p>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Stats */}
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Today's Statistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-2xl font-bold text-blue-700">{selectedKiosk.txns}</p>
                                        <p className="text-sm text-blue-600">Total Transactions</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-700">₹2.8L</p>
                                        <p className="text-sm text-green-600">Revenue Collected</p>
                                    </div>
                                </div>
                            </div>

                            {/* Software */}
                            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Software Version</p>
                                    <p className="font-medium">{selectedKiosk.software_version} (Latest)</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    Up to date
                                </span>
                            </div>

                            {/* Alerts */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                                <AlertTriangle className="text-amber-600" size={20} />
                                <div>
                                    <p className="font-medium text-amber-800">Printer paper low</p>
                                    <p className="text-sm text-amber-600">15% remaining - Schedule maintenance</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                                    <RotateCcw size={18} />
                                    Remote Restart
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                                    <FileText size={18} />
                                    View Logs
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                                    <Settings size={18} />
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kiosks;
