from rest_framework import serializers
from api.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.user.username', read_only=True)
    client_budget = serializers.CharField(source='client.budget', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'