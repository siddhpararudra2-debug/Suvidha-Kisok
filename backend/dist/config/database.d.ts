import Redis from 'ioredis';
export declare const pool: import("pg").Pool;
export declare const redis: Redis;
export declare function query<T = any>(text: string, params?: any[]): Promise<T[]>;
export declare function cacheGet<T>(key: string): Promise<T | null>;
export declare function cacheSet(key: string, value: any, ttlSeconds?: number): Promise<void>;
export declare function cacheDelete(key: string): Promise<void>;
export declare function setSession(userId: string, token: string, ttlSeconds?: number): Promise<void>;
export declare function getSession(userId: string): Promise<{
    token: string;
    createdAt: number;
} | null>;
export declare function deleteSession(userId: string): Promise<void>;
export declare function initializeDatabase(): Promise<void>;
export declare function closeConnections(): Promise<void>;
//# sourceMappingURL=database.d.ts.map