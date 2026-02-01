import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, Zap, Flame, Droplets, Clock } from 'lucide-react';

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Complaint {
    id: string;
    type: string;
    category: string;
    priority: string;
    status: string;
    address: string;
    latitude?: number;
    longitude?: number;
    user_id: string;
    created_at: string;
}

interface ComplaintsMapProps {
    complaints: Complaint[];
    onComplaintClick?: (id: string) => void;
}

const getMarkerColor = (priority: string, status: string) => {
    if (status === 'resolved') return '#22c55e';
    if (priority === 'critical') return '#ef4444';
    if (priority === 'high') return '#f97316';
    if (priority === 'medium') return '#eab308';
    return '#6b7280';
};

const createMarkerIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const typeIcons: Record<string, React.ReactNode> = {
    electricity: <Zap size={14} className="text-yellow-500" />,
    gas: <Flame size={14} className="text-orange-500" />,
    water: <Droplets size={14} className="text-blue-500" />,
};

const ComplaintsMap: React.FC<ComplaintsMapProps> = ({ complaints, onComplaintClick }) => {
    // Filter complaints with valid coordinates
    const mappableComplaints = complaints.filter(
        (c) => c.latitude && c.longitude && !isNaN(c.latitude) && !isNaN(c.longitude)
    );

    // Default center - Surat, Gujarat
    const defaultCenter: [number, number] = [21.1702, 72.8311];

    // Calculate center from complaints if available
    const center: [number, number] = mappableComplaints.length > 0
        ? [
            mappableComplaints.reduce((sum, c) => sum + (c.latitude || 0), 0) / mappableComplaints.length,
            mappableComplaints.reduce((sum, c) => sum + (c.longitude || 0), 0) / mappableComplaints.length,
        ]
        : defaultCenter;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle className="text-primary-600" size={20} />
                    <h3 className="font-semibold text-gray-800">Complaint Locations</h3>
                    <span className="text-sm text-gray-500">({mappableComplaints.length} on map)</span>
                </div>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Critical</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span>High</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Resolved</span>
                    </div>
                </div>
            </div>
            <div style={{ height: '400px' }}>
                <MapContainer
                    center={center}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mappableComplaints.map((complaint) => (
                        <Marker
                            key={complaint.id}
                            position={[complaint.latitude!, complaint.longitude!]}
                            icon={createMarkerIcon(getMarkerColor(complaint.priority, complaint.status))}
                            eventHandlers={{
                                click: () => onComplaintClick?.(complaint.id),
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        {typeIcons[complaint.type]}
                                        <span className="font-semibold text-sm">#{complaint.id.slice(-6)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{complaint.category}</p>
                                    <p className="text-xs text-gray-500 mb-2">{complaint.address}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {formatDate(complaint.created_at)}
                                    </div>
                                    <button
                                        onClick={() => onComplaintClick?.(complaint.id)}
                                        className="mt-2 w-full px-3 py-1.5 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Show critical complaints with a pulsing circle */}
                    {mappableComplaints
                        .filter((c) => c.priority === 'critical' && c.status !== 'resolved')
                        .map((complaint) => (
                            <Circle
                                key={`circle-${complaint.id}`}
                                center={[complaint.latitude!, complaint.longitude!]}
                                radius={500}
                                pathOptions={{
                                    color: '#ef4444',
                                    fillColor: '#ef4444',
                                    fillOpacity: 0.1,
                                    weight: 2,
                                }}
                            />
                        ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default ComplaintsMap;
