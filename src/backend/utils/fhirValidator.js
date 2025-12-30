/**
 * FHIR Resource Validator
 * Validates healthcare data against FHIR R4 standards
 */

const { logger } = require('./logger');

/**
 * Validate FHIR Patient Resource
 * Based on FHIR R4 Patient Resource: https://www.hl7.org/fhir/patient.html
 */
const validateFHIRPatient = (patientData) => {
  const errors = [];
  const warnings = [];

  try {
    // Required fields validation
    if (!patientData.first_name && !patientData.given) {
      errors.push('Patient given name (first_name) is required per FHIR Patient resource');
    }

    if (!patientData.last_name && !patientData.family) {
      errors.push('Patient family name (last_name) is required per FHIR Patient resource');
    }

    // Gender validation (FHIR administrative gender value set)
    const validGenders = ['male', 'female', 'other', 'unknown'];
    if (patientData.gender && !validGenders.includes(patientData.gender.toLowerCase())) {
      errors.push(`Invalid gender value. Must be one of: ${validGenders.join(', ')}`);
    }

    // Date of birth validation
    if (patientData.date_of_birth) {
      const dob = new Date(patientData.date_of_birth);
      if (isNaN(dob.getTime())) {
        errors.push('Invalid date_of_birth format. Use ISO 8601 format (YYYY-MM-DD)');
      } else if (dob > new Date()) {
        errors.push('date_of_birth cannot be in the future');
      }
    }

    // Contact validation (email, phone)
    if (patientData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientData.email)) {
        errors.push('Invalid email format per FHIR ContactPoint');
      }
    }

    if (patientData.phone) {
      // Basic phone validation
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(patientData.phone)) {
        warnings.push('Phone number format may not comply with FHIR ContactPoint standards');
      }
    }

    // Address validation
    if (patientData.address) {
      if (typeof patientData.address !== 'object') {
        warnings.push('Address should be a structured object per FHIR Address datatype');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fhir_compliant: errors.length === 0 && warnings.length === 0
    };

  } catch (error) {
    logger.error('FHIR Patient validation error:', error);
    return {
      valid: false,
      errors: ['Validation error occurred'],
      warnings: [],
      fhir_compliant: false
    };
  }
};

/**
 * Validate FHIR Observation Resource
 * Based on FHIR R4 Observation: https://www.hl7.org/fhir/observation.html
 */
const validateFHIRObservation = (observationData) => {
  const errors = [];
  const warnings = [];

  try {
    // Status is required (FHIR R4)
    const validStatuses = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'];
    if (!observationData.status) {
      errors.push('Observation status is required');
    } else if (!validStatuses.includes(observationData.status)) {
      errors.push(`Invalid observation status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Code is required (what was observed)
    if (!observationData.code && !observationData.test) {
      errors.push('Observation code/test is required per FHIR Observation');
    }

    // Value validation
    if (observationData.value !== undefined && observationData.value !== null) {
      if (typeof observationData.value === 'object') {
        // Check for valueQuantity structure
        if (!observationData.value.value && !observationData.value.unit) {
          warnings.push('valueQuantity should include value and unit per FHIR');
        }
      }
    }

    // Effective date/time
    if (observationData.effectiveDateTime || observationData.timestamp) {
      const effectiveDate = new Date(observationData.effectiveDateTime || observationData.timestamp);
      if (isNaN(effectiveDate.getTime())) {
        errors.push('Invalid effectiveDateTime format');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fhir_compliant: errors.length === 0 && warnings.length === 0
    };

  } catch (error) {
    logger.error('FHIR Observation validation error:', error);
    return {
      valid: false,
      errors: ['Validation error occurred'],
      warnings: [],
      fhir_compliant: false
    };
  }
};

/**
 * Validate FHIR Condition Resource
 * Based on FHIR R4 Condition: https://www.hl7.org/fhir/condition.html
 */
const validateFHIRCondition = (conditionData) => {
  const errors = [];
  const warnings = [];

  try {
    // Clinical status (required if verification status is not entered-in-error)
    const validClinicalStatuses = ['active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved'];
    if (conditionData.clinicalStatus && !validClinicalStatuses.includes(conditionData.clinicalStatus)) {
      errors.push(`Invalid clinicalStatus. Must be one of: ${validClinicalStatuses.join(', ')}`);
    }

    // Verification status
    const validVerificationStatuses = ['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted', 'entered-in-error'];
    if (conditionData.verificationStatus && !validVerificationStatuses.includes(conditionData.verificationStatus)) {
      errors.push(`Invalid verificationStatus. Must be one of: ${validVerificationStatuses.join(', ')}`);
    }

    // Code (diagnosis code) - should use standard terminologies
    if (!conditionData.code && !conditionData.diagnosis && !conditionData.icd10_code) {
      warnings.push('Condition code (ICD-10, SNOMED CT) recommended per FHIR standards');
    }

    // Subject (patient reference)
    if (!conditionData.subject && !conditionData.patient_id) {
      errors.push('Subject/patient reference is required per FHIR Condition');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fhir_compliant: errors.length === 0 && warnings.length === 0
    };

  } catch (error) {
    logger.error('FHIR Condition validation error:', error);
    return {
      valid: false,
      errors: ['Validation error occurred'],
      warnings: [],
      fhir_compliant: false
    };
  }
};

/**
 * Validate FHIR MedicationRequest Resource
 */
const validateFHIRMedicationRequest = (medicationData) => {
  const errors = [];
  const warnings = [];

  try {
    // Status is required
    const validStatuses = ['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'];
    if (!medicationData.status) {
      errors.push('MedicationRequest status is required');
    } else if (!validStatuses.includes(medicationData.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Intent is required
    const validIntents = ['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option'];
    if (!medicationData.intent) {
      errors.push('MedicationRequest intent is required');
    } else if (!validIntents.includes(medicationData.intent)) {
      errors.push(`Invalid intent. Must be one of: ${validIntents.join(', ')}`);
    }

    // Medication reference or code
    if (!medicationData.medication && !medicationData.medicationCodeableConcept) {
      errors.push('Medication reference or code is required');
    }

    // Subject (patient)
    if (!medicationData.subject && !medicationData.patient_id) {
      errors.push('Subject/patient reference is required');
    }

    // Dosage instructions
    if (medicationData.dosageInstruction) {
      if (!Array.isArray(medicationData.dosageInstruction)) {
        warnings.push('dosageInstruction should be an array per FHIR');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fhir_compliant: errors.length === 0 && warnings.length === 0
    };

  } catch (error) {
    logger.error('FHIR MedicationRequest validation error:', error);
    return {
      valid: false,
      errors: ['Validation error occurred'],
      warnings: [],
      fhir_compliant: false
    };
  }
};

/**
 * Convert patient data to FHIR R4 Patient resource format
 */
const convertToFHIRPatient = (patientData) => {
  return {
    resourceType: 'Patient',
    id: patientData.patient_id,
    identifier: [
      {
        use: 'official',
        system: 'urn:hospital:mrn',
        value: patientData.medical_record_number
      }
    ],
    name: [
      {
        use: 'official',
        family: patientData.last_name || patientData.demographics?.last_name,
        given: [patientData.first_name || patientData.demographics?.first_name]
      }
    ],
    gender: patientData.gender || patientData.demographics?.gender,
    birthDate: patientData.date_of_birth || patientData.demographics?.date_of_birth,
    telecom: [
      ...(patientData.phone || patientData.demographics?.phone ? [{
        system: 'phone',
        value: patientData.phone || patientData.demographics?.phone,
        use: 'home'
      }] : []),
      ...(patientData.email || patientData.demographics?.email ? [{
        system: 'email',
        value: patientData.email || patientData.demographics?.email,
        use: 'home'
      }] : [])
    ],
    address: patientData.address ? [
      {
        use: 'home',
        line: [patientData.address.street || patientData.address],
        city: patientData.address.city,
        state: patientData.address.state,
        postalCode: patientData.address.zip,
        country: patientData.address.country
      }
    ] : []
  };
};

/**
 * Validate diagnostic report against FHIR DiagnosticReport
 */
const validateFHIRDiagnosticReport = (reportData) => {
  const errors = [];
  const warnings = [];

  try {
    // Status is required
    const validStatuses = ['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown'];
    if (!reportData.status) {
      errors.push('DiagnosticReport status is required');
    } else if (!validStatuses.includes(reportData.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Code is required (type of diagnostic report)
    if (!reportData.code && !reportData.report_type) {
      errors.push('DiagnosticReport code/type is required');
    }

    // Subject is required
    if (!reportData.subject && !reportData.patient_id) {
      errors.push('Subject/patient reference is required');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fhir_compliant: errors.length === 0 && warnings.length === 0
    };

  } catch (error) {
    logger.error('FHIR DiagnosticReport validation error:', error);
    return {
      valid: false,
      errors: ['Validation error occurred'],
      warnings: [],
      fhir_compliant: false
    };
  }
};

/**
 * Get FHIR compliance summary
 */
const getFHIRComplianceSummary = (validationResults) => {
  const totalErrors = validationResults.reduce((sum, result) => sum + (result.errors?.length || 0), 0);
  const totalWarnings = validationResults.reduce((sum, result) => sum + (result.warnings?.length || 0), 0);
  const allValid = validationResults.every(result => result.valid);

  return {
    fhir_compliant: allValid && totalErrors === 0,
    total_errors: totalErrors,
    total_warnings: totalWarnings,
    validation_passed: allValid,
    compliance_level: totalErrors === 0 && totalWarnings === 0 ? 'full' : 
                     totalErrors === 0 ? 'partial' : 'non-compliant',
    standard_version: 'FHIR R4'
  };
};

module.exports = {
  validateFHIRPatient,
  validateFHIRObservation,
  validateFHIRCondition,
  validateFHIRMedicationRequest,
  validateFHIRDiagnosticReport,
  convertToFHIRPatient,
  getFHIRComplianceSummary
};

