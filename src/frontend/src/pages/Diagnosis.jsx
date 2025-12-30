import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope, FaExclamationTriangle } from 'react-icons/fa';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Diagnosis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const runDemoAnalysis = async () => {
    setAnalyzing(true);
    try {
      const demoData = {
        patient_data: {
          patient_id: 'pat_demo_001',
          encounter_id: 'enc_demo_001',
          demographics: { age: 45, gender: 'male', ethnicity: 'caucasian' },
          chief_complaint: 'Chest pain and shortness of breath for 2 hours',
          symptoms: [
            { symptom: 'chest_pain', severity: 8, duration_hours: 2, character: 'crushing', radiation: 'left_arm' }
          ],
          vital_signs: { blood_pressure: '160/95', heart_rate: 110, respiratory_rate: 22, temperature_celsius: 36.8, oxygen_saturation: 94 },
          medical_history: ['hypertension', 'diabetes_type_2'],
          current_medications: ['lisinopril 10mg daily', 'metformin 500mg twice daily']
        },
        analysis_options: { include_risk_stratification: true, emergency_assessment: true }
      };

      const response = await apiService.analyzeDiagnosis(demoData);
      setResults(response.data);
      toast.success('Diagnosis analysis completed!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinical Diagnosis</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runDemoAnalysis}
          disabled={analyzing}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-lg disabled:opacity-50"
        >
          <FaStethoscope />
          <span>{analyzing ? 'Analyzing...' : 'Run Demo Analysis'}</span>
        </motion.button>
      </div>

      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Analyzing patient data...</p>
        </motion.div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Differential Diagnosis</h2>
            <div className="space-y-4">
              {results.differential_diagnosis?.map((diagnosis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 capitalize">
                        {diagnosis.diagnosis.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600">ICD-10: {diagnosis.icd10_code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{(diagnosis.probability * 100).toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Probability</p>
                      {diagnosis.confidence && (
                        <>
                          <p className="text-lg font-semibold text-purple-600 mt-1">{(diagnosis.confidence * 100).toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      diagnosis.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {diagnosis.severity} severity
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      diagnosis.urgency === 'immediate' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {diagnosis.urgency}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Evidence:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {diagnosis.evidence?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {results.clinical_alerts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 rounded-2xl shadow-xl p-8 border-2 border-red-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl" />
                <h2 className="text-2xl font-bold text-red-800">Clinical Alerts</h2>
              </div>
              {results.clinical_alerts.map((alert, index) => (
                <div key={index} className="p-4 bg-white rounded-xl mb-2">
                  <p className="font-semibold text-red-700">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.action_required}</p>
                </div>
              ))}
            </motion.div>
          )}

          {results.recommended_workup?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Diagnostic Workup</h2>
              <div className="space-y-4">
                {results.recommended_workup.map((test, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-l-4 border-green-500"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 capitalize">{test.test.replace(/_/g, ' ')}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        test.urgency === 'immediate' ? 'bg-red-100 text-red-700' : 
                        test.urgency === 'urgent' ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {test.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{test.rationale}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {results.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Clinical Reasoning</h2>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">Diagnostic Reasoning</h3>
                  <p className="text-gray-700 leading-relaxed">{results.explanation.reasoning}</p>
                </div>

                {results.explanation.key_factors?.length > 0 && (
                  <div className="p-6 bg-purple-50 rounded-xl">
                    <h3 className="text-lg font-bold text-purple-900 mb-3">Key Decision Factors</h3>
                    <ul className="space-y-2">
                      {results.explanation.key_factors.map((factor, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span className="text-gray-700 capitalize">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.explanation.clinical_pearls?.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                    <h3 className="text-lg font-bold text-orange-900 mb-3">💡 Clinical Pearls</h3>
                    <ul className="space-y-3">
                      {results.explanation.clinical_pearls.map((pearl, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-2xl">💎</span>
                          <span className="text-gray-700 leading-relaxed">{pearl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {results.missing_information?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 rounded-2xl shadow-xl p-8 border-2 border-yellow-200"
            >
              <h2 className="text-2xl font-bold text-yellow-900 mb-6">Missing Information</h2>
              <p className="text-sm text-gray-600 mb-4">The following information would improve diagnostic accuracy:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.missing_information.map((item, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg shadow-sm border border-yellow-200">
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Diagnosis;

