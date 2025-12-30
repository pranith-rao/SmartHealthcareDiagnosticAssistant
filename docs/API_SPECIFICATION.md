# Team CursorMinds - API Specification

**Healthcare Diagnostic Assistant - RESTful API Documentation**

Base URL: `http://localhost:3000/api/v1`  
Version: 1.0.0  
Port: 3000 (as required by submission guidelines)

---

## Authentication

All requests should include the following headers:

```http
X-Provider-ID: demo_provider_001
X-Facility-ID: demo_facility_001
Content-Type: application/json
```

**Sample Authentication Values for Testing:**
- **Provider ID**: `demo_provider_001` (use this for all test requests)
- **Facility ID**: `demo_facility_001` (use this for all test requests)

**Note**: The API validates these headers but does not require password authentication for demo purposes. Simply include the headers above in all requests.

---

## Health Check

### GET /health

Check API health status

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Healthcare Diagnostic Assistant API is healthy",
  "timestamp": "2025-10-22T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "diagnostic_engine": "operational",
    "rule_engine": "operational"
  }
}
```

---

## Patient Management APIs

### POST /patients/register

Register a new patient

**Request Body:**
```json
{
  "patient_data": {
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1980-05-15",
    "gender": "male",
    "email": "john.doe@example.com",
    "phone": "+1-555-0101"
  }
}
```

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "patient_id": "pat_abc12345",
    "medical_record_number": "MRN1730123456",
    "registration_timestamp": "2025-10-22T14:30:00Z",
    "hipaa_compliance_verified": true,
    "data_encryption_status": "encrypted",
    "audit_log_created": true,
    "validation_score": 95.5,
    "security_level": "high",
    "compliance_status": "hipaa_compliant",
    "processing_time_ms": 150,
    "error_count": 0
  }
}
```

### GET /patients/:id

Retrieve patient information

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "patient": {
      "patient_id": "pat_abc12345",
      "medical_record_number": "MRN1730123456",
      "demographics": {
        "first_name": "John",
        "last_name": "Doe",
        "age": 45,
        "gender": "male"
      },
      "medical_history": [],
      "current_medications": [],
      "allergies": []
    },
    "data_integrity_score": 98.2,
    "access_authorization_level": "full",
    "phi_protection_status": "compliant",
    "cache_efficiency": 85.0,
    "data_freshness_minutes": 5,
    "processing_time_ms": 45
  }
}
```

### GET /patients/:id/risk-profile

Get comprehensive risk assessment profile for patient

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "patient_id": "pat_abc12345",
    "risk_profile_id": "risk_789",
    "generated_at": "2025-10-22T14:30:00Z",
    "cardiovascular_risk": {
      "ascvd_10_year_risk": 12.5,
      "risk_category": "moderate",
      "risk_factors": [
        "hypertension",
        "diabetes",
        "smoking_history"
      ],
      "framingham_score": 15.2,
      "recommendations": [
        "Statin therapy indicated",
        "Blood pressure control",
        "Smoking cessation"
      ]
    },
    "diabetes_risk": {
      "risk_score": 8.5,
      "risk_category": "high",
      "a1c_level": 6.8,
      "screening_recommended": true
    },
    "bleeding_risk": {
      "has_bled_score": 2,
      "risk_category": "moderate",
      "factors": ["age", "hypertension"]
    },
    "overall_health_score": 72.5,
    "mortality_risk": {
      "1_year": 2.5,
      "5_year": 8.3,
      "10_year": 15.7
    },
    "preventive_recommendations": [
      "Annual cardiovascular screening",
      "Diabetes management",
      "Lifestyle modifications"
    ],
    "processing_time_ms": 320
  }
}
```

---

## Diagnosis APIs

### POST /diagnosis/analyze

Analyze patient symptoms and generate differential diagnosis

**Request Body:**
```json
{
  "patient_data": {
    "patient_id": "pat_abc12345",
    "demographics": {
      "age": 45,
      "gender": "male"
    },
    "chief_complaint": "Chest pain and shortness of breath for 2 hours",
    "symptoms": [
      {
        "symptom": "chest_pain",
        "severity": 8,
        "duration_hours": 2,
        "character": "crushing",
        "radiation": "left_arm"
      }
    ],
    "vital_signs": {
      "blood_pressure": "160/95",
      "heart_rate": 110,
      "respiratory_rate": 22,
      "temperature_celsius": 36.8,
      "oxygen_saturation": 94
    },
    "medical_history": ["hypertension", "diabetes_type_2"],
    "current_medications": ["lisinopril 10mg", "metformin 500mg"]
  },
  "analysis_options": {
    "include_risk_stratification": true,
    "emergency_assessment": true
  }
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "analysis_id": "diag_xyz789",
    "patient_id": "pat_abc12345",
    "assessment_timestamp": "2025-10-22T14:35:00Z",
    "differential_diagnosis": [
      {
        "diagnosis": "acute_myocardial_infarction",
        "probability": 0.78,
        "icd10_code": "I21.9",
        "severity": "high",
        "urgency": "immediate",
        "evidence": [
          "crushing chest pain",
          "radiation to left arm",
          "cardiovascular risk factors"
        ],
        "recommended_actions": [
          "Immediate ECG",
          "Cardiac biomarkers (troponin)",
          "Cardiology consultation STAT"
        ]
      }
    ],
    "risk_assessment": {
      "emergency_severity": "high",
      "triage_level": "level_1_resuscitation",
      "time_sensitive": true,
      "mortality_risk": "moderate_to_high"
    },
    "recommended_workup": [
      {
        "test": "12_lead_ecg",
        "urgency": "immediate",
        "rationale": "Rule out acute MI"
      }
    ],
    "clinical_alerts": [
      {
        "alert_type": "critical",
        "message": "High suspicion for acute coronary syndrome",
        "action_required": "Emergency cardiology consultation"
      }
    ],
    "diagnostic_confidence": 87.5,
    "clinical_accuracy_score": 92.3,
    "rule_engine_coverage": 95.0,
    "external_api_calls": 3,
    "processing_complexity": "high",
    "medical_terminology_compliance": true,
    "processing_time_ms": 850
  }
}
```

### GET /diagnosis/:id

Retrieve diagnosis by ID

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "analysis_id": "diag_xyz789",
    "patient_id": "pat_abc12345",
    "assessment_timestamp": "2025-10-22T14:35:00Z",
    "differential_diagnosis": [...],
    "risk_assessment": {...},
    "validation_parameters": {...}
  }
}
```

---

## Medical Imaging APIs

### POST /imaging/analyze

Analyze medical images

**Request Body:**
```json
{
  "patient_id": "pat_abc12345",
  "study_type": "chest_xray",
  "modality": "CR",
  "body_part": "chest",
  "view": "pa_lateral",
  "clinical_indication": "chest pain, rule out pneumonia"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "analysis_id": "analysis_456",
    "study_id": "study_123",
    "timestamp": "2025-10-22T14:40:00Z",
    "findings": [
      {
        "finding_id": "finding_001",
        "description": "Mild consolidation in right lower lobe",
        "anatomical_location": "right_lower_lobe",
        "severity": "mild",
        "confidence": 0.89,
        "differential_diagnosis": [
          {
            "diagnosis": "pneumonia",
            "probability": 0.78,
            "icd10_code": "J18.9"
          }
        ]
      }
    ],
    "overall_assessment": {
      "normal_study": false,
      "critical_findings": false,
      "recommendation": "Clinical correlation recommended",
      "urgency_level": "routine"
    },
    "image_quality_score": 94.7,
    "detection_accuracy": 89.2,
    "false_positive_rate": 5.8,
    "annotation_precision": 91.5,
    "processing_efficiency": 78.3,
    "standard_compliance": "dicom_3.0",
    "processing_time_seconds": 12
  }
}
```

### POST /imaging/upload-dicom

Upload DICOM medical images for processing

**Request Body (Multipart):**
- `dicom_file`: Binary DICOM file
- `metadata`: JSON string with study information

**Metadata JSON:**
```json
{
  "patient_id": "pat_abc12345",
  "study_type": "ct_scan",
  "facility_id": "facility_123",
  "acquisition_date": "2025-10-22T14:30:00Z"
}
```

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "upload_id": "upload_789",
    "study_id": "study_123",
    "file_size_bytes": 2048576,
    "dicom_metadata": {
      "modality": "CT",
      "study_description": "Chest CT with contrast",
      "series_count": 1,
      "instance_count": 120
    },
    "upload_timestamp": "2025-10-22T14:32:00Z",
    "processing_status": "queued",
    "estimated_processing_time_seconds": 30,
    "dicom_validation": "passed",
    "standard_compliance": "dicom_3.0"
  }
}
```

### GET /imaging/quality-check/:study_id

Check medical image quality for diagnostic adequacy

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "study_id": "study_123",
    "quality_check_id": "qc_456",
    "timestamp": "2025-10-22T14:35:00Z",
    "overall_quality": "acceptable",
    "quality_score": 87.5,
    "quality_metrics": {
      "image_resolution": {
        "score": 92.0,
        "status": "excellent",
        "details": "Adequate for diagnostic interpretation"
      },
      "contrast": {
        "score": 85.0,
        "status": "good",
        "details": "Good tissue differentiation"
      },
      "noise_level": {
        "score": 88.0,
        "status": "good",
        "details": "Acceptable noise levels"
      },
      "artifacts": {
        "score": 85.0,
        "status": "good",
        "motion_artifacts": false,
        "metal_artifacts": false
      },
      "positioning": {
        "score": 90.0,
        "status": "excellent",
        "details": "Proper anatomical positioning"
      }
    },
    "diagnostic_adequacy": true,
    "recommendations": [
      "Image quality acceptable for diagnostic interpretation"
    ],
    "processing_time_ms": 250
  }
}
```

---

## Drug Interaction APIs

### POST /drug-interactions/check

Check for drug interactions

**Request Body:**
```json
{
  "patient_id": "pat_abc12345",
  "patient_profile": {
    "age": 45,
    "weight_kg": 75,
    "kidney_function": "normal",
    "allergies": ["penicillin"]
  },
  "medications": [
    {
      "medication": "aspirin",
      "dose": "81mg",
      "frequency": "daily",
      "route": "oral"
    }
  ],
  "proposed_medication": {
    "medication": "warfarin",
    "dose": "5mg",
    "frequency": "daily"
  }
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "interaction_analysis": {
      "total_interactions": 1,
      "critical_interactions": 1,
      "patient_id": "pat_abc12345"
    },
    "drug_interactions": [
      {
        "severity": "major",
        "drugs_involved": ["aspirin", "warfarin"],
        "mechanism": "Increased bleeding risk",
        "recommendations": [
          "Monitor INR closely",
          "Watch for bleeding signs"
        ],
        "monitoring_required": "INR every 3-5 days"
      }
    ],
    "dosing_recommendations": [...],
    "safety_alerts": [...],
    "processing_time_ms": 120
  }
}
```

---

## Treatment Planning APIs

### POST /treatment/plan-generation

Generate evidence-based treatment plan

**Request Body:**
```json
{
  "patient_id": "pat_abc12345",
  "primary_diagnosis": "acute_myocardial_infarction",
  "secondary_diagnoses": ["diabetes_type_2", "hypertension"],
  "patient_factors": {
    "age": 45,
    "comorbidities": ["diabetes", "hypertension"]
  }
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "treatment_plan_id": "plan_def456",
    "patient_id": "pat_abc12345",
    "created_at": "2025-10-22T15:00:00Z",
    "acute_management": {
      "immediate_interventions": [
        {
          "intervention": "dual_antiplatelet_therapy",
          "medications": ["aspirin 325mg", "clopidogrel 75mg"],
          "duration": "minimum_12_months"
        }
      ]
    },
    "long_term_management": {...},
    "medications": [...],
    "lifestyle_modifications": [...],
    "follow_up_schedule": [...],
    "plan_completeness": 96.8,
    "evidence_based_score": 92.5,
    "safety_check_score": 96.8,
    "guideline_compliance": 94.3,
    "processing_time_ms": 450
  }
}
```

---

## Clinical Report APIs

### POST /reports/clinical-summary

Generate clinical summary report

**Request Body:**
```json
{
  "report_type": "diagnostic_summary",
  "patient_id": "pat_abc12345",
  "encounter_id": "enc_67890",
  "date_range": {
    "start_date": "2025-10-22",
    "end_date": "2025-10-22"
  },
  "include_sections": [
    "clinical_presentation",
    "diagnostic_workup",
    "treatment_plan",
    "outcomes"
  ]
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "report_id": "report_ghi789",
    "patient_id": "pat_abc12345",
    "generated_at": "2025-10-22T15:30:00Z",
    "report_summary": {
      "patient_name": "John Smith",
      "encounter_date": "2025-10-22",
      "primary_diagnosis": "Acute Myocardial Infarction"
    },
    "download_url": "http://localhost:3000/api/v1/reports/download/report_ghi789",
    "report_sections": [...],
    "report_completeness": 96.8,
    "clinical_coherence": 93.5,
    "regulatory_compliance_score": 98.0,
    "generation_efficiency": 82.7,
    "data_correlation_accuracy": 94.2,
    "audit_trail_completeness": 100.0,
    "processing_time_ms": 520
  }
}
```

---

## Clinical Guidelines APIs

### GET /guidelines/:condition

Retrieve evidence-based clinical guidelines for a specific condition

**Path Parameters:**
- `condition` (string, required): Medical condition (e.g., "acute_myocardial_infarction", "diabetes_type_2")

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "guideline_id": "guide_123",
    "condition": "acute_myocardial_infarction",
    "condition_icd10": "I21.9",
    "last_updated": "2025-10-01T00:00:00Z",
    "guideline_version": "2025",
    "source_organizations": [
      "American Heart Association",
      "American College of Cardiology"
    ],
    "evidence_level": "Grade_A",
    "diagnostic_criteria": {
      "clinical_presentation": [
        "Chest pain lasting >20 minutes",
        "Dyspnea",
        "Radiation to arm/jaw"
      ],
      "laboratory_findings": [
        "Elevated cardiac troponin",
        "Elevated CK-MB"
      ],
      "imaging_findings": [
        "ST elevation on ECG",
        "Wall motion abnormalities"
      ]
    },
    "treatment_guidelines": {
      "immediate_management": [
        {
          "intervention": "Aspirin 325mg",
          "evidence_level": "Class_I_Level_A",
          "timing": "Immediately"
        },
        {
          "intervention": "Dual antiplatelet therapy",
          "evidence_level": "Class_I_Level_A",
          "duration": "12 months minimum"
        }
      ],
      "long_term_management": [
        {
          "intervention": "High-intensity statin",
          "evidence_level": "Class_I_Level_A",
          "target": "LDL < 70 mg/dL"
        }
      ]
    },
    "monitoring_recommendations": [
      "ECG monitoring for 24-48 hours",
      "Serial troponin measurements",
      "Echocardiography"
    ],
    "prognosis": {
      "risk_stratification": "Use GRACE or TIMI scores",
      "expected_outcomes": "Variable based on intervention timing"
    },
    "references": [
      {
        "citation": "2023 AHA/ACC Guideline for the Management of STEMI",
        "pubmed_id": "PMID12345678",
        "url": "https://www.ahajournals.org/doi/full/..."
      }
    ],
    "processing_time_ms": 85
  }
}
```

---

## Analytics APIs

### GET /analytics/population-health

Get population health analytics and trends

**Query Parameters:**
- `date_range` (string, optional): Time period (e.g., "30d", "90d", "1y")
- `facility_id` (string, optional): Filter by facility
- `demographics` (string, optional): Filter by demographic group

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "analytics_id": "analytics_456",
    "generated_at": "2025-10-22T15:00:00Z",
    "time_period": {
      "start_date": "2024-10-22",
      "end_date": "2025-10-22",
      "duration_days": 365
    },
    "patient_demographics": {
      "total_patients": 15420,
      "age_distribution": {
        "0-17": 1850,
        "18-44": 4230,
        "45-64": 5120,
        "65+": 4220
      },
      "gender_distribution": {
        "male": 7650,
        "female": 7740,
        "other": 30
      }
    },
    "disease_prevalence": [
      {
        "condition": "hypertension",
        "icd10_code": "I10",
        "patient_count": 4250,
        "prevalence_percentage": 27.6,
        "trend": "increasing"
      },
      {
        "condition": "diabetes_type_2",
        "icd10_code": "E11",
        "patient_count": 3120,
        "prevalence_percentage": 20.2,
        "trend": "stable"
      },
      {
        "condition": "acute_myocardial_infarction",
        "icd10_code": "I21",
        "patient_count": 285,
        "prevalence_percentage": 1.8,
        "trend": "decreasing"
      }
    ],
    "utilization_metrics": {
      "total_encounters": 52340,
      "emergency_visits": 4520,
      "imaging_studies": 8750,
      "lab_tests": 125600
    },
    "quality_metrics": {
      "diagnostic_accuracy_rate": 92.5,
      "treatment_adherence_rate": 87.3,
      "readmission_rate_30_day": 8.5,
      "patient_satisfaction_score": 88.7
    },
    "risk_stratification": {
      "high_risk_patients": 2340,
      "moderate_risk_patients": 5620,
      "low_risk_patients": 7460
    },
    "outcome_trends": {
      "mortality_rate": 1.2,
      "complication_rate": 3.8,
      "improvement_in_chronic_conditions": 65.3
    },
    "resource_utilization": {
      "average_length_of_stay_days": 3.5,
      "icu_admission_rate": 5.2,
      "surgical_intervention_rate": 12.4
    },
    "cost_analysis": {
      "total_healthcare_costs": 45600000,
      "cost_per_patient": 2958,
      "preventable_cost_savings": 3200000
    },
    "predictive_insights": [
      "15% increase in diabetes cases expected next quarter",
      "Cardiovascular disease prevention program showing positive results",
      "Need for additional chronic disease management resources"
    ],
    "processing_time_ms": 1250
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "timestamp": "2025-10-22T15:30:00Z"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed (400)
- `PATIENT_NOT_FOUND` - Patient not found (404)
- `DIAGNOSIS_NOT_FOUND` - Diagnosis not found (404)
- `INTERNAL_SERVER_ERROR` - Server error (500)

---

## Critical Validation Parameters

All API responses include validation parameters as required by submission guidelines:

- `processing_time_ms` - Response time benchmark
- `diagnostic_confidence` - Algorithm confidence (0-100)
- `validation_score` - Data completeness (0-100)
- `security_level` - Security classification
- `compliance_status` - Regulatory compliance
- Plus 10+ additional metrics per endpoint

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Testing

Use the provided sample data in `/data` directory for testing all endpoints.

**Team CursorMinds © 2025**

