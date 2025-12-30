/**
 * Diagnosis Controller
 * Handles diagnostic analysis and clinical decision support
 */

const { v4: uuidv4 } = require('uuid');
const Diagnosis = require('../models/Diagnosis');
const diagnosticEngine = require('../services/diagnosticEngine');
const { logger } = require('../utils/logger');
const { trackApiCall, lookupMedicalTerminology, lookupClinicalGuideline } = require('../utils/externalApiTracker');

/**
 * Analyze clinical symptoms and generate diagnosis
 * POST /api/v1/diagnosis/analyze
 */
exports.analyzeSymptoms = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { patient_data, analysis_options } = req.validatedData;

    // Track external API calls for medical terminology lookup
    const externalApiCalls = [];
    
    // Lookup medical terminology for symptoms (simulate external API call)
    if (patient_data.symptoms && patient_data.symptoms.length > 0) {
      const terminologyLookup = await lookupMedicalTerminology(
        patient_data.symptoms[0].symptom || 'chest_pain'
      );
      externalApiCalls.push(terminologyLookup.metadata);
    }
    
    // Lookup clinical guidelines (simulate external API call)
    const guidelineLookup = await lookupClinicalGuideline(
      patient_data.chief_complaint || 'general_assessment'
    );
    externalApiCalls.push(guidelineLookup.metadata);

    // Run diagnostic analysis
    const analysisResult = await diagnosticEngine.analyze(patient_data, analysis_options || {});

    // Generate analysis ID
    const analysis_id = `diag_${uuidv4().substr(0, 8)}`;

    // Save diagnosis to database
    const diagnosis = new Diagnosis({
      analysis_id,
      patient_id: patient_data.patient_id,
      encounter_id: patient_data.encounter_id,
      assessment_timestamp: new Date(),
      chief_complaint: patient_data.chief_complaint,
      symptoms: patient_data.symptoms,
      vital_signs: patient_data.vital_signs,
      differential_diagnosis: analysisResult.differential_diagnosis,
      risk_assessment: analysisResult.risk_assessment,
      recommended_workup: analysisResult.recommended_workup,
      clinical_alerts: analysisResult.clinical_alerts,
      explanation: analysisResult.explanation,
      missing_information: analysisResult.missing_information,
      validation_parameters: {
        ...analysisResult.validation_parameters,
        external_api_calls: externalApiCalls.length,
        external_api_success: externalApiCalls.every(call => call.api_name)
      },
      processing_time_ms: analysisResult.processing_time_ms,
      performed_by: req.headers['x-provider-id'] || 'system',
      reviewed: false
    });

    await diagnosis.save();

    const totalProcessingTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        analysis_id,
        patient_id: patient_data.patient_id,
        assessment_timestamp: diagnosis.assessment_timestamp.toISOString(),
        differential_diagnosis: analysisResult.differential_diagnosis,
        risk_assessment: analysisResult.risk_assessment,
        recommended_workup: analysisResult.recommended_workup,
        clinical_alerts: analysisResult.clinical_alerts,
        explanation: analysisResult.explanation,
        missing_information: analysisResult.missing_information,
        
        // CRITICAL VALIDATION PARAMETERS
        diagnostic_confidence: analysisResult.validation_parameters.diagnostic_confidence,
        clinical_accuracy_score: analysisResult.validation_parameters.clinical_accuracy_score,
        rule_engine_coverage: analysisResult.validation_parameters.rule_engine_coverage,
        external_api_calls: analysisResult.validation_parameters.external_api_calls,
        processing_complexity: analysisResult.validation_parameters.processing_complexity,
        medical_terminology_compliance: analysisResult.validation_parameters.medical_terminology_compliance,
        processing_time_ms: totalProcessingTime
      }
    });

    logger.info(`Diagnosis analysis completed: ${analysis_id} for patient ${patient_data.patient_id}`);

  } catch (error) {
    logger.error('Diagnosis analysis error:', error);
    next(error);
  }
};

/**
 * Get diagnosis by ID
 * GET /api/v1/diagnosis/:id
 */
exports.getDiagnosis = async (req, res, next) => {
  try {
    const { id } = req.params;

    const diagnosis = await Diagnosis.findOne({ analysis_id: id });

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DIAGNOSIS_NOT_FOUND',
          message: `Diagnosis with ID ${id} not found`,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({
      success: true,
      data: {
        analysis_id: diagnosis.analysis_id,
        patient_id: diagnosis.patient_id,
        assessment_timestamp: diagnosis.assessment_timestamp,
        chief_complaint: diagnosis.chief_complaint,
        differential_diagnosis: diagnosis.differential_diagnosis,
        risk_assessment: diagnosis.risk_assessment,
        recommended_workup: diagnosis.recommended_workup,
        clinical_alerts: diagnosis.clinical_alerts,
        validation_parameters: diagnosis.validation_parameters,
        reviewed: diagnosis.reviewed,
        reviewed_by: diagnosis.reviewed_by
      }
    });

  } catch (error) {
    logger.error('Get diagnosis error:', error);
    next(error);
  }
};

/**
 * Get patient diagnosis history
 * GET /api/v1/diagnosis/patient/:patientId
 */
exports.getPatientDiagnosisHistory = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { limit = 10 } = req.query;

    const diagnoses = await Diagnosis.find({ patient_id: patientId })
      .sort({ assessment_timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      data: {
        patient_id: patientId,
        total_diagnoses: diagnoses.length,
        diagnoses
      }
    });

  } catch (error) {
    logger.error('Get patient diagnosis history error:', error);
    next(error);
  }
};

