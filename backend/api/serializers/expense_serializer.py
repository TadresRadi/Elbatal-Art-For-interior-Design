from rest_framework import serializers
from api.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%Y-%m-%d')
    bill = serializers.FileField(required=False, allow_null=True)
    bill_url = serializers.SerializerMethodField()

    class Meta:
        model = Expense
        fields = ['id', 'client', 'date', 'description', 'amount', 'status', 'bill', 'bill_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'bill_url']

    def get_bill_url(self, obj):
        request = self.context.get('request')
        if obj.bill:
            if request is not None:
                return request.build_absolute_uri(obj.bill.url)
            return obj.bill.url
        return None

    def validate_bill(self, value):
        if not value:
            return value
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('File too large. Max 10 MB.')

        allowed = ['jpg', 'jpeg', 'png', 'gif', 'pdf']
        ext = value.name.split('.')[-1].lower()
        if ext not in allowed:
            raise serializers.ValidationError('Unsupported file type.')

        return value