from rest_framework import serializers
from django.core.exceptions import ValidationError

from api.models import ExpenseVersion, PaymentVersion


class BaseVersionSerializer(serializers.ModelSerializer):
    """Base serializer for version models with common validation."""
    
    def validate_version_number(self, value):
        """Validate version number is positive."""
        if value <= 0:
            raise ValidationError("Version number must be positive.")
        return value
    
    def validate_discussion_completed_at(self, value):
        """Validate discussion completion timestamp."""
        if value is None:
            raise ValidationError("Discussion completion time is required.")
        return value


class ExpenseVersionSerializer(BaseVersionSerializer):
    """Serializer for ExpenseVersion model."""
    
    class Meta:
        model = ExpenseVersion
        fields = [
            'id', 'client', 'version_number', 'discussion_completed_at', 
            'expenses_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_expenses_data(self, value):
        """Validate expenses data is a non-empty list."""
        if not isinstance(value, list):
            raise ValidationError("Expenses data must be a list.")
        
        if not value:
            raise ValidationError("Expenses data cannot be empty.")
        
        # Validate each expense item structure
        required_fields = ['id', 'date', 'description', 'amount', 'status']
        for i, expense in enumerate(value):
            if not isinstance(expense, dict):
                raise ValidationError(f"Expense item at index {i} must be a dictionary.")
            
            for field in required_fields:
                if field not in expense:
                    raise ValidationError(f"Expense item at index {i} missing required field: {field}")
            
            # Validate amount is positive
            try:
                amount = float(expense['amount'])
                if amount < 0:
                    raise ValidationError(f"Expense amount at index {i} cannot be negative.")
            except (ValueError, TypeError):
                raise ValidationError(f"Expense amount at index {i} must be a valid number.")
        
        return value


class PaymentVersionSerializer(BaseVersionSerializer):
    """Serializer for PaymentVersion model."""
    
    class Meta:
        model = PaymentVersion
        fields = [
            'id', 'client', 'version_number', 'discussion_completed_at', 
            'payments_data', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_payments_data(self, value):
        """Validate payments data is a non-empty list."""
        if not isinstance(value, list):
            raise ValidationError("Payments data must be a list.")
        
        if not value:
            raise ValidationError("Payments data cannot be empty.")
        
        # Validate each payment item structure
        required_fields = ['id', 'date', 'amount']
        for i, payment in enumerate(value):
            if not isinstance(payment, dict):
                raise ValidationError(f"Payment item at index {i} must be a dictionary.")
            
            for field in required_fields:
                if field not in payment:
                    raise ValidationError(f"Payment item at index {i} missing required field: {field}")
            
            # Validate amount is positive
            try:
                amount = float(payment['amount'])
                if amount < 0:
                    raise ValidationError(f"Payment amount at index {i} cannot be negative.")
            except (ValueError, TypeError):
                raise ValidationError(f"Payment amount at index {i} must be a valid number.")
        
        return value


class ExpenseVersionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating expense versions (client field writeable)."""
    
    client_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ExpenseVersion
        fields = [
            'client_id', 'version_number', 'discussion_completed_at', 'expenses_data'
        ]
    
    def validate_client_id(self, value):
        """Validate client exists."""
        from api.models import Client
        if not Client.objects.filter(id=value).exists():
            raise ValidationError("Client with this ID does not exist.")
        return value


class PaymentVersionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payment versions (client field writeable)."""
    
    client_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = PaymentVersion
        fields = [
            'client_id', 'version_number', 'discussion_completed_at', 'payments_data'
        ]
    
    def validate_client_id(self, value):
        """Validate client exists."""
        from api.models import Client
        if not Client.objects.filter(id=value).exists():
            raise ValidationError("Client with this ID does not exist.")
        return value
