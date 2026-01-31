import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Don't expose internal errors in production
    const response = {
        error: statusCode === 500 && process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};
