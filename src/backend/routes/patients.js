/**
 * Patient Routes
 */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { validateRequest, patientRegistrationSchema } = require('../utils/validators');

/**
 * @route   POST /api/v1/patients/register
 * @desc    Register new patient
 * @access  Protected
 */
router.post('/register', validateRequest(patientRegistrationSchema), patientController.registerPatient);

/**
 * @route   GET /api/v1/patients
 * @desc    Get all patients (with pagination)
 * @access  Protected
 */
router.get('/', patientController.getAllPatients);

/**
 * @route   GET /api/v1/patients/:id
 * @desc    Get patient by ID
 * @access  Protected
 */
router.get('/:id', patientController.getPatient);

/**
 * @route   PUT /api/v1/patients/:id/status
 * @desc    Update patient status
 * @access  Protected
 */
router.put('/:id/status', patientController.updatePatientStatus);

module.exports = router;

