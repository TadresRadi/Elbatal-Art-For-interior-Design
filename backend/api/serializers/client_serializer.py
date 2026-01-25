from rest_framework import serializers
from django.db.models import Sum
from django.core.exceptions import ValidationError

from api.models import Client, ProjectProgress
from django.contrib.auth.models import User


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for Client model with comprehensive field validation."""
    
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    progress = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    paid = serializers.SerializerMethodField()
    pending = serializers.SerializerMethodField()
    upcoming = serializers.SerializerMethodField()
    expenses_count = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = [
            'id', 'name', 'username', 'email', 'progress', 'total', 'paid', 
            'pending', 'upcoming', 'expenses_count', 'status', 'phone', 'address', 
            'budget', 'created_at', 'discussion_completed', 'discussion_completed_at',
            'expenses_discussion_completed', 'expenses_discussion_completed_at',
            'payments_discussion_completed', 'payments_discussion_completed_at',
            'expenses_version_count', 'payments_version_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'expenses_version_count', 'payments_version_count',
            'expenses_discussion_completed_at', 'payments_discussion_completed_at'
        ]

    def validate_budget(self, value):
        """Validate budget field."""
        if value is not None and value < 0:
            raise ValidationError("Budget cannot be negative.")
        return value

    def validate_phone(self, value):
        """Validate phone field format."""
        if value and len(value) > 20:
            raise ValidationError("Phone number cannot exceed 20 characters.")
        return value

    def validate_address(self, value):
        """Validate address field length."""
        if value and len(value) > 255:
            raise ValidationError("Address cannot exceed 255 characters.")
        return value

    def get_progress(self, obj):
        """Get project progress percentage."""
        try:
            if hasattr(obj, 'project') and hasattr(obj.project, 'progress'):
                return obj.project.progress.percentage
        except AttributeError:
            pass
        return 0

    def _get_expenses_aggregate(self, obj, status_filter=None):
        """Helper method to get expenses aggregate."""
        queryset = obj.expenses
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        result = queryset.aggregate(total=Sum('amount'))['total']
        return float(result) if result is not None else 0.0

    def get_total(self, obj):
        """Get total expenses amount."""
        return self._get_expenses_aggregate(obj)

    def get_paid(self, obj):
        """Get paid expenses amount."""
        return self._get_expenses_aggregate(obj, status_filter='paid')

    def get_pending(self, obj):
        """Get pending expenses amount."""
        return self._get_expenses_aggregate(obj, status_filter='pending')

    def get_upcoming(self, obj):
        """Get upcoming expenses amount."""
        return self._get_expenses_aggregate(obj, status_filter='upcoming')

    def get_expenses_count(self, obj):
        """Get total number of expenses."""
        return obj.expenses.count()


class ClientCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new clients with user data."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, min_length=3)
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=30)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=30)

    class Meta:
        model = Client
        fields = [
            'username', 'email', 'password', 'password_confirm', 'first_name', 
            'last_name', 'phone', 'address', 'budget'
        ]

    def validate_username(self, value):
        """Validate username uniqueness."""
        if User.objects.filter(username=value).exists():
            raise ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        """Validate email uniqueness."""
        if User.objects.filter(email=value).exists():
            raise ValidationError("A user with that email already exists.")
        return value

    def validate(self, attrs):
        """Validate password confirmation."""
        password = attrs.get('password')
        password_confirm = attrs.pop('password_confirm')
        
        if password != password_confirm:
            raise ValidationError("Passwords don't match.")
        
        return attrs

    def create(self, validated_data):
        """Create user and client instances."""
        # Extract user data
        user_data = {
            'username': validated_data['username'],
            'email': validated_data['email'],
            'password': validated_data['password'],
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', ''),
        }
        
        # Create user
        user = User.objects.create_user(**user_data)
        
        # Extract client data
        client_data = {
            'user': user,
            'phone': validated_data.get('phone', ''),
            'address': validated_data.get('address', ''),
            'budget': validated_data.get('budget', 0),
        }
        
        # Create client
        client = Client.objects.create(**client_data)
        
        return client


class ClientUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating client information."""
    
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False, min_length=3)

    class Meta:
        model = Client
        fields = ['phone', 'address', 'budget', 'email', 'username']

    def validate_username(self, value):
        """Validate username uniqueness excluding current user."""
        user = self.instance.user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        """Validate email uniqueness excluding current user."""
        user = self.instance.user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise ValidationError("A user with that email already exists.")
        return value

    def update(self, instance, validated_data):
        """Update client and associated user data."""
        # Extract user-related fields
        user_fields = ['username', 'email']
        user_data = {k: v for k, v in validated_data.items() if k in user_fields}
        client_data = {k: v for k, v in validated_data.items() if k not in user_fields}
        
        # Update user if needed
        if user_data:
            user = instance.user
            for field, value in user_data.items():
                setattr(user, field, value)
            user.save()
        
        # Update client
        for field, value in client_data.items():
            setattr(instance, field, value)
        instance.save()
        
        return instance