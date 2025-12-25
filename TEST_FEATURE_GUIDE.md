# Doctor Test Suggestion Feature

## Overview
This feature allows doctors to suggest medical tests to patients through prescriptions. Patients can then upload their test reports, which will be visible on their prescription page.

## Database Changes

### Updated Prescription Schema
The `Prescription` model now includes a `tests` array with the following structure:

```javascript
tests: [{
  test_name: String,           // Name of the test (e.g., "Blood Test", "X-Ray")
  description: String,         // Additional details about the test
  test_report: String,         // Uploaded test report/results
  report_date: Date,           // When the report was uploaded
  status: String               // 'suggested', 'pending', or 'completed'
}]
```

## API Endpoints

### 1. Create Prescription with Test Suggestions
**Endpoint:** `POST /api/doctor/prescribe`  
**Auth:** Required (Doctor must be verified)  
**Body:**
```json
{
  "appointment_id": "appointment_id",
  "notes": "Doctor notes",
  "medicines": [
    {
      "medicine_id": "medicine_id",
      "dosage": "500mg",
      "duration": "7 days",
      "timing": {
        "morning": 1,
        "noon": 0,
        "night": 1
      }
    }
  ],
  "tests": [
    {
      "test_name": "Blood Test",
      "description": "Complete Blood Count (CBC)"
    },
    {
      "test_name": "X-Ray",
      "description": "Chest X-Ray"
    }
  ]
}
```

### 2. Add Test Suggestion to Existing Prescription
**Endpoint:** `PUT /api/doctor/prescription/:prescriptionId/tests`  
**Auth:** Required (Doctor who created the prescription)  
**Body:**
```json
{
  "test_name": "ECG",
  "description": "Electrocardiogram"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Test suggestion added successfully.",
  "prescription": { ... }
}
```

### 3. Patient Uploads Test Report
**Endpoint:** `PUT /api/doctor/prescription/:prescriptionId/test/:testId/report`  
**Auth:** Required (Patient who owns the prescription)  
**Body:**
```json
{
  "test_report": "Normal range. WBC: 7.5, RBC: 5.2, Hemoglobin: 14.2"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Test report uploaded successfully.",
  "test": {
    "_id": "test_id",
    "test_name": "Blood Test",
    "description": "Complete Blood Count (CBC)",
    "test_report": "Normal range. WBC: 7.5, RBC: 5.2, Hemoglobin: 14.2",
    "report_date": "2025-12-24T10:30:00Z",
    "status": "completed"
  }
}
```

### 4. Get Prescription Details with Tests
**Endpoint:** `GET /api/doctor/prescription/:prescriptionId`  
**Auth:** Required (Patient or Doctor of the prescription)  
**Response:**
```json
{
  "success": true,
  "prescription": {
    "_id": "prescription_id",
    "doctor_id": {
      "_id": "doctor_id",
      "specialization": "Cardiology"
    },
    "patient_id": {
      "_id": "patient_id",
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com"
    },
    "notes": "Doctor notes",
    "medicines": [ ... ],
    "tests": [
      {
        "_id": "test_id",
        "test_name": "Blood Test",
        "description": "Complete Blood Count (CBC)",
        "test_report": "Normal range. WBC: 7.5, RBC: 5.2, Hemoglobin: 14.2",
        "report_date": "2025-12-24T10:30:00Z",
        "status": "completed"
      }
    ],
    "date": "2025-12-20T15:00:00Z"
  }
}
```

### 5. Get All Patient Prescriptions
**Endpoint:** `GET /api/users/prescriptions`  
**Auth:** Required (Patient)  
**Response:**
```json
{
  "success": true,
  "count": 5,
  "prescriptions": [ ... ]
}
```

## Frontend Usage Examples

### 1. Doctor Creating Prescription with Tests
```javascript
const createPrescriptionWithTests = async (prescriptionData) => {
  const response = await fetch('/api/doctor/prescribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      appointment_id: prescriptionData.appointmentId,
      notes: prescriptionData.notes,
      medicines: prescriptionData.medicines,
      tests: [
        { test_name: 'Blood Test', description: 'CBC' },
        { test_name: 'X-Ray', description: 'Chest X-Ray' }
      ]
    })
  });
  
  return response.json();
};
```

### 2. Patient Viewing Prescriptions with Tests
```javascript
const fetchPrescriptions = async () => {
  const response = await fetch('/api/users/prescriptions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### 3. Patient Uploading Test Report
```javascript
const uploadTestReport = async (prescriptionId, testId, reportText) => {
  const response = await fetch(
    `/api/doctor/prescription/${prescriptionId}/test/${testId}/report`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        test_report: reportText
      })
    }
  );
  
  return response.json();
};
```

## Test Status Flow
1. **Suggested** - Doctor has suggested a test
2. **Pending** - Patient has been notified but hasn't uploaded results
3. **Completed** - Patient has uploaded test results/reports

## Notes
- Only doctors can suggest tests (verified doctors only)
- Only patients can upload test reports
- Both doctor and patient can view the prescription with test reports
- Test reports are stored as text/string (can be enhanced to support file uploads)
- Multiple tests can be added to a single prescription
