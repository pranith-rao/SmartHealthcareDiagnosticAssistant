import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaDownload } from 'react-icons/fa';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const downloadPDF = () => {
    if (!report) return;
    
    // Create a simple text content for the PDF
    const content = `
CLINICAL SUMMARY REPORT
=======================

Patient Name: ${report.report_summary?.patient_name || 'N/A'}
Encounter Date: ${report.report_summary?.encounter_date || 'N/A'}
Primary Diagnosis: ${report.report_summary?.primary_diagnosis || 'N/A'}
Attending Physician: ${report.report_summary?.attending_physician || 'N/A'}

Report ID: ${report.report_id || 'N/A'}
Generated: ${report.generated_at ? new Date(report.generated_at).toLocaleString() : 'N/A'}

REPORT SECTIONS
===============
${report.report_sections?.map(section => `
${section.section.replace(/_/g, ' ').toUpperCase()}
${section.content_summary || 'No content'}
`).join('\n') || 'No sections available'}

METRICS
=======
Report Completeness: ${report.report_completeness?.toFixed(1)}%
Clinical Coherence: ${report.clinical_coherence?.toFixed(1)}%
Compliance Score: ${report.regulatory_compliance_score?.toFixed(1)}%
    `.trim();

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-report-${report.report_id || Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully!');
  };

  const generateDemoReport = async () => {
    setGenerating(true);
    try {
      const demoData = {
        report_type: 'diagnostic_summary',
        patient_id: 'pat_demo_001',
        encounter_id: 'enc_demo_001',
        date_range: { start_date: '2025-10-22', end_date: '2025-10-22' },
        include_sections: ['clinical_presentation', 'diagnostic_workup', 'treatment_plan', 'outcomes'],
        format: 'structured_pdf'
      };

      const response = await apiService.generateClinicalReport(demoData);
      setReport(response.data);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Clinical Reports</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateDemoReport}
          disabled={generating}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg disabled:opacity-50"
        >
          <FaFileAlt />
          <span>{generating ? 'Generating...' : 'Generate Demo Report'}</span>
        </motion.button>
      </div>

      {generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Generating clinical report...</p>
        </motion.div>
      )}

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Clinical Summary Report</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaDownload />
              <span>Download Report</span>
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* Report Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Completeness</p>
                <p className="text-2xl font-bold text-blue-600">{report.report_completeness?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Clinical Coherence</p>
                <p className="text-2xl font-bold text-green-600">{report.clinical_coherence?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Compliance Score</p>
                <p className="text-2xl font-bold text-purple-600">{report.regulatory_compliance_score?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                <p className="text-2xl font-bold text-indigo-600">{report.processing_time_ms}ms</p>
              </div>
            </div>

            {/* Report Summary */}
            {report.report_summary && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Patient Name</p>
                    <p className="font-semibold text-gray-800">{report.report_summary.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Encounter Date</p>
                    <p className="font-semibold text-gray-800">{report.report_summary.encounter_date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Primary Diagnosis</p>
                    <p className="font-semibold text-gray-800">{report.report_summary.primary_diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Attending Physician</p>
                    <p className="font-semibold text-gray-800">{report.report_summary.attending_physician}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Report Sections */}
            {report.report_sections && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Report Sections</h3>
                <div className="space-y-3">
                  {report.report_sections.map((section, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-gray-800 mb-1 capitalize">
                        {section.section.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{section.content_summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Report ID: {report.report_id}</p>
              <p>Generated: {new Date(report.generated_at).toLocaleString()}</p>
              <p>Expires: {new Date(report.expiration_date).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Reports</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <FaFileAlt />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Clinical Summary Report {i}</p>
                  <p className="text-sm text-gray-500">Generated: Oct {20 + i}, 2025</p>
                </div>
              </div>
              <button 
                onClick={() => toast.info('This is a demo report. Generate a new report to download.')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaDownload />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

