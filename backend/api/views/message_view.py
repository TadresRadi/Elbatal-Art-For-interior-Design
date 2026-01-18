from rest_framework import viewsets
from api.models import Message
from api.serializers import MessageSerializer
from api.models.client import Client

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            client = user.client
            return Message.objects.filter(client=client)
        except Client.DoesNotExist:
            return Message.objects.none()