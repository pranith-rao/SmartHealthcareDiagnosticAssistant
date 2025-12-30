/**
 * Drug Interaction Routes
 */

const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drugController');
const { validateRequest, drugInteractionSchema } = require('../utils/validators');

/**
 * @route   POST /api/v1/drug-interactions/check
 * @desc    Check drug interactions
 * @access  Protected
 */
router.post('/check', validateRequest(drugInteractionSchema), drugController.checkDrugInteractions);

module.exports = router;

