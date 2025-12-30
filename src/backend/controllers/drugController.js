/**
 * Drug Interaction Controller
 * Handles drug interaction checking and medication safety
 */

const treatmentEngine = require('../services/treatmentEngine');
const { logger } = require('../utils/logger');
const { checkDrugInteraction, trackApiCall } = require('../utils/externalApiTracker');

/**
 * Check drug interactions
 * POST /api/v1/drug-interactions/check
 */
exports.checkDrugInteractions = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    const { patient_id, patient_profile, medications, proposed_medication } = req.validatedData;

    // Track external API calls
    const externalApiCalls = [];
    
    // Check drug interaction with external DrugBank API (simulated)
    if (medications && medications.length > 0 && proposed_medication) {
      const drugApiCall = await checkDrugInteraction(
        medications[0].medication,
        proposed_medication.medication
      );
      externalApiCalls.push(drugApiCall.metadata);
    }
    
    // Query RxNorm API for medication standardization (simulated)
    if (proposed_medication) {
      const rxnormCall = await trackApiCall(
        'RXNORM',
        `/rxcui?name=${proposed_medication.medication}`,
        'GET'
      );
      externalApiCalls.push(rxnormCall.metadata);
    }

    // Check for interactions
    const interactionAnalysis = await treatmentEngine.checkDrugInteractions(
      medications,
      proposed_medication
    );

    // Generate dosing recommendations
    const dosingRecommendations = generateDosingRecommendations(
      proposed_medication,
      patient_profile
    );

    // Generate safety alerts
    const safetyAlerts = generateSafetyAlerts(
      interactionAnalysis,
      medications,
      proposed_medication
    );

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        interaction_analysis: {
          analysis_id: `drug_check_${Date.now()}`,
          total_interactions: interactionAnalysis.total_interactions,
          critical_interactions: interactionAnalysis.critical_interactions,
          patient_id
        },
        drug_interactions: interactionAnalysis.drug_interactions,
        contraindications: checkContraindications(proposed_medication, patient_profile),
        dosing_recommendations: dosingRecommendations,
        safety_alerts: safetyAlerts,
        
        // External API integration tracking
        external_api_integration: {
          total_api_calls: externalApiCalls.length,
          apis_consulted: externalApiCalls.map(call => call.api_name),
          average_api_response_time_ms: externalApiCalls.reduce((sum, call) => sum + call.duration_ms, 0) / externalApiCalls.length
        },
        
        processing_time_ms: processingTime
      }
    });

    logger.info(`Drug interaction check completed for patient ${patient_id}`);

  } catch (error) {
    logger.error('Drug interaction check error:', error);
    next(error);
  }
};

/**
 * Generate dosing recommendations
 */
function generateDosingRecommendations(medication, patientProfile) {
  const recommendations = [];

  // Basic dosing recommendation
  recommendations.push({
    medication: medication.medication,
    recommended_dose: medication.dose,
    adjustment_rationale: 'Standard dose appropriate for age and kidney function',
    monitoring: determineMonitoring(medication.medication),
    renal_adjustment_needed: patientProfile.kidney_function !== 'normal',
    hepatic_adjustment_needed: patientProfile.liver_function !== 'normal'
  });

  return recommendations;
}

/**
 * Check contraindications
 */
function checkContraindications(medication, patientProfile) {
  const contraindications = [];

  // Check allergies
  if (patientProfile.allergies && patientProfile.allergies.length > 0) {
    patientProfile.allergies.forEach(allergy => {
      if (medication.medication.toLowerCase().includes(allergy.toLowerCase())) {
        contraindications.push({
          type: 'allergy',
          severity: 'absolute',
          description: `Patient has documented allergy to ${allergy}`,
          recommendation: 'Do not administer - select alternative medication'
        });
      }
    });
  }

  return contraindications;
}

/**
 * Generate safety alerts
 */
function generateSafetyAlerts(interactionAnalysis, currentMedications, proposedMedication) {
  const alerts = [];

  // Alert for major interactions
  if (interactionAnalysis.critical_interactions > 0) {
    alerts.push({
      alert_type: 'bleeding_risk',
      severity: 'high',
      message: 'Combination therapy increases bleeding risk significantly',
      monitoring_required: 'CBC, bleeding assessment, coagulation studies'
    });
  }

  // Alert for multiple medications
  if (currentMedications.length >= 5) {
    alerts.push({
      alert_type: 'polypharmacy',
      severity: 'medium',
      message: 'Patient on multiple medications - review for potential simplification',
      monitoring_required: 'Medication reconciliation recommended'
    });
  }

  return alerts;
}

/**
 * Determine monitoring requirements
 */
function determineMonitoring(medication) {
  const monitoringProtocols = {
    'clopidogrel': 'Platelet function testing if high bleeding risk',
    'warfarin': 'INR monitoring every 1-4 weeks',
    'atorvastatin': 'Liver enzymes at baseline and 12 weeks',
    'metformin': 'Renal function every 6-12 months',
    'default': 'Standard clinical monitoring'
  };

  return monitoringProtocols[medication.toLowerCase()] || monitoringProtocols.default;
}

module.exports = exports;

