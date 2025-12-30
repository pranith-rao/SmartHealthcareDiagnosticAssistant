/**
 * Clinical Rule Engine
 * Implements rule-based medical decision trees and clinical scoring algorithms
 */

const { VITAL_SIGNS_RANGES, LAB_REFERENCE_RANGES, TRIAGE_LEVELS } = require('../config/constants');

class RuleEngine {
  /**
   * Evaluate vital signs and classify abnormalities
   */
  evaluateVitalSigns(vitalSigns) {
    const evaluations = [];
    let overallRisk = 'low';

    // Blood Pressure Evaluation
    if (vitalSigns.blood_pressure) {
      const [systolic, diastolic] = vitalSigns.blood_pressure.split('/').map(Number);
      
      if (systolic >= VITAL_SIGNS_RANGES.blood_pressure.systolic.critical[0]) {
        evaluations.push({
          parameter: 'blood_pressure',
          status: 'critical',
          value: vitalSigns.blood_pressure,
          classification: 'hypertensive_crisis',
          risk_level: 'high'
        });
        overallRisk = 'high';
      } else if (systolic >= VITAL_SIGNS_RANGES.blood_pressure.systolic.high[0]) {
        evaluations.push({
          parameter: 'blood_pressure',
          status: 'abnormal',
          value: vitalSigns.blood_pressure,
          classification: 'stage_2_hypertension',
          risk_level: 'moderate'
        });
        if (overallRisk === 'low') overallRisk = 'moderate';
      }
    }

    // Heart Rate Evaluation
    if (vitalSigns.heart_rate) {
      const hr = vitalSigns.heart_rate;
      if (hr >= VITAL_SIGNS_RANGES.heart_rate.severe_tachycardia[0]) {
        evaluations.push({
          parameter: 'heart_rate',
          status: 'critical',
          value: hr,
          classification: 'severe_tachycardia',
          risk_level: 'high'
        });
        overallRisk = 'high';
      } else if (hr >= VITAL_SIGNS_RANGES.heart_rate.tachycardia[0]) {
        evaluations.push({
          parameter: 'heart_rate',
          status: 'abnormal',
          value: hr,
          classification: 'tachycardia',
          risk_level: 'moderate'
        });
        if (overallRisk === 'low') overallRisk = 'moderate';
      }
    }

    // Oxygen Saturation Evaluation
    if (vitalSigns.oxygen_saturation) {
      const o2 = vitalSigns.oxygen_saturation;
      if (o2 < VITAL_SIGNS_RANGES.oxygen_saturation.severe_hypoxia[1]) {
        evaluations.push({
          parameter: 'oxygen_saturation',
          status: 'critical',
          value: o2,
          classification: 'severe_hypoxia',
          risk_level: 'high'
        });
        overallRisk = 'high';
      } else if (o2 < VITAL_SIGNS_RANGES.oxygen_saturation.moderate_hypoxia[1]) {
        evaluations.push({
          parameter: 'oxygen_saturation',
          status: 'abnormal',
          value: o2,
          classification: 'moderate_hypoxia',
          risk_level: 'moderate'
        });
        if (overallRisk === 'low') overallRisk = 'moderate';
      }
    }

    return { evaluations, overallRisk };
  }

  /**
   * Calculate CHADS2 score for stroke risk in atrial fibrillation
   */
  calculateCHADS2Score(patientData) {
    let score = 0;
    const factors = [];

    // C - Congestive heart failure
    if (patientData.medical_history?.includes('congestive_heart_failure')) {
      score += 1;
      factors.push('Congestive heart failure');
    }

    // H - Hypertension
    if (patientData.medical_history?.includes('hypertension')) {
      score += 1;
      factors.push('Hypertension');
    }

    // A - Age >= 75
    if (patientData.demographics?.age >= 75) {
      score += 1;
      factors.push('Age ≥ 75');
    }

    // D - Diabetes
    if (patientData.medical_history?.includes('diabetes_type_2') || 
        patientData.medical_history?.includes('diabetes_type_1')) {
      score += 1;
      factors.push('Diabetes');
    }

    // S2 - Prior Stroke or TIA
    if (patientData.medical_history?.includes('stroke') || 
        patientData.medical_history?.includes('tia')) {
      score += 2;
      factors.push('Prior Stroke/TIA');
    }

    // Risk stratification
    let riskLevel = 'low';
    let annualStrokeRisk = '1.9%';
    
    if (score >= 5) {
      riskLevel = 'high';
      annualStrokeRisk = '12.5%';
    } else if (score >= 3) {
      riskLevel = 'moderate';
      annualStrokeRisk = '5.9%';
    }

    return {
      score,
      factors,
      riskLevel,
      annualStrokeRisk,
      anticoagulationRecommended: score >= 2
    };
  }

  /**
   * Acute Coronary Syndrome (ACS) Risk Assessment
   */
  assessACSRisk(symptoms, vitalSigns, demographics, medicalHistory) {
    let riskScore = 0;
    const riskFactors = [];

    // Check for typical ACS symptoms
    const chestPainSymptom = symptoms.find(s => s.symptom.toLowerCase().includes('chest_pain'));
    
    if (chestPainSymptom) {
      // Typical chest pain characteristics
      if (chestPainSymptom.character?.includes('crushing') || 
          chestPainSymptom.character?.includes('pressure')) {
        riskScore += 3;
        riskFactors.push('Typical chest pain character');
      }

      // Radiation to arm
      if (chestPainSymptom.radiation?.includes('arm') || 
          chestPainSymptom.radiation?.includes('jaw')) {
        riskScore += 2;
        riskFactors.push('Pain radiation to arm/jaw');
      }

      // High severity
      if (chestPainSymptom.severity >= 7) {
        riskScore += 2;
        riskFactors.push('Severe pain (≥7/10)');
      }
    }

    // Age factor
    if (demographics.age >= 65) {
      riskScore += 2;
      riskFactors.push('Age ≥ 65');
    } else if (demographics.age >= 45 && demographics.gender === 'male') {
      riskScore += 1;
      riskFactors.push('Male ≥ 45 years');
    }

    // Medical history risk factors
    const acsRiskConditions = [
      'hypertension',
      'diabetes_type_2',
      'hyperlipidemia',
      'family_history_cad',
      'smoking_history'
    ];

    acsRiskConditions.forEach(condition => {
      if (medicalHistory?.includes(condition)) {
        riskScore += 1;
        riskFactors.push(condition.replace(/_/g, ' '));
      }
    });

    // Vital signs
    if (vitalSigns.heart_rate > 100) {
      riskScore += 1;
      riskFactors.push('Tachycardia');
    }

    // Determine risk level
    let riskLevel = 'low';
    let probability = 0.15;
    let urgency = 'routine';

    if (riskScore >= 8) {
      riskLevel = 'high';
      probability = 0.78;
      urgency = 'immediate';
    } else if (riskScore >= 5) {
      riskLevel = 'moderate';
      probability = 0.45;
      urgency = 'urgent';
    } else if (riskScore >= 3) {
      riskLevel = 'low-moderate';
      probability = 0.25;
      urgency = 'semi-urgent';
    }

    return {
      riskScore,
      riskFactors,
      riskLevel,
      probability,
      urgency
    };
  }

  /**
   * Sepsis screening (qSOFA score)
   */
  screenForSepsis(vitalSigns) {
    let score = 0;
    const criteria = [];

    // Respiratory rate >= 22
    if (vitalSigns.respiratory_rate >= 22) {
      score += 1;
      criteria.push('Respiratory rate ≥ 22');
    }

    // Altered mentation (simplified check)
    // In real system, would use GCS score

    // Systolic BP <= 100
    if (vitalSigns.blood_pressure) {
      const systolic = parseInt(vitalSigns.blood_pressure.split('/')[0]);
      if (systolic <= 100) {
        score += 1;
        criteria.push('Systolic BP ≤ 100 mmHg');
      }
    }

    const risk = score >= 2 ? 'high' : 'low';
    const recommendation = score >= 2 
      ? 'High risk for sepsis - immediate evaluation and lactate measurement required'
      : 'Low risk for sepsis based on qSOFA criteria';

    return {
      score,
      criteria,
      risk,
      recommendation
    };
  }

  /**
   * Determine triage level based on symptoms and vital signs
   */
  determineTriageLevel(symptoms, vitalSigns, assessments) {
    // Check for critical findings
    const hasCriticalVitals = assessments.vitalSigns?.overallRisk === 'high';
    const hasChestPain = symptoms.some(s => s.symptom.includes('chest_pain'));
    const hasSevereSymptoms = symptoms.some(s => s.severity >= 8);

    if (hasCriticalVitals || (hasChestPain && assessments.acsRisk?.riskLevel === 'high')) {
      return {
        level: 'level_1_resuscitation',
        ...TRIAGE_LEVELS.level_1_resuscitation,
        rationale: 'Critical vital signs or high-risk acute coronary syndrome'
      };
    }

    if (assessments.acsRisk?.urgency === 'immediate' || hasSevereSymptoms) {
      return {
        level: 'level_2_emergent',
        ...TRIAGE_LEVELS.level_2_emergent,
        rationale: 'Emergent symptoms requiring immediate evaluation'
      };
    }

    if (assessments.vitalSigns?.overallRisk === 'moderate') {
      return {
        level: 'level_3_urgent',
        ...TRIAGE_LEVELS.level_3_urgent,
        rationale: 'Abnormal vital signs requiring urgent assessment'
      };
    }

    return {
      level: 'level_4_less_urgent',
      ...TRIAGE_LEVELS.level_4_less_urgent,
      rationale: 'Stable patient with non-urgent symptoms'
    };
  }

  /**
   * Calculate overall diagnostic confidence
   */
  calculateDiagnosticConfidence(assessments, dataCompleteness) {
    let baseConfidence = 70;

    // Adjust based on data completeness
    baseConfidence += dataCompleteness * 0.2;

    // Adjust based on risk assessment consistency
    if (assessments.acsRisk && assessments.acsRisk.riskScore >= 5) {
      baseConfidence += 10;
    }

    // Adjust based on vital signs clarity
    if (assessments.vitalSigns && assessments.vitalSigns.evaluations.length > 0) {
      baseConfidence += 5;
    }

    // Cap confidence
    return Math.min(95, Math.max(60, baseConfidence));
  }
}

module.exports = new RuleEngine();

