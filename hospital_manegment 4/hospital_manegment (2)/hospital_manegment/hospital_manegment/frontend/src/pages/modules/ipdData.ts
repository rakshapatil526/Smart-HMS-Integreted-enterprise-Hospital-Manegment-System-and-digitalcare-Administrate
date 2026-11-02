export interface IPDPatient {
  id: string;
  admission_id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  doctor_name: string;
  department: string;
  admission_date: string;
  admission_type: 'Emergency' | 'Elective' | 'OPD Transfer';
  ward: string;
  bed_number: string;
  reason: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Under Observation' | 'Discharged';
  photo?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string;
  diagnosis?: string;
}

export interface IPDBed {
  id: string;
  bed_number: string;
  ward_name: string;
  is_occupied: boolean;
  patient_name?: string;
  patient_id?: string;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Reserved';
}

export interface IPDTransferRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  from_ward: string;
  from_bed: string;
  to_ward: string;
  to_bed: string;
  transfer_date: string;
  reason: string;
  approved_by: string;
}

export interface IPDDailyTimelineEvent {
  id: string;
  patient_id: string;
  date: string;
  time: string;
  event_type: 'Admission' | 'Bed Allocation' | 'Doctor Assessment' | 'Nursing Vitals' | 'Lab Request' | 'Radiology Scan' | 'Medication' | 'Transfer' | 'Progress Update';
  description: string;
  author: string;
}

export interface IPDDoctorNote {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  doctor_name: string;
  note_type: 'Progress Note' | 'Treatment Instruction' | 'Diagnosis Update' | 'Discharge Plan';
  content: string;
}

export interface IPDNursingRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  nurse_name: string;
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  notes: string;
  medications_status: { name: string; time: string; given: boolean }[];
}

export interface IPDDischargeRecord {
  id: string;
  admission_id: string;
  patient_id: string;
  patient_name: string;
  admission_date: string;
  discharge_date: string;
  attending_doctor: string;
  department: string;
  diagnosis: string;
  treatment_summary: string;
  discharge_instructions: string;
  followup_date: string;
  total_stay_days: number;
  estimated_bill_amount: number;
  pdf_reference_id: string;
  status: 'Pending Clearance' | 'Discharged & Settled';
}

// Initial Pre-populated IPD Wards & Beds Matrix
export const initialIPDBeds: IPDBed[] = [
  { id: 'b-1', bed_number: 'C-101', ward_name: 'Cardiology Ward', is_occupied: true, patient_name: 'Aarav Sharma', patient_id: 'SC-P001', status: 'Occupied' },
  { id: 'b-2', bed_number: 'C-102', ward_name: 'Cardiology Ward', is_occupied: true, patient_name: 'Priya Singh', patient_id: 'SC-P004', status: 'Occupied' },
  { id: 'b-3', bed_number: 'C-103', ward_name: 'Cardiology Ward', is_occupied: false, status: 'Available' },
  { id: 'b-4', bed_number: 'C-104', ward_name: 'Cardiology Ward', is_occupied: false, status: 'Available' },

  { id: 'b-5', bed_number: 'I-01', ward_name: 'ICU (Intensive Care)', is_occupied: true, patient_name: 'Rahul Verma', patient_id: 'SC-P003', status: 'Occupied' },
  { id: 'b-6', bed_number: 'I-02', ward_name: 'ICU (Intensive Care)', is_occupied: true, patient_name: 'Vikram Malhotra', patient_id: 'SC-P006', status: 'Occupied' },
  { id: 'b-7', bed_number: 'I-03', ward_name: 'ICU (Intensive Care)', is_occupied: false, status: 'Available' },
  { id: 'b-8', bed_number: 'I-04', ward_name: 'ICU (Intensive Care)', is_occupied: false, status: 'Available' },

  { id: 'b-9', bed_number: 'W-101', ward_name: 'General Medical Ward', is_occupied: true, patient_name: 'Anika Patel', patient_id: 'SC-P002', status: 'Occupied' },
  { id: 'b-10', bed_number: 'W-102', ward_name: 'General Medical Ward', is_occupied: true, patient_name: 'Rajesh Kumar', patient_id: 'SC-P005', status: 'Occupied' },
  { id: 'b-11', bed_number: 'W-103', ward_name: 'General Medical Ward', is_occupied: false, status: 'Available' },
  { id: 'b-12', bed_number: 'W-104', ward_name: 'General Medical Ward', is_occupied: false, status: 'Available' },
  { id: 'b-13', bed_number: 'W-105', ward_name: 'General Medical Ward', is_occupied: false, status: 'Available' },

  { id: 'b-14', bed_number: 'V-201', ward_name: 'VIP Executive Suite', is_occupied: true, patient_name: 'Sunita Reddy', patient_id: 'SC-P007', status: 'Occupied' },
  { id: 'b-15', bed_number: 'V-202', ward_name: 'VIP Executive Suite', is_occupied: false, status: 'Available' },
  { id: 'b-16', bed_number: 'O-301', ward_name: 'Surgical Recovery Ward', is_occupied: true, patient_name: 'Manish Gupta', patient_id: 'SC-P008', status: 'Occupied' },
  { id: 'b-17', bed_number: 'O-302', ward_name: 'Surgical Recovery Ward', is_occupied: false, status: 'Available' },
  { id: 'b-18', bed_number: 'O-303', ward_name: 'Surgical Recovery Ward', is_occupied: false, status: 'Available' },
];

// Initial Admitted Patients
export const initialIPDPatients: IPDPatient[] = [
  {
    id: 'ipd-101',
    admission_id: 'IPD-2026-001',
    patient_id: 'SC-P001',
    name: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    admission_date: '17 Aug 2026',
    admission_type: 'Emergency',
    ward: 'Cardiology Ward',
    bed_number: 'C-101',
    reason: 'Acute Chest Discomfort / Ischemic Monitoring',
    status: 'Stable',
    blood_group: 'O+',
    allergies: 'Penicillin',
    diagnosis: 'Acute Coronary Syndrome / Exertional Angina',
  },
  {
    id: 'ipd-102',
    admission_id: 'IPD-2026-002',
    patient_id: 'SC-P002',
    name: 'Anika Patel',
    age: 29,
    gender: 'Female',
    doctor_name: 'Dr. Sarah Jenkins',
    department: 'General Medicine',
    admission_date: '16 Aug 2026',
    admission_type: 'Elective',
    ward: 'General Medical Ward',
    bed_number: 'W-101',
    reason: 'Severe Dengue Fever with Thrombocytopenia',
    status: 'Recovering',
    blood_group: 'A+',
    allergies: 'None',
    diagnosis: 'Viral Hemorrhagic Dengue Fever',
  },
  {
    id: 'ipd-103',
    admission_id: 'IPD-2026-003',
    patient_id: 'SC-P003',
    name: 'Rahul Verma',
    age: 52,
    gender: 'Male',
    doctor_name: 'Dr. Vikram Rao',
    department: 'Pulmonology & ICU',
    admission_date: '15 Aug 2026',
    admission_type: 'Emergency',
    ward: 'ICU (Intensive Care)',
    bed_number: 'I-01',
    reason: 'Acute Respiratory Distress / Severe Pneumonia',
    status: 'Critical',
    blood_group: 'B+',
    allergies: 'Sulfa Drugs',
    diagnosis: 'Bacterial Bronchopneumonia with Hypoxemia',
  },
  {
    id: 'ipd-104',
    admission_id: 'IPD-2026-004',
    patient_id: 'SC-P004',
    name: 'Priya Singh',
    age: 44,
    gender: 'Female',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    admission_date: '17 Aug 2026',
    admission_type: 'OPD Transfer',
    ward: 'Cardiology Ward',
    bed_number: 'C-102',
    reason: 'Hypertensive Emergency & Arrhythmia',
    status: 'Under Observation',
    blood_group: 'AB+',
    allergies: 'Aspirin',
    diagnosis: 'Essential Hypertension with Ventricular Ectopics',
  },
  {
    id: 'ipd-105',
    admission_id: 'IPD-2026-005',
    patient_id: 'SC-P005',
    name: 'Rajesh Kumar',
    age: 61,
    gender: 'Male',
    doctor_name: 'Dr. Priya Nair',
    department: 'Gastroenterology',
    admission_date: '14 Aug 2026',
    admission_type: 'Elective',
    ward: 'General Medical Ward',
    bed_number: 'W-102',
    reason: 'Acute Cholecystitis / Post-Op Recovery',
    status: 'Stable',
    blood_group: 'O-',
    allergies: 'None',
    diagnosis: 'Acute Calculus Cholecystitis',
  },
];

// Initial Daily Timeline Events
export const initialIPDTimelineEvents: IPDDailyTimelineEvent[] = [
  {
    id: 'ev-1',
    patient_id: 'SC-P001',
    date: '17 Aug 2026',
    time: '09:30 AM',
    event_type: 'Admission',
    description: 'Admitted to Cardiology Ward under Dr. Arjun Mehta via Emergency Triage.',
    author: 'Reception / Triage Desk',
  },
  {
    id: 'ev-2',
    patient_id: 'SC-P001',
    date: '17 Aug 2026',
    time: '10:00 AM',
    event_type: 'Bed Allocation',
    description: 'Bed C-101 allocated in Cardiology Ward. Vitals baseline recorded.',
    author: 'Nurse Sarah Jenkins',
  },
  {
    id: 'ev-3',
    patient_id: 'SC-P001',
    date: '17 Aug 2026',
    time: '11:15 AM',
    event_type: 'Doctor Assessment',
    description: 'Dr. Arjun Mehta completed clinical round. Ordered 12-lead ECG, Trop-I, and Cardiac MRI.',
    author: 'Dr. Arjun Mehta',
  },
  {
    id: 'ev-4',
    patient_id: 'SC-P001',
    date: '17 Aug 2026',
    time: '02:00 PM',
    event_type: 'Medication',
    description: 'Administered IV Nitroglycerin infusion and oral Aspirin 75mg.',
    author: 'Nurse Sarah Jenkins',
  },
  {
    id: 'ev-5',
    patient_id: 'SC-P001',
    date: '18 Aug 2026',
    time: '08:30 AM',
    event_type: 'Nursing Vitals',
    description: 'Vitals Stable: BP 122/78 mmHg, Pulse 74 bpm, SpO2 98% on room air.',
    author: 'Nurse Emily Watson',
  },
  {
    id: 'ev-6',
    patient_id: 'SC-P001',
    date: '18 Aug 2026',
    time: '11:00 AM',
    event_type: 'Progress Update',
    description: 'Patient reports complete resolution of chest pain. Cardiac MRI report non-ischemic.',
    author: 'Dr. Arjun Mehta',
  },
];

// Initial Doctor Notes
export const initialIPDDoctorNotes: IPDDoctorNote[] = [
  {
    id: 'dn-1',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    date: '17 Aug 2026 11:30 AM',
    doctor_name: 'Dr. Arjun Mehta',
    note_type: 'Progress Note',
    content: 'Patient presented with acute chest discomfort radiating to left shoulder. Troponin I negative. Started on IV anti-ischemic protocol. Monitor vitals q2h.',
  },
  {
    id: 'dn-2',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    date: '18 Aug 2026 10:15 AM',
    doctor_name: 'Dr. Arjun Mehta',
    note_type: 'Treatment Instruction',
    content: 'Patient pain-free for 18 hours. Wean IV Nitroglycerin. Continue oral Beta-blockers and Statin therapy. Plan for discharge tomorrow morning if stable.',
  },
];

// Initial Nursing Records
export const initialIPDNursingRecords: IPDNursingRecord[] = [
  {
    id: 'nr-1',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    date: '17 Aug 2026',
    nurse_name: 'Nurse Sarah Jenkins',
    bp: '124/82',
    pulse: '78',
    temp: '98.4°F',
    spo2: '98%',
    notes: 'Patient resting comfortably. Chest discomfort subsided after IV medication.',
    medications_status: [
      { name: 'Aspirin 75mg', time: '08:00 AM', given: true },
      { name: 'Atorvastatin 40mg', time: '02:00 PM', given: true },
      { name: 'Metoprolol 25mg', time: '08:00 PM', given: false },
    ],
  },
  {
    id: 'nr-2',
    patient_id: 'SC-P002',
    patient_name: 'Anika Patel',
    date: '17 Aug 2026',
    nurse_name: 'Nurse Emily Watson',
    bp: '110/70',
    pulse: '82',
    temp: '99.1°F',
    spo2: '99%',
    notes: 'Hydration maintained with IV Normal Saline 100ml/hr. Platelet count monitoring in progress.',
    medications_status: [
      { name: 'Paracetamol 500mg IV', time: '10:00 AM', given: true },
      { name: 'IV Fluids NS 0.9%', time: '12:00 PM', given: true },
    ],
  },
];

// Initial Transfers History
export const initialIPDTransfers: IPDTransferRecord[] = [
  {
    id: 'tr-1',
    patient_id: 'SC-P003',
    patient_name: 'Rahul Verma',
    from_ward: 'General Medical Ward',
    from_bed: 'W-105',
    to_ward: 'ICU (Intensive Care)',
    to_bed: 'I-01',
    transfer_date: '15 Aug 2026 04:30 PM',
    reason: 'Desaturation to 88% SpO2 requiring non-invasive mechanical ventilation',
    approved_by: 'Dr. Vikram Rao',
  },
];
