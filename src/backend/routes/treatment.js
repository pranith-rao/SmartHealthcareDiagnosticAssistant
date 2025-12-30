/**
 * Treatment Routes
 */

const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');

/**
 * @route   POST /api/v1/treatment/plan-generation
 * @desc    Generate treatment plan
 * @access  Protected
 */
router.post('/plan-generation', treatmentController.generateTreatmentPlan);

/**
 * @route   GET /api/v1/treatment/:id
 * @desc    Get treatment plan by ID
 * @access  Protected
 */
router.get('/:id', treatmentController.getTreatmentPlan);

/**
 * @route   PUT /api/v1/treatment/:id
 * @desc    Update treatment plan
 * @access  Protected
 */
router.put('/:id', treatmentController.updateTreatmentPlan);

module.exports = router;

