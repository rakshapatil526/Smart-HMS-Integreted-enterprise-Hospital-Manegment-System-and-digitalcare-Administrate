from django.urls import path, include
from rest_framework.routers import DefaultRouter
from diagnostics.views import (
    LabRequestViewSet, LabResultViewSet,
    RadiologyRequestViewSet, RadiologyReportViewSet
)

router = DefaultRouter()
router.register(r'lab-requests', LabRequestViewSet)
router.register(r'lab-results', LabResultViewSet)
router.register(r'radiology-requests', RadiologyRequestViewSet)
router.register(r'radiology-reports', RadiologyReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
