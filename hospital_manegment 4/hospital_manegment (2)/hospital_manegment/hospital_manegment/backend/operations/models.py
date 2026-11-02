import uuid
from django.db import models
from core.models import User
from clinical.models import Patient, Doctor

class Medicine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    generic_name = models.CharField(max_length=150)
    category = models.CharField(max_length=100) # Tablet, Syrup, Injection, Ointment
    batch_number = models.CharField(max_length=50)
    expiry_date = models.DateField()
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.batch_number})"

class Prescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    medicines = models.JSONField(default=list) # [{"medicine_name": "Paracetamol", "dosage": "500mg", "frequency": "1-0-1", "duration": "5 days"}]
    instructions = models.TextField(blank=True, null=True)
    is_dispensed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PharmacyDispensing(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE)
    pharmacist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    dispensed_at = models.DateTimeField(auto_now_add=True)

class InventoryItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100) # Surgical, General Equipment, Consumable, Lab Supply
    supplier = models.CharField(max_length=150)
    stock_quantity = models.IntegerField(default=0)
    min_reorder_qty = models.IntegerField(default=10)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    updated_at = models.DateTimeField(auto_now=True)

class StockTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=[('IN', 'Stock In'), ('OUT', 'Stock Out')])
    quantity = models.IntegerField()
    remarks = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class Invoice(models.Model):
    STATUS_CHOICES = [('Pending', 'Pending'), ('Paid', 'Paid'), ('Partial', 'Partial'), ('Cancelled', 'Cancelled')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='invoices')
    source_module = models.CharField(max_length=50) # OPD, IPD, Lab, Pharmacy, Radiology, OT, Ambulance
    line_items = models.JSONField(default=list) # [{"description": "Consultation", "amount": 500}]
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    invoice_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Card', 'Card'), ('Insurance', 'Insurance'), ('UPI', 'UPI')])
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_reference = models.CharField(max_length=100, blank=True, null=True)
    receipt_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    payment_date = models.DateTimeField(auto_now_add=True)

class InsuranceProvider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=50, unique=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)

class PatientInsurance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='insurance_policies')
    provider = models.ForeignKey(InsuranceProvider, on_delete=models.CASCADE)
    policy_number = models.CharField(max_length=100)
    coverage_amount = models.DecimalField(max_digits=12, decimal_places=2)
    expiry_date = models.DateField()

class InsuranceClaim(models.Model):
    STATUS_CHOICES = [('Submitted', 'Submitted'), ('Under Review', 'Under Review'), ('Approved', 'Approved'), ('Settled', 'Settled'), ('Rejected', 'Rejected')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    claim_number = models.CharField(max_length=50, unique=True)
    policy = models.ForeignKey(PatientInsurance, on_delete=models.CASCADE)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    claim_amount = models.DecimalField(max_digits=10, decimal_places=2)
    approved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)

class BloodUnit(models.Model):
    STATUS_CHOICES = [('Available', 'Available'), ('Reserved', 'Reserved'), ('Transfused', 'Transfused'), ('Expired', 'Expired')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    unit_number = models.CharField(max_length=50, unique=True)
    blood_group = models.CharField(max_length=10) # A+, B+, O+, AB+, A-, B-, O-, AB-
    collection_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    donor_name = models.CharField(max_length=100)

class BloodRequest(models.Model):
    STATUS_CHOICES = [('Requested', 'Requested'), ('Fulfilled', 'Fulfilled'), ('Rejected', 'Rejected')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=10)
    units_requested = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Requested')
    requested_at = models.DateTimeField(auto_now_add=True)
