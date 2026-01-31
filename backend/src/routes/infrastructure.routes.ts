import { Router } from 'express';

const router = Router();

// Mock infrastructure data (GeoJSON format)
const substations = [
    {
        id: 'SUB001',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [72.8541, 19.2288],
        },
        properties: {
            name: 'Borivali-33/11 kV',
            type: '33/11 kV',
            capacity: '2×15 MVA',
            currentLoad: 85,
            status: 'operational',
            lastMaintenance: '2026-01-15',
            connectedFeeders: 12,
            totalConsumers: 4567,
        },
    },
    {
        id: 'SUB002',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [72.8777, 19.0760],
        },
        properties: {
            name: 'Andheri-132/33 kV',
            type: '132/33 kV',
            capacity: '3×50 MVA',
            currentLoad: 72,
            status: 'operational',
            lastMaintenance: '2026-01-10',
            connectedFeeders: 8,
            totalConsumers: 12340,
        },
    },
];

const cngStations = [
    {
        id: 'CNG001',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [72.8656, 19.1136],
        },
        properties: {
            name: 'Mahanagar Gas - Santacruz',
            operator: 'Mahanagar Gas Limited',
            status: 'operational',
            operatingHours: '24/7',
            price: 76.59,
            facilities: ['CNG', 'PNG Booking'],
        },
    },
    {
        id: 'CNG002',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [72.8347, 19.1307],
        },
        properties: {
            name: 'MGL - Andheri East',
            operator: 'Mahanagar Gas Limited',
            status: 'operational',
            operatingHours: '6:00 AM - 10:00 PM',
            price: 76.59,
            facilities: ['CNG'],
        },
    },
];

const waterTanks = [
    {
        id: 'WT001',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [72.8825, 19.0879],
        },
        properties: {
            name: 'Powai ESR',
            type: 'Elevated Storage Reservoir',
            capacity: '5 ML',
            currentLevel: 78,
            status: 'operational',
            servingWards: ['P/N', 'S'],
        },
    },
];

const outages = [
    {
        id: 'OUT001',
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[
                [72.8500, 19.2200],
                [72.8600, 19.2200],
                [72.8600, 19.2300],
                [72.8500, 19.2300],
                [72.8500, 19.2200],
            ]],
        },
        properties: {
            type: 'electricity',
            reason: 'Cable fault',
            startTime: '2026-01-27T14:30:00Z',
            estimatedRestoration: '2026-01-27T18:00:00Z',
            affectedConsumers: 450,
            status: 'active',
        },
    },
];

// Get all infrastructure layers
router.get('/layers', async (req, res) => {
    res.json({
        success: true,
        layers: {
            electricity: {
                substations: substations,
                outages: outages.filter(o => o.properties.type === 'electricity'),
            },
            gas: {
                cngStations: cngStations,
            },
            water: {
                tanks: waterTanks,
            },
        },
    });
});

// Get electricity infrastructure
router.get('/electricity', async (req, res) => {
    res.json({
        success: true,
        type: 'FeatureCollection',
        features: substations,
    });
});

// Get gas infrastructure
router.get('/gas', async (req, res) => {
    res.json({
        success: true,
        type: 'FeatureCollection',
        features: cngStations,
    });
});

// Get water infrastructure
router.get('/water', async (req, res) => {
    res.json({
        success: true,
        type: 'FeatureCollection',
        features: waterTanks,
    });
});

// Get current outages
router.get('/outages', async (req, res) => {
    const { type } = req.query;

    let filtered = outages;
    if (type) {
        filtered = outages.filter(o => o.properties.type === type);
    }

    res.json({
        success: true,
        type: 'FeatureCollection',
        features: filtered,
    });
});

// Get live status
router.get('/status', async (req, res) => {
    res.json({
        success: true,
        status: {
            electricity: {
                gridStatus: 'operational',
                gridLoad: 72 + Math.floor(Math.random() * 10),
                frequency: 50.02,
                lastUpdated: new Date().toISOString(),
            },
            gas: {
                pngPrice: 45.25,
                cngPrice: 76.59,
                supplyStatus: 'normal',
                lastUpdated: new Date().toISOString(),
            },
            water: {
                supplyStatus: 'normal',
                reservoirLevel: 78,
                nextSupplyZone: 'Zone A',
                nextSupplyTime: '06:00 AM',
                lastUpdated: new Date().toISOString(),
            },
        },
    });
});

// Search infrastructure by location
router.get('/search', async (req, res) => {
    const { lat, lng, radius = 5, type } = req.query;

    // In a real app, this would do geospatial queries
    res.json({
        success: true,
        results: {
            substations: substations.slice(0, 2),
            cngStations: cngStations.slice(0, 2),
            waterTanks: waterTanks.slice(0, 1),
        },
    });
});

export default router;
