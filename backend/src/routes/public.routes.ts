import express from 'express';
import { mockOfficials, mockSchemes, mockAnnouncements, getAllKiosks } from '../data/mockData.js';

const router = express.Router();

// Public Directory of Officials
router.get('/officials', (req, res) => {
    res.json(mockOfficials);
});

// Public Schemes
router.get('/schemes', (req, res) => {
    res.json(mockSchemes);
});

// Public Announcements / News
router.get('/announcements', (req, res) => {
    res.json(mockAnnouncements);
});

// Public Kiosks (for map)
router.get('/kiosks', (req, res) => {
    res.json(getAllKiosks());
});

// Public Infrastructure
router.get('/infrastructure', (req, res) => {
    const { mockInfrastructure } = require('../data/mockData.js');
    res.json(mockInfrastructure);
});

export default router;
