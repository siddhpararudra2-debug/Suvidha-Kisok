import pg from 'pg';
import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

// PostgreSQL Connection Pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://suvidha:password@localhost:5432/suvidha_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL pool error:', err);
});

// Redis Client
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
});

redis.on('connect', () => {
    logger.info('Connected to Redis');
});

redis.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

// Database query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug('Executed query', { text: text.slice(0, 50), duration, rows: result.rowCount });
        return result.rows as T[];
    } catch (error) {
        logger.error('Query error:', { text: text.slice(0, 50), error });
        throw error;
    }
}

// Redis cache helper
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error('Redis get error:', { key, error });
        return null;
    }
}

export async function cacheSet(key: string, value: any, ttlSeconds = 300): Promise<void> {
    try {
        await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
        logger.error('Redis set error:', { key, error });
    }
}

export async function cacheDelete(key: string): Promise<void> {
    try {
        await redis.del(key);
    } catch (error) {
        logger.error('Redis delete error:', { key, error });
    }
}

// Session management
export async function setSession(userId: string, token: string, ttlSeconds = 900): Promise<void> {
    await cacheSet(`session:${userId}`, { token, createdAt: Date.now() }, ttlSeconds);
}

export async function getSession(userId: string): Promise<{ token: string; createdAt: number } | null> {
    return cacheGet(`session:${userId}`);
}

export async function deleteSession(userId: string): Promise<void> {
    await cacheDelete(`session:${userId}`);
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(255),
        aadhaar_masked VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        pincode VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS connections (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        consumer_id VARCHAR(100) NOT NULL,
        provider VARCHAR(100),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bills (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        connection_id INTEGER REFERENCES connections(id),
        type VARCHAR(20) NOT NULL,
        bill_number VARCHAR(100) UNIQUE,
        bill_date DATE,
        due_date DATE,
        amount DECIMAL(10,2),
        units_consumed DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'unpaid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        description TEXT,
        priority VARCHAR(20),
        status VARCHAR(30) DEFAULT 'registered',
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        address TEXT,
        assigned_officer_id VARCHAR(50),
        estimated_resolution TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaint_updates (
        id SERIAL PRIMARY KEY,
        complaint_id VARCHAR(50) REFERENCES complaints(id),
        status VARCHAR(30),
        message TEXT,
        updated_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id),
        bill_id VARCHAR(50) REFERENCES bills(id),
        amount DECIMAL(10,2),
        payment_method VARCHAR(30),
        transaction_id VARCHAR(100),
        upi_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS kiosks (
        id VARCHAR(50) PRIMARY KEY,
        location VARCHAR(255),
        status VARCHAR(20) DEFAULT 'online',
        last_ping TIMESTAMP,
        uptime DECIMAL(5,2) DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_bills_user ON bills(user_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
      CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
      CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    `);
        logger.info('Database tables initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize database:', error);
        throw error;
    }
}

// Graceful shutdown
export async function closeConnections(): Promise<void> {
    await pool.end();
    await redis.quit();
    logger.info('Database connections closed');
}
