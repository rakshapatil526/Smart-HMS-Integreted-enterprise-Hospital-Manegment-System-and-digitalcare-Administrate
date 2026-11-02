import {
  NursePatient,
  NurseVitalEntry,
  NursingNoteEntry,
  MedicationAdminEntry,
  CarePlanTask,
  DoctorInstructionItem,
  ShiftHandoverNote,
  NurseNotificationItem
} from '../../types';

export const initialNursePatients: NursePatient[] = [
  {
    id: 'pat-a',
    patient_id: 'PAT-2026-0001',
    name: 'Patient A (Aarav Sharma)',
    age: 45,
    gender: 'Male',
    blood_group: 'A+',
    allergies: 'Penicillin',
    doctor_name: 'Dr. Rajesh Sharma (Cardiology)',
    ward_name: 'General Ward',
    room_number: '102',
    bed_number: 'B102',
    status: 'Stable',
    admission_date: '17 Aug 2026',
    vitals_pending: true,
    meds_pending: true,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'
  },
  {
    id: 'pat-b',
    patient_id: 'PAT-2026-0002',
    name: 'Patient B (Ananya Verma)',
    age: 34,
    gender: 'Female',
    blood_group: 'B+',
    allergies: 'Dust Mites',
    doctor_name: 'Dr. Sunita Kapoor (Neurology)',
    ward_name: 'ICU Ward',
    room_number: '105',
    bed_number: 'B105',
    status: 'Critical',
    admission_date: '16 Aug 2026',
    vitals_pending: true,
    meds_pending: true,
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
  },
  {
    id: 'pat-c',
    patient_id: 'PAT-2026-0003',
    name: 'Patient C (Rohan Mehta)',
    age: 52,
    gender: 'Male',
    blood_group: 'O+',
    allergies: 'Peanuts',
    doctor_name: 'Dr. Rajesh Sharma (Cardiology)',
    ward_name: 'General Ward',
    room_number: '110',
    bed_number: 'B110',
    status: 'Critical',
    admission_date: '15 Aug 2026',
    vitals_pending: true,
    meds_pending: false
  },
  {
    id: 'pat-d',
    patient_id: 'PAT-2026-0004',
    name: 'Patient D (Priya Nair)',
    age: 29,
    gender: 'Female',
    blood_group: 'AB+',
    allergies: 'None',
    doctor_name: 'Dr. Suresh Gupta (Orthopedics)',
    ward_name: 'General Ward',
    room_number: '112',
    bed_number: 'B112',
    status: 'Stable',
    admission_date: '14 Aug 2026',
    vitals_pending: false,
    meds_pending: true
  },
  {
    id: 'pat-e',
    patient_id: 'PAT-2026-0005',
    name: 'Patient E (Vikram Singh)',
    age: 61,
    gender: 'Male',
    blood_group: 'A-',
    allergies: 'Aspirin',
    doctor_name: 'Dr. Rajesh Sharma (Cardiology)',
    ward_name: 'General Ward',
    room_number: '115',
    bed_number: 'B115',
    status: 'Recovery',
    admission_date: '12 Aug 2026',
    vitals_pending: false,
    meds_pending: false
  },
  {
    id: 'pat-f',
    patient_id: 'PAT-2026-0006',
    name: 'Patient F (Sneha Patel)',
    age: 38,
    gender: 'Female',
    blood_group: 'O-',
    allergies: 'Latex',
    doctor_name: 'Dr. Sunita Kapoor (Neurology)',
    ward_name: 'General Ward',
    room_number: '118',
    bed_number: 'B118',
    status: 'Monitoring',
    admission_date: '16 Aug 2026',
    vitals_pending: false,
    meds_pending: true
  },
  {
    id: 'pat-g',
    patient_id: 'PAT-2026-0007',
    name: 'Patient G (Rahul Gupta)',
    age: 48,
    gender: 'Male',
    blood_group: 'B-',
    allergies: 'Sulfa Drugs',
    doctor_name: 'Dr. Suresh Gupta (Orthopedics)',
    ward_name: 'General Ward',
    room_number: '120',
    bed_number: 'B120',
    status: 'Stable',
    admission_date: '13 Aug 2026',
    vitals_pending: false,
    meds_pending: false
  },
  {
    id: 'pat-h',
    patient_id: 'PAT-2026-0008',
    name: 'Patient H (Ishita Chawla)',
    age: 26,
    gender: 'Female',
    blood_group: 'AB-',
    allergies: 'None',
    doctor_name: 'Dr. Rajesh Sharma (Cardiology)',
    ward_name: 'General Ward',
    room_number: '122',
    bed_number: 'B122',
    status: 'Recovery',
    admission_date: '11 Aug 2026',
    vitals_pending: false,
    meds_pending: false
  }
];

export const initialNurseVitals: NurseVitalEntry[] = [
  {
    id: 'vtl-101',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    temperature: '98.6 °F',
    bp_systolic: 120,
    bp_diastolic: 80,
    pulse: 78,
    spo2: 98,
    respiratory_rate: 18,
    timestamp: '08:00 AM',
    recorded_by: 'Nurse Sarah Jenkins',
    attention_required: false
  },
  {
    id: 'vtl-102',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    temperature: '98.7 °F',
    bp_systolic: 118,
    bp_diastolic: 78,
    pulse: 82,
    spo2: 97,
    respiratory_rate: 17,
    timestamp: '12:00 PM',
    recorded_by: 'Nurse Sarah Jenkins',
    attention_required: false
  },
  {
    id: 'vtl-103',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    temperature: '99.1 °F',
    bp_systolic: 125,
    bp_diastolic: 82,
    pulse: 85,
    spo2: 97,
    respiratory_rate: 19,
    timestamp: '04:00 PM',
    recorded_by: 'Nurse Sarah Jenkins',
    attention_required: false
  },
  {
    id: 'vtl-104',
    patient_id: 'pat-b',
    patient_name: 'Patient B (Ananya Verma)',
    bed_number: 'B105',
    temperature: '101.4 °F',
    bp_systolic: 145,
    bp_diastolic: 95,
    pulse: 104,
    spo2: 93,
    respiratory_rate: 22,
    timestamp: '07:30 AM',
    recorded_by: 'Nurse Sarah Jenkins',
    attention_required: true
  }
];

export const initialNursingNotes: NursingNoteEntry[] = [
  {
    id: 'note-01',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    observation: 'Patient resting comfortably in bed. No shortness of breath reported.',
    patient_condition: 'Stable with mild chest sensation on deep inspiration.',
    care_provided: 'Administered oral fluids, performed vital checks, positioned head of bed at 30 degrees.',
    additional_note: 'Patient resting comfortably. No immediate complaints.',
    recorded_at: '17 Aug 2026, 08:30 AM',
    recorded_by: 'Nurse Sarah Jenkins',
    is_finalized: true
  },
  {
    id: 'note-02',
    patient_id: 'pat-b',
    patient_name: 'Patient B (Ananya Verma)',
    bed_number: 'B105',
    observation: 'Patient exhibiting mild restlessness and elevated temperature.',
    patient_condition: 'Febrile, alert to voice.',
    care_provided: 'Applied cold compress, notified attending Dr. Sunita Kapoor, monitored O2 saturation.',
    additional_note: 'Doctor requested stat blood draw and repeat vitals in 2 hours.',
    recorded_at: '17 Aug 2026, 07:45 AM',
    recorded_by: 'Nurse Sarah Jenkins',
    is_finalized: true
  }
];

export const initialMedicationAdmin: MedicationAdminEntry[] = [
  {
    id: 'med-01',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    medicine_name: 'Medicine A (Paracetamol 500mg)',
    dosage: '500mg',
    scheduled_time: '08:00 AM',
    status: 'Given',
    administered_at: '08:05 AM',
    administered_by: 'Nurse Sarah Jenkins',
    doctor_prescription_ref: 'RX-CARD-2026-041'
  },
  {
    id: 'med-02',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    medicine_name: 'Medicine B (Amlodipine 10mg)',
    dosage: '10mg',
    scheduled_time: '12:00 PM',
    status: 'Pending',
    doctor_prescription_ref: 'RX-CARD-2026-041'
  },
  {
    id: 'med-03',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    medicine_name: 'Medicine C (Pantoprazole 40mg)',
    dosage: '1 tablet',
    scheduled_time: '08:00 PM',
    status: 'Pending',
    doctor_prescription_ref: 'RX-CARD-2026-041'
  },
  {
    id: 'med-04',
    patient_id: 'pat-b',
    patient_name: 'Patient B (Ananya Verma)',
    bed_number: 'B105',
    medicine_name: 'IV Ceftriaxone 1g',
    dosage: '1g IV infusion',
    scheduled_time: '09:00 AM',
    status: 'Pending',
    doctor_prescription_ref: 'RX-NEUR-2026-088'
  }
];

export const initialCarePlans: CarePlanTask[] = [
  {
    id: 'task-01',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    task_name: 'Monitor BP every 4 hours',
    category: 'Vitals Monitoring',
    status: 'Completed',
    assigned_time: '08:00 AM',
    updated_at: '08:10 AM',
    updated_by: 'Nurse Sarah Jenkins'
  },
  {
    id: 'task-02',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    task_name: 'Check temperature',
    category: 'Vitals Monitoring',
    status: 'Completed',
    assigned_time: '08:00 AM',
    updated_at: '08:10 AM',
    updated_by: 'Nurse Sarah Jenkins'
  },
  {
    id: 'task-03',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    task_name: 'Medication Administration',
    category: 'Pharmacy',
    status: 'Pending',
    assigned_time: '12:00 PM'
  },
  {
    id: 'task-04',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    task_name: 'Wound care & sterile dressing',
    category: 'Nursing Care',
    status: 'Pending',
    assigned_time: '02:00 PM'
  },
  {
    id: 'task-05',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    task_name: 'Patient observation & mobility check',
    category: 'Nursing Care',
    status: 'Completed',
    assigned_time: '07:30 AM',
    updated_at: '07:45 AM',
    updated_by: 'Nurse Sarah Jenkins'
  }
];

export const initialDoctorInstructions: DoctorInstructionItem[] = [
  {
    id: 'inst-01',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    doctor_name: 'Dr. Rajesh Sharma',
    instruction_text: '• Monitor BP every 4 hours\n• Record temperature\n• Administer prescribed medication\n• Report abnormal readings immediately',
    issued_at: '08:30 AM',
    status: 'Active'
  },
  {
    id: 'inst-02',
    patient_id: 'pat-b',
    patient_name: 'Patient B (Ananya Verma)',
    bed_number: 'B105',
    doctor_name: 'Dr. Sunita Kapoor',
    instruction_text: '• Maintain strict continuous SPO2 telemetry monitoring\n• Keep head elevated 30 degrees\n• Call attending if Temp exceeds 101°F',
    issued_at: '07:15 AM',
    status: 'Active'
  }
];

export const initialShiftHandovers: ShiftHandoverNote[] = [
  {
    id: 'hnd-01',
    shift_from: 'Night Shift',
    shift_to: 'Morning Shift',
    patient_id: 'pat-a',
    patient_name: 'Patient A (Aarav Sharma)',
    bed_number: 'B102',
    current_condition: 'Stable. Slept 6 hours soundly without complaints.',
    important_notes: 'Medication due at 12 PM & 8 PM. Maintain low-sodium diet.',
    pending_tasks: 'Monitor BP at 12:00 PM and collect routine morning blood sample.',
    created_at: '17 Aug 2026, 07:00 AM',
    created_by: 'Nurse Mark Davis (Night Shift)'
  }
];

export const initialNurseNotifications: NurseNotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Doctor added new instruction',
    message: 'Dr. Rajesh Sharma added a new monitoring instruction for Patient A (B102).',
    category: 'instruction',
    timestamp: '08:30 AM',
    read: false,
    patient_id: 'pat-a',
    target_tab: 'vitals'
  },
  {
    id: 'notif-02',
    title: 'Medication due',
    message: 'Medicine B (10mg) scheduled for Patient A at 12:00 PM is pending.',
    category: 'medication',
    timestamp: '08:15 AM',
    read: false,
    patient_id: 'pat-a',
    target_tab: 'medications'
  },
  {
    id: 'notif-03',
    title: 'Attention Required - Abnormal Vital Sign',
    message: 'Patient B (B105) recorded Temp 101.4°F and SpO2 93%. Clinical review required.',
    category: 'vitals',
    timestamp: '07:35 AM',
    read: false,
    patient_id: 'pat-b',
    target_tab: 'vitals'
  },
  {
    id: 'notif-04',
    title: 'New patient assigned',
    message: 'Patient C (Rohan Mehta) assigned to Ward General Bed B110.',
    category: 'assignment',
    timestamp: '07:00 AM',
    read: true,
    patient_id: 'pat-c',
    target_tab: 'patients'
  },
  {
    id: 'notif-05',
    title: 'Care task pending',
    message: 'Wound care dressing task pending for Patient A (B102).',
    category: 'task',
    timestamp: '06:45 AM',
    read: true,
    patient_id: 'pat-a',
    target_tab: 'care-plans'
  }
];

export const initialNurseProfile = {
  name: 'Nurse Sarah Jenkins',
  nurse_id: 'NRS-2026-084',
  department: 'Inpatient Nursing Care',
  ward: 'General Ward & ICU',
  shift: 'Morning (07:00 AM - 03:30 PM)',
  phone: '+1 (555) 234-8901',
  email: 'nurse@smartcare.com',
  bio: 'Certified Registered Nurse (RN) with 8+ years of inpatient care, critical care telemetry, and patient recovery management experience.',
  emergency_contact: 'David Jenkins (+1 555-987-6543)'
};
