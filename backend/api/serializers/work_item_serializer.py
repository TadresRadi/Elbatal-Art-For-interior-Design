from rest_framework import serializers
from api.models import WorkItem


class WorkItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    before_image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    after_image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = WorkItem
        fields = [
            'id',
            'title_ar',
            'title_en',
            'category',
            'image',
            'before_image',
            'after_image',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
