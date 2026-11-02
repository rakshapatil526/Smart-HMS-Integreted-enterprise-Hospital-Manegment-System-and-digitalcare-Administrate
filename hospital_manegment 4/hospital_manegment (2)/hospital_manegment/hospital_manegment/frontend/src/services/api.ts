import axios from 'axios';
import { UserRole } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartcare_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (email: string, password: string, role: UserRole) =>
    api.post('/auth/login/', {
        email,
        password,
        role
    }),
    createStaffUser: (data: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}) =>
  api.post('/auth/admin/create-staff/', data),
  googleLogin: (email: string, firstName?: string, lastName?: string) =>
    api.post('/auth/google-login/', { email, first_name: firstName, last_name: lastName }),
  registerPatient: (data: any) => api.post('/auth/register-patient/', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password/', { email }),
  getProfile: () => api.get('/auth/me/'),
  getDepartments: () => api.get('/auth/departments/'),
  getUsers: () => api.get('/auth/users/'),
  postAIClinicalSuggestion: (payload: any) => api.post('/auth/ai/cds/', payload),
  postAIChatbot: (query: string) => api.post('/auth/ai/chatbot/', { query }),
  postAIVoice: (transcript: string) => api.post('/auth/ai/voice/', { transcript }),
  generatePDF: (type: string, payload: any) => api.post('/auth/pdf/generate/', { type, payload }, { responseType: 'blob' }),
};

export const aiAssistantApi = {
  postChat: (message: string) => api.post('/ai/chat/', { message }),
  getHistory: () => api.get('/ai/history/'),
  clearHistory: () => api.delete('/ai/history/'),
};

export const clinicalApi = {
  getPatients: () => api.get('/clinical/patients/'),
  createPatient: (data: any) => api.post('/clinical/patients/', data),
  getDoctors: () => api.get('/clinical/doctors/'),
  getAppointments: () => api.get('/clinical/appointments/'),
  createAppointment: (data: any) => api.post('/clinical/appointments/', data),
  getOPDConsultations: () => api.get('/clinical/opd/'),
  createOPDConsultation: (data: any) => api.post('/clinical/opd/', data),
  getBeds: () => api.get('/clinical/beds/'),
  getAdmissions: () => api.get('/clinical/admissions/'),
  createAdmission: (data: any) => api.post('/clinical/admissions/', data),
  getNursingRecords: () => api.get('/clinical/nursing/'),
  createNursingRecord: (data: any) => api.post('/clinical/nursing/', data),
  getOTSchedule: () => api.get('/clinical/ot/'),
  createOTSchedule: (data: any) => api.post('/clinical/ot/', data),
  getEHRTimeline: (patientId?: string) => api.get(`/clinical/ehr/${patientId ? `?patient=${patientId}` : ''}`),
};

export const diagnosticsApi = {
  getLabRequests: () => api.get('/diagnostics/lab-requests/'),
  createLabRequest: (data: any) => api.post('/diagnostics/lab-requests/', data),
  getLabResults: () => api.get('/diagnostics/lab-results/'),
  createLabResult: (data: any) => api.post('/diagnostics/lab-results/', data),
  getRadiologyRequests: () => api.get('/diagnostics/radiology-requests/'),
  createRadiologyRequest: (data: any) => api.post('/diagnostics/radiology-requests/', data),
  getRadiologyReports: () => api.get('/diagnostics/radiology-reports/'),
};

export const operationsApi = {
  getMedicines: () => api.get('/operations/medicines/'),
  getPrescriptions: () => api.get('/operations/prescriptions/'),
  createPrescription: (data: any) => api.post('/operations/prescriptions/', data),
  getInventoryItems: () => api.get('/operations/inventory-items/'),
  getInvoices: () => api.get('/operations/invoices/'),
  createInvoice: (data: any) => api.post('/operations/invoices/', data),
  getPayments: () => api.get('/operations/payments/'),
  getInsuranceProviders: () => api.get('/operations/insurance-providers/'),
  getPatientInsurances: () => api.get('/operations/patient-insurances/'),
  getInsuranceClaims: () => api.get('/operations/insurance-claims/'),
  getBloodUnits: () => api.get('/operations/blood-units/'),
  getBloodRequests: () => api.get('/operations/blood-requests/'),
  createBloodRequest: (data: any) => api.post('/operations/blood-requests/', data),
};

export const emergencyHrApi = {
  getHospitals: () => api.get('/emergency-hr/hospitals/'),
  getNearbyHospitals: (latitude: number, longitude: number, radius: number = 25) =>
    api.get(`/emergency-hr/nearby-hospitals/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  getAmbulances: () => api.get('/emergency-hr/ambulances/'),
  getAmbulanceStats: () => api.get('/emergency-hr/ambulances/stats/'),
  getNearbyAmbulances: (latitude: number, longitude: number, radius: number = 25) =>
    api.get(`/emergency-hr/ambulances/nearby/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  getEmergencyRequests: () => api.get('/emergency-hr/emergency-requests/'),
  createEmergencyRequest: (data: any) => api.post('/emergency-hr/emergency-requests/', data),
  assignAmbulance: (id: string, ambulanceId: string) => api.post(`/emergency-hr/emergency-requests/${id}/assign_ambulance/`, { ambulance_id: ambulanceId }),
  acceptEmergencyRequest: (id: string) => api.post(`/emergency-hr/emergency-requests/${id}/accept/`),
  updateEmergencyStatus: (id: string, status: string) => api.post(`/emergency-hr/emergency-requests/${id}/update_status/`, { status }),
  sendHospitalAlert: (id: string) => api.post(`/emergency-hr/emergency-requests/${id}/send_hospital_alert/`),
  erPrep: (id: string, data: any) => api.post(`/emergency-hr/emergency-requests/${id}/er_prep/`, data),
  doctorHandover: (id: string, notes: string) => api.post(`/emergency-hr/emergency-requests/${id}/doctor_handover/`, { notes }),
  generateBilling: (id: string) => api.post(`/emergency-hr/emergency-requests/${id}/generate_billing/`),
  searchNearbyAmbulances: (latitude: number, longitude: number) => api.post('/emergency-hr/emergency-requests/search_nearby/', { latitude, longitude }),
  updateAmbulanceLocation: (id: string, lat: number, lng: number, locationName?: string) => api.post(`/emergency-hr/ambulances/${id}/update_location/`, { latitude: lat, longitude: lng, location_name: locationName }),
  getHREmployees: () => api.get('/emergency-hr/employees/'),
  getPayrolls: () => api.get('/emergency-hr/payrolls/'),
  getTelemedicineSessions: () => api.get('/emergency-hr/telemedicine/'),
};

export const connectEmergencyWebSocket = (onMessage: (data: any) => void): () => void => {
  const wsUrl = 'ws://127.0.0.1:8000/ws/emergency/';
  let socket: WebSocket | null = null;
  let isClosedManually = false;

  const connect = () => {
    try {
      socket = new WebSocket(wsUrl);
      socket.onopen = () => {
        console.log('[EmergencyWS] Connected to real-time dispatch server');
      };
      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          onMessage(parsed);
        } catch (e) {
          console.error('[EmergencyWS] Message parse error:', e);
        }
      };
      socket.onerror = (err) => {
        console.warn('[EmergencyWS] Socket error:', err);
      };
      socket.onclose = () => {
        if (!isClosedManually) {
          console.log('[EmergencyWS] Socket closed. Reconnecting in 3s...');
          setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      console.warn('[EmergencyWS] Connection failed:', err);
    }
  };

  connect();

  return () => {
    isClosedManually = true;
    if (socket) {
      socket.close();
    }
  };
};


