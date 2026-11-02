export interface EHREvent {
  id: string;
  timestamp: string;
  date_str: string;
  category: 'OPD' | 'IPD' | 'Nursing' | 'Laboratory' | 'Radiology' | 'Prescription' | 'Discharge' | 'Vital';
  title: string;
  doctor_or_staff: string;
  department: string;
  summary: string;
  details: any;
  document_pdf_ref?: string;
}

export interface EHRPatientProfile {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  allergies: string[];
  medical_conditions: string[];
  current_medications: string[];
  recent_diagnosis: string;
  last_visit_date: string;
  active_admission: string | null;
  events: EHREvent[];
}

export interface EHRAuditLog {
  id: string;
  user_name: string;
  role: string;
  action: string;
  patient_id: string;
  timestamp: string;
}

// Pre-populated Comprehensive EHR Patient Records
export const initialEHRRecord: EHRPatientProfile = {
  id: 'p-001',
  patient_id: 'SC-P001',
  name: 'Aarav Sharma',
  age: 38,
  gender: 'Male',
  blood_group: 'O+',
  allergies: ['Penicillin', 'Sulfa Drugs'],
  medical_conditions: ['Hypertension', 'Mild Asthma'],
  current_medications: ['Metoprolol 25mg', 'Atorvastatin 40mg', 'Aspirin 75mg'],
  recent_diagnosis: 'Exertional Chest Discomfort / Suspected Angina (Resolved)',
  last_visit_date: '20 Aug 2026',
  active_admission: 'Discharged on 20 Aug 2026 (Cardiology Ward C-101)',
  events: [
    {
      id: 'e-1',
      timestamp: '2026-08-20T10:30:00Z',
      date_str: '20 Aug 2026',
      category: 'Discharge',
      title: '📄 IPD Inpatient Discharge Summary',
      doctor_or_staff: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      summary: 'Patient successfully discharged post-observation. Pain-free for 48h.',
      details: {
        admission_date: '17 Aug 2026',
        discharge_date: '20 Aug 2026',
        ward: 'Cardiology Ward (Bed C-101)',
        final_diagnosis: 'Acute Coronary Syndrome / Exertional Angina (Resolved)',
        discharge_meds: 'Metoprolol 25mg 1-0-0, Atorvastatin 40mg 0-1-0, Aspirin 75mg 1-0-0',
        followup_date: '27 Aug 2026',
      },
      document_pdf_ref: 'IPD_Discharge_Summary_SC-P001.pdf',
    },
    {
      id: 'e-2',
      timestamp: '2026-08-20T09:00:00Z',
      date_str: '20 Aug 2026',
      category: 'OPD',
      title: '🩺 OPD Cardiology Consultation',
      doctor_or_staff: 'Dr. Arjun Mehta',
      department: 'Cardiology',
      summary: 'Follow-up assessment post-admission. Vitals stable. Pain-free.',
      details: {
        chief_complaint: 'Routine post-discharge clinical review',
        bp: '120/80 mmHg',
        pulse: '74 bpm',
        treatment_plan: 'Continue oral cardiac medications. Gradual return to light activity.',
      },
    },
    {
      id: 'e-3',
      timestamp: '2026-08-19T14:15:00Z',
      date_str: '19 Aug 2026',
      category: 'Radiology',
      title: '🩻 MRI Brain & Cardiac Scan Report',
      doctor_or_staff: 'Dr. Robert Vance, MD (Radiology)',
      department: 'Radiology RIS / PACS',
      summary: 'Normal LVEF 62%. No transmural myocardial infarction scar.',
      details: {
        modality: 'Cardiac & Brain MRI (3T Suite)',
        findings: 'Left ventricular end-diastolic volume normal. Calculated LVEF 62%. No subendocardial scar.',
        impression: '1. Unremarkable Cardiac MRI with normal LV function.\n2. Normal Brain MRI.',
        accession_no: 'ACC-2026-9901',
      },
      document_pdf_ref: 'Radiology_Report_MRI_SC-P001.pdf',
    },
    {
      id: 'e-4',
      timestamp: '2026-08-18T11:00:00Z',
      date_str: '18 Aug 2026',
      category: 'Laboratory',
      title: '🧪 CBC & Lipid Profile Report',
      doctor_or_staff: 'Dr. Alan Turing (Lab Director)',
      department: 'Laboratory LIS',
      summary: 'Hemoglobin 14.2 g/dL, WBC 7,200/uL, Cholesterol 210 mg/dL.',
      details: {
        sample_type: 'Venous Blood',
        hemoglobin: '14.2 g/dL',
        wbc_count: '7,200 /uL',
        platelet_count: '250,000 /uL',
        total_cholesterol: '210 mg/dL (Slightly Elevated)',
      },
      document_pdf_ref: 'Lab_Report_CBC_SC-P001.pdf',
    },
    {
      id: 'e-5',
      timestamp: '2026-08-17T18:00:00Z',
      date_str: '17 Aug 2026',
      category: 'Prescription',
      title: '💊 Prescription Dispensed (RX001)',
      doctor_or_staff: 'Pharmacist Alex Rivera',
      department: 'Central Pharmacy',
      summary: '3 medicines dispensed: Paracetamol, Atorvastatin, Aspirin.',
      details: {
        prescription_token: 'RX001',
        medicines_count: 3,
        status: 'Dispensed & Billed',
      },
      document_pdf_ref: 'Prescription_RX001_SC-P001.pdf',
    },
    {
      id: 'e-6',
      timestamp: '2026-08-17T10:00:00Z',
      date_str: '17 Aug 2026',
      category: 'Nursing',
      title: '👩‍⚕️ Inpatient Nursing Vitals & MAR',
      doctor_or_staff: 'Nurse Emily Watson',
      department: 'Cardiology Ward',
      summary: 'BP 120/80, Pulse 78, Temp 98.6°F, SpO2 98%. Patient comfortable.',
      details: {
        bp: '120/80 mmHg',
        pulse: '78 bpm',
        temperature: '98.6 °F',
        spo2: '98%',
        nursing_note: 'Patient resting comfortably. Monitored on telemetry.',
      },
    },
    {
      id: 'e-7',
      timestamp: '2026-08-17T08:30:00Z',
      date_str: '17 Aug 2026',
      category: 'IPD',
      title: '🏥 IPD Admission & Bed Allocation',
      doctor_or_staff: 'Dr. Arjun Mehta',
      department: 'Cardiology Ward',
      summary: 'Admitted for observation under Cardiology Protocol.',
      details: {
        admission_id: 'IPD-2026-001',
        ward: 'Cardiology Ward',
        bed: 'C-101',
        admission_type: 'OPD Transfer',
      },
    },
  ],
};

// Additional Demo EHR Patients
export const demoEHRPatients: EHRPatientProfile[] = [
  initialEHRRecord,
  {
    id: 'p-002',
    patient_id: 'SC-P002',
    name: 'Anika Patel',
    age: 27,
    gender: 'Female',
    blood_group: 'A+',
    allergies: ['Dust Mites'],
    medical_conditions: ['Seasonal Rhinitis'],
    current_medications: ['Amoxicillin 500mg', 'Paracetamol 500mg'],
    recent_diagnosis: 'Acute Bronchial Cough & Fever',
    last_visit_date: '19 Aug 2026',
    active_admission: null,
    events: [
      {
        id: 'e-201',
        timestamp: '2026-08-19T11:00:00Z',
        date_str: '19 Aug 2026',
        category: 'OPD',
        title: '🩺 OPD General Medicine Consultation',
        doctor_or_staff: 'Dr. Sarah Jenkins',
        department: 'General Medicine',
        summary: 'Presented with fever and mild cough for 3 days.',
        details: { chief_complaint: 'Fever and dry cough', bp: '118/76 mmHg', pulse: '80 bpm' },
      },
      {
        id: 'e-202',
        timestamp: '2026-08-19T11:45:00Z',
        date_str: '19 Aug 2026',
        category: 'Radiology',
        title: '🩻 Chest X-Ray PA View',
        doctor_or_staff: 'Tech Marcus Brody',
        department: 'Radiology RIS',
        summary: 'Clear lung fields. No acute consolidation.',
        details: { modality: 'Digital DR X-Ray', findings: 'Clear lung fields without focal infiltrates.' },
      },
    ],
  },
  {
    id: 'p-003',
    patient_id: 'SC-P003',
    name: 'Rahul Verma',
    age: 52,
    gender: 'Male',
    blood_group: 'B+',
    allergies: ['None Reported'],
    medical_conditions: ['Type 2 Diabetes', 'COPD'],
    current_medications: ['Metformin 500mg', 'Ceftriaxone IV'],
    recent_diagnosis: 'COPD Exacerbation with Acute Desaturation',
    last_visit_date: '18 Aug 2026',
    active_admission: 'Admitted in ICU (Bed ICU-02)',
    events: [
      {
        id: 'e-301',
        timestamp: '2026-08-18T09:00:00Z',
        date_str: '18 Aug 2026',
        category: 'IPD',
        title: '🏥 Emergency ICU Admission',
        doctor_or_staff: 'Dr. Vikram Rao',
        department: 'Intensive Care Unit (ICU)',
        summary: 'Admitted with acute respiratory distress and severe hypoxemia.',
        details: { admission_id: 'IPD-2026-003', ward: 'ICU', bed: 'ICU-02' },
      },
      {
        id: 'e-302',
        timestamp: '2026-08-18T10:00:00Z',
        date_str: '18 Aug 2026',
        category: 'Radiology',
        title: '🖥️ HRCT Chest Scan',
        doctor_or_staff: 'Dr. Robert Vance, MD',
        department: 'Radiology RIS',
        summary: 'Bilateral lower lobe infiltrates consistent with acute exacerbation.',
        details: { modality: '64-Slice CT', findings: 'Patchy opacity in bilateral lower lobes.' },
      },
    ],
  },
];

// Initial Audit Trail Log
export const initialEHRAuditLogs: EHRAuditLog[] = [
  {
    id: 'aud-1',
    user_name: 'Dr. Arjun Mehta',
    role: 'Senior Consultant Physician',
    action: 'Viewed Patient EHR Dossier',
    patient_id: 'SC-P001',
    timestamp: '20 Aug 2026 10:32 AM',
  },
  {
    id: 'aud-2',
    user_name: 'Dr. Sarah Jenkins',
    role: 'Attending Physician',
    action: 'Downloaded Discharge Summary PDF',
    patient_id: 'SC-P001',
    timestamp: '20 Aug 2026 11:15 AM',
  },
  {
    id: 'aud-3',
    user_name: 'AI Clinical Assistant',
    role: 'AI Service (Read-Only)',
    action: 'Generated EHR Synthesis Summary',
    patient_id: 'SC-P001',
    timestamp: '20 Aug 2026 11:30 AM',
  },
];
