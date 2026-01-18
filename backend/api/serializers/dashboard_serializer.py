from rest_framework import serializers


class AdminDashboardSerializer(serializers.Serializer):
    total_clients = serializers.IntegerField()
    active_clients = serializers.IntegerField()
    completed_clients = serializers.IntegerField()
    deleted_clients = serializers.IntegerField()

    total_budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2)
