/**
 * Application Constants
 */

module.exports = {
  // Medical Conditions Database
  MEDICAL_CONDITIONS: {
    acute_myocardial_infarction: {
      icd10: 'I21.9',
      category: 'cardiovascular',
      severity: 'high',
      urgency: 'immediate'
    },
    unstable_angina: {
      icd10: 'I20.0',
      category: 'cardiovascular',
      severity: 'medium',
      urgency: 'urgent'
    },
    pneumonia: {
      icd10: 'J18.9',
      category: 'respiratory',
      severity: 'moderate',
      urgency: 'urgent'
    },
    diabetes_type_2: {
      icd10: 'E11.9',
      category: 'endocrine',
      severity: 'moderate',
      urgency: 'routine'
    },
    hypertension: {
      icd10: 'I10',
      category: 'cardiovascular',
      severity: 'moderate',
      urgency: 'routine'
    }
  },

  // Triage Levels
  TRIAGE_LEVELS: {
    level_1_resuscitation: { priority: 1, color: 'red', maxWaitMinutes: 0 },
    level_2_emergent: { priority: 2, color: 'orange', maxWaitMinutes: 10 },
    level_3_urgent: { priority: 3, color: 'yellow', maxWaitMinutes: 30 },
    level_4_less_urgent: { priority: 4, color: 'green', maxWaitMinutes: 60 },
    level_5_non_urgent: { priority: 5, color: 'blue', maxWaitMinutes: 120 }
  },

  // Drug Interaction Severity
  DRUG_INTERACTION_SEVERITY: {
    major: { score: 3, requiresAction: true },
    moderate: { score: 2, requiresAction: true },
    minor: { score: 1, requiresAction: false }
  },

  // Vital Signs Normal Ranges
  VITAL_SIGNS_RANGES: {
    blood_pressure: {
      systolic: { normal: [90, 120], high: [140, 180], critical: [180, 999] },
      diastolic: { normal: [60, 80], high: [90, 110], critical: [110, 999] }
    },
    heart_rate: {
      normal: [60, 100],
      tachycardia: [100, 150],
      severe_tachycardia: [150, 999]
    },
    temperature: {
      normal: [36.1, 37.2],
      fever: [37.3, 39.0],
      high_fever: [39.1, 999]
    },
    respiratory_rate: {
      normal: [12, 20],
      tachypnea: [21, 30],
      severe_tachypnea: [31, 999]
    },
    oxygen_saturation: {
      normal: [95, 100],
      mild_hypoxia: [90, 94],
      moderate_hypoxia: [85, 89],
      severe_hypoxia: [0, 84]
    }
  },

  // Lab Test Reference Ranges
  LAB_REFERENCE_RANGES: {
    glucose_fasting: { unit: 'mg/dL', normal: [70, 99], prediabetes: [100, 125], diabetes: [126, 999] },
    troponin_i: { unit: 'ng/mL', normal: [0, 0.04], elevated: [0.04, 999] },
    hemoglobin_a1c: { unit: '%', normal: [0, 5.6], prediabetes: [5.7, 6.4], diabetes: [6.5, 999] },
    cholesterol_total: { unit: 'mg/dL', desirable: [0, 199], borderline: [200, 239], high: [240, 999] }
  },

  // Response Time Thresholds
  PERFORMANCE_THRESHOLDS: {
    excellent: { max: 1000, score: 100 },
    good: { max: 2000, score: 85 },
    acceptable: { max: 3000, score: 70 },
    poor: { max: 5000, score: 50 }
  },

  // HIPAA Compliance Levels
  SECURITY_LEVELS: {
    high: { encryption: true, auditLog: true, accessControl: 'strict' },
    medium: { encryption: true, auditLog: true, accessControl: 'moderate' },
    low: { encryption: false, auditLog: true, accessControl: 'basic' }
  }
};

