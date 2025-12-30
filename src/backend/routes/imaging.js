/**
 * Medical Imaging Routes
 */

const express = require('express');
const router = express.Router();
const imagingController = require('../controllers/imagingController');

/**
 * @route   POST /api/v1/imaging/analyze
 * @desc    Analyze medical image
 * @access  Protected
 */
router.post('/analyze', imagingController.analyzeImage);

/**
 * @route   GET /api/v1/imaging/:study_id/results
 * @desc    Get imaging study results
 * @access  Protected
 */
router.get('/:study_id/results', imagingController.getImagingResults);

/**
 * @route   POST /api/v1/imaging/compare-studies
 * @desc    Compare multiple imaging studies
 * @access  Protected
 */
router.post('/compare-studies', imagingController.compareStudies);

module.exports = router;

