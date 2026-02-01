import React, { useEffect, useState, useMemo } from 'react';
import api from '../utils/api';
import {
    Search,
    User,
    Phone,
    Mail,
    MapPin,
    Zap,
    Flame,
    Droplets,
    FileText,
    AlertCircle,
    RefreshCw,
    Edit,
    X,
    ChevronRight,
    CheckCircle
} from 'lucide-react';

interface Citizen {
    id: string;
    name: string;
    mobile: string;
    email: string;
    aadhaar_masked: string;
    address: string;
    city: string;
    pincode: string;
    created_at: string;
}

interface Connection {
    id: number;
    type: string;
    consumer_id: string;
    status: string;
}

const Citizens: React.FC = () => {
    const [citizens, setCitizens] = useState<Citizen[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [showModal, setShowModal] = useState(false);

    const fetchCitizens = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/citizens');
            setCitizens(response.data);
        } catch (error) {
            // Mock data for demonstration
            setCitizens([
                { id: 'USR001', name: 'Rajesh Kumar', mobile: '+91-9876543210', email: 'rajesh@email.com', aadhaar_masked: 'XXXX-XXXX-1234', address: '123 Main Street, Sector 15', city: 'Ahmedabad', pincode: '380015', created_at: new Date().toISOString() },
                { id: 'USR002', name: 'Priya Sharma', mobile: '+91-9876543211', email: 'priya@email.com', aadhaar_masked: 'XXXX-XXXX-5678', address: '456 Park Avenue, Sector 21', city: 'Ahmedabad', pincode: '380021', created_at: new Date().toISOString() },
                { id: 'USR003', name: 'Amit Patel', mobile: '+91-9876543212', email: 'amit@email.com', aadhaar_masked: 'XXXX-XXXX-9012', address: '789 Lake View, Sector 8', city: 'Ahmedabad', pincode: '380008', created_at: new Date().toISOString() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitizens();
        const interval = setInterval(fetchCitizens, 60000);
        return () => clearInterval(interval);
    }, []);

    const filteredCitizens = useMemo(() => {
        return citizens.filter(c => {
            const searchLower = searchTerm.toLowerCase();
            return searchTerm === '' ||
                c.name.toLowerCase().includes(searchLower) ||
                c.mobile.includes(searchTerm) ||
                c.id.toLowerCase().includes(searchLower) ||
                c.email?.toLowerCase().includes(searchLower);
        });
    }, [citizens, searchTerm]);

    const openProfile = async (citizen: Citizen) => {
        setSelectedCitizen(citizen);
        setShowModal(true);
        // Mock connections
        setConnections([
            { id: 1, type: 'electricity', consumer_id: '123456789', status: 'active' },
            { id: 2, type: 'gas', consumer_id: 'G987654', status: 'active' },
            { id: 3, type: 'water', consumer_id: 'W123456', status: 'active' },
        ]);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'electricity': return <Zap size={16} className="text-yellow-500" />;
            case 'gas': return <Flame size={16} className="text-orange-500" />;
            case 'water': return <Droplets size={16} className="text-blue-500" />;
            default: return <FileText size={16} className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Citizen Database</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredCitizens.length} registered citizens
                    </p>
                </div>
                <button
                    onClick={fetchCitizens}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name, Mobile, Consumer ID, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Citizens Grid */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    Loading citizens...
                </div>
            ) : filteredCitizens.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                    <AlertCircle className="mx-auto mb-2" size={24} />
                    No citizens found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCitizens.map((citizen) => (
                        <div
                            key={citizen.id}
                            onClick={() => openProfile(citizen)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 cursor-pointer transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-primary-700 font-bold text-lg">
                                            {citizen.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{citizen.name}</h3>
                                        <p className="text-sm text-gray-500">{citizen.id}</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={14} className="text-gray-400" />
                                    {citizen.mobile}
                                </div>
                                {citizen.email && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail size={14} className="text-gray-400" />
                                        {citizen.email}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span className="truncate">{citizen.city}</span>
                                </div>
                            </div>

                            <div className="flex gap-1 mt-4 pt-4 border-t border-gray-100">
                                <span className="p-1.5 bg-yellow-50 rounded-md" title="Electricity">
                                    <Zap size={14} className="text-yellow-500" />
                                </span>
                                <span className="p-1.5 bg-orange-50 rounded-md" title="Gas">
                                    <Flame size={14} className="text-orange-500" />
                                </span>
                                <span className="p-1.5 bg-blue-50 rounded-md" title="Water">
                                    <Droplets size={14} className="text-blue-500" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Profile Modal */}
            {showModal && selectedCitizen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-700 font-bold text-2xl">
                                        {selectedCitizen.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{selectedCitizen.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedCitizen.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <User size={18} />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Mobile</p>
                                        <p className="font-medium">{selectedCitizen.mobile}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium">{selectedCitizen.email || '-'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Aadhaar</p>
                                        <p className="font-medium">{selectedCitizen.aadhaar_masked} ✅</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500">Registered On</p>
                                        <p className="font-medium">{new Date(selectedCitizen.created_at).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="font-medium">{selectedCitizen.address}, {selectedCitizen.city} - {selectedCitizen.pincode}</p>
                                </div>
                            </div>

                            {/* Linked Services */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Zap size={18} />
                                    Linked Services
                                </h3>
                                <div className="space-y-3">
                                    {connections.map((conn) => (
                                        <div key={conn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {getTypeIcon(conn.type)}
                                                <div>
                                                    <p className="font-medium capitalize">{conn.type}</p>
                                                    <p className="text-sm text-gray-500">ID: {conn.consumer_id}</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                <CheckCircle size={12} />
                                                {conn.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-green-700">₹18,450</p>
                                    <p className="text-sm text-green-600">Total Paid (6 mo)</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-blue-700">12</p>
                                    <p className="text-sm text-blue-600">Complaints</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-purple-700">95%</p>
                                    <p className="text-sm text-purple-600">Payment Compliance</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                                    <Edit size={18} />
                                    Edit Details
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                                    <Phone size={18} />
                                    Call
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    <Mail size={18} />
                                    SMS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Citizens;
