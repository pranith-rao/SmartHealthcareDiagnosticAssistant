/**
 * Medical Imaging Study MongoDB Model
 */

const mongoose = require('mongoose');

const imagingStudySchema = new mongoose.Schema({
  study_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  analysis_id: {
    type: String,
    unique: true,
    sparse: true
  },
  patient_id: {
    type: String,
    required: true,
    index: true
  },
  study_type: {
    type: String,
    enum: ['chest_xray', 'ct_scan', 'mri', 'ultrasound', 'mammogram'],
    required: true
  },
  modality: String,
  body_part: String,
  view: String,
  acquisition_date: {
    type: Date,
    default: Date.now
  },
  clinical_indication: String,
  facility_id: String,
  image_metadata: {
    file_name: String,
    file_size: Number,
    format: String,
    dimensions: {
      width: Number,
      height: Number
    }
  },
  analysis_status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  findings: [{
    finding_id: String,
    description: String,
    anatomical_location: String,
    severity: String,
    confidence: Number,
    coordinates: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    },
    differential_diagnosis: [{
      diagnosis: String,
      probability: Number,
      icd10_code: String
    }]
  }],
  overall_assessment: {
    normal_study: Boolean,
    critical_findings: Boolean,
    recommendation: String,
    urgency_level: String,
    follow_up_suggested: String
  },
  quality_metrics: {
    image_quality: String,
    positioning: String,
    penetration: String,
    artifacts_detected: Boolean
  },
  validation_parameters: {
    image_quality_score: Number,
    detection_accuracy: Number,
    false_positive_rate: Number,
    annotation_precision: Number,
    processing_efficiency: Number,
    standard_compliance: String
  },
  processing_time_seconds: Number,
  algorithm_version: String,
  radiologist_review: {
    reviewed: Boolean,
    reviewed_by: String,
    reviewed_at: Date,
    comments: String
  }
}, {
  timestamps: true
});

// Indexes
imagingStudySchema.index({ patient_id: 1, acquisition_date: -1 });
imagingStudySchema.index({ study_type: 1, analysis_status: 1 });

module.exports = mongoose.model('ImagingStudy', imagingStudySchema);

