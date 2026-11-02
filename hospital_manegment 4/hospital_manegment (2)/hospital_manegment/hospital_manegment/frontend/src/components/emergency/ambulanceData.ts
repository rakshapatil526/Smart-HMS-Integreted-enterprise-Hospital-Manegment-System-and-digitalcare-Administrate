export interface AmbulanceVehicle {
  id: string;
  vehicle_number: string;
  vehicle_type: 'Basic Ambulance (BLS)' | 'Advanced Life Support (ALS ICU)' | 'Neonatal ICU' | 'Trauma Mobile Unit';
  driver_name: string;
  driver_phone: string;
  paramedic_staff: string;
  status: 'Available' | 'Assigned' | 'En Route' | 'At Pickup' | 'Patient Onboard' | 'En Route to Hospital' | 'Hospital Arrived' | 'Completed' | 'Maintenance';
  current_location: string;
  latitude: number;
  longitude: number;
  heading_deg: number;
  speed_kmh: number;
  eta_minutes: number;
  distance_km: number;
  equipment: string[];
  last_service_date: string;
  next_service_date: string;
}

export interface EmergencyRequestItem {
  id: string;
  emergency_id: string;
  patient_id: string;
  patient_name: string;
  phone: string;
  pickup_address: string;
  city_karnataka: 'Bengaluru' | 'Mysuru' | 'Hubballi' | 'Mangaluru' | 'Belagavi';
  latitude: number;
  longitude: number;
  emergency_type: 'Accident' | 'Cardiac Emergency' | 'Neurological Emergency' | 'Breathing Difficulty' | 'Injury' | 'Burn' | 'Pediatric Emergency' | 'Other';
  severity: 'Critical' | 'Urgent' | 'Moderate';
  patient_count: number;
  description: string;
  assigned_ambulance_id: string;
  assigned_driver: string;
  status: 'Requested' | 'Assigned' | 'En Route' | 'At Pickup' | 'Patient Onboard' | 'Hospital Arrived' | 'Completed';
  request_time: string;
  hospital_destination: string;
  trip_charge: number;
}

export interface HospitalERAlert {
  id: string;
  alert_id: string;
  ambulance_number: string;
  patient_name: string;
  emergency_id: string;
  emergency_type: string;
  eta_minutes: number;
  required_resources: string[];
  status: 'Incoming Alert' | 'Trauma Bay Prepped' | 'Patient Received';
  timestamp: string;
}

// Initial Ambulances Fleet (Karnataka Locations)
export const initialAmbulanceFleet: AmbulanceVehicle[] = [
  {
    id: 'amb-1',
    vehicle_number: 'KA-01-EA-1001',
    vehicle_type: 'Advanced Life Support (ALS ICU)',
    driver_name: 'Ravi Kumar',
    driver_phone: '+91-9845012345',
    paramedic_staff: 'Paramedic Dr. Suresh Gowda',
    status: 'En Route to Hospital',
    current_location: 'MG Road / Indiranagar Junction, Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    heading_deg: 45,
    speed_kmh: 58,
    eta_minutes: 8,
    distance_km: 3.4,
    equipment: ['Defibrillator', 'Ventilator', 'High Oxygen System', 'ECG Monitor', 'Stretcher'],
    last_service_date: '10 Aug 2026',
    next_service_date: '10 Sep 2026',
  },
  {
    id: 'amb-2',
    vehicle_number: 'KA-09-EA-2002',
    vehicle_type: 'Basic Ambulance (BLS)',
    driver_name: 'Arun Hegde',
    driver_phone: '+91-9845023456',
    paramedic_staff: 'Nurse Rajeshwari',
    status: 'Available',
    current_location: 'Jayalakshmipuram, Mysuru',
    latitude: 12.3051,
    longitude: 76.6551,
    heading_deg: 0,
    speed_kmh: 0,
    eta_minutes: 0,
    distance_km: 0,
    equipment: ['Oxygen Cylinder', 'First Aid Kit', 'Foldable Stretcher'],
    last_service_date: '05 Aug 2026',
    next_service_date: '05 Sep 2026',
  },
  {
    id: 'amb-3',
    vehicle_number: 'KA-25-EA-3003',
    vehicle_type: 'Advanced Life Support (ALS ICU)',
    driver_name: 'Manoj Patil',
    driver_phone: '+91-9845034567',
    paramedic_staff: 'Paramedic Anoop Kulkarni',
    status: 'At Pickup',
    current_location: 'Vidyanagar, Hubballi',
    latitude: 15.3647,
    longitude: 75.1240,
    heading_deg: 120,
    speed_kmh: 0,
    eta_minutes: 12,
    distance_km: 5.1,
    equipment: ['Defibrillator', 'Infusion Pump', 'Suction Unit', 'Stretcher'],
    last_service_date: '01 Aug 2026',
    next_service_date: '01 Sep 2026',
  },
  {
    id: 'amb-4',
    vehicle_number: 'KA-19-EA-4004',
    vehicle_type: 'Trauma Mobile Unit',
    driver_name: 'Pradeep Shetty',
    driver_phone: '+91-9845045678',
    paramedic_staff: 'Paramedic Divya Rai',
    status: 'Available',
    current_location: 'Hampankatta, Mangaluru',
    latitude: 12.8702,
    longitude: 74.8440,
    heading_deg: 0,
    speed_kmh: 0,
    eta_minutes: 0,
    distance_km: 0,
    equipment: ['Spine Board', 'Trauma Kit', 'Advanced Airways', 'Oxygen'],
    last_service_date: '12 Aug 2026',
    next_service_date: '12 Sep 2026',
  },
  {
    id: 'amb-5',
    vehicle_number: 'KA-22-EA-5005',
    vehicle_type: 'Neonatal ICU',
    driver_name: 'Basavaraj Chougule',
    driver_phone: '+91-9845056789',
    paramedic_staff: 'Nurse Sunita Deshmukh',
    status: 'Maintenance',
    current_location: 'Khanapur Road, Belagavi',
    latitude: 15.8497,
    longitude: 74.4977,
    heading_deg: 0,
    speed_kmh: 0,
    eta_minutes: 0,
    distance_km: 0,
    equipment: ['Infant Incubator', 'Transport Ventilator', 'Monitor'],
    last_service_date: '15 Jul 2026',
    next_service_date: '18 Aug 2026',
  },
];

// Initial Emergency Requests Queue
export const initialEmergencyRequests: EmergencyRequestItem[] = [
  {
    id: 'er-1',
    emergency_id: 'EMERG-2026-001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    phone: '+91-9876543210',
    pickup_address: 'Main Road / MG Road Crossing, Bengaluru',
    city_karnataka: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    emergency_type: 'Cardiac Emergency',
    severity: 'Critical',
    patient_count: 1,
    description: 'Acute chest pain with diaphoresis and exertional dyspnea',
    assigned_ambulance_id: 'KA-01-EA-1001',
    assigned_driver: 'Ravi Kumar',
    status: 'Patient Onboard',
    request_time: '17 Aug 2026 10:15 AM',
    hospital_destination: 'Smart Care Central Hospital, Bengaluru',
    trip_charge: 2500,
  },
  {
    id: 'er-2',
    emergency_id: 'EMERG-2026-002',
    patient_id: 'SC-P002',
    patient_name: 'Anika Patel',
    phone: '+91-9876543211',
    pickup_address: 'City Bus Station Road, Mysuru',
    city_karnataka: 'Mysuru',
    latitude: 12.3051,
    longitude: 76.6551,
    emergency_type: 'Accident',
    severity: 'Urgent',
    patient_count: 1,
    description: 'Two-wheeler collision, laceration on right knee',
    assigned_ambulance_id: 'KA-09-EA-2002',
    assigned_driver: 'Arun Hegde',
    status: 'Hospital Arrived',
    request_time: '17 Aug 2026 09:30 AM',
    hospital_destination: 'Smart Care Regional Hospital, Mysuru',
    trip_charge: 1800,
  },
  {
    id: 'er-3',
    emergency_id: 'EMERG-2026-003',
    patient_id: 'SC-P003',
    patient_name: 'Rahul Verma',
    phone: '+91-9876543212',
    pickup_address: 'Airport Road, Hubballi',
    city_karnataka: 'Hubballi',
    latitude: 15.3647,
    longitude: 75.1240,
    emergency_type: 'Breathing Difficulty',
    severity: 'Critical',
    patient_count: 1,
    description: 'COPD acute respiratory distress, SpO2 desaturation',
    assigned_ambulance_id: 'KA-25-EA-3003',
    assigned_driver: 'Manoj Patil',
    status: 'En Route',
    request_time: '17 Aug 2026 10:40 AM',
    hospital_destination: 'Smart Care Emergency Care, Hubballi',
    trip_charge: 2200,
  },
];

// Initial Hospital ER Alerts
export const initialERAlerts: HospitalERAlert[] = [
  {
    id: 'alt-1',
    alert_id: 'ALERT-2026-901',
    ambulance_number: 'KA-01-EA-1001',
    patient_name: 'Aarav Sharma',
    emergency_id: 'EMERG-2026-001',
    emergency_type: 'Cardiac Emergency',
    eta_minutes: 8,
    required_resources: ['Emergency Physician', 'Trauma Bay Bed 2', 'Cath Lab Standby', 'ECG / Defibrillator'],
    status: 'Trauma Bay Prepped',
    timestamp: '10:42 AM',
  },
];
