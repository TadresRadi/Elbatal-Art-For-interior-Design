from rest_framework import serializers
from api.models import Expense


class ExpenseCreateSerializer(serializers.ModelSerializer):
    bill = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Expense
        fields = ['client', 'date', 'description', 'amount', 'status', 'bill']

    def validate(self, data):
        amount = data['amount']

        if amount <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")

        return data