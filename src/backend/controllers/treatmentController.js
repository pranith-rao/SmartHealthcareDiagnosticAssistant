/**
 * Treatment Controller
 * Handles treatment plan generation and management
 */

const { v4: uuidv4 } = require('uuid');
const Treatment = require('../models/Treatment');
const treatmentEngine = require('../services/treatmentEngine');
const { logger } = require('../utils/logger');

/**
 * Generate treatment plan
 * POST /api/v1/treatment/plan-generation
 */
exports.generateTreatmentPlan = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { patient_id, primary_diagnosis, secondary_diagnoses, patient_factors, treatment_goals } = req.body;

    // Generate treatment plan
    const treatmentPlan = await treatmentEngine.generateTreatmentPlan(
      { patient_id },
      primary_diagnosis,
      patient_factors || {}
    );

    // Generate treatment plan ID
    const treatment_plan_id = `plan_${uuidv4().substr(0, 8)}`;

    // Save to database (mock diagnosis_id for now)
    const treatment = new Treatment({
      treatment_plan_id,
      patient_id,
      diagnosis_id: `diag_${Date.now()}`,
      primary_diagnosis,
      secondary_diagnoses: secondary_diagnoses || [],
      acute_management: treatmentPlan.acute_management,
      long_term_management: treatmentPlan.long_term_management,
      medications: treatmentPlan.medications,
      lifestyle_modifications: treatmentPlan.lifestyle_modifications,
      follow_up_schedule: treatmentPlan.follow_up_schedule,
      monitoring_plan: treatmentPlan.monitoring_plan,
      discharge_criteria: treatmentPlan.discharge_criteria,
      validation_parameters: treatmentPlan.validation_parameters,
      created_by: req.headers['x-provider-id'] || 'system',
      status: 'active'
    });

    await treatment.save();

    const totalProcessingTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        treatment_plan_id,
        patient_id,
        created_at: treatment.createdAt.toISOString(),
        acute_management: treatmentPlan.acute_management,
        long_term_management: treatmentPlan.long_term_management,
        medications: treatmentPlan.medications,
        lifestyle_modifications: treatmentPlan.lifestyle_modifications,
        follow_up_schedule: treatmentPlan.follow_up_schedule,
        monitoring_plan: treatmentPlan.monitoring_plan,
        discharge_criteria: treatmentPlan.discharge_criteria,
        
        // CRITICAL VALIDATION PARAMETERS
        plan_completeness: treatmentPlan.validation_parameters.plan_completeness,
        evidence_based_score: treatmentPlan.validation_parameters.evidence_based_score,
        safety_check_score: treatmentPlan.validation_parameters.safety_check_score,
        guideline_compliance: treatmentPlan.validation_parameters.guideline_compliance,
        processing_time_ms: totalProcessingTime
      }
    });

    logger.info(`Treatment plan generated: ${treatment_plan_id} for patient ${patient_id}`);

  } catch (error) {
    logger.error('Generate treatment plan error:', error);
    next(error);
  }
};

/**
 * Get treatment plan by ID
 * GET /api/v1/treatment/:id
 */
exports.getTreatmentPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const treatment = await Treatment.findOne({ treatment_plan_id: id });

    if (!treatment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TREATMENT_NOT_FOUND',
          message: `Treatment plan with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: treatment
    });

  } catch (error) {
    logger.error('Get treatment plan error:', error);
    next(error);
  }
};

/**
 * Update treatment plan
 * PUT /api/v1/treatment/:id
 */
exports.updateTreatmentPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const treatment = await Treatment.findOneAndUpdate(
      { treatment_plan_id: id },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!treatment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TREATMENT_NOT_FOUND',
          message: `Treatment plan with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: treatment
    });

  } catch (error) {
    logger.error('Update treatment plan error:', error);
    next(error);
  }
};

module.exports = exports;

