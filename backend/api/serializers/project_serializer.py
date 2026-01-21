from rest_framework import serializers
from api.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    client_username = serializers.CharField(source='client.user.username', read_only=True)
    client_budget = serializers.CharField(source='client.budget', read_only=True)
    client_address = serializers.CharField(source='client.address', read_only=True)  # جديد
    client_phone = serializers.CharField(source='client.phone', read_only=True)      # جديد

    class Meta:
        model = Project
        fields = '__all__'