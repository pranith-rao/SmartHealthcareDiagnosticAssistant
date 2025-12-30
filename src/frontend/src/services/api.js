import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add custom headers if needed
    config.headers['X-Provider-ID'] = 'demo_provider';
    config.headers['X-Facility-ID'] = 'facility_demo';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API endpoints
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Patient endpoints
  registerPatient: (patientData) => api.post('/patients/register', patientData),
  getPatient: (patientId) => api.get(`/patients/${patientId}`),
  getAllPatients: (params) => api.get('/patients', { params }),
  updatePatientStatus: (patientId, statusData) => api.put(`/patients/${patientId}/status`, statusData),

  // Diagnosis endpoints
  analyzeDiagnosis: (diagnosisData) => api.post('/diagnosis/analyze', diagnosisData),
  getDiagnosis: (diagnosisId) => api.get(`/diagnosis/${diagnosisId}`),
  getPatientDiagnosisHistory: (patientId) => api.get(`/diagnosis/patient/${patientId}`),

  // Imaging endpoints
  analyzeImage: (imagingData) => api.post('/imaging/analyze', imagingData),
  getImagingResults: (studyId) => api.get(`/imaging/${studyId}/results`),
  compareStudies: (comparisonData) => api.post('/imaging/compare-studies', comparisonData),

  // Drug interaction endpoints
  checkDrugInteractions: (drugData) => api.post('/drug-interactions/check', drugData),

  // Treatment endpoints
  generateTreatmentPlan: (treatmentData) => api.post('/treatment/plan-generation', treatmentData),
  getTreatmentPlan: (planId) => api.get(`/treatment/${planId}`),
  updateTreatmentPlan: (planId, updates) => api.put(`/treatment/${planId}`, updates),

  // Report endpoints
  generateClinicalReport: (reportData) => api.post('/reports/clinical-summary', reportData),
  downloadReport: (reportId) => api.get(`/reports/download/${reportId}`),
  getPatientReports: (patientId) => api.get(`/reports/patient/${patientId}`),
};

export default api;

