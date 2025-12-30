/**
 * Team CursorMinds - Healthcare Diagnostic Assistant
 * Main Server Entry Point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const { disconnectDB } = require('./config/database');
const { logger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Facility-ID', 'X-Provider-ID']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team CursorMinds Healthcare Assistant is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1', routes);

// Serve static files (React frontend in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString()
    }
  });
});

// Global error handler
app.use(errorHandler);

// Start server function
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;

// Async startup function
const startServer = async () => {
  try {
    // Connect to MongoDB first and wait for it to be ready
    logger.info('⏳ Connecting to database...');
    await connectDB();
    logger.info('✅ Database connected successfully');
    
    // Start HTTP server after database is ready
    server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Team CursorMinds Healthcare Assistant started`);
      logger.info(`📍 Server running on http://${HOST}:${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`❤️  Health Check: http://${HOST}:${PORT}/health`);
      logger.info(`📊 API Base: http://${HOST}:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    logger.warn('⚠️  Server will continue without database connection');
    
    // Start server anyway but with warning
    server = app.listen(PORT, HOST, () => {
      logger.info(`🚀 Team CursorMinds Healthcare Assistant started (LIMITED MODE)`);
      logger.info(`📍 Server running on http://${HOST}:${PORT}`);
      logger.info(`⚠️  Database not connected - some features may not work`);
    });
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await disconnectDB();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  logger.info('Shutting down gracefully...');
  
  // Force exit after 3 seconds if graceful shutdown takes too long
  const forceExitTimer = setTimeout(() => {
    logger.warn('Force exit after timeout');
    process.exit(0);
  }, 3000);
  
  try {
    if (server) {
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        clearTimeout(forceExitTimer);
        process.exit(0);
      });
    } else {
      await disconnectDB();
      clearTimeout(forceExitTimer);
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during shutdown:', error);
    clearTimeout(forceExitTimer);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

module.exports = app;

