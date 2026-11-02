from django.urls import path, include
from rest_framework.routers import DefaultRouter
from operations.views import (
    MedicineViewSet, PrescriptionViewSet, PharmacyDispensingViewSet,
    InventoryItemViewSet, StockTransactionViewSet, InvoiceViewSet, PaymentViewSet,
    InsuranceProviderViewSet, PatientInsuranceViewSet, InsuranceClaimViewSet,
    BloodUnitViewSet, BloodRequestViewSet
)

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'pharmacy-dispensing', PharmacyDispensingViewSet)
router.register(r'inventory-items', InventoryItemViewSet)
router.register(r'stock-transactions', StockTransactionViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'insurance-providers', InsuranceProviderViewSet)
router.register(r'patient-insurances', PatientInsuranceViewSet)
router.register(r'insurance-claims', InsuranceClaimViewSet)
router.register(r'blood-units', BloodUnitViewSet)
router.register(r'blood-requests', BloodRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
