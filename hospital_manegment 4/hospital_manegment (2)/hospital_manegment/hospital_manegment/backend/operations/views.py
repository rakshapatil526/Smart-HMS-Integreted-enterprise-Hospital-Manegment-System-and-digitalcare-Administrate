from rest_framework import viewsets, permissions
from operations.models import (
    Medicine, Prescription, PharmacyDispensing, InventoryItem, StockTransaction,
    Invoice, Payment, InsuranceProvider, PatientInsurance, InsuranceClaim,
    BloodUnit, BloodRequest
)
from operations.serializers import (
    MedicineSerializer, PrescriptionSerializer, PharmacyDispensingSerializer,
    InventoryItemSerializer, StockTransactionSerializer, InvoiceSerializer, PaymentSerializer,
    InsuranceProviderSerializer, PatientInsuranceSerializer, InsuranceClaimSerializer,
    BloodUnitSerializer, BloodRequestSerializer
)

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [permissions.AllowAny]

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all().order_by('-created_at')
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.AllowAny]

class PharmacyDispensingViewSet(viewsets.ModelViewSet):
    queryset = PharmacyDispensing.objects.all().order_by('-dispensed_at')
    serializer_class = PharmacyDispensingSerializer
    permission_classes = [permissions.AllowAny]

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by('name')
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.AllowAny]

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.all().order_by('-timestamp')
    serializer_class = StockTransactionSerializer
    permission_classes = [permissions.AllowAny]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-created_at')
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.AllowAny]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-payment_date')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]

class InsuranceProviderViewSet(viewsets.ModelViewSet):
    queryset = InsuranceProvider.objects.all()
    serializer_class = InsuranceProviderSerializer
    permission_classes = [permissions.AllowAny]

class PatientInsuranceViewSet(viewsets.ModelViewSet):
    queryset = PatientInsurance.objects.all()
    serializer_class = PatientInsuranceSerializer
    permission_classes = [permissions.AllowAny]

class InsuranceClaimViewSet(viewsets.ModelViewSet):
    queryset = InsuranceClaim.objects.all().order_by('-submitted_at')
    serializer_class = InsuranceClaimSerializer
    permission_classes = [permissions.AllowAny]

class BloodUnitViewSet(viewsets.ModelViewSet):
    queryset = BloodUnit.objects.all().order_by('-collection_date')
    serializer_class = BloodUnitSerializer
    permission_classes = [permissions.AllowAny]

class BloodRequestViewSet(viewsets.ModelViewSet):
    queryset = BloodRequest.objects.all().order_by('-requested_at')
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.AllowAny]
