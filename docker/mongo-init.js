// MongoDB Initialization Script for Docker
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('healthcare_assistant');

// Create collections
db.createCollection('patients');
db.createCollection('diagnoses');
db.createCollection('treatments');
db.createCollection('imagingstudies');

// Create indexes for better performance
db.patients.createIndex({ "patient_id": 1 }, { unique: true });
db.patients.createIndex({ "medical_record_number": 1 }, { unique: true, sparse: true });
db.patients.createIndex({ "demographics.last_name": 1, "demographics.first_name": 1 });

db.diagnoses.createIndex({ "analysis_id": 1 }, { unique: true });
db.diagnoses.createIndex({ "patient_id": 1, "createdAt": -1 });

db.treatments.createIndex({ "treatment_plan_id": 1 }, { unique: true });
db.treatments.createIndex({ "patient_id": 1, "status": 1 });

db.imagingstudies.createIndex({ "study_id": 1 }, { unique: true });
db.imagingstudies.createIndex({ "patient_id": 1, "acquisition_date": -1 });

print('MongoDB initialization completed for Team CursorMinds Healthcare Assistant');

