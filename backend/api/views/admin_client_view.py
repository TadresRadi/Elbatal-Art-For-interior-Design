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
                'total_budget': str(project.total_budget),
                'client_address': project.client.address,
                'client_phone': project.client.phone,
                'start_date': project.start_date,
                'expected_end_date': project.expected_end_date
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

    @action(detail=True, methods=['patch'], url_path='progress')
    def update_progress(self, request, pk=None):
        client = self.get_object()
        project = getattr(client, 'project', None)
        
        if not project:
            return Response({'status':'no-project'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            progress_value = int(request.data.get('progress', 0))
            if progress_value < 0 or progress_value > 100:
                return Response({'error':'Progress must be between 0 and 100'}, status=status.HTTP_400_BAD_REQUEST)
            
            project.progress.percentage = progress_value
            project.progress.save()
            
            # Update project status based on progress
            if progress_value == 100:
                project.status = 'completed'
            elif progress_value > 0:
                project.status = 'active'
            
            project.save()
            
            return Response({
                'status':'success',
                'progress': progress_value
            })
            
        except (ValueError, TypeError):
            return Response({'error':'Invalid progress value'}, status=status.HTTP_400_BAD_REQUEST)