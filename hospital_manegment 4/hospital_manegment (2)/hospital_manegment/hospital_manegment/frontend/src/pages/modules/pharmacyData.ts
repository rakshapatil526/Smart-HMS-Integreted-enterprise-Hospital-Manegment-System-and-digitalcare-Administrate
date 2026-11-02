export interface PharmacyMedicine {
  id: string;
  name: string;
  generic_name: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment';
  batch_number: string;
  stock_quantity: number;
  expiry_date: string;
  supplier: string;
  selling_price: number;
  reorder_level: number;
  status: 'Available' | 'Low Stock' | 'Expiring Soon' | 'Out of Stock';
}

export interface PrescribedMedicineItem {
  id: string;
  medicine_name: string;
  strength: string;
  frequency: string;
  duration: string;
  required_qty: number;
  unit_price: number;
  available_qty: number;
  is_available: boolean;
}

export interface PharmacyPrescription {
  id: string;
  token_no: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: string;
  doctor_name: string;
  department: string;
  date: string;
  medicines: PrescribedMedicineItem[];
  status: 'Pending' | 'Dispensed' | 'Insufficient Stock';
  total_amount: number;
  billing_status: 'Pending' | 'Sent to Billing' | 'Paid';
}

export interface PharmacyTransaction {
  id: string;
  transaction_id: string;
  token_no: string;
  patient_id: string;
  patient_name: string;
  date: string;
  medicines_summary: string;
  total_amount: number;
  pharmacist_name: string;
  billing_status: 'Sent to Billing' | 'Paid';
}

// Initial Pre-populated Pharmacy Inventory
export const initialPharmacyInventory: PharmacyMedicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol',
    generic_name: 'Acetaminophen',
    strength: '500 mg',
    form: 'Tablet',
    batch_number: 'B001',
    stock_quantity: 110,
    expiry_date: '2027-05-15',
    supplier: 'PharmaCare Distributors',
    selling_price: 2.50,
    reorder_level: 20,
    status: 'Available',
  },
  {
    id: 'med-2',
    name: 'Amoxicillin',
    generic_name: 'Amoxicillin Trihydrate',
    strength: '500 mg',
    form: 'Capsule',
    batch_number: 'B002',
    stock_quantity: 3,
    expiry_date: '2026-09-30',
    supplier: 'Apex BioMed Supplies',
    selling_price: 5.00,
    reorder_level: 10,
    status: 'Low Stock',
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    generic_name: 'Atorvastatin Calcium',
    strength: '40 mg',
    form: 'Tablet',
    batch_number: 'B003',
    stock_quantity: 85,
    expiry_date: '2026-09-15',
    supplier: 'CardioPharma Labs',
    selling_price: 12.00,
    reorder_level: 15,
    status: 'Expiring Soon',
  },
  {
    id: 'med-4',
    name: 'Metoprolol Succinate',
    generic_name: 'Metoprolol',
    strength: '25 mg',
    form: 'Tablet',
    batch_number: 'B004',
    stock_quantity: 140,
    expiry_date: '2027-11-20',
    supplier: 'CardioPharma Labs',
    selling_price: 8.50,
    reorder_level: 25,
    status: 'Available',
  },
  {
    id: 'med-5',
    name: 'Aspirin',
    generic_name: 'Acetylsalicylic Acid',
    strength: '75 mg',
    form: 'Tablet',
    batch_number: 'B005',
    stock_quantity: 210,
    expiry_date: '2028-01-10',
    supplier: 'Global Med Corp',
    selling_price: 1.50,
    reorder_level: 30,
    status: 'Available',
  },
  {
    id: 'med-6',
    name: 'Ceftriaxone IV',
    generic_name: 'Ceftriaxone Sodium',
    strength: '1 gm',
    form: 'Injection',
    batch_number: 'B006',
    stock_quantity: 4,
    expiry_date: '2026-10-05',
    supplier: 'Hospital Injectables Inc.',
    selling_price: 18.00,
    reorder_level: 10,
    status: 'Low Stock',
  },
];

// Initial Doctor Prescriptions Queue
export const initialPharmacyPrescriptions: PharmacyPrescription[] = [
  {
    id: 'rx-101',
    token_no: 'RX001',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    doctor_name: 'Dr. Arjun Mehta',
    department: 'Cardiology',
    date: '17 Aug 2026',
    medicines: [
      { id: 'm1', medicine_name: 'Paracetamol', strength: '500 mg', frequency: '1-0-1', duration: '5 Days', required_qty: 10, unit_price: 2.50, available_qty: 110, is_available: true },
      { id: 'm2', medicine_name: 'Atorvastatin', strength: '40 mg', frequency: '0-1-0', duration: '7 Days', required_qty: 7, unit_price: 12.00, available_qty: 85, is_available: true },
      { id: 'm3', medicine_name: 'Aspirin', strength: '75 mg', frequency: '1-0-0', duration: '10 Days', required_qty: 10, unit_price: 1.50, available_qty: 210, is_available: true },
    ],
    status: 'Pending',
    total_amount: 124.00,
    billing_status: 'Pending',
  },
  {
    id: 'rx-102',
    token_no: 'RX002',
    patient_id: 'SC-P002',
    patient_name: 'Anika Patel',
    age: 29,
    gender: 'Female',
    doctor_name: 'Dr. Sarah Jenkins',
    department: 'General Medicine',
    date: '16 Aug 2026',
    medicines: [
      { id: 'm4', medicine_name: 'Paracetamol', strength: '500 mg', frequency: '1-1-1', duration: '5 Days', required_qty: 15, unit_price: 2.50, available_qty: 110, is_available: true },
      { id: 'm5', medicine_name: 'Amoxicillin', strength: '500 mg', frequency: '1-0-1', duration: '5 Days', required_qty: 10, unit_price: 5.00, available_qty: 3, is_available: false },
    ],
    status: 'Insufficient Stock',
    total_amount: 87.50,
    billing_status: 'Pending',
  },
  {
    id: 'rx-103',
    token_no: 'RX003',
    patient_id: 'SC-P003',
    patient_name: 'Rahul Verma',
    age: 52,
    gender: 'Male',
    doctor_name: 'Dr. Vikram Rao',
    department: 'Pulmonology',
    date: '17 Aug 2026',
    medicines: [
      { id: 'm6', medicine_name: 'Ceftriaxone IV', strength: '1 gm', frequency: '1-0-1', duration: '3 Days', required_qty: 6, unit_price: 18.00, available_qty: 4, is_available: false },
    ],
    status: 'Pending',
    total_amount: 108.00,
    billing_status: 'Pending',
  },
  {
    id: 'rx-104',
    token_no: 'RX004',
    patient_id: 'SC-P005',
    patient_name: 'Rajesh Kumar',
    age: 61,
    gender: 'Male',
    doctor_name: 'Dr. Priya Nair',
    department: 'Gastroenterology',
    date: '15 Aug 2026',
    medicines: [
      { id: 'm7', medicine_name: 'Metoprolol Succinate', strength: '25 mg', frequency: '1-0-0', duration: '14 Days', required_qty: 14, unit_price: 8.50, available_qty: 140, is_available: true },
    ],
    status: 'Dispensed',
    total_amount: 119.00,
    billing_status: 'Sent to Billing',
  },
];

// Initial Dispensed Transactions State
export const initialPharmacyTransactions: PharmacyTransaction[] = [
  {
    id: 'tx-1',
    transaction_id: 'PHARM-TX-2026-901',
    token_no: 'RX004',
    patient_id: 'SC-P005',
    patient_name: 'Rajesh Kumar',
    date: '15 Aug 2026 02:15 PM',
    medicines_summary: 'Metoprolol Succinate 25mg (14 Tabs)',
    total_amount: 119.00,
    pharmacist_name: 'Pharmacist Alex Rivera',
    billing_status: 'Sent to Billing',
  },
];
