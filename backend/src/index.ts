import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import billRoutes from './routes/bill.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import infrastructureRoutes from './routes/infrastructure.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Security middleware
app.use(helmet());
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.CORS_ORIGIN || 'https://phoros-code.github.io',
    'https://phoros-code.github.io',
    'https://siddhpararudra2-debug.github.io',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/infrastructure', infrastructureRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io for real-time updates
io.on('connection', (socket) => {
    logger.info('Client connected', { socketId: socket.id });

    socket.on('subscribe:status', () => {
        // Send live status updates
        setInterval(() => {
            socket.emit('status:update', {
                electricity: {
                    gridStatus: 'operational',
                    gridLoad: Math.floor(70 + Math.random() * 15),
                    lastUpdated: new Date().toISOString(),
                },
                gas: {
                    pngPrice: 45.25,
                    cngPrice: 76.59,
                    lastUpdated: new Date().toISOString(),
                },
                water: {
                    supplyStatus: 'normal',
                    lastUpdated: new Date().toISOString(),
                },
            });
        }, 30000); // Every 30 seconds
    });

    socket.on('disconnect', () => {
        logger.info('Client disconnected', { socketId: socket.id });
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

import { initializeDatabase } from './config/database.js';

const PORT = process.env.PORT || 4000;

// Initialize Database then start server
initializeDatabase().then(() => {
    httpServer.listen(PORT, () => {
        logger.info(`SUVIDHA Backend running on port ${PORT}`);
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
});

export { app, io };
