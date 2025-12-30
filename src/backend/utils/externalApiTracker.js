/**
 * External API Integration Tracker
 * Tracks and monitors external medical API calls
 */

const { logger } = require('./logger');

// In-memory storage for API call metrics (would use database in production)
const apiCallMetrics = new Map();
const apiCallHistory = [];

/**
 * Simulated External Medical APIs
 */
const EXTERNAL_APIS = {
  // Medical Knowledge APIs
  UMLS: 'https://uts-ws.nlm.nih.gov/rest',
  SNOMED_CT: 'https://browser.ihtsdotools.org/api',
  PUBMED: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils',
  
  // Drug Information APIs
  RXNORM: 'https://rxnav.nlm.nih.gov/REST',
  DRUGBANK: 'https://go.drugbank.com/api/v1',
  FDA_DRUGS: 'https://api.fda.gov/drug',
  
  // Clinical Decision Support
  CDS_HOOKS: 'https://cds-hooks.org/api',
  CLINICAL_CALCULATORS: 'https://api.clinicalcalculators.org',
  
  // FHIR Servers
  FHIR_SERVER: 'https://hapi.fhir.org/baseR4',
  
  // Medical Imaging
  DICOM_SERVER: 'https://dicomweb.example.org',
  PACS_INTEGRATION: 'https://pacs.example.org/api'
};

/**
 * Track external API call
 */
const trackApiCall = async (apiName, endpoint, method = 'GET', requestData = null) => {
  const startTime = Date.now();
  const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Simulate API call (in production, this would make real calls)
    const response = await simulateExternalApiCall(apiName, endpoint, method, requestData);
    
    const duration = Date.now() - startTime;
    
    // Record metrics
    const callRecord = {
      call_id: callId,
      api_name: apiName,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      status: 'success',
      response_code: response.status || 200,
      data_returned: response.data !== null
    };
    
    // Store in history
    apiCallHistory.push(callRecord);
    
    // Update metrics
    updateApiMetrics(apiName, duration, true);
    
    logger.info(`External API call successful: ${apiName} - ${endpoint} (${duration}ms)`);
    
    return {
      success: true,
      call_id: callId,
      data: response.data,
      metadata: {
        api_name: apiName,
        duration_ms: duration,
        timestamp: callRecord.timestamp
      }
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Record failed call
    const callRecord = {
      call_id: callId,
      api_name: apiName,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      status: 'failed',
      error: error.message
    };
    
    apiCallHistory.push(callRecord);
    updateApiMetrics(apiName, duration, false);
    
    logger.error(`External API call failed: ${apiName} - ${error.message}`);
    
    return {
      success: false,
      call_id: callId,
      error: error.message,
      metadata: {
        api_name: apiName,
        duration_ms: duration,
        timestamp: callRecord.timestamp
      }
    };
  }
};

/**
 * Update API metrics
 */
const updateApiMetrics = (apiName, duration, success) => {
  if (!apiCallMetrics.has(apiName)) {
    apiCallMetrics.set(apiName, {
      total_calls: 0,
      successful_calls: 0,
      failed_calls: 0,
      total_duration_ms: 0,
      avg_duration_ms: 0,
      last_call: null
    });
  }
  
  const metrics = apiCallMetrics.get(apiName);
  metrics.total_calls++;
  if (success) {
    metrics.successful_calls++;
  } else {
    metrics.failed_calls++;
  }
  metrics.total_duration_ms += duration;
  metrics.avg_duration_ms = metrics.total_duration_ms / metrics.total_calls;
  metrics.last_call = new Date().toISOString();
  
  apiCallMetrics.set(apiName, metrics);
};

/**
 * Simulate external API calls
 * In production, these would make real HTTP requests to external services
 */
const simulateExternalApiCall = async (apiName, endpoint, method, requestData) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  
  // Simulate different responses based on API type
  switch (apiName) {
    case 'UMLS':
      return {
        status: 200,
        data: {
          concept_id: 'C0018802',
          preferred_name: 'Medical Terminology',
          semantic_types: ['Intellectual Product']
        }
      };
      
    case 'RXNORM':
      return {
        status: 200,
        data: {
          rxcui: '207106',
          name: 'amoxicillin 500 MG Oral Capsule',
          synonym: 'Amoxil 500 MG Oral Capsule',
          tty: 'SCD'
        }
      };
      
    case 'DRUGBANK':
      return {
        status: 200,
        data: {
          drugbank_id: 'DB01060',
          name: 'Amoxicillin',
          interactions: [
            {
              drug: 'Warfarin',
              severity: 'moderate',
              description: 'May increase anticoagulant effect'
            }
          ]
        }
      };
      
    case 'PUBMED':
      return {
        status: 200,
        data: {
          articles: [
            {
              pmid: '12345678',
              title: 'Clinical Guidelines for Treatment',
              authors: ['Smith J', 'Doe A'],
              journal: 'Medical Journal',
              year: 2024
            }
          ]
        }
      };
      
    case 'FHIR_SERVER':
      return {
        status: 200,
        data: {
          resourceType: 'Bundle',
          type: 'searchset',
          total: 1,
          entry: []
        }
      };
      
    case 'CLINICAL_CALCULATORS':
      return {
        status: 200,
        data: {
          calculator: 'ASCVD_Risk',
          result: 12.5,
          interpretation: 'Moderate risk',
          recommendations: ['Statin therapy', 'Lifestyle modifications']
        }
      };
      
    default:
      return {
        status: 200,
        data: {
          message: 'API call simulated successfully',
          api: apiName
        }
      };
  }
};

/**
 * Get API metrics summary
 */
const getApiMetricsSummary = () => {
  const summary = {
    total_external_api_calls: apiCallHistory.length,
    apis_used: Array.from(apiCallMetrics.keys()),
    overall_success_rate: 0,
    average_response_time_ms: 0,
    api_details: {}
  };
  
  let totalSuccess = 0;
  let totalDuration = 0;
  
  for (const [apiName, metrics] of apiCallMetrics.entries()) {
    summary.api_details[apiName] = {
      total_calls: metrics.total_calls,
      success_rate: ((metrics.successful_calls / metrics.total_calls) * 100).toFixed(2) + '%',
      avg_response_time_ms: Math.round(metrics.avg_duration_ms),
      last_called: metrics.last_call
    };
    
    totalSuccess += metrics.successful_calls;
    totalDuration += metrics.total_duration_ms;
  }
  
  if (apiCallHistory.length > 0) {
    summary.overall_success_rate = ((totalSuccess / apiCallHistory.length) * 100).toFixed(2) + '%';
    summary.average_response_time_ms = Math.round(totalDuration / apiCallHistory.length);
  }
  
  return summary;
};

/**
 * Get recent API call history
 */
const getRecentApiCalls = (limit = 10) => {
  return apiCallHistory.slice(-limit).reverse();
};

/**
 * Track medical terminology lookup
 */
const lookupMedicalTerminology = async (term, system = 'SNOMED_CT') => {
  return await trackApiCall(system, `/search?term=${term}`, 'GET');
};

/**
 * Track drug interaction check
 */
const checkDrugInteraction = async (drug1, drug2) => {
  return await trackApiCall('DRUGBANK', `/interactions/${drug1}/${drug2}`, 'GET', {
    drug1,
    drug2
  });
};

/**
 * Track clinical guideline lookup
 */
const lookupClinicalGuideline = async (condition) => {
  return await trackApiCall('PUBMED', `/guidelines?condition=${condition}`, 'GET');
};

/**
 * Track FHIR resource query
 */
const queryFHIRResource = async (resourceType, parameters) => {
  return await trackApiCall('FHIR_SERVER', `/${resourceType}?${new URLSearchParams(parameters)}`, 'GET');
};

/**
 * Track clinical calculator usage
 */
const calculateClinicalScore = async (calculatorType, patientData) => {
  return await trackApiCall('CLINICAL_CALCULATORS', `/${calculatorType}`, 'POST', patientData);
};

/**
 * Get API health status
 */
const getApiHealthStatus = () => {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    external_apis: {}
  };
  
  for (const [apiName, baseUrl] of Object.entries(EXTERNAL_APIS)) {
    const metrics = apiCallMetrics.get(apiName);
    
    if (metrics) {
      const successRate = (metrics.successful_calls / metrics.total_calls) * 100;
      healthStatus.external_apis[apiName] = {
        status: successRate > 95 ? 'healthy' : successRate > 80 ? 'degraded' : 'unhealthy',
        success_rate: successRate.toFixed(2) + '%',
        avg_response_time_ms: Math.round(metrics.avg_duration_ms),
        last_call: metrics.last_call
      };
    } else {
      healthStatus.external_apis[apiName] = {
        status: 'not_used',
        success_rate: 'N/A',
        avg_response_time_ms: 0,
        last_call: null
      };
    }
  }
  
  return healthStatus;
};

module.exports = {
  trackApiCall,
  getApiMetricsSummary,
  getRecentApiCalls,
  lookupMedicalTerminology,
  checkDrugInteraction,
  lookupClinicalGuideline,
  queryFHIRResource,
  calculateClinicalScore,
  getApiHealthStatus,
  EXTERNAL_APIS
};

