export interface BillingLineItem {
  id: string;
  service_name: string;
  source_module: 'OPD' | 'IPD' | 'Laboratory' | 'Radiology' | 'Pharmacy' | 'Procedures' | 'Other';
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface BillingInvoice {
  id: string;
  invoice_number: string;
  bill_number: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: string;
  phone: string;
  visit_type: 'OPD' | 'IPD' | 'Emergency' | 'Pharmacy';
  attending_doctor: string;
  date: string;
  due_date: string;
  line_items: BillingLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  insurance_coverage: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  status: 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Cancelled' | 'Refunded';
  payment_method?: 'Cash' | 'Card' | 'UPI' | 'Online Payment' | 'Insurance TPA';
  cancellation_reason?: string;
  refund_amount?: number;
  refund_reason?: string;
}

export interface BillingReceipt {
  id: string;
  receipt_number: string;
  invoice_number: string;
  patient_name: string;
  patient_id: string;
  amount_paid: number;
  payment_method: 'Cash' | 'Card' | 'UPI' | 'Online Payment';
  transaction_ref: string;
  date: string;
  status: 'PAID ✓' | 'PARTIAL ✓';
  cashier_name: string;
}

export interface BillingRefundRecord {
  id: string;
  refund_id: string;
  invoice_number: string;
  patient_name: string;
  amount_refunded: number;
  reason: string;
  date: string;
  authorized_by: string;
}

// Pre-populated Billing Invoices
export const initialBillingInvoices: BillingInvoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'INV-2026-00125',
    bill_number: 'BILL-8801',
    patient_id: 'SC-P001',
    patient_name: 'Aarav Sharma',
    age: 38,
    gender: 'Male',
    phone: '+91-9876543210',
    visit_type: 'OPD',
    attending_doctor: 'Dr. Arjun Mehta',
    date: '20 Aug 2026',
    due_date: '20 Aug 2026',
    line_items: [
      { id: 'li-1', service_name: 'OPD Specialist Consultation', source_module: 'OPD', quantity: 1, unit_price: 500, amount: 500 },
      { id: 'li-2', service_name: 'Complete Blood Count (CBC)', source_module: 'Laboratory', quantity: 1, unit_price: 300, amount: 300 },
      { id: 'li-3', service_name: 'Chest X-Ray PA View', source_module: 'Radiology', quantity: 1, unit_price: 600, amount: 600 },
      { id: 'li-4', service_name: 'Pharmacy Prescription Medicines', source_module: 'Pharmacy', quantity: 1, unit_price: 450, amount: 450 },
    ],
    subtotal: 1850,
    discount: 0,
    tax: 0,
    insurance_coverage: 0,
    total_amount: 1850,
    amount_paid: 1850,
    balance_due: 0,
    status: 'Paid',
    payment_method: 'UPI',
  },
  {
    id: 'inv-2',
    invoice_number: 'INV-2026-00126',
    bill_number: 'BILL-8802',
    patient_id: 'SC-P002',
    patient_name: 'Anika Patel',
    age: 29,
    gender: 'Female',
    phone: '+91-9876543211',
    visit_type: 'IPD',
    attending_doctor: 'Dr. Sarah Jenkins',
    date: '19 Aug 2026',
    due_date: '22 Aug 2026',
    line_items: [
      { id: 'li-5', service_name: 'VIP Suite Room Stay (3 Days)', source_module: 'IPD', quantity: 3, unit_price: 4000, amount: 12000 },
      { id: 'li-6', service_name: 'Senior Doctor Ward Visits', source_module: 'IPD', quantity: 3, unit_price: 1500, amount: 4500 },
      { id: 'li-7', service_name: 'Full Panel Blood Chemistry', source_module: 'Laboratory', quantity: 1, unit_price: 3500, amount: 3500 },
      { id: 'li-8', service_name: '2D Echocardiography', source_module: 'Radiology', quantity: 1, unit_price: 4000, amount: 4000 },
      { id: 'li-9', service_name: 'IV Antibiotics & Supplies', source_module: 'Pharmacy', quantity: 1, unit_price: 6000, amount: 6000 },
    ],
    subtotal: 30000,
    discount: 2000,
    tax: 0,
    insurance_coverage: 0,
    total_amount: 28000,
    amount_paid: 10000,
    balance_due: 18000,
    status: 'Partially Paid',
    payment_method: 'Card',
  },
  {
    id: 'inv-3',
    invoice_number: 'INV-2026-00127',
    bill_number: 'BILL-8803',
    patient_id: 'SC-P003',
    patient_name: 'Rahul Verma',
    age: 52,
    gender: 'Male',
    phone: '+91-9876543212',
    visit_type: 'IPD',
    attending_doctor: 'Dr. Vikram Rao',
    date: '18 Aug 2026',
    due_date: '21 Aug 2026',
    line_items: [
      { id: 'li-10', service_name: 'ICU Critical Care Bed (4 Days)', source_module: 'IPD', quantity: 4, unit_price: 8000, amount: 32000 },
      { id: 'li-11', service_name: 'HRCT Chest & Contrast Imaging', source_module: 'Radiology', quantity: 1, unit_price: 8000, amount: 8000 },
      { id: 'li-12', service_name: 'ICU Injectables & Meds', source_module: 'Pharmacy', quantity: 1, unit_price: 10000, amount: 10000 },
    ],
    subtotal: 50000,
    discount: 5000,
    tax: 0,
    insurance_coverage: 25000,
    total_amount: 20000,
    amount_paid: 0,
    balance_due: 20000,
    status: 'Issued',
  },
  {
    id: 'inv-4',
    invoice_number: 'INV-2026-00128',
    bill_number: 'BILL-8804',
    patient_id: 'SC-P005',
    patient_name: 'Rajesh Kumar',
    age: 61,
    gender: 'Male',
    phone: '+91-9876543214',
    visit_type: 'OPD',
    attending_doctor: 'Dr. Priya Nair',
    date: '16 Aug 2026',
    due_date: '16 Aug 2026',
    line_items: [
      { id: 'li-13', service_name: 'Gastroenterology Consultation', source_module: 'OPD', quantity: 1, unit_price: 600, amount: 600 },
      { id: 'li-14', service_name: 'Ultrasound Whole Abdomen', source_module: 'Radiology', quantity: 1, unit_price: 2000, amount: 2000 },
    ],
    subtotal: 2600,
    discount: 100,
    tax: 0,
    insurance_coverage: 0,
    total_amount: 2500,
    amount_paid: 2500,
    balance_due: 0,
    status: 'Paid',
    payment_method: 'Cash',
  },
];

// Pre-populated Receipts
export const initialBillingReceipts: BillingReceipt[] = [
  {
    id: 'rcpt-1',
    receipt_number: 'RCPT-2026-00125',
    invoice_number: 'INV-2026-00125',
    patient_name: 'Aarav Sharma',
    patient_id: 'SC-P001',
    amount_paid: 1850,
    payment_method: 'UPI',
    transaction_ref: 'UPI/202688910022',
    date: '20 Aug 2026 11:30 AM',
    status: 'PAID ✓',
    cashier_name: 'Accounts Manager Sarah Connor',
  },
  {
    id: 'rcpt-2',
    receipt_number: 'RCPT-2026-00126',
    invoice_number: 'INV-2026-00126',
    patient_name: 'Anika Patel',
    patient_id: 'SC-P002',
    amount_paid: 10000,
    payment_method: 'Card',
    transaction_ref: 'POS/CARD-4492',
    date: '19 Aug 2026 03:45 PM',
    status: 'PARTIAL ✓',
    cashier_name: 'Accounts Manager Sarah Connor',
  },
];

// Pre-populated Refunds
export const initialBillingRefunds: BillingRefundRecord[] = [
  {
    id: 'ref-1',
    refund_id: 'RFND-2026-901',
    invoice_number: 'INV-2026-00120',
    patient_name: 'Priya Singh',
    amount_refunded: 1000,
    reason: 'Cancelled duplicate lab investigation order',
    date: '15 Aug 2026',
    authorized_by: 'Finance Director James Vance',
  },
];
