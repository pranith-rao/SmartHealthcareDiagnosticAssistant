/**
 * Patient MongoDB Model
 */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patient_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  medical_record_number: {
    type: String,
    unique: true,
    sparse: true
  },
  demographics: {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    date_of_birth: {
      type: Date,
      required: true
    },
    age: {
      type: Number
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    }
  },
  medical_history: [{
    condition: String,
    diagnosed_date: Date,
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
      default: 'active'
    }
  }],
  current_medications: [{
    medication: String,
    dosage: String,
    frequency: String,
    start_date: Date
  }],
  allergies: [{
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  vital_signs_history: [{
    recorded_at: Date,
    blood_pressure: String,
    heart_rate: Number,
    temperature: Number,
    respiratory_rate: Number,
    oxygen_saturation: Number,
    weight_kg: Number,
    height_cm: Number,
    bmi: Number
  }],
  insurance_info: {
    provider: String,
    policy_number: String,
    group_number: String
  },
  emergency_contact: {
    name: String,
    relationship: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active'
  },
  data_encryption_status: {
    type: String,
    default: 'encrypted'
  },
  created_by: String,
  updated_by: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate age from date of birth
patientSchema.pre('save', function(next) {
  if (this.demographics && this.demographics.date_of_birth) {
    const dob = new Date(this.demographics.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    this.demographics.age = age;
  }
  next();
});

// Indexes for performance
patientSchema.index({ 'demographics.last_name': 1, 'demographics.first_name': 1 });
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);

