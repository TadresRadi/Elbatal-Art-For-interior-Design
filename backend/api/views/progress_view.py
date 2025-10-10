from rest_framework import viewsets
from api.models import Progress
from api.serializers import ProgressSerializer

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer