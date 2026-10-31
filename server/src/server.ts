import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[CertiPro Server] Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`[CertiPro Server] Health Check: http://localhost:${env.PORT}/api/v1/health`);
  });

  const gracefulShutdown = () => {
    console.log('[CertiPro Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[CertiPro Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

bootstrap().catch((err) => {
  console.error('[CertiPro Server] Fatal startup error:', err);
  process.exit(1);
});

