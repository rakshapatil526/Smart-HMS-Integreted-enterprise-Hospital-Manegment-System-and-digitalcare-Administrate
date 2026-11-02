import uuid
from django.db import models
from core.models import User

class AIChatHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_chat_histories')
    role = models.CharField(max_length=50)
    message = models.TextField()
    response = models.TextField()
    sources = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} ({self.role}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
