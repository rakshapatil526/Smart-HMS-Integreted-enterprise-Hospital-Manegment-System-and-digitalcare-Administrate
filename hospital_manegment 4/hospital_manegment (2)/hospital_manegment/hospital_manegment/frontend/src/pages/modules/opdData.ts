export interface OPDPatientRecord {
  id: string;
  patient_id: string;
  token_number: number;
  token_code: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  phone: string;
  email: string;
  address: string;
  photo_url: string;
  allergies: string;
  chronic_conditions: string;
  department: string;
  assigned_doctor: string;
  appointment_time: string;
  visit_type: 'New Visit' | 'Follow-up' | 'Routine Checkup' | 'Emergency Referral';
  status: 'Booked' | 'Checked-In' | 'Waiting' | 'With Doctor' | 'Consultation Completed' | 'Tests / Prescription' | 'Visit Completed';
  current_vitals?: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
  };
  consultation_details?: {
    chief_complaint: string;
    symptoms: string;
    medical_history: string;
    examination: string;
    diagnosis: string;
    clinical_notes: string;
    treatment_plan: string;
    follow_up_date: string;
  };
  billing?: {
    consultation_fee: number;
    registration_fee: number;
    total_amount: number;
    invoice_number: string;
    payment_status: 'Paid' | 'Pending';
  };
}

export interface OPDVisitHistory {
  visit_id: string;
  date: string;
  department: string;
  doctor_name: string;
  visit_type: string;
  diagnosis: string;
  treatment_plan: string;
  prescribed_medicines: string[];
}

export interface OPDLabRequest {
  id: string;
  request_number: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  department: string;
  test_names: string[];
  request_date: string;
  status: 'Pending' | 'Sample Collected' | 'Processing' | 'Report Finalized';
  report_summary?: string;
}

export interface OPDRadiologyRequest {
  id: string;
  request_number: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  department: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Echocardiogram';
  body_part: string;
  request_date: string;
  status: 'Requested' | 'Scheduled' | 'Scan Completed' | 'Report Ready';
  findings?: string;
}

export interface OPDPrescriptionItem {
  id: string;
  prescription_number: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  department: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  status: 'Pending' | 'Dispensed';
}

export const opdDepartments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'General Surgery',
  'Gynecology & Obstetrics',
  'Dermatology',
  'ENT',
  'Ophthalmology'
];

export const opdDoctorsList = [
  { name: 'Dr. Arjun Mehta', department: 'Cardiology' },
  { name: 'Dr. Priya Nair', department: 'Cardiology' },
  { name: 'Dr. Rahul Verma', department: 'Neurology' },
  { name: 'Dr. Sneha Rao', department: 'Neurology' },
  { name: 'Dr. Karan Shah', department: 'Orthopedics' },
  { name: 'Dr. Ananya Iyer', department: 'Orthopedics' },
  { name: 'Dr. Neha Kapoor', department: 'Pediatrics' },
  { name: 'Dr. Rohan Das', department: 'Pediatrics' },
  { name: 'Dr. Vikram Rao', department: 'General Medicine' },
  { name: 'Dr. Aditi Menon', department: 'General Medicine' },
  { name: 'Dr. Sameer Joshi', department: 'General Surgery' },
  { name: 'Dr. Kavya Singh', department: 'General Surgery' },
  { name: 'Dr. Meera Sharma', department: 'Gynecology & Obstetrics' },
  { name: 'Dr. Ishita Roy', department: 'Gynecology & Obstetrics' },
  { name: 'Dr. Nisha Patel', department: 'Dermatology' },
  { name: 'Dr. Riya Malhotra', department: 'Dermatology' },
  { name: 'Dr. Amit Kulkarni', department: 'ENT' },
  { name: 'Dr. Pooja Desai', department: 'ENT' },
  { name: 'Dr. Aditya Rao', department: 'Ophthalmology' },
  { name: 'Dr. Tanya Kapoor', department: 'Ophthalmology' },
];

// 50 Synthetic OPD Patient Records (OPD-P001 through OPD-P050)
export const demoOPDPatients50: OPDPatientRecord[] = Array.from({ length: 50 }, (_, i) => {
  const idx = i + 1;
  const pid = `OPD-P${String(idx).padStart(3, '0')}`;
  const dept = opdDepartments[i % opdDepartments.length];
  const docObj = opdDoctorsList.find((d) => d.department === dept) || opdDoctorsList[0];
  const genders: ('Male' | 'Female')[] = ['Male', 'Female'];
  const gen = genders[i % 2];
  const namesMale = ['Aarav Sharma', 'Rohan Verma', 'Kabir Singh', 'Arjun Kumar', 'Vihaan Das', 'Aditya Shah', 'Rahul Joshi', 'Karan Desai', 'Aman Gupta', 'Neel Mehta', 'Vikram Rao', 'Siddharth Roy', 'Manish Patel', 'Varun Kapoor', 'Dev Bhatia'];
  const namesFemale = ['Anika Rao', 'Meera Nair', 'Diya Patel', 'Sneha Iyer', 'Ishita Roy', 'Kavya Menon', 'Nisha Kapoor', 'Pooja Sharma', 'Riya Malhotra', 'Tanya Rao', 'Ananya Menon', 'Sunita Verma', 'Priya Gupta', 'Kirti Saxena', 'Ritu Choudhury'];
  
  const name = gen === 'Male' ? namesMale[i % namesMale.length] : namesFemale[i % namesFemale.length];
  const age = 18 + ((i * 7) % 55);
  const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'];
  const blood_group = bloodGroups[i % bloodGroups.length];
  
  const timeSlots = ['09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];
  const appointment_time = timeSlots[i % timeSlots.length];

  const status = i < 12 ? 'Waiting' : i < 18 ? 'With Doctor' : i < 44 ? 'Consultation Completed' : i < 48 ? 'Visit Completed' : 'Booked';

  const avatarBase = gen === 'Female' 
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80';

  return {
    id: `opd-rec-${idx}`,
    patient_id: pid,
    token_number: idx,
    token_code: `OP${String(idx).padStart(3, '0')}`,
    name,
    age,
    gender: gen,
    blood_group,
    phone: `+91 98765${String(idx).padStart(5, '0')}`,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    address: `Flat ${100 + idx}, Sector ${ (idx % 15) + 1 }, Smart Health City`,
    photo_url: avatarBase,
    allergies: idx % 3 === 0 ? 'Penicillin' : idx % 5 === 0 ? 'Dust Mites, Sulfa' : 'None',
    chronic_conditions: idx % 4 === 0 ? 'Hypertension' : idx % 6 === 0 ? 'Type 2 Diabetes' : 'None',
    department: dept,
    assigned_doctor: docObj.name,
    appointment_time,
    visit_type: idx % 3 === 0 ? 'Follow-up' : 'New Visit',
    status,
    current_vitals: {
      bp: `${118 + (idx % 15)}/${78 + (idx % 10)}`,
      pulse: `${72 + (idx % 12)} bpm`,
      temp: `${98.4 + ((idx % 5) * 0.2)} °F`,
      spo2: `${97 + (idx % 3)}%`,
    },
    consultation_details: {
      chief_complaint: `Patient presents with complaints related to ${dept.toLowerCase()} symptoms for ${ (idx % 5) + 1 } days.`,
      symptoms: `Mild discomfort, fatigue, localized pain during routine activity.`,
      medical_history: `No prior surgeries. Managed under outpatient OPD care.`,
      examination: `Normal S1/S2 heart sounds. Chest clear on auscultation. Abdomen soft, non-tender.`,
      diagnosis: `Clinical diagnosis: ${dept} OPD evaluation - Mild ${dept} Disorder.`,
      clinical_notes: `Advised routine diagnostic tests, lifestyle modifications, and prescribed symptomatic treatment.`,
      treatment_plan: `Complete 5-day course of prescribed medication. Rest and adequate hydration.`,
      follow_up_date: `2026-08-24`,
    },
    billing: {
      consultation_fee: 500,
      registration_fee: 200,
      total_amount: 700,
      invoice_number: `INV-2026-${String(100 + idx).padStart(4, '0')}`,
      payment_status: 'Paid',
    },
  };
});

// Historic OPD Visit Records for Returning Patients
export const demoOPDPreviousVisits: Record<string, OPDVisitHistory[]> = {
  'OPD-P001': [
    {
      visit_id: 'VIS-2026-0820',
      date: '20 Aug 2026',
      department: 'Cardiology',
      doctor_name: 'Dr. Arjun Mehta',
      visit_type: 'Follow-up Consultation',
      diagnosis: 'Stable Angina Pectoris',
      treatment_plan: 'Continue Aspirin 75mg daily and Atorvastatin 20mg. TMT review normal.',
      prescribed_medicines: ['Aspirin 75mg (1-0-0)', 'Atorvastatin 20mg (0-0-1)', 'Metoprolol 25mg (1-0-0)'],
    },
    {
      visit_id: 'VIS-2026-0715',
      date: '15 Jul 2026',
      department: 'Cardiology',
      doctor_name: 'Dr. Arjun Mehta',
      visit_type: 'Consultation & ECG Review',
      diagnosis: 'Exertional Angina',
      treatment_plan: 'Advised Lipid Profile, TMT Test, and dietary salt restriction.',
      prescribed_medicines: ['Aspirin 75mg', 'Nitroglycerin 0.5mg SL prn'],
    },
    {
      visit_id: 'VIS-2026-0610',
      date: '10 Jun 2026',
      department: 'General Medicine',
      doctor_name: 'Dr. Vikram Rao',
      visit_type: 'Initial OPD Visit',
      diagnosis: 'Mild Hypertension & Fatigue',
      treatment_plan: 'Baseline blood work & lifestyle modification.',
      prescribed_medicines: ['Amlodipine 5mg (1-0-0)'],
    },
  ],
  'OPD-P002': [
    {
      visit_id: 'VIS-2026-0818',
      date: '18 Aug 2026',
      department: 'Dermatology',
      doctor_name: 'Dr. Nisha Patel',
      visit_type: 'Skin Follow-up',
      diagnosis: 'Allergic Contact Dermatitis',
      treatment_plan: 'Topical Hydrocortisone cream twice daily for 7 days.',
      prescribed_medicines: ['Hydrocortisone 1% Cream', 'Cetirizine 10mg'],
    },
  ],
};

// OPD Lab Requests List
export const demoOPDLabRequests: OPDLabRequest[] = [
  {
    id: 'lab-req-1',
    request_number: 'LIS-2026-001',
    patient_id: 'OPD-P001',
    patient_name: 'Aarav Sharma',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    test_names: ['Complete Blood Count (CBC)', 'Fasting Blood Sugar', 'Lipid Profile'],
    request_date: '17 Aug 2026',
    status: 'Report Finalized',
    report_summary: 'Hb: 14.2 g/dL, Total Cholesterol: 185 mg/dL, Fasting Sugar: 98 mg/dL. All values within normal clinical range.',
  },
  {
    id: 'lab-req-2',
    request_number: 'LIS-2026-002',
    patient_id: 'OPD-P003',
    patient_name: 'Rohan Verma',
    doctor_name: 'Dr. Vikram Rao',
    department: 'General Medicine',
    test_names: ['HbA1c', 'Kidney Function Test (KFT)', 'Serum Electrolytes'],
    request_date: '17 Aug 2026',
    status: 'Processing',
    report_summary: 'Blood sample received & currently under automated analyzer assay.',
  },
];

// OPD Radiology Requests List
export const demoOPDRadiologyRequests: OPDRadiologyRequest[] = [
  {
    id: 'rad-req-1',
    request_number: 'RIS-2026-001',
    patient_id: 'OPD-P001',
    patient_name: 'Aarav Sharma',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    modality: 'Echocardiogram',
    body_part: 'Cardiac Echo 2D',
    request_date: '17 Aug 2026',
    status: 'Report Ready',
    findings: 'Normal LV Systolic Function. LVEF 62%. No regional wall motion abnormality detected.',
  },
  {
    id: 'rad-req-2',
    request_number: 'RIS-2026-002',
    patient_id: 'OPD-P005',
    patient_name: 'Kabir Singh',
    doctor_name: 'Dr. Karan Shah',
    department: 'Orthopedics',
    modality: 'X-Ray',
    body_part: 'Right Knee Joint (AP & Lateral)',
    request_date: '17 Aug 2026',
    status: 'Scan Completed',
    findings: 'X-Ray scan acquired. Radiologist review pending.',
  },
];

// OPD Prescriptions List
export const demoOPDPrescriptions: OPDPrescriptionItem[] = [
  {
    id: 'rx-1',
    prescription_number: 'RX-2026-001',
    patient_id: 'OPD-P001',
    patient_name: 'Aarav Sharma',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    date: '17 Aug 2026',
    status: 'Dispensed',
    medicines: [
      { name: 'Aspirin 75mg', dosage: '75mg', frequency: '1-0-0', duration: '30 Days', instructions: 'Take after breakfast' },
      { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: '0-0-1', duration: '30 Days', instructions: 'Take at bedtime' },
      { name: 'Metoprolol 25mg', dosage: '25mg', frequency: '1-0-0', duration: '30 Days', instructions: 'Take after meals' },
    ],
  },
  {
    id: 'rx-2',
    prescription_number: 'RX-2026-002',
    patient_id: 'OPD-P002',
    patient_name: 'Anika Rao',
    doctor_name: 'Dr. Nisha Patel',
    department: 'Dermatology',
    date: '17 Aug 2026',
    status: 'Pending',
    medicines: [
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: '0-0-1', duration: '10 Days', instructions: 'Take before bed' },
      { name: 'Hydrocortisone 1% Ointment', dosage: 'Topical', frequency: '2 times daily', duration: '7 Days', instructions: 'Apply to affected skin area' },
    ],
  },
];
