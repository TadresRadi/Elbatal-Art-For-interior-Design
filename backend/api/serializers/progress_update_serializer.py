from rest_framework import serializers
from api.models import ProjectProgress


class ProjectProgressUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProgress
        fields = ['percentage']

    def validate_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Percentage must be between 0 and 100."
            )
        return value