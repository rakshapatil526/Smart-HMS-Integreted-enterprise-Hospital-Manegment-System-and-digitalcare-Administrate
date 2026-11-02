from django.urls import path, include
from rest_framework.routers import DefaultRouter
from emergency_hr.views import (
    HospitalViewSet, AmbulanceViewSet, EmergencyRequestViewSet,
    HREmployeeViewSet, PayrollViewSet, TelemedicineAppointmentViewSet
)

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'ambulances', AmbulanceViewSet)
router.register(r'emergency-requests', EmergencyRequestViewSet)
router.register(r'employees', HREmployeeViewSet)
router.register(r'payrolls', PayrollViewSet)
router.register(r'telemedicine', TelemedicineAppointmentViewSet)

urlpatterns = [
    path('nearby-hospitals/', HospitalViewSet.as_view({'get': 'nearby', 'post': 'nearby'}), name='nearby-hospitals'),
    path('', include(router.urls)),
]
