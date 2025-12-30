/**
 * Main Router - API v1
 */

const express = require('express');
const router = express.Router();

// Import route modules
const patientRoutes = require('./patients');
const diagnosisRoutes = require('./diagnosis');
const imagingRoutes = require('./imaging');
const drugRoutes = require('./drugInteractions');
const treatmentRoutes = require('./treatment');
const reportRoutes = require('./reports');

// Audit logging middleware
const auditLogger = require('../middleware/auditLogger');

// Apply audit logging to all routes
router.use(auditLogger);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Healthcare Diagnostic Assistant API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      diagnostic_engine: 'operational',
      rule_engine: 'operational',
      treatment_engine: 'operational'
    }
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Team CursorMinds Healthcare Diagnostic Assistant API',
    version: '1.0.0',
    documentation: '/docs/API_SPECIFICATION.md',
    endpoints: {
      patients: '/api/v1/patients',
      diagnosis: '/api/v1/diagnosis',
      imaging: '/api/v1/imaging',
      drug_interactions: '/api/v1/drug-interactions',
      treatment: '/api/v1/treatment',
      reports: '/api/v1/reports',
      health: '/api/v1/health'
    }
  });
});

// Mount route modules
router.use('/patients', patientRoutes);
router.use('/diagnosis', diagnosisRoutes);
router.use('/imaging', imagingRoutes);
router.use('/drug-interactions', drugRoutes);
router.use('/treatment', treatmentRoutes);
router.use('/reports', reportRoutes);

module.exports = router;

