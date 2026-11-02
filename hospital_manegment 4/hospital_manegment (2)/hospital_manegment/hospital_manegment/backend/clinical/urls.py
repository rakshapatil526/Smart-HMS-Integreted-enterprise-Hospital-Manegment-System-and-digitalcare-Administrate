from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clinical.views import (
    PatientViewSet, DoctorViewSet, AppointmentViewSet, OPDConsultationViewSet,
    BedViewSet, AdmissionViewSet, NursingRecordViewSet, OTScheduleViewSet, EHRTimelineViewSet
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'opd', OPDConsultationViewSet)
router.register(r'beds', BedViewSet)
router.register(r'admissions', AdmissionViewSet)
router.register(r'nursing', NursingRecordViewSet)
router.register(r'ot', OTScheduleViewSet)
router.register(r'ehr', EHRTimelineViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
