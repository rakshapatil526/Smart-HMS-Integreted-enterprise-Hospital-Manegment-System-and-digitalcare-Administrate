export interface BloodDonor {
  id: string;
  donor_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  last_donation_date: string;
  weight_kg: number;
  hemoglobin_gdl: number;
  eligibility_status: 'Eligible ✓' | 'Temporarily Ineligible' | 'Permanently Deferred';
  total_donations: number;
  address: string;
}

export interface BloodInventoryUnit {
  id: string;
  barcode_id: string;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component_type: 'Whole Blood' | 'PRBC (Packed Red Cells)' | 'FFP (Fresh Frozen Plasma)' | 'Platelet Concentrate' | 'Cryoprecipitate';
  volume_ml: number;
  collection_date: string;
  expiry_date: string;
  storage_location: string;
  screening_status: 'Passed ✓' | 'Pending' | 'Reactive / Failed ❌';
  unit_status: 'Available' | 'Reserved / Cross-matched' | 'Issued' | 'Quarantine' | 'Disposed';
  donor_id: string;
}

export interface BloodScreeningRecord {
  id: string;
  barcode_id: string;
  blood_group: string;
  hiv_status: 'Non-Reactive ✓' | 'Reactive ❌';
  hbsag_status: 'Non-Reactive ✓' | 'Reactive ❌';
  hcv_status: 'Non-Reactive ✓' | 'Reactive ❌';
  vdrl_status: 'Non-Reactive ✓' | 'Reactive ❌';
  malaria_status: 'Negative ✓' | 'Positive ❌';
  abo_rh_verified: boolean;
  testing_date: string;
  technician_name: string;
  final_result: 'Passed ✓' | 'Failed ❌' | 'Pending';
}

export interface BloodRequestItem {
  id: string;
  request_no: string;
  patient_name: string;
  patient_id: string;
  ward_dept: string;
  doctor_name: string;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  component_type: 'Whole Blood' | 'PRBC (Packed Red Cells)' | 'FFP (Fresh Frozen Plasma)' | 'Platelet Concentrate' | 'Cryoprecipitate';
  units_requested: number;
  urgency: 'STAT / Emergency 🚨' | 'Urgent' | 'Routine';
  request_date: string;
  status: 'Pending Verification' | 'Cross-Matched' | 'Issued ✓' | 'Cancelled';
  reserved_barcodes: string[];
}

export interface BloodCrossMatchRecord {
  id: string;
  match_id: string;
  request_no: string;
  patient_name: string;
  patient_blood_group: string;
  donor_barcode: string;
  major_crossmatch: 'Compatible ✓' | 'Incompatible ❌';
  minor_crossmatch: 'Compatible ✓' | 'Incompatible ❌';
  coombs_test: 'Negative ✓' | 'Positive ❌';
  technician: string;
  match_date: string;
  overall_compatibility: 'Compatible ✓' | 'Incompatible ❌';
}

export interface BloodDisposalRecord {
  id: string;
  disposal_id: string;
  barcode_id: string;
  blood_group: string;
  component_type: string;
  expiry_date: string;
  disposal_date: string;
  reason: 'Expired Shelf-Life' | 'Serology Reactive' | 'Hemolyzed / Clotted' | 'Bag Leakage / Damage';
  disposed_by: string;
  method: 'Autoclave & Incineration (Biohazard Category 1)';
}

// Initial Sample Data
export const INITIAL_DONORS: BloodDonor[] = [
  {
    id: 'D-101',
    donor_id: 'DNR-2026-001',
    name: 'Vikramaditya Sharma',
    age: 32,
    gender: 'Male',
    blood_group: 'O+',
    phone: '+91 98450 11223',
    email: 'vikram.sharma@example.com',
    last_donation_date: '2026-06-15',
    weight_kg: 74,
    hemoglobin_gdl: 14.5,
    eligibility_status: 'Eligible ✓',
    total_donations: 6,
    address: 'Indiranagar, Bengaluru'
  },
  {
    id: 'D-102',
    donor_id: 'DNR-2026-002',
    name: 'Priya Sundaram',
    age: 27,
    gender: 'Female',
    blood_group: 'A+',
    phone: '+91 98765 43210',
    email: 'priya.s@example.com',
    last_donation_date: '2026-05-20',
    weight_kg: 58,
    hemoglobin_gdl: 13.2,
    eligibility_status: 'Eligible ✓',
    total_donations: 3,
    address: 'Koramangala, Bengaluru'
  },
  {
    id: 'D-103',
    donor_id: 'DNR-2026-003',
    name: 'Mohammed Rizwan',
    age: 41,
    gender: 'Male',
    blood_group: 'B+',
    phone: '+91 99123 88776',
    email: 'm.rizwan@example.com',
    last_donation_date: '2026-04-10',
    weight_kg: 82,
    hemoglobin_gdl: 15.1,
    eligibility_status: 'Eligible ✓',
    total_donations: 12,
    address: 'Jayanagar, Bengaluru'
  },
  {
    id: 'D-104',
    donor_id: 'DNR-2026-004',
    name: 'Ananya Deshmukh',
    age: 24,
    gender: 'Female',
    blood_group: 'AB+',
    phone: '+91 97400 55667',
    email: 'ananya.d@example.com',
    last_donation_date: '2026-07-01',
    weight_kg: 52,
    hemoglobin_gdl: 12.8,
    eligibility_status: 'Eligible ✓',
    total_donations: 2,
    address: 'Whitefield, Bengaluru'
  },
  {
    id: 'D-105',
    donor_id: 'DNR-2026-005',
    name: 'Rajesh Kulkarni',
    age: 48,
    gender: 'Male',
    blood_group: 'O-',
    phone: '+91 96111 22334',
    email: 'rajesh.k@example.com',
    last_donation_date: '2026-03-18',
    weight_kg: 78,
    hemoglobin_gdl: 14.8,
    eligibility_status: 'Eligible ✓',
    total_donations: 18,
    address: 'Malleshwaram, Bengaluru'
  },
  {
    id: 'D-106',
    donor_id: 'DNR-2026-006',
    name: 'Kavita Menon',
    age: 29,
    gender: 'Female',
    blood_group: 'A-',
    phone: '+91 98800 44332',
    email: 'kavita.m@example.com',
    last_donation_date: '2026-09-01',
    weight_kg: 48,
    hemoglobin_gdl: 11.5,
    eligibility_status: 'Temporarily Ineligible',
    total_donations: 1,
    address: 'HSR Layout, Bengaluru'
  }
];

export const INITIAL_INVENTORY: BloodInventoryUnit[] = [
  {
    id: 'U-001',
    barcode_id: 'BB-O-2026-901',
    blood_group: 'O+',
    component_type: 'PRBC (Packed Red Cells)',
    volume_ml: 350,
    collection_date: '2026-09-10',
    expiry_date: '2026-10-22',
    storage_location: 'Cold Room 1 (Shelf A-02)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-001'
  },
  {
    id: 'U-002',
    barcode_id: 'BB-O-2026-902',
    blood_group: 'O+',
    component_type: 'PRBC (Packed Red Cells)',
    volume_ml: 350,
    collection_date: '2026-09-12',
    expiry_date: '2026-10-24',
    storage_location: 'Cold Room 1 (Shelf A-03)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-001'
  },
  {
    id: 'U-003',
    barcode_id: 'BB-O-2026-903',
    blood_group: 'O-',
    component_type: 'PRBC (Packed Red Cells)',
    volume_ml: 350,
    collection_date: '2026-09-15',
    expiry_date: '2026-10-27',
    storage_location: 'Emergency Reserve Locker (ER-01)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-005'
  },
  {
    id: 'U-004',
    barcode_id: 'BB-A-2026-801',
    blood_group: 'A+',
    component_type: 'FFP (Fresh Frozen Plasma)',
    volume_ml: 200,
    collection_date: '2026-08-01',
    expiry_date: '2027-08-01',
    storage_location: 'Deep Freezer F-02 (-30°C)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-002'
  },
  {
    id: 'U-005',
    barcode_id: 'BB-B-2026-701',
    blood_group: 'B+',
    component_type: 'Platelet Concentrate',
    volume_ml: 60,
    collection_date: '2026-09-24',
    expiry_date: '2026-09-29',
    storage_location: 'Platelet Agitator PA-01 (22°C)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-003'
  },
  {
    id: 'U-006',
    barcode_id: 'BB-AB-2026-601',
    blood_group: 'AB+',
    component_type: 'Cryoprecipitate',
    volume_ml: 15,
    collection_date: '2026-08-15',
    expiry_date: '2027-08-15',
    storage_location: 'Deep Freezer F-01 (-30°C)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-004'
  },
  {
    id: 'U-007',
    barcode_id: 'BB-A-2026-802',
    blood_group: 'A-',
    component_type: 'PRBC (Packed Red Cells)',
    volume_ml: 350,
    collection_date: '2026-09-01',
    expiry_date: '2026-10-13',
    storage_location: 'Cold Room 2 (Shelf B-01)',
    screening_status: 'Passed ✓',
    unit_status: 'Available',
    donor_id: 'DNR-2026-006'
  },
  {
    id: 'U-008',
    barcode_id: 'BB-B-2026-702',
    blood_group: 'B-',
    component_type: 'Whole Blood',
    volume_ml: 450,
    collection_date: '2026-09-18',
    expiry_date: '2026-10-23',
    storage_location: 'Quarantine Fridge Q-01',
    screening_status: 'Pending',
    unit_status: 'Quarantine',
    donor_id: 'DNR-2026-003'
  }
];

export const INITIAL_SCREENINGS: BloodScreeningRecord[] = [
  {
    id: 'SCR-001',
    barcode_id: 'BB-O-2026-901',
    blood_group: 'O+',
    hiv_status: 'Non-Reactive ✓',
    hbsag_status: 'Non-Reactive ✓',
    hcv_status: 'Non-Reactive ✓',
    vdrl_status: 'Non-Reactive ✓',
    malaria_status: 'Negative ✓',
    abo_rh_verified: true,
    testing_date: '2026-09-11',
    technician_name: 'Tech Ramesh Kumar',
    final_result: 'Passed ✓'
  },
  {
    id: 'SCR-002',
    barcode_id: 'BB-A-2026-801',
    blood_group: 'A+',
    hiv_status: 'Non-Reactive ✓',
    hbsag_status: 'Non-Reactive ✓',
    hcv_status: 'Non-Reactive ✓',
    vdrl_status: 'Non-Reactive ✓',
    malaria_status: 'Negative ✓',
    abo_rh_verified: true,
    testing_date: '2026-08-02',
    technician_name: 'Tech Ramesh Kumar',
    final_result: 'Passed ✓'
  },
  {
    id: 'SCR-003',
    barcode_id: 'BB-O-2026-903',
    blood_group: 'O-',
    hiv_status: 'Non-Reactive ✓',
    hbsag_status: 'Non-Reactive ✓',
    hcv_status: 'Non-Reactive ✓',
    vdrl_status: 'Non-Reactive ✓',
    malaria_status: 'Negative ✓',
    abo_rh_verified: true,
    testing_date: '2026-09-16',
    technician_name: 'Tech Ramesh Kumar',
    final_result: 'Passed ✓'
  }
];

export const INITIAL_REQUESTS: BloodRequestItem[] = [
  {
    id: 'REQ-501',
    request_no: 'BRQ-2026-101',
    patient_name: 'Vikram Singh',
    patient_id: 'PAT-2026-003',
    ward_dept: 'Cardiology ICU (Bed #104)',
    doctor_name: 'Dr. Sarah Jenkins',
    blood_group: 'O+',
    component_type: 'PRBC (Packed Red Cells)',
    units_requested: 2,
    urgency: 'STAT / Emergency 🚨',
    request_date: '2026-09-27 08:30 AM',
    status: 'Cross-Matched',
    reserved_barcodes: ['BB-O-2026-901', 'BB-O-2026-902']
  },
  {
    id: 'REQ-502',
    request_no: 'BRQ-2026-102',
    patient_name: 'Lakshmi Narayan',
    patient_id: 'PAT-2026-024',
    ward_dept: 'Operation Theatre (OT #2)',
    doctor_name: 'Dr. Arjun Mehta',
    blood_group: 'A+',
    component_type: 'FFP (Fresh Frozen Plasma)',
    units_requested: 1,
    urgency: 'Urgent',
    request_date: '2026-09-27 09:15 AM',
    status: 'Pending Verification',
    reserved_barcodes: []
  },
  {
    id: 'REQ-503',
    request_no: 'BRQ-2026-103',
    patient_name: 'Deepak Gupta',
    patient_id: 'PAT-2026-009',
    ward_dept: 'Surgical Ward (Bed #202)',
    doctor_name: 'Dr. Arjun Mehta',
    blood_group: 'O-',
    component_type: 'PRBC (Packed Red Cells)',
    units_requested: 1,
    urgency: 'Routine',
    request_date: '2026-09-26 02:00 PM',
    status: 'Issued ✓',
    reserved_barcodes: ['BB-O-2026-903']
  }
];

export const INITIAL_CROSSMATCHES: BloodCrossMatchRecord[] = [
  {
    id: 'XM-101',
    match_id: 'XMATCH-2026-01',
    request_no: 'BRQ-2026-101',
    patient_name: 'Vikram Singh',
    patient_blood_group: 'O+',
    donor_barcode: 'BB-O-2026-901',
    major_crossmatch: 'Compatible ✓',
    minor_crossmatch: 'Compatible ✓',
    coombs_test: 'Negative ✓',
    technician: 'Senior Serologist Dr. Anita Patel',
    match_date: '2026-09-27 08:45 AM',
    overall_compatibility: 'Compatible ✓'
  },
  {
    id: 'XM-102',
    match_id: 'XMATCH-2026-02',
    request_no: 'BRQ-2026-101',
    patient_name: 'Vikram Singh',
    patient_blood_group: 'O+',
    donor_barcode: 'BB-O-2026-902',
    major_crossmatch: 'Compatible ✓',
    minor_crossmatch: 'Compatible ✓',
    coombs_test: 'Negative ✓',
    technician: 'Senior Serologist Dr. Anita Patel',
    match_date: '2026-09-27 08:50 AM',
    overall_compatibility: 'Compatible ✓'
  }
];

export const INITIAL_DISPOSALS: BloodDisposalRecord[] = [
  {
    id: 'DISP-001',
    disposal_id: 'DISP-2026-088',
    barcode_id: 'BB-AB-2026-505',
    blood_group: 'AB-',
    component_type: 'Platelet Concentrate',
    expiry_date: '2026-09-15',
    disposal_date: '2026-09-16',
    reason: 'Expired Shelf-Life',
    disposed_by: 'Safety Officer Suresh V',
    method: 'Autoclave & Incineration (Biohazard Category 1)'
  },
  {
    id: 'DISP-002',
    disposal_id: 'DISP-2026-089',
    barcode_id: 'BB-B-2026-402',
    blood_group: 'B+',
    component_type: 'PRBC (Packed Red Cells)',
    expiry_date: '2026-10-10',
    disposal_date: '2026-09-14',
    reason: 'Serology Reactive',
    disposed_by: 'Safety Officer Suresh V',
    method: 'Autoclave & Incineration (Biohazard Category 1)'
  }
];
