from rest_framework import serializers
from api.models.message import Message

class MessageSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, allow_null=True)
    file_url = serializers.SerializerMethodField()
    content = serializers.CharField(required=False, allow_blank=True)
    # ملف مرفق اختياري

    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'client', 'file', 'file_url', 'timestamp']
        read_only_fields = ['id', 'sender', 'timestamp', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
        
    def validate_file(self, value):
        if not value:
            return value
        # حد أقصى للحجم: مثال 10MB
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('File too large. Max 10 MB.')

        # تحقق من الامتدادات المقبولة
        allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf']
        ext = value.name.split('.')[-1].lower()
        if ext not in allowed:
            raise serializers.ValidationError('Unsupported file type.')

        return value