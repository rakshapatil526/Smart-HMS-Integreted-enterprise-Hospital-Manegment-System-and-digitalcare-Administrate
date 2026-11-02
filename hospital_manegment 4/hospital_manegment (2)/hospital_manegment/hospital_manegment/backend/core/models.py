import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class RoleChoices(models.TextChoices):
    PATIENT = 'Patient', 'Patient'
    RECEPTION = 'Reception', 'Reception'
    DOCTOR = 'Doctor', 'Doctor'
    NURSE = 'Nurse', 'Nurse'
    LAB_TECH = 'Laboratory Technician', 'Laboratory Technician'
    RADIOLOGIST = 'Radiologist', 'Radiologist'
    PHARMACIST = 'Pharmacist', 'Pharmacist'
    OT_STAFF = 'OT Staff', 'OT Staff'
    BILLING_STAFF = 'Billing Staff', 'Billing Staff'
    INSURANCE_STAFF = 'Insurance Staff', 'Insurance Staff'
    INVENTORY_MANAGER = 'Inventory Manager', 'Inventory Manager'
    BLOOD_BANK_STAFF = 'Blood Bank Staff', 'Blood Bank Staff'
    AMBULANCE_OPERATOR = 'Ambulance Operator', 'Ambulance Operator'
    AMBULANCE_DRIVER = 'Ambulance Driver', 'Ambulance Driver'
    HR_STAFF = 'HR Staff', 'HR Staff'
    ADMIN = 'Admin', 'Admin'

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=RoleChoices.choices, default=RoleChoices.PATIENT)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.CharField(max_length=500, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    module = models.CharField(max_length=100)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class AIInteractionLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=50) # 'CDS', 'CHATBOT', 'VOICE'
    query_text = models.TextField()
    response_text = models.TextField()
    context_data = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
