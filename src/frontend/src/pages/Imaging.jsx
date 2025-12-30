import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaXRay, FaUpload } from 'react-icons/fa';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Imaging = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/dicom', 'application/dicom'];
    const validExtensions = ['.dcm', '.jpg', '.jpeg', '.png'];
    
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExtension);

    if (!isValidType) {
      toast.error('Please upload a valid medical image (DICOM, JPEG, or PNG)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected successfully!`);
    
    // Auto-analyze the uploaded file
    analyzeUploadedFile(file);
  };

  const analyzeUploadedFile = async (file) => {
    setAnalyzing(true);
    try {
      // Analyze the uploaded file
      const demoData = {
        patient_id: 'pat_upload_' + Date.now(),
        study_type: 'chest_xray', // Valid enum value
        modality: 'CR',
        body_part: 'chest',
        view: 'pa_lateral',
        clinical_indication: 'Uploaded medical image - ' + file.name,
        filename: file.name,
        filesize: file.size
      };

      const response = await apiService.analyzeImage(demoData);
      setResults(response.data);
      toast.success('Image analysis completed!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const runDemoImaging = async () => {
    setAnalyzing(true);
    try {
      const demoData = {
        patient_id: 'pat_demo_001',
        study_type: 'chest_xray',
        modality: 'CR',
        body_part: 'chest',
        view: 'pa_lateral',
        clinical_indication: 'chest pain, rule out pneumonia'
      };

      const response = await apiService.analyzeImage(demoData);
      setResults(response.data);
      toast.success('Image analysis completed!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Medical Imaging</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runDemoImaging}
          disabled={analyzing}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-xl shadow-lg disabled:opacity-50"
        >
          <FaXRay />
          <span>{analyzing ? 'Analyzing...' : 'Run Demo Analysis'}</span>
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Medical Image</h2>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".dcm,.jpg,.jpeg,.png,image/jpeg,image/png,application/dicom"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-teal-500 bg-teal-50'
              : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-teal-500 hover:bg-gray-50'
          }`}
        >
          <FaUpload className={`text-6xl mx-auto mb-4 ${
            selectedFile ? 'text-green-500' : 'text-gray-400'
          }`} />
          
          {selectedFile ? (
            <>
              <p className="text-green-600 font-semibold mb-2">✓ File Selected</p>
              <p className="text-gray-600 mb-2">{selectedFile.name}</p>
              <p className="text-sm text-gray-400">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <p className="text-sm text-teal-600 mt-3">Click to select a different file</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                {isDragging ? 'Drop file here...' : 'Drag and drop or click to upload'}
              </p>
              <p className="text-sm text-gray-400">Supported: DICOM, JPEG, PNG (max 10MB)</p>
            </>
          )}
        </div>
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
            className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Analyzing medical image...</p>
        </motion.div>
      )}

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Image Quality</p>
                <p className="text-2xl font-bold text-blue-600">{results.image_quality_score?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Detection Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{results.detection_accuracy?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Annotation Precision</p>
                <p className="text-2xl font-bold text-purple-600">{results.annotation_precision?.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                <p className="text-2xl font-bold text-teal-600">{results.processing_time_seconds?.toFixed(1)}s</p>
              </div>
            </div>

            {results.findings && results.findings.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Findings</h3>
                {results.findings.map((finding, index) => (
                  <div key={index} className="p-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl mb-4">
                    <p className="font-bold text-gray-800 mb-2">{finding.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Location: {finding.anatomical_location}</span>
                      <span>•</span>
                      <span>Severity: {finding.severity}</span>
                      <span>•</span>
                      <span>Confidence: {(finding.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.overall_assessment && (
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Assessment</h3>
                <p className="text-gray-700 mb-2">{results.overall_assessment.recommendation}</p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {results.overall_assessment.urgency_level}
                  </span>
                  {results.overall_assessment.follow_up_suggested && (
                    <span className="text-sm text-gray-600">
                      Follow-up: {results.overall_assessment.follow_up_suggested}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Imaging;

