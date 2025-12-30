/**
 * Diagnosis Routes
 */

const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const { validateRequest, diagnosisAnalysisSchema } = require('../utils/validators');

/**
 * @route   POST /api/v1/diagnosis/analyze
 * @desc    Analyze clinical symptoms and generate diagnosis
 * @access  Protected
 */
router.post('/analyze', validateRequest(diagnosisAnalysisSchema), diagnosisController.analyzeSymptoms);

/**
 * @route   GET /api/v1/diagnosis/:id
 * @desc    Get diagnosis by ID
 * @access  Protected
 */
router.get('/:id', diagnosisController.getDiagnosis);

/**
 * @route   GET /api/v1/diagnosis/patient/:patientId
 * @desc    Get patient diagnosis history
 * @access  Protected
 */
router.get('/patient/:patientId', diagnosisController.getPatientDiagnosisHistory);

module.exports = router;

