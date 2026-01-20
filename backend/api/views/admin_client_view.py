from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.permissions import IsAdmin

from api.models import Client
from api.serializers import ClientCreateSerializer
from api.serializers.client_serializer import ClientSerializer
from api.models import client
from api.models import project


class AdminClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        client = serializer.save()

        project = getattr(client, 'project', None)      
        project_data = None
        if project:
            project_data = {
                'title': project.title,
                'total_budget': str(project.total_budget)
            }
        return Response({
            'id': client.id,
            'username': client.user.username,
            'phone': client.phone,
            'address': client.address,
            'budget': str(client.budget),
            'project': project_data
        }, status=201)
    @action(detail=True, methods=['post'], url_path='complete')
    def mark_complete(self, request, pk=None):
        client = self.get_object()
        project = getattr(client, 'project', None)

        if project:
            project.status = 'completed'
            project.progress.percentage = 100
            project.progress.save()
            project.save()
            return Response({'status':'success'})

        return Response({'status':'no-project'}, status=status.HTTP_400_BAD_REQUEST)