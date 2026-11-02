export type UserRole =
  | 'Patient'
  | 'Reception'
  | 'Doctor'
  | 'Nurse'
  | 'Laboratory Technician'
  | 'Radiologist'
  | 'Pharmacist'
  | 'OT Staff'
  | 'Billing Staff'
  | 'Insurance Staff'
  | 'Inventory Manager'
  | 'Blood Bank Staff'
  | 'Ambulance Operator'
  | 'Ambulance Driver'
  | 'HR Staff'
  | 'Admin';

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  is_active?: boolean;
  avatar?: string;
  address?: string;
  department?: string;
  department_name?: string;
  specialization?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Patient {
  id: string;
  patient_id: string;
  user: User;
  dob?: string;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  allergies: string;
  chronic_conditions: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  doctor_id: string;
  user: User;
  department: Department;
  specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  schedule: Record<string, string[]>;
  photo_url?: string;
}

export interface Appointment {
  id: string;
  appointment_number: string;
  patient: Patient;
  patient_details?: Patient;
  doctor: Doctor;
  doctor_details?: Doctor;
  department: Department;
  appointment_date: string;
  time_slot: string;
  type: 'OPD' | 'Telemedicine' | 'Follow-up';
  status: 'Booked' | 'Checked-in' | 'In-Consultation' | 'Completed' | 'Cancelled';
  token_number: number;
  notes?: string;
}

export interface OPDConsultation {
  id: string;
  appointment: Appointment;
  patient_name: string;
  doctor_name: string;
  symptoms: string;
  clinical_notes: string;
  diagnosis: string;
  vitals: {
    bp?: string;
    hr?: string;
    temp?: string;
    spo2?: string;
  };
  follow_up_date?: string;
}

export interface Bed {
  id: string;
  ward_name: string;
  bed_number: string;
  bed_type: 'ICU' | 'General' | 'Private' | 'Emergency';
  daily_charge: number;
  is_occupied: boolean;
  patient_name?: string;
}

export interface Admission {
  id: string;
  admission_number: string;
  patient_details: Patient;
  doctor_name: string;
  bed_details?: Bed;
  admission_date: string;
  discharge_date?: string;
  status: 'Admitted' | 'Transferred' | 'Discharged';
  reason_for_admission: string;
  discharge_summary?: string;
}

export interface LabTestParameter {
  id: string;
  parameter_name: string;
  value: string;
  unit: string;
  reference_range: string;
  status: 'Normal' | 'High' | 'Low' | 'Abnormal';
}

export interface LabSampleDetails {
  sample_id: string;
  sample_type: string; // Blood, Urine, Sputum, Swab, Tissue, CSF, Stool
  collection_date: string;
  collected_by: string;
  status: 'Collected' | 'Processing' | 'Completed' | 'Sample Issue';
  issue_reason?: string;
  issue_remarks?: string;
}

export interface LabResultDetails {
  parameters: LabTestParameter[];
  remarks?: string;
  entered_at?: string;
  entered_by?: string;
}

export interface LabVerificationDetails {
  verified_by: string;
  verified_at: string;
  status: 'Verified' | 'Correction Requested';
  notes?: string;
}

export interface LabTestRequest {
  id: string;
  request_id: string;
  request_number?: string;
  patient_id: string;
  patient_name: string;
  patient_details?: {
    user?: {
      first_name?: string;
      last_name?: string;
    };
  };
  patient_age: number;
  patient_gender: 'Male' | 'Female' | 'Other';
  doctor_name: string;
  test_name: string;
  category: string;
  priority: 'Normal' | 'Urgent';
  clinical_reason: string;
  requested_date: string;
  status: 'Pending' | 'Accepted' | 'Sample Collected' | 'Processing' | 'Result Entered' | 'Verified' | 'Sample Issue' | 'Requested' | 'Completed';
  sample_type?: string;
  sample_details?: LabSampleDetails;
  processing_notes?: string;
  result?: LabResultDetails;
  verification?: LabVerificationDetails;
}

export type LabRequest = LabTestRequest;



export interface ReceptionPatientRecord {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_group: string;
  allergies: string;
  photo_url: string;
  registration_date: string;
  department: string;
  assigned_doctor: string;
  today_appointment?: {
    doctor_name: string;
    time_slot: string;
    status: 'Confirmed' | 'Waiting' | 'Checked-in' | 'Completed' | 'Cancelled';
  };
  admission_status?: string;
  billing_status?: string;
}

export interface ReceptionDoctorRecord {
  id: string;
  doctor_id: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  designation: string;
  specialization: string;
  experience_years: number;
  status: 'Available' | 'Busy' | 'On Leave';
  consultation_hours: string;
  today_appointments_count: number;
  schedule: Record<string, string>;
  photo_url: string;
}

export interface ReceptionAppointmentRecord {
  id: string;
  appointment_number: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  department: string;
  time_slot: string;
  status: 'Confirmed' | 'Waiting' | 'Checked-in' | 'Completed' | 'Cancelled';
  date: string;
  token_number: number;
}

export interface ReceptionNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'registration' | 'cancellation' | 'doctor' | 'bed' | 'emergency' | 'checkin';
  timestamp: string;
  read: boolean;
}


export interface LabStaffProfile {
  name: string;
  staff_id: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  certifications: string;
}


export interface RadiologyRequest {
  id: string;
  request_number: string;
  patient_details: Patient;
  doctor_name: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound';
  body_part: string;
  status: 'Requested' | 'Scheduled' | 'Scanned' | 'Reported';
  requested_at: string;
  report?: {
    radiologist_name?: string;
    image_url?: string;
    findings: string;
    impression: string;
  };
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  batch_number: string;
  expiry_date: string;
  stock_quantity: number;
  reorder_level: number;
  unit_price: number;
}

export interface Prescription {
  id: string;
  prescription_number: string;
  patient_details: Patient;
  doctor_name: string;
  medicines: Array<{ medicine_name: string; dosage: string; frequency: string; duration: string }>;
  instructions?: string;
  is_dispensed: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  item_code: string;
  name: string;
  category: string;
  supplier: string;
  stock_quantity: number;
  min_reorder_qty: number;
  unit_cost: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  patient_details: Patient;
  source_module: string;
  line_items: Array<{ description: string; amount: number }>;
  subtotal: number;
  discount: number;
  total_amount: number;
  status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled';
  created_at: string;
}

export interface BloodUnit {
  id: string;
  unit_number: string;
  blood_group: string;
  collection_date: string;
  expiry_date: string;
  status: 'Available' | 'Reserved' | 'Transfused' | 'Expired';
  donor_name: string;
}

export type AmbulanceStatus =
  | 'REQUESTED'
  | 'Requested'
  | 'SEARCHING'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ACCEPTED'
  | 'EN_ROUTE_TO_PICKUP'
  | 'En Route to Patient'
  | 'ARRIVED_AT_PICKUP'
  | 'PATIENT_ONBOARD'
  | 'EN_ROUTE_TO_HOSPITAL'
  | 'ARRIVED_AT_HOSPITAL'
  | 'PATIENT_HANDOVER'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'Available'
  | 'Assigned'
  | 'En Route'
  | 'At Pickup'
  | 'Patient Onboard'
  | 'En Route to Hospital'
  | 'Hospital Arrived'
  | 'Completed'
  | 'Maintenance'
  | 'Out of Service'
  | 'Dispatched'
  | 'In-Service'
  | 'On Site';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  emergency_available?: boolean;
  facility_type?: string;
  distance_km?: number;
  available_beds?: number;
  total_beds?: number;
  trauma_center?: boolean;
}

export interface Ambulance {
  id: string;
  vehicle_number: string;
  ambulance_type?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_model?: string;
  equipment_level?: string;
  current_latitude: number;
  current_longitude: number;
  current_location_name?: string;
  status: AmbulanceStatus;
  rating?: number;
  equipment_oxygen?: boolean;
  equipment_first_aid?: boolean;
  equipment_stretcher?: boolean;
  equipment_defibrillator?: boolean;
  equipment_ventilator?: boolean;
  last_service_date?: string;
  next_service_date?: string;
}

export type EmergencyTypeChoice =
  | 'Accident'
  | 'Cardiac Emergency'
  | 'Neurological Emergency'
  | 'Breathing Difficulty'
  | 'Injury'
  | 'Burn'
  | 'Pediatric Emergency'
  | 'Other';

export interface EmergencyRequest {
  id: string;
  request_number: string;
  patient?: string;
  patient_name?: string;
  patient_phone?: string;
  temp_patient_id?: string;
  patient_details?: Patient;
  ambulance_details?: Ambulance;
  emergency_type?: EmergencyTypeChoice;
  short_description?: string;
  number_of_patients?: number;
  severity?: 'Critical' | 'Moderate' | 'Minor';
  priority?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  pickup_address: string;
  latitude: number;
  longitude: number;
  destination_hospital?: string;
  destination_latitude?: number;
  destination_longitude?: number;
  assigned_ambulance?: Ambulance;
  driver_name?: string;
  driver_phone?: string;
  driver_rating?: number;
  distance_km?: number;
  status: AmbulanceStatus;
  eta_minutes: number;
  hospital_alert_sent?: boolean;
  hospital_alert_acknowledged?: boolean;
  doctor_assessment_notes?: string;
  assigned_doctor_name?: string;
  assigned_nurse_name?: string;
  assigned_er_bay?: string;
  handover_time?: string;
  ipd_admission_required?: boolean;
  ipd_bed_allocated?: string;
  billing_amount?: number;
  billing_invoice_generated?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EHRTimelineItem {
  id: string;
  event_type: string;
  summary: string;
  details: Record<string, any>;
  recorded_by_name?: string;
  timestamp: string;
}

export interface AICDSResult {
  disclaimer: string;
  summary: string;
  risk_alerts: string[];
  allergy_warnings: string[];
  clinical_considerations: string[];
}

export interface NursingInstruction {
  id: string;
  patient_id: string;
  doctor_name: string;
  instruction: string;
  status: 'Pending' | 'Completed';
  given_at: string;
  nurse_completed_by?: string;
  nurse_notes?: string;
  recorded_vitals?: {
    bp?: string;
    hr?: string;
    temp?: string;
    spo2?: string;
  };
}

export interface OTSurgeryRequest {
  id: string;
  patient_name: string;
  patient_id: string;
  procedure_name: string;
  scheduled_date: string;
  priority: 'High' | 'Routine' | 'Emergency';
  status: 'Requested' | 'Scheduled' | 'In-Progress' | 'Completed';
  clinical_notes?: string;
  post_op_notes?: string;
}

export interface TelemedicineSessionItem {
  id: string;
  appointment_number: string;
  patient_name: string;
  patient_id: string;
  time_slot: string;
  status: 'Waiting' | 'Confirmed' | 'Completed';
  chief_complaint?: string;
  video_url?: string;
}

export interface DoctorNotificationItem {
  id: string;
  title: string;
  category: 'lab' | 'radiology' | 'appointment' | 'followup' | 'telemedicine' | 'ipd' | 'pharmacy';
  message: string;
  timestamp: string;
  read: boolean;
  target_id?: string;
}

export interface NursePatient {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  allergies: string;
  doctor_name: string;
  ward_name: string;
  room_number: string;
  bed_number: string;
  status: 'Stable' | 'Critical' | 'Monitoring' | 'Recovery';
  admission_date: string;
  vitals_pending: boolean;
  meds_pending: boolean;
  photo_url?: string;
}

export interface NurseVitalEntry {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  temperature: string;
  bp_systolic: number;
  bp_diastolic: number;
  pulse: number;
  spo2: number;
  respiratory_rate: number;
  timestamp: string;
  recorded_by: string;
  attention_required: boolean;
}

export interface NursingNoteEntry {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  observation: string;
  patient_condition: string;
  care_provided: string;
  additional_note?: string;
  recorded_at: string;
  recorded_by: string;
  is_finalized: boolean;
}

export interface MedicationAdminEntry {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  medicine_name: string;
  dosage: string;
  scheduled_time: string;
  status: 'Given' | 'Pending' | 'Not Given';
  administered_at?: string;
  administered_by?: string;
  reason_not_given?: string;
  doctor_prescription_ref: string;
}

export interface CarePlanTask {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  task_name: string;
  category: string;
  status: 'Completed' | 'Pending' | 'In-Progress';
  assigned_time: string;
  updated_at?: string;
  updated_by?: string;
}

export interface DoctorInstructionItem {
  id: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  doctor_name: string;
  instruction_text: string;
  issued_at: string;
  status: 'Active' | 'Acknowledged';
  acknowledged_at?: string;
  acknowledged_by?: string;
}

export interface ShiftHandoverNote {
  id: string;
  shift_from: string;
  shift_to: string;
  patient_id: string;
  patient_name: string;
  bed_number: string;
  current_condition: string;
  important_notes: string;
  pending_tasks: string;
  created_at: string;
  created_by: string;
}

export interface NurseNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'instruction' | 'medication' | 'transfer' | 'assignment' | 'task' | 'vitals';
  timestamp: string;
  read: boolean;
  patient_id?: string;
  target_tab?: string;
}

export interface LabNotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  timestamp: string;
  read: boolean;
  request_id?: string;
  target_tab?: string;
}



