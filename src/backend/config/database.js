/**
 * MongoDB Database Configuration
 * Using mongodb-memory-server for in-memory database
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { logger } = require('../utils/logger');

// Disable buffering globally - models will fail fast if not connected
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);

let mongoServer = null;

const connectDB = async () => {
  try {
    // Check if external MongoDB URI is provided
    const externalURI = process.env.MONGODB_URI;
    
    let mongoURI;
    
    if (externalURI && !externalURI.includes('localhost')) {
      // Use external MongoDB if provided (e.g., MongoDB Atlas)
      mongoURI = externalURI;
      logger.info('🔗 Using external MongoDB connection...');
    } else {
      // Use in-memory MongoDB server with increased timeout
      logger.info('🚀 Starting in-memory MongoDB server...');
      logger.info('⏳ This may take 30-60 seconds on first run (downloading MongoDB binary)...');
      logger.info('📥 Please wait while MongoDB binaries are downloaded and initialized...');
      
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'healthcare_assistant',
          port: 27017,
        },
        binary: {
          downloadDir: './mongodb-binaries',
          version: '6.0.9',
        }
      });
      
      mongoURI = mongoServer.getUri();
      logger.info('✅ In-memory MongoDB server started successfully');
      logger.info(`📍 MongoDB URI: ${mongoURI}`);
    }
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000, // Increased to 60 seconds for in-memory server startup
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering - fail fast if not connected
      autoIndex: true, // Build indexes in background
    };

    const conn = await mongoose.connect(mongoURI, options);

    // Wait for connection to be fully ready
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
      }
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📁 Database: ${conn.connection.name}`);
    logger.info(`🔌 Connection State: Ready (${mongoose.connection.readyState})`);

    // Handle MongoDB connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    return conn;

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    logger.warn('⚠️  Continuing without database - API will use mock data');
    logger.info('💡 To fix: Install MongoDB locally or set MONGODB_URI in .env');
    // Don't throw - allow server to continue without DB
    return null;
  }
};

// Cleanup function to stop the in-memory server
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      logger.info('🛑 In-memory MongoDB server stopped');
    }
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;

