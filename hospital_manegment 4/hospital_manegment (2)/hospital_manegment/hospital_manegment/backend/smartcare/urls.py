from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('core.urls')),
    path('api/v1/clinical/', include('clinical.urls')),
    path('api/v1/diagnostics/', include('diagnostics.urls')),
    path('api/v1/operations/', include('operations.urls')),
    path('api/v1/emergency-hr/', include('emergency_hr.urls')),
    path('api/v1/ai/', include('ai_assistant.urls')),
    path('api/ai/', include('ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
