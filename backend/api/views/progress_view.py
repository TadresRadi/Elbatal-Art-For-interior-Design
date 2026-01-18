from rest_framework import viewsets
from api.models import ProjectProgress
from api.serializers import ProjectProgressSerializer
from api.permissions import IsClient

class ProjectProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectProgressSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        client = self.request.user.client
        return ProjectProgress.objects.filter(project__client=client)