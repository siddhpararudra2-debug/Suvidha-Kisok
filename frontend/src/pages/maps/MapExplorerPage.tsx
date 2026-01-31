import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Search,
    MyLocation,
    ElectricBolt,
    LocalGasStation,
    WaterDrop,
    Warning,
    Close,
    Layers,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RootState, AppDispatch } from '../../store';
import { setCurrentLocation, showNotification } from '../../store/slices/uiSlice';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons for different infrastructure types
const createIcon = (color: string) => new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
    background-color: ${color};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const electricityIcon = createIcon('#fbbc04');
const gasIcon = createIcon('#ea4335');
const waterIcon = createIcon('#1a73e8');

// Mock infrastructure data
const infrastructureData = {
    substations: [
        { id: 'SUB001', name: 'Varachha 66kV Substation', lat: 21.2096, lng: 72.8576, capacity: '2×15 MVA', load: 85, status: 'operational' },
        { id: 'SUB002', name: 'Adajan 220kV Grid', lat: 21.1959, lng: 72.7933, capacity: '3×50 MVA', load: 72, status: 'operational' },
        { id: 'SUB003', name: 'Vesu 66kV Substation', lat: 21.1517, lng: 72.7758, capacity: '2×20 MVA', load: 68, status: 'operational' },
        { id: 'SUB004', name: 'Katargam GIDC Grid', lat: 21.2227, lng: 72.8252, capacity: '2×100 MVA', load: 78, status: 'operational' },
        { id: 'SUB005', name: 'Udhana 66kV Substation', lat: 21.1663, lng: 72.8428, capacity: '2×25 MVA', load: 65, status: 'operational' },
    ],
    cngStations: [
        { id: 'CNG001', name: 'Gujarat Gas Adajan', lat: 21.1900, lng: 72.7900, operator: 'Gujarat Gas', price: 76.59, hours: '24/7' },
        { id: 'CNG002', name: 'Gujarat Gas Piplod', lat: 21.1611, lng: 72.7725, operator: 'Gujarat Gas', price: 76.59, hours: '6AM-10PM' },
        { id: 'CNG003', name: 'Gujarat Gas Varachha', lat: 21.2100, lng: 72.8600, operator: 'Gujarat Gas', price: 76.59, hours: '24/7' },
    ],
    waterTanks: [
        { id: 'WT001', name: 'Sarthana Water Works', lat: 21.2300, lng: 72.8900, capacity: '5 ML', level: 78, status: 'operational' },
        { id: 'WT002', name: 'Rander Water Tank', lat: 21.2000, lng: 72.7800, capacity: '1350 MLD', level: 85, status: 'operational' },
        { id: 'WT003', name: 'Dindoli ESR', lat: 21.1400, lng: 72.8700, capacity: '8 ML', level: 62, status: 'operational' },
    ],
    outages: [
        { id: 'OUT001', lat: 21.1800, lng: 72.8100, radius: 500, type: 'electricity', reason: 'Cable fault', eta: '2 hours' },
        { id: 'OUT002', lat: 21.1600, lng: 72.8300, radius: 300, type: 'water', reason: 'Pipeline repair', eta: '4 hours' },
        { id: 'OUT003', lat: 21.2200, lng: 72.8400, radius: 200, type: 'gas', reason: 'Maintenance', eta: '3 hours' },
    ],
};

// Component to update map view when user location changes
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapExplorerPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { currentLocation } = useSelector((state: RootState) => state.ui);

    const [layers, setLayers] = useState({
        electricity: true,
        gas: true,
        water: true,
        outages: true,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number]>([21.1702, 72.8311]); // Surat Center
    const [mapZoom, setMapZoom] = useState(12);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [locating, setLocating] = useState(false);

    const handleLayerChange = (layer: keyof typeof layers) => {
        setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
    };

    const handleMyLocation = () => {
        setLocating(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    setMapZoom(15);
                    dispatch(setCurrentLocation({ lat: latitude, lng: longitude, address: null }));
                    dispatch(showNotification({ message: 'Location found!', severity: 'success' }));
                    setLocating(false);
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    dispatch(showNotification({ message: 'Could not get location. Using default.', severity: 'warning' }));
                    setLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            dispatch(showNotification({ message: 'Geolocation not supported', severity: 'error' }));
            setLocating(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        // Mock location search as priority/cache
        const locations: Record<string, [number, number]> = {
            'surat': [21.1702, 72.8311],
            'adajan': [21.1959, 72.7933],
            'vesu': [21.1517, 72.7758],
            'varachha': [21.2096, 72.8576],
            'piplod': [21.1611, 72.7725],
            'katargam': [21.2227, 72.8252],
            'udhana': [21.1663, 72.8428],
            'sarthana': [21.2300, 72.8900],
            'rander': [21.2000, 72.7800],
            'dindoli': [21.1400, 72.8700],
        };

        const query = searchQuery.toLowerCase();
        // Check mock locations first
        const match = Object.entries(locations).find(([key]) => key.includes(query) || query.includes(key));

        if (match) {
            setMapCenter(match[1]);
            setMapZoom(14);
            dispatch(showNotification({ message: `Found: ${match[0].charAt(0).toUpperCase() + match[0].slice(1)}`, severity: 'success' }));
            return;
        }

        // If not found in mock, use OpenStreetMap Nominatim API
        try {
            setLocating(true); // Reuse locating spinner or create a new loading state
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newLat = parseFloat(lat);
                const newLng = parseFloat(lon);

                setMapCenter([newLat, newLng]);
                setMapZoom(14);
                dispatch(showNotification({ message: `Found: ${display_name.split(',')[0]}`, severity: 'success' }));
            } else {
                dispatch(showNotification({ message: 'Location not found', severity: 'warning' }));
            }
        } catch (error) {
            console.error('Search error:', error);
            dispatch(showNotification({ message: 'Error searching location', severity: 'error' }));
        } finally {
            setLocating(false);
        }
    };

    const handleMarkerClick = (item: any, type: string) => {
        setSelectedItem({ ...item, infrastructureType: type });
        setDetailsOpen(true);
    };

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
                    borderRadius: 3,
                    color: 'white',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {t('maps.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Explore electricity, gas, and water infrastructure in your area
                </Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 280px)', minHeight: 500 }}>
                {/* Sidebar Controls */}
                <Card sx={{ width: 320, flexShrink: 0, borderRadius: 2, overflow: 'auto' }}>
                    <CardContent>
                        {/* Search */}
                        <TextField
                            fullWidth
                            placeholder={t('maps.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            title={t('maps.myLocation')}
                                            onClick={handleMyLocation}
                                            disabled={locating}
                                        >
                                            {locating ? <CircularProgress size={20} /> : <MyLocation />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSearch}
                            disabled={locating}
                            sx={{ mb: 3, minHeight: 44 }}
                        >
                            {locating ? <CircularProgress size={24} color="inherit" /> : 'Search Location'}
                        </Button>

                        {/* Layers */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Layers color="primary" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {t('maps.layers')}
                            </Typography>
                        </Box>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={layers.electricity}
                                        onChange={() => handleLayerChange('electricity')}
                                        sx={{ color: '#fbbc04', '&.Mui-checked': { color: '#fbbc04' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ElectricBolt sx={{ color: '#fbbc04', fontSize: 20 }} />
                                        <Typography variant="body2">{t('maps.electricityNetwork')}</Typography>
                                        <Chip label={infrastructureData.substations.length} size="small" />
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={layers.gas}
                                        onChange={() => handleLayerChange('gas')}
                                        sx={{ color: '#ea4335', '&.Mui-checked': { color: '#ea4335' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalGasStation sx={{ color: '#ea4335', fontSize: 20 }} />
                                        <Typography variant="body2">{t('maps.gasNetwork')}</Typography>
                                        <Chip label={infrastructureData.cngStations.length} size="small" />
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={layers.water}
                                        onChange={() => handleLayerChange('water')}
                                        sx={{ color: '#1a73e8', '&.Mui-checked': { color: '#1a73e8' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WaterDrop sx={{ color: '#1a73e8', fontSize: 20 }} />
                                        <Typography variant="body2">{t('maps.waterNetwork')}</Typography>
                                        <Chip label={infrastructureData.waterTanks.length} size="small" />
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={layers.outages}
                                        onChange={() => handleLayerChange('outages')}
                                        sx={{ color: '#d93025', '&.Mui-checked': { color: '#d93025' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Warning sx={{ color: '#d93025', fontSize: 20 }} />
                                        <Typography variant="body2">{t('maps.showOutages')}</Typography>
                                        <Chip label={infrastructureData.outages.length} size="small" color="error" />
                                    </Box>
                                }
                            />
                        </FormGroup>

                        {/* Legend */}
                        <Typography variant="subtitle2" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                            Legend
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#fbbc04', border: '2px solid white', boxShadow: 1 }} />
                                <Typography variant="caption">Substation</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ea4335', border: '2px solid white', boxShadow: 1 }} />
                                <Typography variant="caption">CNG Station</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#1a73e8', border: '2px solid white', boxShadow: 1 }} />
                                <Typography variant="caption">Water Tank/WTP</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'rgba(217,48,37,0.3)', border: '2px dashed #d93025' }} />
                                <Typography variant="caption">Outage Zone</Typography>
                            </Box>
                        </Box>

                        {/* Active Outages Alert */}
                        {layers.outages && infrastructureData.outages.length > 0 && (
                            <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {infrastructureData.outages.length} Active Outage(s)
                                </Typography>
                                <Typography variant="caption">
                                    Click on red circles for details
                                </Typography>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Map Container */}
                <Card sx={{ flex: 1, borderRadius: 2, overflow: 'hidden' }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <MapController center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* User Location */}
                        {currentLocation && (
                            <Marker
                                position={[currentLocation.lat, currentLocation.lng]}
                            >
                                <Popup>
                                    <Typography variant="subtitle2">Your Location</Typography>
                                </Popup>
                            </Marker>
                        )}

                        {/* Electricity Substations */}
                        {layers.electricity && (
                            <LayerGroup>
                                {infrastructureData.substations.map((sub) => (
                                    <Marker
                                        key={sub.id}
                                        position={[sub.lat, sub.lng]}
                                        icon={electricityIcon}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(sub, 'substation'),
                                        }}
                                    >
                                        <Popup>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{sub.name}</Typography>
                                            <Typography variant="caption" display="block">Capacity: {sub.capacity}</Typography>
                                            <Typography variant="caption" display="block">Load: {sub.load}%</Typography>
                                        </Popup>
                                    </Marker>
                                ))}
                            </LayerGroup>
                        )}

                        {/* CNG Stations */}
                        {layers.gas && (
                            <LayerGroup>
                                {infrastructureData.cngStations.map((station) => (
                                    <Marker
                                        key={station.id}
                                        position={[station.lat, station.lng]}
                                        icon={gasIcon}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(station, 'cng'),
                                        }}
                                    >
                                        <Popup>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{station.name}</Typography>
                                            <Typography variant="caption" display="block">Price: ₹{station.price}/kg</Typography>
                                            <Typography variant="caption" display="block">Hours: {station.hours}</Typography>
                                        </Popup>
                                    </Marker>
                                ))}
                            </LayerGroup>
                        )}

                        {/* Water Infrastructure */}
                        {layers.water && (
                            <LayerGroup>
                                {infrastructureData.waterTanks.map((tank) => (
                                    <Marker
                                        key={tank.id}
                                        position={[tank.lat, tank.lng]}
                                        icon={waterIcon}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(tank, 'water'),
                                        }}
                                    >
                                        <Popup>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{tank.name}</Typography>
                                            <Typography variant="caption" display="block">Capacity: {tank.capacity}</Typography>
                                            <Typography variant="caption" display="block">Level: {tank.level}%</Typography>
                                        </Popup>
                                    </Marker>
                                ))}
                            </LayerGroup>
                        )}

                        {/* Outage Zones */}
                        {layers.outages && (
                            <LayerGroup>
                                {infrastructureData.outages.map((outage) => (
                                    <Circle
                                        key={outage.id}
                                        center={[outage.lat, outage.lng]}
                                        radius={outage.radius}
                                        pathOptions={{
                                            color: '#d93025',
                                            fillColor: '#d93025',
                                            fillOpacity: 0.2,
                                            weight: 2,
                                            dashArray: '5, 5',
                                        }}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(outage, 'outage'),
                                        }}
                                    >
                                        <Popup>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                                                ⚠️ {outage.type.toUpperCase()} OUTAGE
                                            </Typography>
                                            <Typography variant="caption" display="block">Reason: {outage.reason}</Typography>
                                            <Typography variant="caption" display="block">ETA: {outage.eta}</Typography>
                                        </Popup>
                                    </Circle>
                                ))}
                            </LayerGroup>
                        )}
                    </MapContainer>
                </Card>
            </Box>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{selectedItem?.name || 'Details'}</Typography>
                    <IconButton onClick={() => setDetailsOpen(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {selectedItem.infrastructureType === 'substation' && (
                                <>
                                    <Chip icon={<ElectricBolt />} label="Substation" color="warning" />
                                    <Typography><strong>Capacity:</strong> {selectedItem.capacity}</Typography>
                                    <Typography><strong>Current Load:</strong> {selectedItem.load}%</Typography>
                                    <Typography><strong>Status:</strong> {selectedItem.status}</Typography>
                                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                                        <Box sx={{ width: `${selectedItem.load}%`, bgcolor: selectedItem.load > 80 ? 'error.main' : 'success.main', height: '100%', borderRadius: 1 }} />
                                    </Box>
                                </>
                            )}
                            {selectedItem.infrastructureType === 'cng' && (
                                <>
                                    <Chip icon={<LocalGasStation />} label="CNG Station" color="error" />
                                    <Typography><strong>Operator:</strong> {selectedItem.operator}</Typography>
                                    <Typography><strong>Price:</strong> ₹{selectedItem.price}/kg</Typography>
                                    <Typography><strong>Operating Hours:</strong> {selectedItem.hours}</Typography>
                                    <Button variant="contained" color="error" fullWidth>
                                        Get Directions
                                    </Button>
                                </>
                            )}
                            {selectedItem.infrastructureType === 'water' && (
                                <>
                                    <Chip icon={<WaterDrop />} label="Water Infrastructure" color="primary" />
                                    <Typography><strong>Capacity:</strong> {selectedItem.capacity}</Typography>
                                    <Typography><strong>Current Level:</strong> {selectedItem.level}%</Typography>
                                    <Typography><strong>Status:</strong> {selectedItem.status}</Typography>
                                </>
                            )}
                            {selectedItem.infrastructureType === 'outage' && (
                                <>
                                    <Alert severity="error">Active Outage in this area</Alert>
                                    <Typography><strong>Type:</strong> {selectedItem.type}</Typography>
                                    <Typography><strong>Reason:</strong> {selectedItem.reason}</Typography>
                                    <Typography><strong>Affected Radius:</strong> {selectedItem.radius}m</Typography>
                                    <Typography><strong>Estimated Restoration:</strong> {selectedItem.eta}</Typography>
                                    <Button variant="contained" color="error" fullWidth>
                                        Report Issue
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MapExplorerPage;
