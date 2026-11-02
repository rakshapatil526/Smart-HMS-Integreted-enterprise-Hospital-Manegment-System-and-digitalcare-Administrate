import {
  ReceptionDoctorRecord,
  ReceptionAppointmentRecord,
  DoctorNotificationItem,
  ReceptionNotificationItem,
  LabTestRequest,
  RadiologyRequest,
  Prescription,
  NurseNotificationItem,
  LabNotificationItem,
  NursePatient,
  EmergencyRequest,
  AmbulanceStatus
} from '../types';
import { PharmacyPrescription } from '../pages/modules/pharmacyData';
import { clinicalApi } from './api';

export const MASTER_DOCTORS: ReceptionDoctorRecord[] = [
  {
    id: 'doc-narayan',
    doctor_id: 'DOC-CARD-00',
    name: 'Dr. Narayan Swamy',
    email: 'doctor@smartcare.com',
    department: 'Cardiology',
    designation: 'Senior Consultant Cardiologist',
    specialization: 'Interventional Cardiology & Cardiac Care',
    experience_years: 16,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 5,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Thursday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  },
  {
    id: 'doc-sarah',
    doctor_id: 'DOC-CARD-01',
    name: 'Dr. Sarah Jenkins',
    email: 'doc_card_2@smartcare.com',
    department: 'Cardiology',
    designation: 'Senior Consultant Cardiologist',
    specialization: 'Interventional Cardiology & Clinical Operations',
    experience_years: 14,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 6,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Thursday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    id: 'doc-001',
    doctor_id: 'DOC-CARD-02',
    name: 'Dr. Arjun Mehta',
    email: 'doc_card_3@smartcare.com',
    department: 'Cardiology',
    designation: 'Senior Consultant Cardiologist',
    specialization: 'Interventional Cardiology',
    experience_years: 12,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 8,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '14:00 - 18:00', Wednesday: '09:00 - 13:00', Thursday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  },
  {
    id: 'doc-002',
    doctor_id: 'DOC-CARD-03',
    name: 'Dr. Priya Nair',
    email: 'doc_card_4@smartcare.com',
    department: 'Cardiology',
    designation: 'Junior Consultant Cardiologist',
    specialization: 'Clinical Cardiology',
    experience_years: 5,
    status: 'Busy',
    consultation_hours: '10:00 AM – 02:00 PM',
    today_appointments_count: 6,
    schedule: { Monday: '10:00 - 14:00', Tuesday: '10:00 - 14:00', Thursday: '10:00 - 14:00', Saturday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=200&q=80',
  },
  {
    id: 'doc-003',
    doctor_id: 'DOC-NEUR-01',
    name: 'Dr. Rahul Verma',
    department: 'Neurology',
    designation: 'Senior Neurologist',
    specialization: 'Neuro-vascular & Stroke Care',
    experience_years: 15,
    status: 'Available',
    consultation_hours: '09:30 AM – 01:30 PM',
    today_appointments_count: 7,
    schedule: { Monday: '09:30 - 13:30', Wednesday: '09:30 - 13:30', Friday: '09:30 - 13:30' },
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
  },
  {
    id: 'doc-004',
    doctor_id: 'DOC-NEUR-02',
    name: 'Dr. Sneha Rao',
    department: 'Neurology',
    designation: 'Consultant Neurologist',
    specialization: 'Epilepsy & Movement Disorders',
    experience_years: 6,
    status: 'Available',
    consultation_hours: '02:00 PM – 06:00 PM',
    today_appointments_count: 5,
    schedule: { Tuesday: '14:00 - 18:00', Thursday: '14:00 - 18:00', Saturday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    id: 'doc-005',
    doctor_id: 'DOC-ORTH-01',
    name: 'Dr. Karan Shah',
    department: 'Orthopedics',
    designation: 'Senior Orthopedic Surgeon',
    specialization: 'Joint Replacement & Trauma',
    experience_years: 14,
    status: 'Busy',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 9,
    schedule: { Monday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
  },
  {
    id: 'doc-006',
    doctor_id: 'DOC-ORTH-02',
    name: 'Dr. Ananya Iyer',
    department: 'Orthopedics',
    designation: 'Junior Orthopedic Consultant',
    specialization: 'Sports Medicine & Arthroscopy',
    experience_years: 4,
    status: 'Available',
    consultation_hours: '11:00 AM – 03:00 PM',
    today_appointments_count: 4,
    schedule: { Tuesday: '11:00 - 15:00', Thursday: '11:00 - 15:00', Saturday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=200&q=80',
  },
  {
    id: 'doc-007',
    doctor_id: 'DOC-PEDI-01',
    name: 'Dr. Neha Kapoor',
    department: 'Pediatrics',
    designation: 'Senior Pediatrician',
    specialization: 'Pediatric Care & Immunization',
    experience_years: 11,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 10,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '09:00 - 13:00', Thursday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    id: 'doc-008',
    doctor_id: 'DOC-PEDI-02',
    name: 'Dr. Rohan Das',
    department: 'Pediatrics',
    designation: 'Consultant Pediatrician',
    specialization: 'Neonatology & Child Nutrition',
    experience_years: 5,
    status: 'Available',
    consultation_hours: '02:00 PM – 06:00 PM',
    today_appointments_count: 6,
    schedule: { Wednesday: '14:00 - 18:00', Friday: '14:00 - 18:00', Saturday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
  },
  {
    id: 'doc-009',
    doctor_id: 'DOC-GENM-01',
    name: 'Dr. Vikram Rao',
    department: 'General Medicine',
    designation: 'Senior Physician',
    specialization: 'Internal Medicine & Diabetology',
    experience_years: 16,
    status: 'Available',
    consultation_hours: '08:30 AM – 12:30 PM',
    today_appointments_count: 12,
    schedule: { Monday: '08:30 - 12:30', Tuesday: '08:30 - 12:30', Wednesday: '08:30 - 12:30', Thursday: '08:30 - 12:30' },
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  },
  {
    id: 'doc-chen',
    doctor_id: 'DOC-GENM-02',
    name: 'Dr. Michael Chen',
    department: 'General Medicine',
    designation: 'Senior Consultant Physician',
    specialization: 'Internal Medicine & General Health',
    experience_years: 12,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 7,
    schedule: { Monday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  },
  {
    id: 'doc-010',
    doctor_id: 'DOC-GENM-03',
    name: 'Dr. Aditi Menon',
    department: 'General Medicine',
    designation: 'Junior Physician',
    specialization: 'General Clinical Diagnosis',
    experience_years: 3,
    status: 'Available',
    consultation_hours: '01:00 PM – 05:00 PM',
    today_appointments_count: 7,
    schedule: { Tuesday: '13:00 - 17:00', Thursday: '13:00 - 17:00', Saturday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    id: 'doc-011',
    doctor_id: 'DOC-SURG-01',
    name: 'Dr. Sameer Joshi',
    department: 'General Surgery',
    designation: 'Senior General Surgeon',
    specialization: 'Laparoscopic & GI Surgery',
    experience_years: 18,
    status: 'Busy',
    consultation_hours: '10:00 AM – 02:00 PM',
    today_appointments_count: 5,
    schedule: { Monday: '10:00 - 14:00', Wednesday: '10:00 - 14:00', Friday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
  },
  {
    id: 'doc-012',
    doctor_id: 'DOC-SURG-02',
    name: 'Dr. Kavya Singh',
    department: 'General Surgery',
    designation: 'Consultant General Surgeon',
    specialization: 'Minimal Access Surgery',
    experience_years: 7,
    status: 'Available',
    consultation_hours: '02:00 PM – 06:00 PM',
    today_appointments_count: 4,
    schedule: { Tuesday: '14:00 - 18:00', Thursday: '14:00 - 18:00', Saturday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=200&q=80',
  },
  {
    id: 'doc-013',
    doctor_id: 'DOC-GYNE-01',
    name: 'Dr. Meera Sharma',
    department: 'Gynecology & Obstetrics',
    designation: 'Senior Gynecologist',
    specialization: 'High-Risk Pregnancy & Fetal Medicine',
    experience_years: 13,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 8,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    id: 'doc-014',
    doctor_id: 'DOC-GYNE-02',
    name: 'Dr. Ishita Roy',
    department: 'Gynecology & Obstetrics',
    designation: 'Junior Gynecologist',
    specialization: 'Reproductive Health',
    experience_years: 4,
    status: 'Available',
    consultation_hours: '02:00 PM – 06:00 PM',
    today_appointments_count: 5,
    schedule: { Thursday: '14:00 - 18:00', Saturday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    id: 'doc-015',
    doctor_id: 'DOC-DERM-01',
    name: 'Dr. Nisha Patel',
    department: 'Dermatology',
    designation: 'Senior Dermatologist',
    specialization: 'Clinical Dermatology & Cosmetology',
    experience_years: 10,
    status: 'Available',
    consultation_hours: '10:00 AM – 02:00 PM',
    today_appointments_count: 11,
    schedule: { Monday: '10:00 - 14:00', Wednesday: '10:00 - 14:00', Friday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=200&q=80',
  },
  {
    id: 'doc-016',
    doctor_id: 'DOC-DERM-02',
    name: 'Dr. Riya Malhotra',
    department: 'Dermatology',
    designation: 'Consultant Dermatologist',
    specialization: 'Pediatric & Aesthetic Dermatology',
    experience_years: 5,
    status: 'Available',
    consultation_hours: '03:00 PM – 07:00 PM',
    today_appointments_count: 6,
    schedule: { Tuesday: '15:00 - 19:00', Thursday: '15:00 - 19:00', Saturday: '10:00 - 14:00' },
    photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
  },
  {
    id: 'doc-017',
    doctor_id: 'DOC-ENT-01',
    name: 'Dr. Amit Kulkarni',
    department: 'ENT',
    designation: 'Senior ENT Specialist',
    specialization: 'Otolaryngology & Skull Base Surgery',
    experience_years: 15,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 7,
    schedule: { Monday: '09:00 - 13:00', Wednesday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=80',
  },
  {
    id: 'doc-018',
    doctor_id: 'DOC-ENT-02',
    name: 'Dr. Pooja Desai',
    department: 'ENT',
    designation: 'Junior ENT Specialist',
    specialization: 'Sinus Surgery & Voice Disorders',
    experience_years: 4,
    status: 'Available',
    consultation_hours: '02:00 PM – 05:00 PM',
    today_appointments_count: 4,
    schedule: { Tuesday: '14:00 - 17:00', Thursday: '14:00 - 17:00', Saturday: '09:00 - 12:00' },
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    id: 'doc-019',
    doctor_id: 'DOC-OPHT-01',
    name: 'Dr. Aditya Rao',
    department: 'Ophthalmology',
    designation: 'Senior Ophthalmologist',
    specialization: 'Cataract & Refractive Surgery',
    experience_years: 13,
    status: 'Available',
    consultation_hours: '09:00 AM – 01:00 PM',
    today_appointments_count: 8,
    schedule: { Monday: '09:00 - 13:00', Tuesday: '09:00 - 13:00', Thursday: '09:00 - 13:00', Friday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=80',
  },
  {
    id: 'doc-020',
    doctor_id: 'DOC-OPHT-02',
    name: 'Dr. Tanya Kapoor',
    department: 'Ophthalmology',
    designation: 'Consultant Ophthalmologist',
    specialization: 'Retina & Glaucoma Care',
    experience_years: 6,
    status: 'Available',
    consultation_hours: '02:00 PM – 06:00 PM',
    today_appointments_count: 5,
    schedule: { Wednesday: '14:00 - 18:00', Saturday: '09:00 - 13:00' },
    photo_url: 'https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=200&q=80',
  },
];

export const INITIAL_APPOINTMENTS: ReceptionAppointmentRecord[] = [
  {
    id: 'apt-rakshitha-narayan',
    appointment_number: 'APT-2026-9011',
    patient_id: 'SC-P021',
    patient_name: 'Rakshitha',
    doctor_name: 'Dr. Narayan Swamy',
    department: 'Cardiology',
    time_slot: '10:30 AM',
    status: 'Confirmed',
    date: new Date().toISOString().split('T')[0],
    token_number: 1,
  },
  {
    id: 'apt-aarav-arjun',
    appointment_number: 'APT-2026-9001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    time_slot: '09:00 AM',
    status: 'Waiting',
    date: new Date().toISOString().split('T')[0],
    token_number: 2,
  },
  {
    id: 'apt-anika-nisha',
    appointment_number: 'APT-2026-9002',
    patient_id: 'SC-P002',
    patient_name: 'Anika Rao',
    doctor_name: 'Dr. Nisha Patel',
    department: 'Dermatology',
    time_slot: '09:30 AM',
    status: 'Waiting',
    date: new Date().toISOString().split('T')[0],
    token_number: 3,
  },
  {
    id: 'apt-rohan-vikram',
    appointment_number: 'APT-2026-9003',
    patient_id: 'SC-P003',
    patient_name: 'Rohan Verma',
    doctor_name: 'Dr. Vikram Rao',
    department: 'General Medicine',
    time_slot: '10:00 AM',
    status: 'Checked-in',
    date: new Date().toISOString().split('T')[0],
    token_number: 4,
  },
  {
    id: 'apt-alex-sarah',
    appointment_number: 'APT-2026-9004',
    patient_id: 'PAT-2026-8942',
    patient_name: 'Alex Smith',
    doctor_name: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    time_slot: '11:00 AM',
    status: 'Confirmed',
    date: new Date().toISOString().split('T')[0],
    token_number: 5,
  }
];

const APPOINTMENTS_KEY = 'smartcare_shared_appointments';
const DOCTOR_NOTIFICATIONS_KEY = 'smartcare_doctor_notifications';
const RECEPTION_NOTIFICATIONS_KEY = 'smartcare_reception_notifications';
const NURSE_NOTIFICATIONS_KEY = 'smartcare_nurse_notifications';
const LAB_NOTIFICATIONS_KEY = 'smartcare_lab_notifications';
const RADIOLOGY_NOTIFICATIONS_KEY = 'smartcare_radiology_notifications';
const PHARMACY_NOTIFICATIONS_KEY = 'smartcare_pharmacy_notifications';
const AMBULANCE_NOTIFICATIONS_KEY = 'smartcare_ambulance_notifications';
const PATIENT_NOTIFICATIONS_KEY = 'smartcare_patient_notifications';
const LAB_REQUESTS_KEY = 'smartcare_shared_lab_requests';
const RADIOLOGY_REQUESTS_KEY = 'smartcare_shared_radiology_requests';
const PRESCRIPTIONS_KEY = 'smartcare_shared_prescriptions';
const AMBULANCE_REQUESTS_KEY = 'smartcare_shared_ambulance_requests';
const SELECTED_DOCTOR_KEY = 'smartcare_selected_doctor';

const CUSTOM_DOCTORS_KEY = 'smartcare_custom_doctors';
const STAFF_USERS_KEY = 'smartcare_staff_users';

export const sharedStore = {
  getDoctors(): ReceptionDoctorRecord[] {
    let custom: ReceptionDoctorRecord[] = [];
    try {
      const stored = localStorage.getItem(CUSTOM_DOCTORS_KEY);
      if (stored) {
        custom = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading custom doctors:", e);
    }

    const combined = [...custom, ...MASTER_DOCTORS];
    const seen = new Set<string>();
    const uniqueList: ReceptionDoctorRecord[] = [];

    for (const doc of combined) {
      const key = (doc.email || doc.name).toLowerCase().replace(/^dr\.?\s+/i, '').trim();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push(doc);
      }
    }
    return uniqueList;
  },

  addDoctor(newDoc: ReceptionDoctorRecord) {
    try {
      const stored = localStorage.getItem(CUSTOM_DOCTORS_KEY);
      const custom: ReceptionDoctorRecord[] = stored ? JSON.parse(stored) : [];
      const normKey = (newDoc.email || newDoc.name).toLowerCase().replace(/^dr\.?\s+/i, '').trim();

      const existingIndex = custom.findIndex(
        (d) => (d.email || d.name).toLowerCase().replace(/^dr\.?\s+/i, '').trim() === normKey
      );

      if (existingIndex >= 0) {
        custom[existingIndex] = { ...custom[existingIndex], ...newDoc };
      } else {
        custom.unshift(newDoc);
      }
      localStorage.setItem(CUSTOM_DOCTORS_KEY, JSON.stringify(custom));
    } catch (e) {
      console.error("Error saving custom doctor:", e);
    }
    window.dispatchEvent(new CustomEvent('smartcare_doctor_added', { detail: newDoc }));
  },

  getStaffUsers(): any[] {
    try {
      const stored = localStorage.getItem(STAFF_USERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  },

  addStaffUser(staff: any) {
    try {
      const list = this.getStaffUsers();
      const normEmail = (staff.email || '').toLowerCase().trim();
      const existingIdx = list.findIndex(
        (s: any) => (s.email || '').toLowerCase().trim() === normEmail
      );
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...staff };
      } else {
        list.unshift(staff);
      }
      localStorage.setItem(STAFF_USERS_KEY, JSON.stringify(list));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('smartcare_staff_added', { detail: staff }));
  },

  getDoctorNameForUser(user: any): string {
    if (!user) return this.getSelectedDoctor();
    const doctors = this.getDoctors();

    // 1. Match by email
    if (user.email) {
      const matched = doctors.find(
        (d) => d.email && d.email.toLowerCase() === user.email.toLowerCase()
      );
      if (matched) return matched.name;
    }

    // 2. Format name from user first & last name
    const fn = (user.first_name || '').trim();
    const ln = (user.last_name || '').trim();
    if (!fn && !ln) return this.getSelectedDoctor();

    if (fn.toLowerCase().startsWith('dr.') || fn.toLowerCase().startsWith('dr ')) {
      return `${fn} ${ln}`.trim();
    }
    return `Dr. ${fn} ${ln}`.trim();
  },

  getDoctorDetailsForUser(user: any): { name: string; department: string; specialization: string; email?: string } {
    const docName = this.getDoctorNameForUser(user);
    const doctors = this.getDoctors();
    const cleanName = docName.toLowerCase().replace(/^dr\.?\s+/i, '').trim();

    const matched = doctors.find(
      (d) =>
        (user?.email && d.email && d.email.toLowerCase() === user.email.toLowerCase()) ||
        d.name.toLowerCase().replace(/^dr\.?\s+/i, '').trim() === cleanName
    );

    if (matched) {
      return {
        name: matched.name,
        department: matched.department || 'Cardiology',
        specialization: matched.specialization || 'Consultant Physician',
        email: matched.email || user?.email,
      };
    }

    return {
      name: docName,
      department: user?.department_name || (user?.department ? user.department.name : 'Cardiology'),
      specialization: user?.specialization || 'Consultant Physician',
      email: user?.email,
    };
  },

  getSelectedDoctor(): string {
    return localStorage.getItem(SELECTED_DOCTOR_KEY) || 'Dr. Narayan Swamy';
  },

  setSelectedDoctor(doctorName: string) {
    localStorage.setItem(SELECTED_DOCTOR_KEY, doctorName);
    window.dispatchEvent(new CustomEvent('smartcare_doctor_changed', { detail: doctorName }));
  },

  getAppointments(): ReceptionAppointmentRecord[] {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading shared appointments:", e);
    }
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  },

  getAppointmentsForDoctor(doctorName: string): ReceptionAppointmentRecord[] {
    const all = this.getAppointments();
    if (!doctorName) return [];
    const docClean = doctorName.toLowerCase().replace(/^dr\.?\s+/i, '').trim();
    if (!docClean) return [];

    return all.filter((a) => {
      if (!a.doctor_name) return false;
      const aDocClean = a.doctor_name.toLowerCase().replace(/^dr\.?\s+/i, '').trim();
      return (
        aDocClean === docClean ||
        aDocClean.includes(docClean) ||
        docClean.includes(aDocClean)
      );
    });
  },

  async addAppointment(newAptData: {
    patient_name: string;
    patient_id?: string;
    doctor_name: string;
    department: string;
    date: string;
    time_slot: string;
    reason?: string;
  }): Promise<ReceptionAppointmentRecord> {
    const all = this.getAppointments();
    const tokenNum = all.length + 1;
    const aptNumber = `APT-2026-${Math.floor(Math.random() * 8000) + 1000}`;

    const newAppointment: ReceptionAppointmentRecord = {
      id: `apt-${Date.now()}`,
      appointment_number: aptNumber,
      patient_id: newAptData.patient_id || `SC-P${String(Math.floor(Math.random() * 900) + 100)}`,
      patient_name: newAptData.patient_name,
      doctor_name: newAptData.doctor_name,
      department: newAptData.department,
      time_slot: newAptData.time_slot,
      status: 'Confirmed',
      date: newAptData.date,
      token_number: tokenNum,
    };

    const updated = [newAppointment, ...all];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));

    // Add Doctor Notification
    this.addDoctorNotification({
      id: `notif-doc-${Date.now()}`,
      title: 'New Patient Appointment',
      category: 'appointment',
      message: `New appointment booked by patient ${newAptData.patient_name} for ${newAptData.time_slot} (${newAptData.date}). Reason: ${newAptData.reason || 'General Consultation'}`,
      timestamp: 'Just Now',
      read: false,
      target_id: newAptData.doctor_name
    });

    // Add Reception Notification
    this.addReceptionNotification({
      id: `notif-rec-${Date.now()}`,
      title: `New Appointment: ${newAptData.doctor_name}`,
      message: `Patient ${newAptData.patient_name} booked consultation slot with ${newAptData.doctor_name} for ${newAptData.time_slot} (${newAptData.date}).`,
      category: 'registration',
      timestamp: 'Just Now',
      read: false,
    });

    try {
      await clinicalApi.createAppointment({
        doctor_name: newAptData.doctor_name,
        appointment_date: newAptData.date,
        time_slot: newAptData.time_slot,
        type: 'OPD',
        status: 'Booked'
      });
    } catch (e) {
      console.warn("Backend API sync fallback:", e);
    }

    window.dispatchEvent(new CustomEvent('smartcare_appointment_added', { detail: newAppointment }));
    return newAppointment;
  },

  updateAppointmentStatus(id: string, newStatus: ReceptionAppointmentRecord['status']) {
    const all = this.getAppointments();
    const updated = all.map(a => a.id === id ? { ...a, status: newStatus } : a);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_appointment_added', { detail: { id, newStatus } }));
  },

  // --- LAB INVESTIGATIONS (DOCTOR <-> LAB <-> PATIENT) ---
  getLabRequests(): LabTestRequest[] {
    try {
      const stored = localStorage.getItem(LAB_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initial: LabTestRequest[] = [
      {
        id: 'LAB-REQ-101',
        request_id: 'LAB-REQ-101',
        patient_id: 'SC-P001',
        patient_name: 'Aarav Sharma',
        patient_age: 32,
        patient_gender: 'Male',
        doctor_name: 'Dr. Narayan Swamy',
        test_name: 'CBC (Complete Blood Count)',
        category: 'Hematology',
        priority: 'Normal',
        clinical_reason: 'Exertional chest discomfort evaluation',
        requested_date: new Date().toISOString().split('T')[0],
        status: 'Sample Collected',
        sample_type: 'Whole Blood (EDTA)',
      },
      {
        id: 'LAB-REQ-102',
        request_id: 'LAB-REQ-102',
        patient_id: 'SC-P021',
        patient_name: 'Rakshitha',
        patient_age: 28,
        patient_gender: 'Female',
        doctor_name: 'Dr. Narayan Swamy',
        test_name: 'Lipid Profile & Fasting Glucose',
        category: 'Biochemistry',
        priority: 'Urgent',
        clinical_reason: 'Routine cardiac health screening',
        requested_date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        sample_type: 'Serum',
      }
    ];
    localStorage.setItem(LAB_REQUESTS_KEY, JSON.stringify(initial));
    return initial;
  },

  addLabRequest(reqData: {
    doctor_name: string;
    patient_name: string;
    test_name: string;
    category?: 'Hematology' | 'Biochemistry' | 'Urinalysis' | 'Critical Care' | 'Pathology' | string;
    priority: 'Normal' | 'Urgent';
    clinical_reason: string;
  }) {
    const current = this.getLabRequests();
    const newReq: LabTestRequest = {
      id: `LAB-REQ-${Date.now()}`,
      request_id: `LAB-REQ-${Math.floor(Math.random() * 800) + 100}`,
      patient_id: `PAT-${Math.floor(Math.random() * 900) + 100}`,
      patient_name: reqData.patient_name,
      patient_age: 30,
      patient_gender: 'Female',
      doctor_name: reqData.doctor_name,
      test_name: reqData.test_name,
      category: (reqData.category as any) || 'Pathology',
      priority: reqData.priority,
      clinical_reason: reqData.clinical_reason,
      requested_date: new Date().toISOString().split('T')[0],
      status: 'Requested',
    };

    const updated = [newReq, ...current];
    localStorage.setItem(LAB_REQUESTS_KEY, JSON.stringify(updated));

    // Notify Laboratory Tech
    this.addLabNotification({
      id: `lab-notif-${Date.now()}`,
      title: `${reqData.priority === 'Urgent' ? '🚨 STAT Urgent' : '🧪 New'} Lab Order`,
      message: `${reqData.doctor_name} ordered ${reqData.test_name} for Patient ${reqData.patient_name}. Reason: ${reqData.clinical_reason}`,
      category: reqData.priority === 'Urgent' ? 'urgent' : 'request',
      timestamp: 'Just Now',
      read: false,
      request_id: newReq.id
    });

    window.dispatchEvent(new CustomEvent('smartcare_lab_request_added', { detail: newReq }));
    return newReq;
  },

  completeLabResult(requestId: string, labTechName: string, remarks: string = 'Normal results verified.') {
    const current = this.getLabRequests();
    const target = current.find(r => r.id === requestId || r.request_id === requestId);
    const updated = current.map(r => (r.id === requestId || r.request_id === requestId) ? { ...r, status: 'Verified' as const } : r);
    localStorage.setItem(LAB_REQUESTS_KEY, JSON.stringify(updated));

    if (target) {
      // Notify Doctor back!
      this.addDoctorNotification({
        id: `notif-doc-lab-${Date.now()}`,
        title: '🧪 Lab Report Completed & Verified',
        category: 'lab',
        message: `Lab Test (${target.test_name}) for Patient ${target.patient_name} verified by ${labTechName}. Remarks: ${remarks}`,
        timestamp: 'Just Now',
        read: false,
        target_id: target.doctor_name
      });
    }

    window.dispatchEvent(new CustomEvent('smartcare_lab_request_added', { detail: { requestId } }));
  },

  // --- RADIOLOGY SCANS (DOCTOR <-> RADIOLOGY <-> PATIENT) ---
  getRadiologyRequests(): RadiologyRequest[] {
    try {
      const stored = localStorage.getItem(RADIOLOGY_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initial: RadiologyRequest[] = [
      {
        id: 'RAD-101',
        request_number: 'RAD-2026-001',
        patient_details: { id: 'P001', patient_id: 'SC-P001', user: { id: 'u1', email: 'a@a.com', username: 'aarav', first_name: 'Aarav', last_name: 'Sharma', role: 'Patient' }, gender: 'Male', blood_group: 'A+', emergency_contact_name: 'Pooja', emergency_contact_phone: '123', allergies: 'Penicillin', chronic_conditions: 'None', created_at: '2026-08-01' },
        doctor_name: 'Dr. Narayan Swamy',
        modality: 'CT Scan',
        body_part: 'Chest PA View',
        status: 'Requested',
        requested_at: new Date().toISOString().split('T')[0],
      }
    ];
    localStorage.setItem(RADIOLOGY_REQUESTS_KEY, JSON.stringify(initial));
    return initial;
  },

  addRadiologyRequest(reqData: {
    doctor_name: string;
    patient_name: string;
    modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound';
    body_part: string;
  }) {
    const current = this.getRadiologyRequests();
    const newRad: RadiologyRequest = {
      id: `RAD-${Date.now()}`,
      request_number: `RAD-2026-${Math.floor(Math.random() * 800) + 100}`,
      patient_details: {
        id: `p-${Date.now()}`,
        patient_id: `SC-P${Math.floor(Math.random() * 900) + 100}`,
        user: { id: `u-${Date.now()}`, email: 'patient@smartcare.com', username: 'pat', first_name: reqData.patient_name, last_name: '', role: 'Patient' },
        gender: 'Female',
        blood_group: 'O+',
        emergency_contact_name: 'Emergency Contact',
        emergency_contact_phone: '+1 555-0199',
        allergies: 'None',
        chronic_conditions: 'None',
        created_at: new Date().toISOString().split('T')[0],
      },
      doctor_name: reqData.doctor_name,
      modality: reqData.modality,
      body_part: reqData.body_part,
      status: 'Requested',
      requested_at: new Date().toISOString().split('T')[0],
    };

    const updated = [newRad, ...current];
    localStorage.setItem(RADIOLOGY_REQUESTS_KEY, JSON.stringify(updated));

    // Notify Radiologist & Doctor
    this.addDoctorNotification({
      id: `notif-doc-rad-${Date.now()}`,
      title: '🩻 Radiology Imaging Order Sent',
      category: 'radiology',
      message: `${reqData.doctor_name} ordered ${reqData.modality} (${reqData.body_part}) for Patient ${reqData.patient_name}. Transmitted to RIS Radiology.`,
      timestamp: 'Just Now',
      read: false,
      target_id: reqData.doctor_name
    });

    window.dispatchEvent(new CustomEvent('smartcare_radiology_added', { detail: newRad }));
    return newRad;
  },

  completeRadiologyReport(requestId: string, radiologistName: string, findings: string) {
    const current = this.getRadiologyRequests();
    const target = current.find(r => r.id === requestId || r.request_number === requestId);
    const updated = current.map(r => (r.id === requestId || r.request_number === requestId) ? {
      ...r,
      status: 'Reported' as const,
      report: { radiologist_name: radiologistName, findings, impression: 'Verified imaging scan.' }
    } : r);
    localStorage.setItem(RADIOLOGY_REQUESTS_KEY, JSON.stringify(updated));

    if (target) {
      this.addDoctorNotification({
        id: `notif-rad-done-${Date.now()}`,
        title: '🩻 Radiology Scan Finalized',
        category: 'radiology',
        message: `${target.modality} (${target.body_part}) for Patient ${target.patient_details?.user?.first_name || 'Patient'} completed by Radiologist ${radiologistName}. Findings: ${findings}`,
        timestamp: 'Just Now',
        read: false,
        target_id: target.doctor_name
      });

      this.addPatientNotification({
        id: `notif-pat-rad-${Date.now()}`,
        title: '🩻 Radiology Report Available',
        message: `Your ${target.modality} scan report from Radiologist ${radiologistName} is now ready in your medical records.`,
        category: 'radiology',
        timestamp: 'Just Now',
        read: false
      });
    }

    window.dispatchEvent(new CustomEvent('smartcare_radiology_added', { detail: { requestId } }));
  },

  // --- PHARMACY & PRESCRIPTIONS (DOCTOR <-> PHARMACY <-> PATIENT) ---
  getPrescriptions(): PharmacyPrescription[] {
    try {
      const stored = localStorage.getItem(PRESCRIPTIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initial: PharmacyPrescription[] = [
      {
        id: 'rx-101',
        token_no: 'RX-2026-001',
        patient_id: 'SC-P001',
        patient_name: 'Aarav Sharma',
        age: 32,
        gender: 'Male',
        doctor_name: 'Dr. Narayan Swamy',
        department: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        medicines: [
          { id: 'm1', medicine_name: 'Atorvastatin', strength: '40 mg', frequency: '1-0-0', duration: '30 Days', required_qty: 30, unit_price: 12.00, available_qty: 85, is_available: true },
          { id: 'm2', medicine_name: 'Aspirin', strength: '75 mg', frequency: '0-1-0', duration: '30 Days', required_qty: 30, unit_price: 3.50, available_qty: 120, is_available: true }
        ],
        status: 'Pending',
        total_amount: 465.00,
        billing_status: 'Pending',
      },
      {
        id: 'rx-102',
        token_no: 'RX-2026-002',
        patient_id: 'SC-P021',
        patient_name: 'Rakshitha',
        age: 28,
        gender: 'Female',
        doctor_name: 'Dr. Narayan Swamy',
        department: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        medicines: [
          { id: 'm3', medicine_name: 'Paracetamol', strength: '500 mg', frequency: '1-1-1', duration: '5 Days', required_qty: 15, unit_price: 2.50, available_qty: 110, is_available: true }
        ],
        status: 'Pending',
        total_amount: 37.50,
        billing_status: 'Pending',
      }
    ];
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(initial));
    return initial;
  },

  addPrescription(prescData: {
    doctor_name: string;
    patient_name: string;
    patient_id?: string;
    medicines: { medicine_name: string; strength: string; frequency: string; duration: string; required_qty: number; unit_price: number }[];
  }): PharmacyPrescription {
    const current = this.getPrescriptions();
    const rxToken = `RX-2026-${Math.floor(Math.random() * 800) + 100}`;
    const total = prescData.medicines.reduce((acc, m) => acc + (m.required_qty * m.unit_price), 0);

    const newRx: PharmacyPrescription = {
      id: `rx-${Date.now()}`,
      token_no: rxToken,
      patient_id: prescData.patient_id || `SC-P${Math.floor(Math.random() * 900) + 100}`,
      patient_name: prescData.patient_name,
      age: 30,
      gender: 'Female',
      doctor_name: prescData.doctor_name,
      department: 'General Medicine',
      date: new Date().toISOString().split('T')[0],
      medicines: prescData.medicines.map((m, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        ...m,
        available_qty: 100,
        is_available: true
      })),
      status: 'Pending',
      total_amount: total > 0 ? total : 150.00,
      billing_status: 'Pending'
    };

    const updated = [newRx, ...current];
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updated));

    // Notify Pharmacy
    this.addPharmacyNotification({
      id: `pharm-notif-${Date.now()}`,
      title: '💊 New Doctor Prescription',
      message: `${prescData.doctor_name} prescribed medicines for Patient ${prescData.patient_name} (${rxToken}).`,
      category: 'prescription',
      timestamp: 'Just Now',
      read: false,
      token_no: rxToken
    });

    // Notify Doctor Confirmation
    this.addDoctorNotification({
      id: `doc-notif-rx-${Date.now()}`,
      title: '💊 Prescription Transmitted to Pharmacy',
      category: 'pharmacy',
      message: `Prescription (${rxToken}) for ${prescData.patient_name} submitted to Pharmacy.`,
      timestamp: 'Just Now',
      read: false,
      target_id: prescData.doctor_name
    });

    window.dispatchEvent(new CustomEvent('smartcare_prescription_added', { detail: newRx }));
    return newRx;
  },

  dispensePrescription(prescriptionId: string, pharmacistName: string) {
    const current = this.getPrescriptions();
    const target = current.find(p => p.id === prescriptionId || p.token_no === prescriptionId);
    const updated = current.map(p => (p.id === prescriptionId || p.token_no === prescriptionId) ? { ...p, status: 'Dispensed' as const, billing_status: 'Sent to Billing' as const } : p);
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updated));

    if (target) {
      // Notify Doctor back!
      this.addDoctorNotification({
        id: `notif-doc-pharm-${Date.now()}`,
        title: '💊 Prescription Dispensed by Pharmacy',
        category: 'pharmacy',
        message: `Prescription (${target.token_no}) for Patient ${target.patient_name} has been dispensed by Pharmacist ${pharmacistName}.`,
        timestamp: 'Just Now',
        read: false,
        target_id: target.doctor_name
      });

      // Notify Patient
      this.addPatientNotification({
        id: `notif-pat-pharm-${Date.now()}`,
        title: '💊 Medicines Ready / Dispensed',
        message: `Your prescribed medicines (${target.token_no}) have been fulfilled by the pharmacy.`,
        category: 'pharmacy',
        timestamp: 'Just Now',
        read: false
      });
    }

    window.dispatchEvent(new CustomEvent('smartcare_prescription_added', { detail: { prescriptionId } }));
  },

  // --- AMBULANCE & EMERGENCY (DOCTOR <-> AMBULANCE <-> RECEPTION <-> PATIENT) ---
  getAmbulanceRequests(): EmergencyRequest[] {
    try {
      const stored = localStorage.getItem(AMBULANCE_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initial: EmergencyRequest[] = [
      {
        id: 'EM-101',
        request_number: 'E101',
        patient_name: 'Aarav Sharma',
        patient_phone: '+91 9876500001',
        emergency_type: 'Cardiac Emergency',
        short_description: 'Acute chest pain and breathless episode',
        number_of_patients: 1,
        pickup_address: 'Indiranagar Main Rd, Bengaluru',
        latitude: 12.9784,
        longitude: 77.6408,
        severity: 'Critical',
        status: 'En Route to Patient',
        eta_minutes: 8,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(AMBULANCE_REQUESTS_KEY, JSON.stringify(initial));
    return initial;
  },

  addAmbulanceRequest(reqData: {
    patient_name: string;
    phone: string;
    emergency_type: string;
    address: string;
    doctor_name?: string;
  }): EmergencyRequest {
    const current = this.getAmbulanceRequests();
    const reqNo = `E${Math.floor(Math.random() * 800) + 100}`;
    const newReq: EmergencyRequest = {
      id: `amb-req-${Date.now()}`,
      request_number: reqNo,
      patient_name: reqData.patient_name,
      patient_phone: reqData.phone,
      emergency_type: reqData.emergency_type as any,
      short_description: `Emergency request for ${reqData.patient_name} - ${reqData.emergency_type}`,
      number_of_patients: 1,
      pickup_address: reqData.address,
      latitude: 12.9716,
      longitude: 77.5946,
      severity: 'Critical',
      status: 'Requested',
      eta_minutes: 10,
      created_at: new Date().toISOString()
    };

    const updated = [newReq, ...current];
    localStorage.setItem(AMBULANCE_REQUESTS_KEY, JSON.stringify(updated));

    // Notify Ambulance Operator
    this.addAmbulanceNotification({
      id: `amb-notif-${Date.now()}`,
      title: '🚨 CRITICAL EMERGENCY DISPATCH REQUEST',
      message: `Emergency Ambulance requested for ${reqData.patient_name} at ${reqData.address}. Type: ${reqData.emergency_type}`,
      category: 'emergency',
      timestamp: 'Just Now',
      read: false
    });

    // Notify Receptionist
    this.addReceptionNotification({
      id: `rec-notif-amb-${Date.now()}`,
      title: '🚨 Emergency Ambulance Dispatched',
      message: `Emergency response unit dispatched for ${reqData.patient_name} (${reqData.address}).`,
      category: 'emergency',
      timestamp: 'Just Now',
      read: false
    });

    // Notify Doctor (if specified or default Dr. Narayan Swamy)
    const targetDoc = reqData.doctor_name || 'Dr. Narayan Swamy';
    this.addDoctorNotification({
      id: `doc-notif-amb-${Date.now()}`,
      title: '🚑 Ambulance Emergency Alert',
      message: `Emergency dispatch initiated for Patient ${reqData.patient_name}. Location: ${reqData.address}. Prepared for ER arrival.`,
      category: 'ipd',
      timestamp: 'Just Now',
      read: false,
      target_id: targetDoc
    });

    window.dispatchEvent(new CustomEvent('smartcare_ambulance_added', { detail: newReq }));
    return newReq;
  },

  updateAmbulanceStatus(requestId: string, status: AmbulanceStatus, driverName: string = 'Driver Ramesh') {
    const current = this.getAmbulanceRequests();
    const target = current.find(r => r.id === requestId || r.request_number === requestId);
    const updated = current.map(r => (r.id === requestId || r.request_number === requestId) ? { ...r, status } : r);
    localStorage.setItem(AMBULANCE_REQUESTS_KEY, JSON.stringify(updated));

    if (target) {
      // Notify Doctor, Receptionist & Patient
      const docName = 'Dr. Narayan Swamy';
      this.addDoctorNotification({
        id: `notif-doc-amb-status-${Date.now()}`,
        title: `🚑 Ambulance Status: ${status}`,
        category: 'ipd',
        message: `Ambulance (${target.request_number}) carrying Patient ${target.patient_name} status updated to: "${status}". Driver: ${driverName}`,
        timestamp: 'Just Now',
        read: false,
        target_id: docName
      });

      this.addReceptionNotification({
        id: `notif-rec-amb-status-${Date.now()}`,
        title: `🚑 Emergency Unit Update`,
        message: `Patient ${target.patient_name} ambulance status: ${status}. Prepared ER bed allocation.`,
        category: 'emergency',
        timestamp: 'Just Now',
        read: false
      });

      this.addPatientNotification({
        id: `notif-pat-amb-${Date.now()}`,
        title: `🚑 Emergency Response Update`,
        message: `Your ambulance unit status: ${status}. Dispatcher contact available.`,
        category: 'emergency',
        timestamp: 'Just Now',
        read: false
      });
    }

    window.dispatchEvent(new CustomEvent('smartcare_ambulance_added', { detail: { requestId, status } }));
  },

  // --- DOCTOR <-> DOCTOR & DOCTOR <-> NURSE MESSAGING & NOTIFICATIONS ---
  sendDoctorToDoctorMessage(data: {
    senderDoctor: string;
    recipientDoctor: string;
    patientName: string;
    message: string;
  }) {
    this.addDoctorNotification({
      id: `notif-doc2doc-${Date.now()}`,
      title: `👨‍⚕️ Inter-Doctor Referral / Note from ${data.senderDoctor}`,
      category: 'appointment',
      message: `${data.senderDoctor} sent clinical notes for Patient ${data.patientName}: "${data.message}"`,
      timestamp: 'Just Now',
      read: false,
      target_id: data.recipientDoctor
    });
  },

  sendDoctorToNurseInstruction(data: {
    doctorName: string;
    nurseName?: string;
    patientName: string;
    bedNumber: string;
    instruction: string;
  }) {
    this.addNurseNotification({
      id: `nurse-notif-${Date.now()}`,
      title: `🩺 Doctor Instruction from ${data.doctorName}`,
      message: `Doctor ${data.doctorName} assigned order for Patient ${data.patientName} (Bed #${data.bedNumber}): "${data.instruction}"`,
      category: 'instruction',
      timestamp: 'Just Now',
      read: false,
      patient_id: data.patientName
    });
  },

  sendNurseUpdateToDoctor(data: {
    nurseName: string;
    doctorName: string;
    patientName: string;
    bedNumber: string;
    vitalsSummary: string;
  }) {
    this.addDoctorNotification({
      id: `notif-nurse2doc-${Date.now()}`,
      title: `👩‍⚕️ Nurse Vitals & Bed Update`,
      category: 'ipd',
      message: `Nurse ${data.nurseName} updated IPD Vitals for Bed #${data.bedNumber} (${data.patientName}): ${data.vitalsSummary}`,
      timestamp: 'Just Now',
      read: false,
      target_id: data.doctorName
    });
  },

  sendDoctorToReceptionMessage(data: {
    doctorName: string;
    patientName: string;
    message: string;
  }) {
    this.addReceptionNotification({
      id: `rec-notif-${Date.now()}`,
      title: `👨‍⚕️ Doctor Note from ${data.doctorName}`,
      message: `${data.doctorName} updated status for Patient ${data.patientName}: "${data.message}"`,
      category: 'doctor',
      timestamp: 'Just Now',
      read: false,
    });
  },

  sendReceptionToDoctorMessage(data: {
    receptionistName: string;
    doctorName: string;
    patientName: string;
    message: string;
  }) {
    this.addDoctorNotification({
      id: `doc-notif-rec-${Date.now()}`,
      title: `📋 Front Desk / Reception Alert`,
      category: 'appointment',
      message: `Receptionist ${data.receptionistName}: Patient ${data.patientName} ${data.message}`,
      timestamp: 'Just Now',
      read: false,
      target_id: data.doctorName
    });
  },

  // --- UNIVERSAL CROSS-MODULE STAFF MESSAGING DISPATCHER ---
  sendUniversalStaffNotification(data: {
    fromRole: string;
    fromName: string;
    toRole: 'Doctor' | 'Nurse' | 'Reception' | 'Lab' | 'Radiology' | 'Pharmacy' | 'Ambulance' | 'Patient';
    toName?: string;
    patientName?: string;
    title: string;
    message: string;
  }) {
    const formattedTitle = `🔔 [${data.fromRole}] ${data.title}`;
    const fullMsg = `${data.fromName} (${data.fromRole}): ${data.message}${data.patientName ? ` [Patient: ${data.patientName}]` : ''}`;

    switch (data.toRole) {
      case 'Doctor':
        this.addDoctorNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          category: 'appointment',
          message: fullMsg,
          timestamp: 'Just Now',
          read: false,
          target_id: data.toName || 'Dr. Narayan Swamy'
        });
        break;
      case 'Nurse':
        this.addNurseNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'instruction',
          timestamp: 'Just Now',
          read: false,
          patient_id: data.patientName
        });
        break;
      case 'Reception':
        this.addReceptionNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'registration',
          timestamp: 'Just Now',
          read: false
        });
        break;
      case 'Lab':
        this.addLabNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'request',
          timestamp: 'Just Now',
          read: false
        });
        break;
      case 'Radiology':
        this.addRadiologyNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'radiology',
          timestamp: 'Just Now',
          read: false
        });
        break;
      case 'Pharmacy':
        this.addPharmacyNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'prescription',
          timestamp: 'Just Now',
          read: false
        });
        break;
      case 'Ambulance':
        this.addAmbulanceNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'emergency',
          timestamp: 'Just Now',
          read: false
        });
        break;
      case 'Patient':
        this.addPatientNotification({
          id: `notif-univ-${Date.now()}`,
          title: formattedTitle,
          message: fullMsg,
          category: 'general',
          timestamp: 'Just Now',
          read: false
        });
        break;
    }
  },

  // --- NOTIFICATION STORES & HELPERS ---
  getDoctorNotifications(doctorName?: string): DoctorNotificationItem[] {
    try {
      const stored = localStorage.getItem(DOCTOR_NOTIFICATIONS_KEY);
      let list: DoctorNotificationItem[] = stored ? JSON.parse(stored) : [];
      if (list.length === 0) {
        list = [
          {
            id: 'notif-d1',
            title: 'New Patient Appointment Booked',
            category: 'appointment',
            message: 'Patient Rakshitha booked an appointment for 10:30 AM today with Dr. Narayan Swamy.',
            timestamp: '5 mins ago',
            read: false,
            target_id: 'Dr. Narayan Swamy'
          },
          {
            id: 'notif-d2',
            title: '🧪 Lab Result Available',
            category: 'lab',
            message: 'CBC Blood Report ready for Patient Aarav Sharma.',
            timestamp: '15 mins ago',
            read: false,
          }
        ];
        localStorage.setItem(DOCTOR_NOTIFICATIONS_KEY, JSON.stringify(list));
      }
      if (doctorName) {
        const docClean = doctorName.toLowerCase().replace('dr.', '').trim();
        return list.filter(n => !n.target_id || n.target_id.toLowerCase().includes(docClean) || docClean.includes(n.target_id.toLowerCase()));
      }
      return list;
    } catch (e) {
      return [];
    }
  },

  addDoctorNotification(notif: DoctorNotificationItem) {
    const current = this.getDoctorNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(DOCTOR_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_notification_added', { detail: notif }));
  },

  getReceptionNotifications(): ReceptionNotificationItem[] {
    try {
      const stored = localStorage.getItem(RECEPTION_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-r0',
        title: 'New Appointment Booked 📅',
        message: 'Patient Rakshitha booked slot for 10:30 AM with Dr. Narayan Swamy.',
        category: 'registration',
        timestamp: 'Just now',
        read: false,
      }
    ];
  },

  addReceptionNotification(notif: ReceptionNotificationItem) {
    const current = this.getReceptionNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(RECEPTION_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_reception_notif_added', { detail: notif }));
  },

  getNurseNotifications(): NurseNotificationItem[] {
    try {
      const stored = localStorage.getItem(NURSE_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-n1',
        title: 'Doctor Instruction Assigned',
        message: 'Dr. Narayan Swamy ordered IV saline infusion for Bed B102 (Patient Rohan Verma).',
        category: 'instruction',
        timestamp: '10 mins ago',
        read: false,
        patient_id: 'Rohan Verma'
      }
    ];
  },

  addNurseNotification(notif: NurseNotificationItem) {
    const current = this.getNurseNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(NURSE_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_nurse_notif_added', { detail: notif }));
  },

  getLabNotifications(): LabNotificationItem[] {
    try {
      const stored = localStorage.getItem(LAB_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-l1',
        title: 'New Pathology Order',
        message: 'Dr. Narayan Swamy requested Lipid Profile for Patient Rakshitha.',
        category: 'request',
        timestamp: '15 mins ago',
        read: false,
      }
    ];
  },

  addLabNotification(notif: LabNotificationItem) {
    const current = this.getLabNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(LAB_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_lab_notif_added', { detail: notif }));
  },

  getRadiologyNotifications(): any[] {
    try {
      const stored = localStorage.getItem(RADIOLOGY_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-rad1',
        title: '🩻 New Radiology Scan Request',
        message: 'Dr. Narayan Swamy requested Chest CT Scan for Patient Aarav Sharma.',
        category: 'radiology',
        timestamp: '10 mins ago',
        read: false
      }
    ];
  },

  addRadiologyNotification(notif: any) {
    const current = this.getRadiologyNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(RADIOLOGY_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_radiology_notif_added', { detail: notif }));
  },

  getPharmacyNotifications(): any[] {
    try {
      const stored = localStorage.getItem(PHARMACY_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-ph1',
        title: '💊 New Prescription Received',
        message: 'Dr. Narayan Swamy prescribed medicines for Patient Rakshitha.',
        category: 'prescription',
        timestamp: '12 mins ago',
        read: false
      }
    ];
  },

  addPharmacyNotification(notif: any) {
    const current = this.getPharmacyNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(PHARMACY_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_pharmacy_notif_added', { detail: notif }));
  },

  getAmbulanceNotifications(): any[] {
    try {
      const stored = localStorage.getItem(AMBULANCE_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-amb1',
        title: '🚨 Emergency Response Alert',
        message: 'Ambulance requested for critical cardiac patient at Indiranagar.',
        category: 'emergency',
        timestamp: '5 mins ago',
        read: false
      }
    ];
  },

  addAmbulanceNotification(notif: any) {
    const current = this.getAmbulanceNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(AMBULANCE_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_ambulance_notif_added', { detail: notif }));
  },

  getPatientNotifications(): any[] {
    try {
      const stored = localStorage.getItem(PATIENT_NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'notif-p1',
        title: 'Appointment Confirmed',
        message: 'Your consultation with Dr. Narayan Swamy is confirmed for 10:30 AM today.',
        category: 'appointment',
        timestamp: '1 hour ago',
        read: false
      }
    ];
  },

  addPatientNotification(notif: any) {
    const current = this.getPatientNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(PATIENT_NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('smartcare_patient_notif_added', { detail: notif }));
  }
};
