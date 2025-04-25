import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import userRouter from '@routes/userRoutes';

const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN?.split(',') || [] : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

// Routes
app.route('/api/users', userRouter);

// Health check
app.get('/', (c) => c.json({ status: 'ok' }));

const protocol = process.env.PROTOCOL ?? 'http';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ?? 4000;

try {
  serve({
    fetch: app.fetch,
    port: Number(port),
  });

  console.log(`⚡️ Server is running on ${protocol}://${host}:${port}`);
  console.log(`🔄 API Endpoint: ${protocol}://${host}:${port}/api`);
} catch (error) {
  console.error(
    '❌ Failed to start server:',
    error instanceof Error ? error.message : 'Unknown error'
  );
  process.exit(1);
}
