import uuid
from django.db import models
from core.models import User
from clinical.models import Patient, Doctor

class LabRequest(models.Model):
    STATUS_CHOICES = [
        ('Requested', 'Requested'),
        ('Sample Collected', 'Sample Collected'),
        ('Processing', 'Processing'),
        ('Completed', 'Completed'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_requests')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    test_name = models.CharField(max_length=150)
    category = models.CharField(max_length=100) # Hematology, Biochemistry, Microbiology, Pathology
    sample_type = models.CharField(max_length=50, default='Blood')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Requested')
    requested_at = models.DateTimeField(auto_now_add=True)

class LabResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lab_request = models.OneToOneField(LabRequest, on_delete=models.CASCADE, related_name='result')
    result_data = models.JSONField(default=dict) # e.g. [{"parameter": "Hemoglobin", "value": "14.2", "unit": "g/dL", "normal_range": "13.5-17.5"}]
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    report_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

class RadiologyRequest(models.Model):
    MODALITY_CHOICES = [('X-Ray', 'X-Ray'), ('CT Scan', 'CT Scan'), ('MRI', 'MRI'), ('Ultrasound', 'Ultrasound')]
    STATUS_CHOICES = [('Requested', 'Requested'), ('Scheduled', 'Scheduled'), ('Scanned', 'Scanned'), ('Reported', 'Reported')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='radiology_requests')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    modality = models.CharField(max_length=20, choices=MODALITY_CHOICES)
    body_part = models.CharField(max_length=100)
    clinical_reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Requested')
    requested_at = models.DateTimeField(auto_now_add=True)

class RadiologyReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    radiology_request = models.OneToOneField(RadiologyRequest, on_delete=models.CASCADE, related_name='report')
    radiologist = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    findings = models.TextField()
    impression = models.TextField()
    report_pdf_url = models.CharField(max_length=500, blank=True, null=True)
    reported_at = models.DateTimeField(auto_now_add=True)
