from rest_framework import serializers
from .models import AIChatHistory

class AIChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True, allow_blank=False, max_length=2000)

class AIChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AIChatHistory
        fields = ['id', 'role', 'message', 'response', 'sources', 'created_at']
        read_only_fields = ['id', 'role', 'response', 'sources', 'created_at']
