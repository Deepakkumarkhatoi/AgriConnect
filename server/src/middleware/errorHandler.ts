import { Request, Response, NextFunction } from 'express';
import { dbState } from '../config/db';

export function checkDbConnection(req: Request, res: Response, next: NextFunction): void {
  // If route is a health/status check or weather/mandi sample fallback, we can let it pass
  if (req.path === '/api/v1/health' || req.path === '/health') {
    return next();
  }

  if (!dbState.isConnected) {
    res.status(503).json({
      success: false,
      error: 'MongoDB is not connected. Please verify your MONGODB_URI in server/.env.',
      dbState: {
        isConnected: false,
        details: dbState.error || 'Connection timed out or invalid Atlas credentials.',
      },
    });
    return;
  }

  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('API Error:', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
