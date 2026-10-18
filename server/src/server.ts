import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

async function bootstrap() {
  const app = createApp();

  // Attempt database connection
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🌱 AgriConnect Backend API is running!`);
    console.log(`📡 URL: http://localhost:${ENV.PORT}`);
    console.log(`🏥 Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`🌿 Environment: ${ENV.NODE_ENV}`);
    console.log(`==================================================\n`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal initialization error:', err);
});
