from rest_framework import permissions

class IsAuthorizedUserForAI(permissions.BasePermission):
    """
    Ensures that the user is authenticated and has a valid role assigned.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None))
