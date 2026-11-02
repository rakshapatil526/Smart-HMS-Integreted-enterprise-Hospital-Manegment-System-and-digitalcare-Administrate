from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import (
    login_view,
    google_login_view,
    register_patient_view,
    forgot_password_view,
    me_view,
    DepartmentViewSet,
    UserViewSet,
    ai_clinical_suggestion,
    ai_chatbot,
    ai_voice_assistant,
    generate_pdf_document,
    create_staff_user,
)


router = DefaultRouter()

router.register(
    r'departments',
    DepartmentViewSet
)

router.register(
    r'users',
    UserViewSet
)


urlpatterns = [

    path(
        'login/',
        login_view,
        name='login'
    ),

    path(
        'google-login/',
        google_login_view,
        name='google_login'
    ),

    # ADMIN: CREATE STAFF ACCOUNT
    path(
        'admin/create-staff/',
        create_staff_user,
        name='create_staff_user'
    ),

    path(
        'register-patient/',
        register_patient_view,
        name='register_patient'
    ),

    path(
        'forgot-password/',
        forgot_password_view,
        name='forgot_password'
    ),

    path(
        'me/',
        me_view,
        name='me'
    ),

    path(
        'ai/cds/',
        ai_clinical_suggestion,
        name='ai_cds'
    ),

    path(
        'ai/chatbot/',
        ai_chatbot,
        name='ai_chatbot'
    ),

    path(
        'ai/voice/',
        ai_voice_assistant,
        name='ai_voice'
    ),

    path(
        'pdf/generate/',
        generate_pdf_document,
        name='generate_pdf'
    ),

    path(
        '',
        include(router.urls)
    ),
]