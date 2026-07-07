import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import practiceAreaRoutes from './routes/practiceAreaRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Basic Security Headers via Helmet
// Customize cross-origin resource sharing/loading policies for safety
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows images uploaded locally to be displayed on client
  })
);

// 2. CORS configuration
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 3. Logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Rate Limiter: Prevent brute force/DOS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === 'development' ? 10000 : 100, // Higher limit for local development testing
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// 5. Compression for fast page loading
app.use(compression());

// 6. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 7. Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 8. Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/practiceareas', practiceAreaRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/settings', settingRoutes);

// Fallback Route for non-existing APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.json({ success: true, message: 'Advocate Mubashir Alam Portfolio API is running...' });
    });
  }
}

// 9. Central Error Handler Middleware
app.use(errorHandler);

export default app;
