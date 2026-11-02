export interface RISRequest {
  id: string;
  request_id: string;
  name?: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: string;
  doctor_name: string;
  department: string;
  investigation: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound' | 'Echocardiography';
  body_part: string;
  priority: 'Normal' | 'Urgent' | 'STAT Emergency';
  clinical_reason: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Scheduled' | 'Scan Completed' | 'Report Drafted' | 'Finalized';
  cost: number;
}

export interface RISSchedule {
  id: string;
  request_id: string;
  patient_name: string;
  investigation: string;
  scheduled_date: string;
  scheduled_time: string;
  machine_id: string;
  technician_name: string;
  status: 'Scheduled' | 'Patient Arrived' | 'In Progress' | 'Completed';
}

export interface RISImagingStudy {
  id: string;
  request_id: string;
  patient_id: string;
  patient_name: string;
  investigation: string;
  study_date: string;
  image_urls: string[];
  total_series: number;
  total_images: number;
  pacs_accession_no: string;
  status: 'Acquired' | 'Archived in PACS';
}

export interface RISReport {
  id: string;
  report_id: string;
  request_id: string;
  patient_id: string;
  patient_name: string;
  investigation: string;
  doctor_name: string;
  radiologist_name: string;
  date: string;
  clinical_history: string;
  findings: string;
  impression: string;
  recommendations: string;
  status: 'Draft' | 'Reviewed' | 'Finalized';
  pdf_ref: string;
}

// Initial Radiology Requests State
export const initialRISRequests: RISRequest[] = [
  {
    id: 'req-1',
    request_id: 'RAD-2026-001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Neurology & Cardiology',
    investigation: 'MRI',
    body_part: 'Brain & Cardiac Protocol',
    priority: 'Urgent',
    clinical_reason: 'Evaluation of persistent headaches, focal neurological signs, and exertional angina',
    date: '17 Aug 2026',
    status: 'Pending',
    cost: 450,
  },
  {
    id: 'req-2',
    request_id: 'RAD-2026-002',
    patient_id: 'SC-P002',
    name: 'Anika Patel',
    patient_name: 'Anika Patel',
    age: 29,
    gender: 'Female',
    doctor_name: 'Dr. Sarah Jenkins',
    department: 'General Medicine',
    investigation: 'X-Ray',
    body_part: 'Chest PA View',
    priority: 'Normal',
    clinical_reason: 'Fever with cough, ruling out pulmonary consolidation or viral pneumonia',
    date: '17 Aug 2026',
    status: 'Scheduled',
    cost: 120,
  },
  {
    id: 'req-3',
    request_id: 'RAD-2026-003',
    patient_id: 'SC-P003',
    name: 'Rahul Verma',
    patient_name: 'Rahul Verma',
    age: 52,
    gender: 'Male',
    doctor_name: 'Dr. Vikram Rao',
    department: 'Pulmonology',
    investigation: 'CT Scan',
    body_part: 'HRCT Chest',
    priority: 'STAT Emergency',
    clinical_reason: 'Severe acute hypoxemia and desaturation in ICU',
    date: '17 Aug 2026',
    status: 'Scan Completed',
    cost: 380,
  },
  {
    id: 'req-4',
    request_id: 'RAD-2026-004',
    patient_id: 'SC-P005',
    name: 'Rajesh Kumar',
    patient_name: 'Rajesh Kumar',
    age: 61,
    gender: 'Male',
    doctor_name: 'Dr. Priya Nair',
    department: 'Gastroenterology',
    investigation: 'Ultrasound',
    body_part: 'Whole Abdomen & Pelvis',
    priority: 'Normal',
    clinical_reason: 'Right upper quadrant pain, evaluation for cholelithiasis',
    date: '16 Aug 2026',
    status: 'Finalized',
    cost: 200,
  },
  {
    id: 'req-5',
    request_id: 'RAD-2026-005',
    patient_id: 'SC-P004',
    name: 'Priya Singh',
    patient_name: 'Priya Singh',
    age: 44,
    gender: 'Female',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    investigation: 'Echocardiography',
    body_part: '2D Echo with Doppler',
    priority: 'Urgent',
    clinical_reason: 'Assessment of LV ejection fraction and valvular regurgitation',
    date: '17 Aug 2026',
    status: 'Accepted',
    cost: 280,
  },
];

// Initial Scan Schedules State
export const initialRISSchedules: RISSchedule[] = [
  {
    id: 'sch-1',
    request_id: 'RAD-2026-002',
    patient_name: 'Anika Patel',
    investigation: 'Chest X-Ray PA',
    scheduled_date: '17 Aug 2026',
    scheduled_time: '10:30 AM',
    machine_id: 'XRAY-ROOM-01',
    technician_name: 'Tech Marcus Brody',
    status: 'Scheduled',
  },
  {
    id: 'sch-2',
    request_id: 'RAD-2026-001',
    patient_name: 'Aarav Sharma',
    investigation: 'MRI Brain & Cardiac',
    scheduled_date: '17 Aug 2026',
    scheduled_time: '11:15 AM',
    machine_id: 'MRI-3T-SUITE-01',
    technician_name: 'Tech Sarah Connor',
    status: 'Patient Arrived',
  },
  {
    id: 'sch-3',
    request_id: 'RAD-2026-003',
    patient_name: 'Rahul Verma',
    investigation: 'HRCT Chest',
    scheduled_date: '17 Aug 2026',
    scheduled_time: '09:00 AM',
    machine_id: 'CT-64-SLICE-02',
    technician_name: 'Tech Dave Bowman',
    status: 'Completed',
  },
];

// Initial PACS Imaging Studies State
export const initialRISStudies: RISImagingStudy[] = [
  {
    id: 'std-1',
    request_id: 'RAD-2026-001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    investigation: 'MRI Brain Scan',
    study_date: '17 Aug 2026',
    image_urls: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
    ],
    total_series: 4,
    total_images: 128,
    pacs_accession_no: 'ACC-2026-9901',
    status: 'Archived in PACS',
  },
  {
    id: 'std-2',
    request_id: 'RAD-2026-003',
    patient_id: 'SC-P003',
    patient_name: 'Rahul Verma',
    investigation: 'HRCT Chest',
    study_date: '17 Aug 2026',
    image_urls: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    ],
    total_series: 2,
    total_images: 64,
    pacs_accession_no: 'ACC-2026-9902',
    status: 'Archived in PACS',
  },
];

// Initial Radiologist Reports State
export const initialRISReports: RISReport[] = [
  {
    id: 'rep-1',
    report_id: 'REP-2026-101',
    request_id: 'RAD-2026-004',
    patient_id: 'SC-P005',
    patient_name: 'Rajesh Kumar',
    investigation: 'Ultrasound Whole Abdomen',
    doctor_name: 'Dr. Priya Nair',
    radiologist_name: 'Dr. Robert Vance, MD (Radiology)',
    date: '16 Aug 2026',
    clinical_history: 'Right upper quadrant abdominal tenderness.',
    findings: 'Gallbladder is distended with a 7mm radiopaque calculus in the infundibulum. Gallbladder wall thickness is 4mm (mildly thickened). No pericholecystic fluid collection. Liver, spleen, and pancreas exhibit normal echotexture.',
    impression: '1. Acute calculus cholecystitis with 7mm impact stone at gallbladder neck.\n2. Otherwise unremarkable abdominal ultrasound examination.',
    recommendations: 'Surgical gastroenterology consultation for cholecystectomy evaluation.',
    status: 'Finalized',
    pdf_ref: 'RAD_REP_SC-P005.pdf',
  },
  {
    id: 'rep-2',
    report_id: 'REP-2026-102',
    request_id: 'RAD-2026-001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    investigation: 'MRI Brain & Cardiac Scan',
    doctor_name: 'Dr. Arjun Mehta',
    radiologist_name: 'Dr. Robert Vance, MD (Radiology)',
    date: '17 Aug 2026',
    clinical_history: 'Evaluation of persistent headache and exertional chest pain.',
    findings: 'Multi-planar cine and LGE T1/T2 cardiac MRI sequences. Left ventricular end-diastolic volume normal. Calculated LVEF ~ 62%. No subendocardial or transmural myocardial infarction scar. Brain parenchyma normal without midline shift.',
    impression: '1. Unremarkable Cardiac MRI examination with normal LV systolic function (LVEF ~ 62%).\n2. Normal Brain MRI study without focal acute ischemic stroke or intracranial mass effect.',
    recommendations: 'Outpatient clinical cardiology follow-up as indicated.',
    status: 'Finalized',
    pdf_ref: 'RAD_REP_SC-P001.pdf',
  },
];
