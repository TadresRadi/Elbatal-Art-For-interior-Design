from rest_framework import viewsets
from api.models import Project
from api.serializers import ProjectSerializer
from api.permissions import IsClient
from api.models.client import Client

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        user = self.request.user
        try:
            client = user.client
            return Project.objects.filter(client=client)
        except Client.DoesNotExist:
            return Project.objects.none()