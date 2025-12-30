# Team CursorMinds - Healthcare Diagnostic Assistant

**Smart Healthcare Diagnostic Assistant - Backend Medical Decision Support System**

A MERN stack application providing AI-powered medical diagnostic support with rule-based clinical decision engines, treatment planning, and comprehensive reporting capabilities.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Team](#team)

---

## 🎯 Overview

This application addresses the critical shortage of medical specialists by providing an intelligent diagnostic assistant that:

- Analyzes patient symptoms and vital signs
- Generates differential diagnoses using rule-based algorithms
- Provides evidence-based treatment recommendations
- Analyzes medical imaging studies
- Checks drug interactions
- Generates comprehensive clinical reports

**Built for**: Technothon 2025  
**Submission Date**: October 30, 2025  
**Port**: 3000 (Backend + Frontend)

---

## ✨ Features

### Core Functionality

- **Patient Management**: Register and manage patient records with HIPAA-compliant data storage
- **Diagnostic Analysis**: Rule-based diagnostic engine using clinical decision trees and statistical algorithms
- **Medical Imaging**: Analyze chest X-rays, CT scans, and other medical images with drag-and-drop file upload
- **Treatment Planning**: Generate evidence-based treatment plans with medication recommendations
- **Drug Interaction Checking**: Identify potential drug interactions and contraindications
- **Clinical Reporting**: Generate comprehensive clinical summary reports with PDF download

### Technical Features

- ✅ RESTful API with comprehensive endpoints
- ✅ MongoDB in-memory database (mongodb-memory-server - no external MongoDB needed)
- ✅ Rule-based diagnostic engine (CHADS2, qSOFA, ACS risk assessment)
- ✅ HIPAA-compliant audit logging
- ✅ JWT authentication and encryption
- ✅ Beautiful React frontend with Framer Motion animations
- ✅ Drag-and-drop file upload for medical images (DICOM, JPEG, PNG)
- ✅ One-click PDF/report download functionality
- ✅ Docker containerization for easy deployment
- ✅ Comprehensive validation parameters in all API responses
- ✅ Automatic frontend rebuild in batch files
- ✅ Graceful server shutdown handling

---

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (with mongodb-memory-server)
- **Authentication**: JWT
- **Logging**: Winston
- **Validation**: Joi
- **Security**: Helmet.js, HIPAA audit logging

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

### DevOps
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 (production)

---

## 📦 Prerequisites

Before running the application, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker Desktop** (optional - for containerized deployment)
- **Git**

**Note**: MongoDB is NOT required - the application uses an in-memory database.

---

## 🚀 Installation & Setup

### ⭐ OPTION 1: Quick Start Without Docker (RECOMMENDED FOR EVALUATORS)

**Single-click execution:**
```bash
# Simply double-click this file, or run:
Team_CursorMinds_Submission.bat
```

**What it does:**
- ✅ Checks Node.js installation
- ✅ Installs all dependencies automatically
- ✅ Builds React frontend for production
- ✅ Starts the complete application
- ✅ Opens browser to http://localhost:3000

**Requirements:** Node.js 18+ only  
**Time:** 3-5 minutes first run, 10 seconds subsequent runs

---

### 🐳 OPTION 2: Using Docker

**Single-click execution:**
```bash
# Simply double-click this file, or run:
Team_CursorMinds_Submission_Docker.bat
```

**What it does:**
- ✅ Checks Docker installation and status
- ✅ Builds Docker images
- ✅ Starts application containers
- ✅ Opens browser to http://localhost:3000

**Requirements:** Docker Desktop installed and running  
**Time:** 5-10 minutes first run, 30 seconds subsequent runs

---

## 🎮 Running the Application

### Quick Run (Either Method)

**Without Docker:**
```bash
.\Team_CursorMinds_Submission.bat
```

**With Docker:**
```bash
.\Team_CursorMinds_Submission_Docker.bat
```

Both batch files handle everything automatically!

---

### Manual Docker Control (Advanced)

If you want more control over Docker:

```bash
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

### Accessing the Application

- **Full Application**: http://localhost:3000 (Frontend + Backend)
- **API Endpoints**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/api/v1/health

**Note:** Both batch files serve the complete application (frontend + backend) on port 3000

---

## 📚 API Documentation

Complete documentation is available in the `docs/` folder:

- **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - Comprehensive API endpoint documentation
- **[API_TEST_COLLECTION.md](./API_TEST_COLLECTION.md)** - curl commands and Postman collection for testing
- **[TEST_PLAN.md](./TEST_PLAN.md)** - Test plan, test cases, and results report  
- **[PROMPTS_USED.md](./PROMPTS_USED.md)** - Complete list of Cursor AI prompts used

### Quick API Examples

#### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

#### Register Patient
```bash
curl -X POST http://localhost:3000/api/v1/patients/register \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider" \
  -d '{
    "patient_data": {
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-05-15",
      "gender": "male"
    }
  }'
```

#### Analyze Diagnosis
```bash
curl -X POST http://localhost:3000/api/v1/diagnosis/analyze \
  -H "Content-Type: application/json" \
  -H "X-Provider-ID: demo_provider" \
  -d '{
    "patient_data": {
      "patient_id": "pat_12345",
      "demographics": { "age": 45, "gender": "male" },
      "chief_complaint": "Chest pain",
      "symptoms": [
        { "symptom": "chest_pain", "severity": 8 }
      ],
      "vital_signs": {
        "blood_pressure": "160/95",
        "heart_rate": 110
      },
      "medical_history": ["hypertension"]
    }
  }'
```

---

## 📁 Project Structure

```
Team_CursorMinds_Submission/
├── src/
│   ├── backend/
│   │   ├── server.js                 # Express server entry point
│   │   ├── config/                   # Configuration files
│   │   ├── models/                   # MongoDB models
│   │   ├── routes/                   # API routes
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Business logic & engines
│   │   │   ├── ruleEngine.js        # Clinical rule engine
│   │   │   ├── diagnosticEngine.js  # Diagnostic analysis
│   │   │   └── treatmentEngine.js   # Treatment planning
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.js              # JWT authentication
│   │   │   ├── auditLogger.js       # HIPAA audit logging
│   │   │   └── errorHandler.js      # Error handling
│   │   └── utils/                    # Utility functions
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx              # Main React component
│       │   ├── pages/               # Page components
│       │   ├── components/          # Reusable components
│       │   ├── services/            # API service layer
│       │   └── styles/              # CSS and Tailwind
│       └── package.json
├── config/                          # App configuration
├── data/                            # Sample data
├── docs/                            # Documentation
│   ├── API_SPECIFICATION.md        # API documentation
│   ├── API_TEST_COLLECTION.md      # API test collection (curl/Postman)
│   ├── TEST_PLAN.md                # Test plan and results
│   ├── PROMPTS_USED.md             # Cursor AI prompts (20%)
│   └── README.md                   # This file
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose config
├── Team_CursorMinds_Submission.bat # Windows batch file
├── START_HERE.md                   # Quick start guide
├── package.json                     # Node.js dependencies
└── README.md                        # Project overview
```

---

## 🔍 Key Features Deep Dive

### 1. Rule-Based Diagnostic Engine

Our diagnostic engine uses proven clinical decision rules:

- **CHADS2 Score**: Stroke risk assessment in atrial fibrillation
- **qSOFA Score**: Sepsis screening
- **ACS Risk Assessment**: Acute coronary syndrome probability
- **Vital Signs Analysis**: Automated classification of abnormal values

### 2. Enhanced Diagnosis Output

Following problem statement requirements:

- **Differential Diagnosis**: Multiple diagnoses with probability AND confidence scores
- **Clinical Reasoning**: Detailed explanation of diagnostic logic
- **Clinical Pearls**: Educational insights for healthcare providers
- **Recommended Workup**: Diagnostic tests with rationale
- **Missing Information**: Identifies data gaps for better accuracy

### 3. Treatment Planning

Evidence-based treatment recommendations including:

- Acute management protocols
- Long-term medication plans
- Lifestyle modifications
- Follow-up scheduling

### 4. Security & HIPAA Compliance

- **JWT Authentication**: Secure API access
- **Data Encryption**: At rest and in transit
- **Comprehensive Audit Logging**: All PHI access tracked
- **Access Control**: Role-based authorization
- **PHI Protection**: Protected Health Information safeguards

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

Should return:
```json
{
  "success": true,
  "message": "Healthcare Diagnostic Assistant API is healthy",
  "version": "1.0.0"
}
```

### Frontend Test
1. Navigate to http://localhost:3000
2. Click "Patients" tab
3. Click "New Patient" and register a patient
4. Click "Diagnosis" tab
5. Click "Run Demo Analysis"
6. Verify all results display correctly

---

## 🚨 Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <process_id> /F
```

### Node.js Not Found
Install from: https://nodejs.org/ (version 18 or higher)

### Docker Issues
- Ensure Docker Desktop is running
- Try: `docker system prune -a` (removes all containers and images)
- Rebuild: `docker-compose up --build`

---

## 👥 Team

**Team CursorMinds**

- Healthcare diagnostic assistant developed for Technothon 2025
- Focused on improving healthcare accessibility through intelligent clinical decision support

---

## 📝 License

This project is developed for Technothon 2025 submission.

---

## 📞 Support

For technical issues or questions:
- Check `API_SPECIFICATION.md` for API details
- Use `API_TEST_COLLECTION.md` for testing commands
- Review `TEST_PLAN.md` for test cases and results
- See `PROMPTS_USED.md` for development insights
- Check `START_HERE.md` for quick start guide
- Contact technical support during Technothon

---

## 🎉 Acknowledgments

- Built with Cursor AI assistance
- Medical knowledge bases and clinical guidelines
- Open-source community for amazing tools

---

**Team CursorMinds © 2025**
**Technothon 2025 - Smart Healthcare Diagnostic Assistant**

