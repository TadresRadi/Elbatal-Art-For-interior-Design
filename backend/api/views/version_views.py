from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError

from api.models import Client, ExpenseVersion, PaymentVersion, Expense, CashReceipt
from api.serializers.version_serializer import ExpenseVersionSerializer, PaymentVersionSerializer


class BaseVersionViewSet(viewsets.ModelViewSet):
    """Base class for version viewsets with common functionality."""
    
    def get_queryset(self):
        """Filter queryset by client_id if provided."""
        client_id = self.request.query_params.get('client_id')
        if client_id:
            try:
                client_id = int(client_id)
                return self.version_model.objects.filter(client_id=client_id)
            except (ValueError, TypeError):
                return self.version_model.objects.none()
        return self.version_model.objects.all()
    
    def _validate_client_id(self, request):
        """Validate and retrieve client_id from request."""
        client_id = request.data.get('client_id') or request.query_params.get('client_id')
        if not client_id:
            raise ValidationError({'client_id': 'This field is required.'})
        
        try:
            client_id = int(client_id)
        except (ValueError, TypeError):
            raise ValidationError({'client_id': 'Must be a valid integer.'})
        
        return client_id
    
    def _get_client(self, client_id):
        """Retrieve client instance or raise ValidationError."""
        try:
            return Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            raise ValidationError({'client': 'Client not found.'})
    
    def _serialize_expense_data(self, expense):
        """Serialize expense data to JSON-serializable format."""
        return {
            'id': expense.id,
            'date': str(expense.date),
            'description': expense.description,
            'amount': str(expense.amount),
            'status': expense.status,
            'bill_url': expense.bill.url if expense.bill else None,
            'created_at': expense.created_at.isoformat() if expense.created_at else None,
            'updated_at': expense.updated_at.isoformat() if expense.updated_at else None,
        }
    
    def _serialize_payment_data(self, payment):
        """Serialize payment data to JSON-serializable format."""
        return {
            'id': payment.id,
            'date': str(payment.date),
            'amount': str(payment.amount),
            'created_at': payment.created_at.isoformat() if payment.created_at else None,
            'updated_at': payment.updated_at.isoformat() if payment.updated_at else None,
        }


class ExpenseVersionViewSet(BaseVersionViewSet):
    """ViewSet for managing expense versions."""
    serializer_class = ExpenseVersionSerializer
    permission_classes = [IsAdminUser]
    version_model = ExpenseVersion

    @action(detail=False, methods=['post'], url_path='create-version')
    @transaction.atomic
    def create_version(self, request):
        """Create a new expense version for the specified client."""
        try:
            client_id = self._validate_client_id(request)
            client = self._get_client(client_id)
            
            # Get current expenses data with related objects
            current_expenses = Expense.objects.filter(client=client).select_related('client')
            
            # Convert expenses to JSON-serializable format
            expenses_data = [self._serialize_expense_data(expense) for expense in current_expenses]
            
            # Calculate new version number
            new_version_number = client.expenses_version_count + 1
            
            # Create new version
            version = ExpenseVersion.objects.create(
                client=client,
                version_number=new_version_number,
                discussion_completed_at=timezone.now(),
                expenses_data=expenses_data
            )
            
            # Update client discussion status atomically
            client.expenses_version_count = new_version_number
            client.expenses_discussion_completed = True
            client.expenses_discussion_completed_at = timezone.now()
            client.save()
            
            serializer = self.get_serializer(version)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred while creating the expense version.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentVersionViewSet(BaseVersionViewSet):
    """ViewSet for managing payment versions."""
    serializer_class = PaymentVersionSerializer
    permission_classes = [IsAdminUser]
    version_model = PaymentVersion

    @action(detail=False, methods=['post'], url_path='create-version')
    @transaction.atomic
    def create_version(self, request):
        """Create a new payment version for the specified client."""
        try:
            client_id = self._validate_client_id(request)
            client = self._get_client(client_id)
            
            # Get current payments data with related objects
            current_payments = CashReceipt.objects.filter(client=client).select_related('client')
            
            # Convert payments to JSON-serializable format
            payments_data = [self._serialize_payment_data(payment) for payment in current_payments]
            
            # Calculate new version number
            new_version_number = client.payments_version_count + 1
            
            # Create new version
            version = PaymentVersion.objects.create(
                client=client,
                version_number=new_version_number,
                discussion_completed_at=timezone.now(),
                payments_data=payments_data
            )
            
            # Update client discussion status atomically
            client.payments_version_count = new_version_number
            client.payments_discussion_completed = True
            client.payments_discussion_completed_at = timezone.now()
            client.save()
            
            serializer = self.get_serializer(version)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred while creating the payment version.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class BaseClientVersionViewSet(viewsets.ReadOnlyModelViewSet):
    """Base class for client-accessible version viewsets."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return versions for the authenticated client."""
        user = self.request.user
        if hasattr(user, 'client') and user.client:
            return self.version_model.objects.filter(client=user.client)
        return self.version_model.objects.none()


class ClientExpenseVersionViewSet(BaseClientVersionViewSet):
    """Client-accessible expense versions (read-only)."""
    serializer_class = ExpenseVersionSerializer
    version_model = ExpenseVersion


class ClientPaymentVersionViewSet(BaseClientVersionViewSet):
    """Client-accessible payment versions (read-only)."""
    serializer_class = PaymentVersionSerializer
    version_model = PaymentVersion
