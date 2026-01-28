from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Client, Project, ProjectProgress
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
        
        # Create project for client if it doesn't exist
        if client and not hasattr(client, 'project'):
            project = Project.objects.create(
                client=client,
                title=f"{client.user.get_full_name() or client.user.username}'s Project",
                description=f"Project for {client.user.username}",
                total_budget=client.budget or 0,
                start_date=None,
                expected_end_date=None
            )
            ProjectProgress.objects.create(project=project, percentage=0)
        
        serializer = self.get_serializer(client)
        return Response(serializer.data)