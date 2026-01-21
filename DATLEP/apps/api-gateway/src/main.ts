import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);

// ----------------------
// Rate Limiting (IPv6-safe)
// ----------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // limit per user or IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req, res) => ipKeyGenerator(req.ip || ''), // ✅ IPv6 safe
});

app.use(limiter);

// ----------------------
// Health Check
// ----------------------
app.get('/gateway-health', (req, res) => {
  res.json({ message: 'API Gateway is running!' });
});

// ----------------------
// Proxy to auth-service (example)
// ----------------------
app.use('/', proxy('http://localhost:6001'));
app.use('/product', proxy('http://localhost:6002'));

// ----------------------
// Start Server
// ----------------------
const port = parseInt(process.env.PORT || '8080', 10);

const server = app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}/`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
