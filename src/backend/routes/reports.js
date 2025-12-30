/**
 * Clinical Report Routes
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

/**
 * @route   POST /api/v1/reports/clinical-summary
 * @desc    Generate clinical summary report
 * @access  Protected
 */
router.post('/clinical-summary', reportController.generateClinicalReport);

/**
 * @route   GET /api/v1/reports/download/:report_id
 * @desc    Download clinical report
 * @access  Protected
 */
router.get('/download/:report_id', reportController.downloadReport);

/**
 * @route   GET /api/v1/reports/patient/:patient_id
 * @desc    Get patient reports
 * @access  Protected
 */
router.get('/patient/:patient_id', reportController.getPatientReports);

module.exports = router;

