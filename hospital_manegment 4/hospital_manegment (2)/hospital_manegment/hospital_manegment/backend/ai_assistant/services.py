import logging
from .context_builder import build_authorized_context
from .ai_engine import AIEngine
from .models import AIChatHistory

logger = logging.getLogger(__name__)

def process_ai_chat(user, message):
    role = getattr(user, 'role', 'Patient') or 'Patient'

    # Build authorized, intent-aware context
    context = build_authorized_context(user, role, question=message)

    # Generate response using database context & AI Engine
    response_text = AIEngine.generate_response(user, role, context, message)

    # Save to user-isolated chat history
    chat_record = AIChatHistory.objects.create(
        user=user,
        role=role,
        message=message,
        response=response_text,
        sources=[]
    )

    return {
        "success": True,
        "id": str(chat_record.id),
        "role": role,
        "message": response_text,
        "sources": [],
        "created_at": chat_record.created_at.isoformat()
    }
