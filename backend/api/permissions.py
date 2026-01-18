from rest_framework.permissions import BasePermission
from api.models.client import Client

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
         return request.user and request.user.is_staff
class IsClient(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return Client.objects.filter(user=user).exists()