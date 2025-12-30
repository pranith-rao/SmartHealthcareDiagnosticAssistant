/**
 * HIPAA Compliance Audit Logging Middleware
 */

const { logger } = require('../utils/logger');

const auditLogger = (req, res, next) => {
  // Only log if HIPAA audit logging is enabled
  if (process.env.ENABLE_AUDIT_LOGGING !== 'true') {
    return next();
  }

  // Capture request start time
  const startTime = Date.now();

  // Store original res.json function
  const originalJson = res.json;

  // Override res.json to capture response
  res.json = function (data) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Create audit log entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: `${req.method} ${req.path}`,
      user_id: req.headers['x-provider-id'] || 'anonymous',
      facility_id: req.headers['x-facility-id'] || 'unknown',
      patient_id: req.body?.patient_id || req.params?.id || req.query?.patient_id || null,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
      status_code: res.statusCode,
      response_time_ms: responseTime,
      purpose: req.headers['x-purpose-of-use'] || 'clinical_care',
      phi_accessed: containsPHI(req.path),
      success: res.statusCode < 400
    };

    // Log the audit entry
    logger.info('HIPAA Audit Log', auditEntry);

    // Call original json function
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Check if the endpoint potentially accesses PHI
 */
const containsPHI = (path) => {
  const phiEndpoints = [
    '/patients',
    '/diagnosis',
    '/imaging',
    '/treatment',
    '/reports'
  ];

  return phiEndpoints.some(endpoint => path.includes(endpoint));
};

module.exports = auditLogger;

