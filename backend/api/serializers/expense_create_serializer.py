from rest_framework import serializers
from api.models import Expense, Project


class ExpenseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['project', 'title', 'amount']

    def validate(self, data):
        project = data['project']
        amount = data['amount']

        if amount <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")

        if project.remaining_budget < amount:
            raise serializers.ValidationError(
                "Expense exceeds remaining project budget."
            )

        return data