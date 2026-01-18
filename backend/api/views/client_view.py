from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Client
from api.serializers import ClientSerializer
from api.permissions import IsClient
from rest_framework.permissions import BasePermission


class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_staff
    
    
class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        client = self.get_queryset().first()
        serializer =  self.get_serializer(client)
        return Response(serializer.data)