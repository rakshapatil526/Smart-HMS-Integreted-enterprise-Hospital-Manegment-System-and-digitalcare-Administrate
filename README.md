# SMART CARE HMS - Smart Hospital Management System

**SMART CARE HMS** is a complete, full-stack Hospital Management System built with Python Django REST Framework, React 18 + TypeScript + Tailwind CSS, PostgreSQL / SQLite database integration, AI Clinical Decision Support, RAG Chatbot, Voice Assistant, and PDF document generation.

---

## 1. Welcome Page & First-Entry Experience

When someone opens **Smart Care HMS**, they see the **Welcome Page**:
- **Header Navigation**: 🏥 SMART CARE HMS logo, About modal, Help modal.
- **Main Hero Section**:
  - Title: `SMART CARE HOSPITAL MANAGEMENT SYSTEM`
  - Subtitle: `One connected platform for smarter hospital and patient management.`
  - Action Buttons: `[ SIGN IN ]` and `[ CREATE PATIENT ACCOUNT ]`.
- **Capability Highlights**:
  - 👤 Patient Care
  - 📅 Appointments
  - 🏥 Hospital Management
  - 🚑 Emergency Ambulance
  - 🤖 AI Assistance

---

## 2. Create Patient Account UI (Registration)

Clicking **Create Patient Account**:
1. Patient enters details:
   - Full Name
   - Email
   - Phone Number
   - Date of Birth
   - Gender (`[ Select ]`: Male, Female, Other)
   - Password (with password eye toggle 👁)
   - Confirm Password (with password eye toggle 👁)
   - Checkbox: `☐ I agree to the Terms and Privacy`
2. Submits via `[ CREATE ACCOUNT ]`.
3. Account is saved in Database (`Patient` role), JWT token issued, user automatically logged in & lands directly in **Patient Dashboard**.

---

## 3. Login / Sign-In UI & Seamless Role Selection

Clicking **Sign In**:
1. **Role Selector**: User selects their role (`Patient`, `Doctor`, `Nurse`, `Reception`, `Laboratory Technician`, `Radiologist`, `Pharmacist`, `OT Staff`, `Billing Staff`, `Insurance Staff`, `Inventory Manager`, `Blood Bank Staff`, `Ambulance Operator`, `Ambulance Driver`, `HR Staff`, `Admin`) or uses quick role chips.
2. **Auto-Fill Demo Credentials**: Selecting any role automatically populates its demo email and default password (`Password@123`), enabling seamless single-click login testing.
3. Credentials authenticated against backend database (SQLite / PostgreSQL).
4. **Google Sign-In**: Click `[ G Continue with Google ]` -> verifies Google account email:
   - Existing user -> opens assigned role dashboard.
   - New user -> creates `Patient` account and opens Patient Dashboard.
5. **Forgot Password**: Click `Forgot password?` -> enters registered email -> receives password reset instructions modal.

---

## 4. Complete First-Entry & Authentication Flow

```
              OPEN SMART CARE HMS (http://localhost:3000/)
                       │
                       ▼
                 WELCOME PAGE (Screen 1)
                 /           \
                /             \
               ▼               ▼
     [ CREATE PATIENT ACCOUNT ]  [ SIGN IN ]
               │               │
               ▼               ▼
      PATIENT REGISTRATION     LOGIN (Screen 3)
           (Screen 2)          │
               │               ▼
               ▼          AUTHENTICATE & JWT
        PATIENT ACCOUNT        │
               │               ▼
               └────────► ASSIGNED ROLE
                               │
       ┌──────────┬────────────┼────────────┬──────────┐
       ▼          ▼            ▼            ▼          ▼
    PATIENT    DOCTOR        NURSE      RECEPTION    ADMIN
       │          │            │            │          │
       ▼          ▼            ▼            ▼          ▼
   Dashboard  Dashboard    Dashboard    Dashboard  Dashboard
```

---

## 16 User Roles & Database Accounts

Default Password for all seeded accounts: **`Password@123`**

| Role | Database Account Email | Primary Module Access |
| :--- | :--- | :--- |
| **Patient** | `patient@smartcare.com` | Personal Profile, Appointments, EHR Timeline, Reports, Prescriptions, AI Assistants |
| **Reception** | `reception@smartcare.com` | Patient Registration, Appointments, OPD Token Queue, IPD Admissions, Basic Billing |
| **Doctor** | `doctor@smartcare.com` | Today's OPD Appointments, Consultations, Prescriptions, Lab/Rad Orders, AI CDS, Emergency Triage |
| **Nurse** | `nurse@smartcare.com` | Assigned IPD Ward Patients, Vitals Telemetry, MAR Medication Administration, Care Notes |
| **Laboratory Technician** | `labtech@smartcare.com` | LIS Request Queue, Sample Collection, Result Entry, Verification, PDF Reports |
| **Radiologist** | `radiologist@smartcare.com` | RIS X-Ray, CT, MRI, Ultrasound Queue, DICOM Scan Preview, Radiologist PDF Reports |
| **Pharmacist** | `pharmacist@smartcare.com` | Prescription Queue, Medicine Search, Batch/Expiry Check, Dispensing, Auto-Stock Deduction |
| **OT Staff** | `otstaff@smartcare.com` | OT Room Scheduling, Surgical Team Assignment, Pre-Op & Post-Op Checklists |
| **Billing Staff** | `billing@smartcare.com` | Aggregate OPD/IPD/Lab/Pharm/OT/Ambulance Charges, PDF Invoices & Receipts |
| **Insurance Staff** | `insurance@smartcare.com` | TPA Provider Lookup, Cashless Pre-Authorization, Policy Verification, Claims |
| **Inventory Manager** | `inventory@smartcare.com` | Supplier Directory, Stock-In/Out, Purchase Orders, Reorder Level Alerts |
| **Blood Bank Staff** | `bloodbank@smartcare.com` | Donor Registry, Blood Units Inventory by Group/Rh, Cross-Match, Hospital Issues |
| **Ambulance Operator** | `ambulanceop@smartcare.com` | Emergency Dispatch Triage, Fleet GPS Tracking, Driver Assignment, ETA |
| **Ambulance Driver** | `ambulancedriver@smartcare.com` | Emergency Driver Alert, GPS Navigation Map View, ER Hospital Alert |
| **HR Staff** | `hrstaff@smartcare.com` | Employee Directory, Attendance, Shift Schedules, Payroll & Salary Slip PDFs |
| **Admin** | `admin@smartcare.com` | System Governance, Staff Creation, Role Management, Department Settings, Audit Logs |

---

## 5. Module Feature Walkthrough

### 👤 Patient Module
- **Dashboard**: KPI stats, upcoming appointment card, recent activity log, emergency dispatch trigger.
- **My Profile**: Patient ID (PAT-2026-8942), contact details, blood group, allergies, emergency contact.
- **Appointments**: Upcoming & past appointments, slot booking modal, PDF Appointment Slip download.
- **My EHR**: Longitudinal clinical timeline with PDF dossier downloads.
- **Prescriptions**: Prescribed medicine table, doctor notes, PDF download.
- **Lab & Radiology Reports**: Test results, DICOM image viewer, PDF downloads.
- **Bills & Payments**: Invoice breakdown, online UPI payment gateway simulation, PDF receipts.
- **Telemedicine**: Virtual waiting room, WebRTC video consultation, live chat.
- **Emergency Ambulance**: Karnataka live GPS tracking, ambulance assignment, ETA countdown.

### 👨‍⚕️ Doctor Module
- **Dashboard**: Today's OPD appointments, quick action cards, pending diagnostics.
- **OPD & IPD Consultations**: Vitals recording, diagnosis, digital prescriptions, lab & radiology ordering.
- **Emergency Triage**: Pre-arrival alerts, ER preparation checklist, doctor handover notes.
- **AI Clinical Support**: Real-time diagnostic suggestions, drug interaction alerts, treatment protocol advice.

### 👩‍⚕️ Nurse Module
- **Inpatient Care**: Ward bed allocation, vital signs telemetry, MAR medication administration, shift handovers.

### 🧪 Laboratory (LIS) & 🩻 Radiology (RIS) Modules
- **LIS**: Test request queue, sample collection logging, parameter result entry, pathologist verification, PDF reports.
- **RIS**: DICOM study archive, imaging suite scheduling, radiologist report editor, PDF radiology reports.

### 💊 Pharmacy Module
- **Dispensary**: Prescription queue, stock verification, automatic inventory deduction, batch/expiry alerts, billing transmission.

### 🚑 Emergency & Ambulance Fleet Module
- **Dispatch**: Rapido-style emergency request flow, driver alert broadcast, Karnataka map view, hospital alert banners.

---

## 6. PDF Generation & Document Downloads

PDF document generation is supported across all core hospital modules:
- **Prescription PDF**: Digital Rx with doctor signature, medicines, dosage, and statutory warnings.
- **Invoice & Receipt PDF**: Itemized OPD/IPD/Lab/Pharmacy financial receipts.
- **Lab Report PDF**: Pathology parameters with reference ranges and pathologist signatures.
- **Radiology Report PDF**: Imaging findings, radiological impression, and radiologist signatures.
- **EHR Summary PDF**: Longitudinal patient medical history extract.
- **Discharge Summary PDF**: IPD hospital course, treatment summary, and follow-up instructions.
- **Appointment Slip PDF**: Appointment confirmation with token number and department details.

*Failsafe Architecture*: Backend ReportLab PDF streaming is coupled with client-side fallback binary PDF synthesis, ensuring document downloads work reliably even if the backend API is offline.

---

## 6.5. Role-Based AI Assistant Module

The application features a full-stack **Role-Based AI Assistant** with modular architecture (`backend/ai_assistant/`) and strict data isolation across all hospital user roles.

### Key Capabilities & Role Security
- **Patient AI**: Accesses only authorized appointments, prescriptions, EHR history, and lab reports. Provides educational advice; directs emergencies to ambulance dispatch.
- **Doctor AI**: Summarizes today's appointments, patient consultation history, lab results, and vitals telemetry without making autonomous clinical prescriptions.
- **Nurse AI**: Tracks assigned ward beds, nursing vitals telemetry logs, and scheduled care activities.
- **Pharmacy AI**: Queries medicine inventory, low-stock reorder alerts, expiring batches, and pending prescription queues.
- **Laboratory AI**: Tracks pending lab request queues, completed test parameters, and lab workload metrics.
- **Admin AI**: Summarizes hospital operational statistics, appointment counts, pending invoices, and emergency telemetry.

### Environment Configuration (.env)
Configure the AI provider in `backend/.env` or environment variables:
```env
AI_PROVIDER=openai # Options: 'openai', 'gemini', 'local'
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4o-mini # or 'gemini-1.5-flash'
```
*Fallback*: If no API key is specified, the system automatically uses the zero-config `LocalRuleEngineProvider`, ensuring seamless, instant responses without external API dependencies.

### REST API Endpoints
- `POST /api/ai/chat/`: Process role-authorized user query and return contextual AI response.
- `GET /api/ai/history/`: Fetch authorized user's chat history.
- `DELETE /api/ai/history/`: Clear user's chat history.

---

## 7. How to Easily Run the Application

### ⚡ Quickest Way (1-Click Run on Windows)
Simply double-click:
```cmd
start.bat
```
*(Or in PowerShell run `.\start.ps1`)*

**This automatically:**
1. Starts the **Django Backend** API on `http://127.0.0.1:8000/`.
2. Starts the **Vite React Frontend** on `http://localhost:3000/`.
3. Opens `http://localhost:3000/` in your web browser.

Individual convenience scripts are also available:
- `run_backend.bat` - Starts only the Backend server
- `run_frontend.bat` - Starts only the Frontend server

---

### 🛠️ Manual Terminal Method

#### Prerequisites
- **Python 3.10+** (Virtualenv is pre-configured in `backend/venv`)
- **Node.js 18+** & **npm**

---

#### 🚀 Terminal 1: Run Backend (Django REST API)

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Activate the pre-configured virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

3. (Already prepared) Migrations and database are pre-seeded with 58 users:
   ```bash
   python manage.py migrate
   python seed_db.py
   ```

4. Start Backend Server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *Backend API is available at: `http://127.0.0.1:8000/`*  
   *Admin Panel is available at: `http://127.0.0.1:8000/admin/`*

---

#### 🌐 Terminal 2: Run Frontend (React + Vite)

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. (Already installed) Install dependencies:
   ```bash
   npm install
   ```

3. Start Frontend Development Server:
   ```bash
   npm run dev
   ```
   *Frontend application will be available at: `http://localhost:3000/`*

---

### 🔄 How to Update or Re-Seed the Application

1. **Reset / Re-Seed Database (Demo Users & Records)**:
   ```bash
   cd backend
   python seed_db.py
   ```

2. **Update Dependencies**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt --upgrade
   python manage.py migrate

   # Frontend
   cd frontend
   npm update
   ```

---

## Production Build & Verification

- **Frontend**: Verified with `npm run build` (`1692 modules transformed cleanly`).
- **Backend**: Verified with `python manage.py check` (`0 issues identified`).
