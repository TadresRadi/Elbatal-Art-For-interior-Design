from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated
from api.models import Message, Client
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from api.serializers.message_serializer import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        # لو المستخدم عميل فرجّع رسائله
        if hasattr(user, 'client'):
            return Message.objects.filter(client=user.client).order_by('timestamp')
        # ادمن: ممكن يحدد العميل عبر query param
        client = self.request.query_params.get('client_id')
        if client:
            return Message.objects.filter(client=client).order_by('timestamp')
        return Message.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        # حدّد العميل والـ sender
        if hasattr(user, 'client'):
            client = user.client
            sender = 'client'
        else:
            # admin: يدعم client or client_id
            client = self.request.data.get('client') or self.request.data.get('client_id')
            if not client:
                raise serializers.ValidationError({"client": "This field is required for admin users."})
            try:
                client = Client.objects.get(id=client)
            except Client.DoesNotExist:
                raise serializers.ValidationError({"client": "Invalid client ID."})
            sender = 'admin'

        # نمرر serializer.save مع الملفات: DRF يتعامل مع request.FILES تلقائياً لأن serializer استقبل data
        serializer.save(sender=sender, client=client)