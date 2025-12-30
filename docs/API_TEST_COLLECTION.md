# Team CursorMinds - API Test Collection

**Healthcare Diagnostic Assistant - API Test Commands**

This document provides curl commands to test all API endpoints. Copy and paste these commands into your terminal to test the API.

**Prerequisites:**
- Application must be running on `http://localhost:3000`
- Run the batch file first: `Team_CursorMinds_Submission.bat`

---

## Authentication Headers

All requests use these headers:
```
X-Provider-ID: demo_provider_001
X-Facility-ID: demo_facility_001
Content-Type: application/json
```

---

## Test Commands

### 1. Health Check

**Test if API is running:**
```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001"
```

**Expected Response:** `200 OK` with system status

---

### 2. Register Patient

**Create a new patient:**
```bash
curl -X POST http://localhost:3000/api/v1/patients/register \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"patient_data\":{\"first_name\":\"John\",\"last_name\":\"Doe\",\"date_of_birth\":\"1980-05-15\",\"gender\":\"male\",\"email\":\"john.doe@example.com\",\"phone\":\"+1-555-0101\"}}"
```

**Expected Response:** `201 Created` with patient ID and validation parameters

---

### 3. Get All Patients

**Retrieve patient list:**
```bash
curl -X GET "http://localhost:3000/api/v1/patients?limit=10&status=active" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001"
```

**Expected Response:** `200 OK` with array of patients

---

### 4. Get Specific Patient

**Get patient by ID (replace {patient_id} with actual ID from registration):**
```bash
curl -X GET http://localhost:3000/api/v1/patients/pat_demo_001 \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001"
```

**Expected Response:** `200 OK` with patient details

---

### 5. Clinical Diagnosis Analysis

**Analyze patient symptoms and generate differential diagnosis:**
```bash
curl -X POST http://localhost:3000/api/v1/diagnosis/analyze \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"patient_data\":{\"patient_id\":\"pat_demo_001\",\"encounter_id\":\"enc_demo_001\",\"demographics\":{\"age\":45,\"gender\":\"male\",\"ethnicity\":\"caucasian\"},\"chief_complaint\":\"Chest pain and shortness of breath for 2 hours\",\"symptoms\":[{\"symptom\":\"chest_pain\",\"severity\":8,\"duration_hours\":2,\"character\":\"crushing\",\"radiation\":\"left_arm\"}],\"vital_signs\":{\"blood_pressure\":\"160/95\",\"heart_rate\":110,\"respiratory_rate\":22,\"temperature_celsius\":36.8,\"oxygen_saturation\":94},\"medical_history\":[\"hypertension\",\"diabetes_type_2\"],\"current_medications\":[\"lisinopril 10mg daily\",\"metformin 500mg twice daily\"]},\"analysis_options\":{\"include_risk_stratification\":true,\"emergency_assessment\":true}}"
```

**Expected Response:** `200 OK` with differential diagnosis, clinical alerts, and recommendations

---

### 6. Medical Imaging Analysis

**Analyze medical imaging study:**
```bash
curl -X POST http://localhost:3000/api/v1/imaging/analyze \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"patient_id\":\"pat_demo_001\",\"study_type\":\"chest_xray\",\"modality\":\"CR\",\"body_part\":\"chest\",\"view\":\"pa_lateral\",\"clinical_indication\":\"chest pain, rule out pneumonia\"}"
```

**Expected Response:** `200 OK` with imaging findings and quality metrics

---

### 7. Treatment Plan Generation

**Generate treatment plan:**
```bash
curl -X POST http://localhost:3000/api/v1/treatment/plan \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"patient_id\":\"pat_demo_001\",\"diagnosis_id\":\"diag_demo_001\",\"primary_diagnosis\":{\"diagnosis\":\"acute_coronary_syndrome\",\"icd10_code\":\"I24.9\",\"severity\":\"high\"},\"patient_context\":{\"age\":45,\"comorbidities\":[\"hypertension\",\"diabetes_type_2\"],\"current_medications\":[\"lisinopril 10mg daily\",\"metformin 500mg twice daily\"],\"allergies\":[\"penicillin\"],\"renal_function\":\"normal\",\"hepatic_function\":\"normal\"}}"
```

**Expected Response:** `200 OK` with treatment recommendations

---

### 8. Clinical Guidelines

**Get treatment guidelines for a condition:**
```bash
curl -X POST http://localhost:3000/api/v1/treatment/guidelines \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"condition\":\"hypertension\",\"patient_factors\":{\"age\":45,\"comorbidities\":[\"diabetes_type_2\"],\"contraindications\":[]}}"
```

**Expected Response:** `200 OK` with evidence-based guidelines

---

### 9. Drug Interaction Check

**Check for drug interactions:**
```bash
curl -X POST http://localhost:3000/api/v1/drugs/interactions \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"medications\":[{\"drug_name\":\"aspirin\",\"dosage\":\"81mg\",\"frequency\":\"daily\"},{\"drug_name\":\"warfarin\",\"dosage\":\"5mg\",\"frequency\":\"daily\"}],\"patient_factors\":{\"age\":65,\"weight_kg\":75,\"renal_function\":\"normal\",\"hepatic_function\":\"normal\",\"allergies\":[]}}"
```

**Expected Response:** `200 OK` with interaction analysis

---

### 10. Generate Clinical Report

**Generate comprehensive clinical summary:**
```bash
curl -X POST http://localhost:3000/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001" \
  -d "{\"report_type\":\"diagnostic_summary\",\"patient_id\":\"pat_demo_001\",\"encounter_id\":\"enc_demo_001\",\"date_range\":{\"start_date\":\"2025-10-22\",\"end_date\":\"2025-10-22\"},\"include_sections\":[\"clinical_presentation\",\"diagnostic_workup\",\"treatment_plan\",\"outcomes\"],\"format\":\"structured_pdf\"}"
```

**Expected Response:** `200 OK` with complete clinical report

---

### 11. Analytics Summary

**Get system analytics:**
```bash
curl -X GET http://localhost:3000/api/v1/analytics/summary \
  -H "X-Provider-ID: demo_provider_001" \
  -H "X-Facility-ID: demo_facility_001"
```

**Expected Response:** `200 OK` with system metrics

---

## Testing Workflow

### Complete Test Sequence:

1. **Start Application:**
   ```
   Double-click: Team_CursorMinds_Submission.bat
   Wait for: "Server running on http://0.0.0.0:3000"
   ```

2. **Test Health:**
   ```bash
   curl -X GET http://localhost:3000/api/v1/health -H "X-Provider-ID: demo_provider_001" -H "X-Facility-ID: demo_facility_001"
   ```

3. **Register Patient:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/patients/register -H "Content-Type: application/json" -H "X-Provider-ID: demo_provider_001" -H "X-Facility-ID: demo_facility_001" -d "{\"patient_data\":{\"first_name\":\"Jane\",\"last_name\":\"Smith\",\"date_of_birth\":\"1990-08-20\",\"gender\":\"female\",\"email\":\"jane.smith@example.com\"}}"
   ```

4. **Run Diagnosis:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/diagnosis/analyze -H "Content-Type: application/json" -H "X-Provider-ID: demo_provider_001" -H "X-Facility-ID: demo_facility_001" -d "{\"patient_data\":{\"patient_id\":\"pat_demo_001\",\"chief_complaint\":\"chest pain\",\"symptoms\":[{\"symptom\":\"chest_pain\",\"severity\":8}],\"vital_signs\":{\"blood_pressure\":\"160/95\",\"heart_rate\":110}}}"
   ```

5. **Verify All Responses Include:**
   - ✅ `success: true`
   - ✅ Validation parameters (validation_score, processing_time_ms, etc.)
   - ✅ Proper HTTP status codes
   - ✅ Complete data structures

---

## Expected Validation Parameters

Every API response should include these parameters:

### Patient Registration:
- `hipaa_compliance_verified`
- `data_encryption_status`
- `audit_log_created`
- `validation_score`
- `processing_time_ms`

### Diagnosis Analysis:
- `validation_score`
- `confidence_score`
- `processing_time_ms`
- `clinical_accuracy_score`

### Imaging Analysis:
- `image_quality_score`
- `detection_accuracy`
- `annotation_precision`
- `processing_time_seconds`

### Treatment Planning:
- `guideline_compliance_score`
- `evidence_strength`
- `recommendation_confidence`
- `processing_time_ms`

### Drug Interactions:
- `interaction_severity_score`
- `contraindication_confidence`
- `safety_score`
- `processing_time_ms`

### Clinical Reports:
- `report_completeness`
- `clinical_coherence`
- `regulatory_compliance_score`
- `processing_time_ms`

---

## PowerShell Alternative Commands

For Windows PowerShell users, use `Invoke-WebRequest`:

### Health Check:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" -Method GET -Headers @{"X-Provider-ID"="demo_provider_001"; "X-Facility-ID"="demo_facility_001"}
```

### Register Patient:
```powershell
$body = @{patient_data=@{first_name="John";last_name="Doe";date_of_birth="1980-05-15";gender="male"}} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/patients/register" -Method POST -Headers @{"Content-Type"="application/json";"X-Provider-ID"="demo_provider_001";"X-Facility-ID"="demo_facility_001"} -Body $body
```

---

## Postman Collection

These curl commands can be easily imported into Postman:
1. Open Postman
2. Click "Import" → "Raw text"
3. Paste any curl command above
4. Postman will automatically convert it

**Or use Postman's Collection Runner:**
- Import all commands as a collection
- Set environment variables:
  - `base_url`: `http://localhost:3000/api/v1`
  - `provider_id`: `demo_provider_001`
  - `facility_id`: `demo_facility_001`

---

## Success Criteria

All tests should return:
- ✅ Appropriate HTTP status codes (200, 201, etc.)
- ✅ `success: true` in response
- ✅ Complete data structures as per API_SPECIFICATION.md
- ✅ All validation parameters present
- ✅ Response time < 5 seconds for all endpoints

---

## Troubleshooting

**If tests fail:**
1. Ensure application is running: Check `http://localhost:3000/api/v1/health`
2. Wait 30-60 seconds after starting (MongoDB in-memory initialization)
3. Check headers are included (X-Provider-ID and X-Facility-ID)
4. Verify JSON syntax in POST requests
5. Check logs in command window for errors

**Common Issues:**
- **Connection refused**: Application not started
- **404 Not Found**: Check endpoint URL spelling
- **400 Bad Request**: Check JSON format in request body
- **500 Internal Error**: Check server logs in command window

---

**Team CursorMinds © 2025**

*For detailed API specifications, see [API_SPECIFICATION.md](./API_SPECIFICATION.md)*

