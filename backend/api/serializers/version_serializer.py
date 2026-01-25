from rest_framework import serializers
from api.models import ExpenseVersion, PaymentVersion


class ExpenseVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseVersion
        fields = ['id', 'version_number', 'discussion_completed_at', 'expenses_data', 'created_at']


class PaymentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentVersion
        fields = ['id', 'version_number', 'discussion_completed_at', 'payments_data', 'created_at']
