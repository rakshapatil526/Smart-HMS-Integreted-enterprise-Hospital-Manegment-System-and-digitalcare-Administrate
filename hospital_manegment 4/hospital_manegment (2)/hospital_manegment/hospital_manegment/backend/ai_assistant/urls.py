from django.urls import path
from .views import AIChatView, AIChatHistoryView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai_chat'),
    path('history/', AIChatHistoryView.as_view(), name='ai_history'),
]
