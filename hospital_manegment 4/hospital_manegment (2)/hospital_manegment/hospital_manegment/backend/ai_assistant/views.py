from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .permissions import IsAuthorizedUserForAI
from .serializers import AIChatRequestSerializer, AIChatHistorySerializer
from .services import process_ai_chat
from .models import AIChatHistory

class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Case 1: User is not authenticated
        if not request.user or not request.user.is_authenticated:
            return Response({
                "success": False,
                "message": "Authentication required."
            }, status=status.HTTP_401_UNAUTHORIZED)

        serializer = AIChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data['message']

        # Case 2: Check if user with Patient role has linked Patient profile
        role = getattr(request.user, 'role', 'Patient') or 'Patient'
        if role.lower() == 'patient':
            from .context_builder import get_current_patient
            patient = get_current_patient(request.user)
            if not patient:
                return Response({
                    "success": False,
                    "message": "No patient profile is linked to this account."
                }, status=status.HTTP_200_OK)

        # Case 3: Authenticated user and Patient exists -> retrieve data
        try:
            result = process_ai_chat(request.user, message)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "message": "An error occurred while processing your AI request. Please try again.",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        histories = AIChatHistory.objects.filter(user=request.user).order_by('created_at')
        serializer = AIChatHistorySerializer(histories, many=True)
        return Response({"success": True, "history": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request):
        AIChatHistory.objects.filter(user=request.user).delete()
        return Response({"success": True, "message": "Chat history cleared successfully."}, status=status.HTTP_200_OK)
