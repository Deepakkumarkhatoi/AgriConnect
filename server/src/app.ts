import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { dbState } from './config/db';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import farmRoutes from './routes/farmRoutes';
import cropRoutes from './routes/cropRoutes';
import marketPriceRoutes from './routes/marketPriceRoutes';
import weatherRoutes from './routes/weatherRoutes';
import schemeRoutes from './routes/schemeRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import orderRoutes from './routes/orderRoutes';
import supportRoutes from './routes/supportRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

export function createApp(): Application {
  const app = express();

  // CORS Configuration
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health and Cluster Diagnostic endpoint
  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'AgriConnect Backend REST API',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbState.isConnected,
        target: dbState.connectionString.includes('mongodb+srv://')
          ? 'MongoDB Atlas Cloud Cluster'
          : 'Local / Standalone MongoDB',
        error: dbState.error || null,
        instructions: dbState.isConnected
          ? 'Connected successfully.'
          : 'To connect to MongoDB Atlas Cluster: update MONGODB_URI in server/.env with your cluster credentials and ensure IP 0.0.0.0/0 is whitelisted in Atlas Network Access.',
      },
    });
  });

  // Mount API modules
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/farms', farmRoutes);
  app.use('/api/v1/crops', cropRoutes);
  app.use('/api/v1/market-prices', marketPriceRoutes);
  app.use('/api/v1/weather', weatherRoutes);
  app.use('/api/v1/schemes', schemeRoutes);
  app.use('/api/v1/listings', marketplaceRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/support', supportRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
