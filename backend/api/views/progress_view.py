from rest_framework import viewsets
from api.models import ProjectProgress, Client
from api.serializers import ProjectProgressSerializer
from api.permissions import IsClient

class ProjectProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectProgressSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        try:
            client = Client.objects.get(user=self.request.user)
            return ProjectProgress.objects.filter(project__client=client)
        except Client.DoesNotExist:
            return ProjectProgress.objects.none()