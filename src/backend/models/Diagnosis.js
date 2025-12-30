/**
 * Diagnosis MongoDB Model
 */

const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  analysis_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  patient_id: {
    type: String,
    required: true,
    index: true
  },
  encounter_id: String,
  assessment_timestamp: {
    type: Date,
    default: Date.now
  },
  chief_complaint: {
    type: String,
    required: true
  },
  symptoms: [{
    symptom: String,
    severity: Number,
    duration_hours: Number,
    character: String,
    radiation: String,
    aggravating_factors: [String],
    relieving_factors: [String]
  }],
  vital_signs: {
    blood_pressure: String,
    heart_rate: Number,
    respiratory_rate: Number,
    temperature_celsius: Number,
    oxygen_saturation: Number
  },
  differential_diagnosis: [{
    diagnosis: String,
    probability: Number,
    confidence: Number,
    icd10_code: String,
    severity: String,
    urgency: String,
    evidence: [String],
    recommended_actions: [String]
  }],
  risk_assessment: {
    emergency_severity: String,
    triage_level: String,
    time_sensitive: Boolean,
    mortality_risk: String
  },
  recommended_workup: [{
    test: String,
    urgency: String,
    rationale: String
  }],
  clinical_alerts: [{
    alert_type: String,
    message: String,
    action_required: String
  }],
  explanation: {
    reasoning: String,
    key_factors: [String],
    clinical_pearls: [String]
  },
  missing_information: [String],
  validation_parameters: {
    diagnostic_confidence: Number,
    clinical_accuracy_score: Number,
    rule_engine_coverage: Number,
    external_api_calls: Number,
    processing_complexity: String,
    medical_terminology_compliance: Boolean
  },
  processing_time_ms: Number,
  performed_by: String,
  reviewed: {
    type: Boolean,
    default: false
  },
  reviewed_by: String,
  reviewed_at: Date
}, {
  timestamps: true
});

// Indexes
diagnosisSchema.index({ patient_id: 1, createdAt: -1 });
diagnosisSchema.index({ assessment_timestamp: -1 });

module.exports = mongoose.model('Diagnosis', diagnosisSchema);

