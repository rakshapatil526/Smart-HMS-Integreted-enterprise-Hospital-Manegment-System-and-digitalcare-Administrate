from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse

from core.models import User, Department, AuditLog, RoleChoices
from core.serializers import (
    UserSerializer,
    DepartmentSerializer,
    AuditLogSerializer
)
from core.ai_service import AIService
from core.pdf_generator import PDFGenerator


# ============================================================
# GOOGLE LOGIN
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):

    email = request.data.get('email')
    first_name = request.data.get('first_name', 'Google')
    last_name = request.data.get('last_name', 'User')

    if not email:
        return Response(
            {
                'error': 'Google account email is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.filter(
        email__iexact=email
    ).first()

    if not user:

        # Create a Patient account for new Google users
        username = email.split('@')[0]

        base_user = username
        counter = 1

        while User.objects.filter(
            username=username
        ).exists():

            username = f"{base_user}_{counter}"

            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password='GoogleOAuthPassword@2026',
            first_name=first_name,
            last_name=last_name,
            role=RoleChoices.PATIENT
        )

    # Create JWT
    refresh = RefreshToken.for_user(user)

    serializer = UserSerializer(user)

    # Audit log
    AuditLog.objects.create(
        user=user,
        action='GOOGLE_LOGIN',
        module='AUTH',
        details=(
            f"User {user.email} "
            f"authenticated via Google OAuth"
        )
    )

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': serializer.data
    })


# ============================================================
# LOGIN
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):

    # --------------------------------------------------------
    # Get login information
    # --------------------------------------------------------

    email = request.data.get(
        'email',
        ''
    ).strip()

    password = request.data.get(
        'password',
        ''
    )

    selected_role = request.data.get(
        'role',
        ''
    ).strip()

    # --------------------------------------------------------
    # Validate required fields
    # --------------------------------------------------------

    if not email or not password:

        return Response(
            {
                'error':
                    'Email and password are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------------------------------
    # Find user
    #
    # User can login using:
    # - Email
    # - Username
    # --------------------------------------------------------

    user = (
        User.objects.filter(
            email__iexact=email
        ).first()
        or
        User.objects.filter(
            username__iexact=email
        ).first()
    )

    # --------------------------------------------------------
    # Check email and password
    # --------------------------------------------------------

    if not user or not user.check_password(password):

        return Response(
            {
                'error':
                    'Invalid email or password.'
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # --------------------------------------------------------
    # IMPORTANT ROLE VALIDATION
    #
    # If selected_role is provided, verify it matches.
    # Otherwise, backend resolves user's actual database role.
    # --------------------------------------------------------

    if selected_role and user.role != selected_role:

        return Response(
            {
                'error': (
                    f'You cannot login as {selected_role}. '
                    f'This account is registered as {user.role}.'
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # --------------------------------------------------------
    # Check whether account is active
    # --------------------------------------------------------

    if not user.is_active:

        return Response(
            {
                'error': (
                    'Your account is currently inactive. '
                    'Please contact the hospital administrator.'
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # --------------------------------------------------------
    # Create JWT tokens
    # --------------------------------------------------------

    refresh = RefreshToken.for_user(user)

    serializer = UserSerializer(user)

    # --------------------------------------------------------
    # Create audit log
    # --------------------------------------------------------

    AuditLog.objects.create(
        user=user,
        action='LOGIN',
        module='AUTH',
        details=(
            f"User {user.email} "
            f"authenticated as {user.role}"
        )
    )

    # --------------------------------------------------------
    # Return login response
    # --------------------------------------------------------

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': serializer.data
    })


# ============================================================
# PATIENT REGISTRATION
# ============================================================
# ============================================================
# CREATE STAFF USER - ADMIN ONLY
# ============================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_staff_user(request):

    # Only Admin can create staff accounts
    if request.user.role != RoleChoices.ADMIN:
        return Response(
            {
                'error': 'Only Admin can create staff accounts.'
            },
            status=status.HTTP_403_FORBIDDEN
        )

    full_name = request.data.get(
        'full_name',
        ''
    ).strip()

    email = request.data.get(
        'email',
        ''
    ).strip().lower()

    phone = request.data.get(
        'phone',
        ''
    ).strip()

    password = request.data.get(
        'password',
        ''
    )

    role = request.data.get(
        'role',
        ''
    ).strip()

    # Check required fields
    if not full_name or not email or not password or not role:
        return Response(
            {
                'error':
                    'Name, email, password and role are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Patient accounts must be created through
    # patient registration, not Admin staff creation.
    if role == RoleChoices.PATIENT:
        return Response(
            {
                'error':
                    'Patient accounts must use patient registration.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check whether role is valid
    valid_roles = [
        choice[0]
        for choice in RoleChoices.choices
    ]

    if role not in valid_roles:
        return Response(
            {
                'error': 'Invalid staff role.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check duplicate email
    if User.objects.filter(
        email__iexact=email
    ).exists():
        return Response(
            {
                'error':
                    'An account with this email already exists.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Split name
    name_parts = full_name.split()

    first_name = name_parts[0]

    last_name = (
        ' '.join(name_parts[1:])
        if len(name_parts) > 1
        else ''
    )

    # Create unique username
    username = email.split('@')[0]

    base_username = username
    counter = 1

    while User.objects.filter(
        username=username
    ).exists():

        username = f'{base_username}_{counter}'
        counter += 1

    # Resolve Department if provided
    department_name = request.data.get('department_name') or request.data.get('department') or ''
    department_obj = None
    if department_name:
        department_obj = (
            Department.objects.filter(name__iexact=department_name).first()
            or Department.objects.filter(id__iexact=department_name).first()
        )
    if not department_obj and role == RoleChoices.DOCTOR:
        department_obj = Department.objects.first()

    # Create staff account
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        role=role,
        department=department_obj
    )

    # If role is Doctor, create the corresponding Doctor profile
    if role == RoleChoices.DOCTOR:
        try:
            from clinical.models import Doctor
            spec = request.data.get('specialization') or 'Consultant Physician'
            exp = int(request.data.get('experience') or request.data.get('experience_years') or 5)
            fee = float(request.data.get('consultation_fee') or 500.00)
            dept_code = department_obj.code if department_obj else 'GEN'
            doc_count = Doctor.objects.count() + 1
            Doctor.objects.create(
                doctor_id=f"DOC-{dept_code}-{doc_count:02d}",
                user=user,
                department=department_obj or Department.objects.first(),
                specialization=spec,
                qualification=request.data.get('qualification') or 'Senior Consultant',
                experience_years=exp,
                consultation_fee=fee,
                schedule={"Mon-Sat": ["09:00-13:00", "15:00-18:00"]}
            )
        except Exception as e:
            print("Error creating doctor profile in DB:", e)

    # Audit log
    AuditLog.objects.create(
        user=request.user,
        action='CREATE_STAFF_USER',
        module='AUTH',
        details=(
            f'Admin created {role} account '
            f'for {user.email}'
        )
    )

    serializer = UserSerializer(user)

    return Response(
        {
            'message':
                f'{role} account created successfully.',
            'user': serializer.data
        },
        status=status.HTTP_201_CREATED
    )


# ============================================================
# PATIENT REGISTRATION
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_patient_view(request):

    email = request.data.get(
        'email',
        ''
    ).strip().lower()

    password = request.data.get(
        'password',
        ''
    )

    full_name = request.data.get(
        'full_name',
        ''
    ).strip()

    phone = request.data.get(
        'phone',
        ''
    ).strip()

    # --------------------------------------------------------
    # Required fields
    # --------------------------------------------------------

    if not email or not password:

        return Response(
            {
                'error':
                    'Email and password are required.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------------------------------
    # Check duplicate email
    # --------------------------------------------------------

    if User.objects.filter(
        email__iexact=email
    ).exists():

        return Response(
            {
                'error':
                    'An account with this email already exists.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------------------------------
    # Split full name
    # --------------------------------------------------------

    name_parts = full_name.split(' ')

    first_name = (
        name_parts[0]
        if len(name_parts) > 0
        and name_parts[0]
        else 'Patient'
    )

    last_name = (
        ' '.join(name_parts[1:])
        if len(name_parts) > 1
        else ''
    )

    # --------------------------------------------------------
    # Generate unique username
    # --------------------------------------------------------

    username = email.split('@')[0]

    base_user = username
    counter = 1

    while User.objects.filter(
        username=username
    ).exists():

        username = f"{base_user}_{counter}"

        counter += 1

    # --------------------------------------------------------
    # Create Django User
    #
    # IMPORTANT:
    # Patient registration ALWAYS creates Patient role.
    # Users cannot select Doctor/Admin/etc. here.
    # --------------------------------------------------------

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        role=RoleChoices.PATIENT,
        phone=phone
    )

    # --------------------------------------------------------
    # Create Patient profile
    # --------------------------------------------------------

    from clinical.models import Patient
    import random

    Patient.objects.create(
        patient_id=(
            f"PAT-2026-{random.randint(1000, 9999)}"
        ),
        user=user,
        gender=request.data.get(
            'gender',
            'Male'
        ),
        blood_group='O+',
        emergency_contact_name='Self',
        emergency_contact_phone=(
            phone
            or '+1 555-0199'
        )
    )

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    refresh = RefreshToken.for_user(user)

    serializer = UserSerializer(user)

    # --------------------------------------------------------
    # Audit log
    # --------------------------------------------------------

    AuditLog.objects.create(
        user=user,
        action='REGISTER_PATIENT',
        module='AUTH',
        details=(
            f"New Patient account registered "
            f"for {user.email}"
        )
    )

    # --------------------------------------------------------
    # Return response
    # --------------------------------------------------------

    return Response(
        {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': serializer.data
        },
        status=status.HTTP_201_CREATED
    )


# ============================================================
# FORGOT PASSWORD
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):

    email = request.data.get('email')

    if not email:

        return Response(
            {
                'error':
                    'Please enter your registered email address.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Security practice:
    # Do not reveal whether the email exists.

    return Response(
        {
            'message':
                'Check your email for password reset instructions.'
        }
    )


# ============================================================
# CURRENT USER PROFILE
# ============================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):

    serializer = UserSerializer(
        request.user
    )

    return Response(
        serializer.data
    )


# ============================================================
# DEPARTMENT VIEWSET
# ============================================================

class DepartmentViewSet(viewsets.ModelViewSet):

    queryset = Department.objects.all()

    serializer_class = DepartmentSerializer

    permission_classes = [AllowAny]


# ============================================================
# USER VIEWSET
# ============================================================

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()

    serializer_class = UserSerializer

    permission_classes = [IsAuthenticated]


# ============================================================
# AI CLINICAL SUGGESTION
# ============================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_clinical_suggestion(request):

    symptoms = request.data.get(
        'symptoms',
        ''
    )

    history = request.data.get(
        'history',
        ''
    )

    lab_data = request.data.get(
        'lab_data',
        {}
    )

    medicines = request.data.get(
        'medicines',
        []
    )

    allergies = request.data.get(
        'allergies',
        ''
    )

    res = AIService.generate_clinical_decision_support(
        symptoms,
        history,
        lab_data,
        medicines,
        allergies
    )

    return Response(res)


# ============================================================
# AI CHATBOT
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chatbot(request):
    query = request.data.get('query', '') or request.data.get('message', '')
    user = request.user if request.user.is_authenticated else None
    
    if user and query:
        from ai_assistant.services import process_ai_chat
        res = process_ai_chat(user, query)
        return Response({
            "response": res["message"],
            "action_suggested": None,
            "success": True,
            "role": res["role"],
            "sources": res["sources"]
        })
    
    res = AIService.process_rag_chatbot(user, query)
    return Response(res)


# ============================================================
# AI VOICE ASSISTANT
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_voice_assistant(request):

    voice_text = request.data.get(
        'transcript',
        ''
    )

    user = (
        request.user
        if request.user.is_authenticated
        else None
    )

    res = AIService.process_voice_intent(
        user,
        voice_text
    )

    return Response(res)


# ============================================================
# PDF GENERATION
# ============================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_pdf_document(request):

    doc_type = (
        request.data
        .get('type', 'prescription')
        .lower()
        .replace('-', '_')
    )

    payload = request.data.get(
        'payload',
        {}
    )

    filename = f"{doc_type}_document.pdf"

    # --------------------------------------------------------
    # Prescription
    # --------------------------------------------------------

    if doc_type == 'prescription':

        pdf_bytes = (
            PDFGenerator
            .generate_prescription_pdf(payload)
        )

    # --------------------------------------------------------
    # Invoice
    # --------------------------------------------------------

    elif doc_type == 'invoice':

        pdf_bytes = (
            PDFGenerator
            .generate_invoice_pdf(payload)
        )

    # --------------------------------------------------------
    # Lab Report
    # --------------------------------------------------------

    elif doc_type in [
        'lab_report',
        'lab_reports',
        'lab'
    ]:

        pdf_bytes = (
            PDFGenerator
            .generate_lab_report_pdf(payload)
        )

        filename = 'lab_report.pdf'

    # --------------------------------------------------------
    # Radiology Report
    # --------------------------------------------------------

    elif doc_type in [
        'radiology_report',
        'radiology_reports',
        'radiology'
    ]:

        pdf_bytes = (
            PDFGenerator
            .generate_radiology_report_pdf(payload)
        )

        filename = 'radiology_report.pdf'

    # --------------------------------------------------------
    # EHR Summary
    # --------------------------------------------------------

    elif doc_type in [
        'ehr_summary',
        'ehr'
    ]:

        pdf_bytes = (
            PDFGenerator
            .generate_ehr_summary_pdf(payload)
        )

        filename = 'ehr_summary.pdf'

    # --------------------------------------------------------
    # Discharge Summary
    # --------------------------------------------------------

    elif doc_type in [
        'discharge_summary',
        'discharge',
        'ipd_discharge'
    ]:

        pdf_bytes = (
            PDFGenerator
            .generate_ipd_discharge_summary_pdf(payload)
        )

        filename = 'discharge_summary.pdf'

    # --------------------------------------------------------
    # Generic fallback
    # --------------------------------------------------------

    else:

        pdf_bytes = (
            PDFGenerator
            .generate_prescription_pdf(payload)
        )

        filename = f"{doc_type}.pdf"

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    response = HttpResponse(
        pdf_bytes,
        content_type='application/pdf'
    )

    response[
        'Content-Disposition'
    ] = f'attachment; filename="{filename}"'

    return response