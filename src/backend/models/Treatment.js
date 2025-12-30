/**
 * Treatment Plan MongoDB Model
 */

const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  treatment_plan_id: {
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
  diagnosis_id: {
    type: String,
    required: true
  },
  primary_diagnosis: String,
  secondary_diagnoses: [String],
  acute_management: {
    immediate_interventions: [{
      intervention: String,
      medications: [String],
      duration: String,
      monitoring: String,
      status: {
        type: String,
        enum: ['planned', 'in_progress', 'completed'],
        default: 'planned'
      }
    }]
  },
  long_term_management: {
    cardiovascular_prevention: [{
      intervention: String,
      medication: String,
      titration: String,
      target: String
    }],
    chronic_disease_management: [{
      condition: String,
      intervention: String,
      target: String,
      monitoring: String
    }]
  },
  medications: [{
    drug: String,
    dosage: String,
    frequency: String,
    route: String,
    duration: String,
    monitoring: [String],
    interactions_checked: Boolean,
    contraindications: [String]
  }],
  lifestyle_modifications: [{
    intervention: String,
    resources: [String],
    target: String,
    progress: String
  }],
  follow_up_schedule: [{
    timeframe: String,
    type: String,
    assessments: [String],
    completed: {
      type: Boolean,
      default: false
    }
  }],
  monitoring_plan: {
    vital_signs: String,
    laboratory_tests: String,
    imaging: String
  },
  discharge_criteria: [String],
  validation_parameters: {
    plan_completeness: Number,
    evidence_based_score: Number,
    safety_check_score: Number,
    guideline_compliance: Number
  },
  created_by: String,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
treatmentSchema.index({ patient_id: 1, status: 1 });
treatmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Treatment', treatmentSchema);

