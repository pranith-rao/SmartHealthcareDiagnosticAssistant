/**
 * Validation Utility Functions
 */

const Joi = require('joi');

/**
 * Patient registration validation schema
 */
const patientRegistrationSchema = Joi.object({
  patient_data: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    date_of_birth: Joi.date().max('now').required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
    medical_record_number: Joi.string().optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zip: Joi.string().optional(),
      country: Joi.string().optional()
    }).optional()
  }).required()
});

/**
 * Diagnosis analysis validation schema
 */
const diagnosisAnalysisSchema = Joi.object({
  patient_data: Joi.object({
    patient_id: Joi.string().required(),
    encounter_id: Joi.string().optional(),
    demographics: Joi.object({
      age: Joi.number().min(0).max(150).required(),
      gender: Joi.string().valid('male', 'female', 'other').required(),
      ethnicity: Joi.string().optional(),
      weight_kg: Joi.number().min(0).max(500).optional(),
      height_cm: Joi.number().min(0).max(300).optional()
    }).required(),
    chief_complaint: Joi.string().required(),
    symptoms: Joi.array().items(
      Joi.object({
        symptom: Joi.string().required(),
        severity: Joi.number().min(0).max(10).required(),
        duration_hours: Joi.number().min(0).optional(),
        character: Joi.string().optional(),
        radiation: Joi.string().optional(),
        aggravating_factors: Joi.array().items(Joi.string()).optional(),
        relieving_factors: Joi.array().items(Joi.string()).optional()
      })
    ).min(1).required(),
    vital_signs: Joi.object({
      blood_pressure: Joi.string().pattern(/^\d{2,3}\/\d{2,3}$/).optional(),
      heart_rate: Joi.number().min(0).max(300).optional(),
      respiratory_rate: Joi.number().min(0).max(100).optional(),
      temperature_celsius: Joi.number().min(25).max(45).optional(),
      oxygen_saturation: Joi.number().min(0).max(100).optional()
    }).required(),
    medical_history: Joi.array().items(Joi.string()).optional(),
    current_medications: Joi.array().items(Joi.string()).optional()
  }).required(),
  analysis_options: Joi.object({
    include_risk_stratification: Joi.boolean().optional(),
    emergency_assessment: Joi.boolean().optional(),
    drug_interactions: Joi.boolean().optional()
  }).optional()
});

/**
 * Drug interaction check validation schema
 */
const drugInteractionSchema = Joi.object({
  patient_id: Joi.string().required(),
  patient_profile: Joi.object({
    age: Joi.number().min(0).max(150).required(),
    weight_kg: Joi.number().min(0).max(500).optional(),
    kidney_function: Joi.string().valid('normal', 'mild_impairment', 'moderate_impairment', 'severe_impairment').optional(),
    liver_function: Joi.string().valid('normal', 'mild_impairment', 'moderate_impairment', 'severe_impairment').optional(),
    allergies: Joi.array().items(Joi.string()).optional()
  }).required(),
  medications: Joi.array().items(
    Joi.object({
      medication: Joi.string().required(),
      dose: Joi.string().required(),
      frequency: Joi.string().required(),
      route: Joi.string().valid('oral', 'IV', 'IM', 'subcutaneous', 'topical', 'inhaled').required()
    })
  ).required(),
  proposed_medication: Joi.object({
    medication: Joi.string().required(),
    dose: Joi.string().required(),
    frequency: Joi.string().required(),
    indication: Joi.string().optional()
  }).optional()
});

/**
 * Validate request data
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details: errors,
          timestamp: new Date().toISOString()
        }
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  patientRegistrationSchema,
  diagnosisAnalysisSchema,
  drugInteractionSchema,
  validateRequest
};

