from rest_framework import serializers
from api.models import ProjectProgress


class ProjectProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgress
        fields = '__all__'