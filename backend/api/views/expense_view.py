from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from api.models import Expense, Client
from api.serializers.expense_serializer import ExpenseSerializer
from api.permissions import IsClient

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        user = self.request.user
        
        # If admin, can filter by client_id or see all
        if user.is_superuser or user.is_staff:
            client_id = self.request.query_params.get('client_id')
            if client_id:
                return Expense.objects.filter(client_id=client_id).order_by('-date')
            return Expense.objects.all().order_by('-date')
        
        # If client, only see their own expenses
        try:
            client = user.client
            return Expense.objects.filter(client=client).order_by('-date')
        except Client.DoesNotExist:
            return Expense.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        
        # If admin, need to specify client
        if user.is_superuser or user.is_staff:
            client_id = self.request.data.get('client') or self.request.data.get('client_id')
            if not client_id:
                from rest_framework import serializers
                raise serializers.ValidationError("client_id is required for admin users")
            
            try:
                client = Client.objects.get(id=client_id)
                serializer.save(client=client)
            except Client.DoesNotExist:
                from rest_framework import serializers
                raise serializers.ValidationError("Invalid client_id")
        else:
            # If client, use their own client
            try:
                client = user.client
                serializer.save(client=client)
            except Client.DoesNotExist:
                from rest_framework import serializers
                raise serializers.ValidationError("Client not found")