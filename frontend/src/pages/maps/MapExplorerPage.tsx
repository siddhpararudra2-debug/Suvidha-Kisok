import { useState, useEffect, useRef } from 'react';
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
const outageIcon = createIcon('#d93025');

// Mock infrastructure data
const infrastructureData = {
    substations: [
        { id: 'SUB001', name: 'Borivali 33/11 kV Substation', lat: 19.2288, lng: 72.8541, capacity: '2×15 MVA', load: 85, status: 'operational' },
        { id: 'SUB002', name: 'Andheri 132/33 kV Substation', lat: 19.1136, lng: 72.8697, capacity: '3×50 MVA', load: 72, status: 'operational' },
        { id: 'SUB003', name: 'Bandra 33/11 kV Substation', lat: 19.0596, lng: 72.8295, capacity: '2×20 MVA', load: 68, status: 'operational' },
        { id: 'SUB004', name: 'Powai 220/33 kV Grid', lat: 19.1176, lng: 72.9060, capacity: '2×100 MVA', load: 78, status: 'operational' },
    ],
    cngStations: [
        { id: 'CNG001', name: 'MGL Santacruz', lat: 19.0803, lng: 72.8423, operator: 'Mahanagar Gas', price: 76.59, hours: '24/7' },
        { id: 'CNG002', name: 'MGL Andheri East', lat: 19.1197, lng: 72.8684, operator: 'Mahanagar Gas', price: 76.59, hours: '6AM-10PM' },
        { id: 'CNG003', name: 'MGL Borivali', lat: 19.2307, lng: 72.8567, operator: 'Mahanagar Gas', price: 76.59, hours: '24/7' },
    ],
    waterTanks: [
        { id: 'WT001', name: 'Powai ESR', lat: 19.1241, lng: 72.8994, capacity: '5 ML', level: 78, status: 'operational' },
        { id: 'WT002', name: 'Bhandup WTP', lat: 19.1482, lng: 72.9352, capacity: '1350 MLD', level: 85, status: 'operational' },
        { id: 'WT003', name: 'Malad ESR', lat: 19.1873, lng: 72.8489, capacity: '8 ML', level: 62, status: 'operational' },
    ],
    outages: [
        { id: 'OUT001', lat: 19.1050, lng: 72.8370, radius: 500, type: 'electricity', reason: 'Cable fault', eta: '2 hours' },
        { id: 'OUT002', lat: 19.2150, lng: 72.8650, radius: 300, type: 'water', reason: 'Pipeline repair', eta: '4 hours' },
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
    const [mapCenter, setMapCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai
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

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        // Mock location search - in production, use geocoding API
        const locations: Record<string, [number, number]> = {
            'andheri': [19.1136, 72.8697],
            'bandra': [19.0596, 72.8295],
            'borivali': [19.2288, 72.8541],
            'powai': [19.1176, 72.9060],
            'mumbai': [19.0760, 72.8777],
            'juhu': [19.0883, 72.8263],
            'malad': [19.1873, 72.8489],
        };

        const query = searchQuery.toLowerCase();
        const match = Object.entries(locations).find(([key]) => key.includes(query) || query.includes(key));

        if (match) {
            setMapCenter(match[1]);
            setMapZoom(14);
            dispatch(showNotification({ message: `Found: ${match[0].charAt(0).toUpperCase() + match[0].slice(1)}`, severity: 'success' }));
        } else {
            dispatch(showNotification({ message: 'Location not found', severity: 'warning' }));
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
                            sx={{ mb: 3, minHeight: 44 }}
                        >
                            Search Location
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
