from rest_framework import serializers
from operations.models import (
    Medicine, Prescription, PharmacyDispensing, InventoryItem, StockTransaction,
    Invoice, Payment, InsuranceProvider, PatientInsurance, InsuranceClaim,
    BloodUnit, BloodRequest
)
from clinical.serializers import PatientSerializer, DoctorSerializer

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'

class PharmacyDispensingSerializer(serializers.ModelSerializer):
    pharmacist_name = serializers.CharField(source='pharmacist.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = PharmacyDispensing
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class StockTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = StockTransaction
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'

class InsuranceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceProvider
        fields = '__all__'

class PatientInsuranceSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = PatientInsurance
        fields = '__all__'

class InsuranceClaimSerializer(serializers.ModelSerializer):
    policy_number = serializers.CharField(source='policy.policy_number', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)

    class Meta:
        model = InsuranceClaim
        fields = '__all__'

class BloodUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodUnit
        fields = '__all__'

class BloodRequestSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)

    class Meta:
        model = BloodRequest
        fields = '__all__'
