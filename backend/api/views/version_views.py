from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from api.models import Client, ExpenseVersion, PaymentVersion
from api.serializers.version_serializer import ExpenseVersionSerializer, PaymentVersionSerializer
from django.utils import timezone


class ExpenseVersionViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseVersionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Filter by client_id if provided in query params
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return ExpenseVersion.objects.filter(client_id=client_id)
        return ExpenseVersion.objects.all()

    @action(detail=False, methods=['post'], url_path='create-version')
    def create_version(self, request):
        try:
            client_id = request.data.get('client_id') or request.query_params.get('client_id')
            if not client_id:
                return Response({'error': 'client_id is required'}, status=400)
                
            client = Client.objects.get(id=client_id)
            
            # Get current expenses data
            from api.models import Expense
            current_expenses = Expense.objects.filter(client=client)
            
            # Convert expenses to JSON-serializable format
            expenses_data = []
            for expense in current_expenses:
                expense_data = {
                    'id': expense.id,
                    'date': str(expense.date),
                    'description': expense.description,
                    'amount': str(expense.amount),
                    'status': expense.status,
                    'bill_url': expense.bill.url if expense.bill else None,
                    'created_at': expense.created_at.isoformat() if expense.created_at else None,
                }
                expenses_data.append(expense_data)
            
            # Increment version count
            new_version_number = client.expenses_version_count + 1
            
            # Create new version
            version = ExpenseVersion.objects.create(
                client=client,
                version_number=new_version_number,
                discussion_completed_at=timezone.now(),
                expenses_data=expenses_data
            )
            
            # Update client version count
            client.expenses_version_count = new_version_number
            client.expenses_discussion_completed = True
            client.expenses_discussion_completed_at = timezone.now()
            client.save()
            
            serializer = ExpenseVersionSerializer(version)
            return Response(serializer.data, status=201)
            
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class PaymentVersionViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentVersionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # Filter by client_id if provided in query params
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return PaymentVersion.objects.filter(client_id=client_id)
        return PaymentVersion.objects.all()

    @action(detail=False, methods=['post'], url_path='create-version')
    def create_version(self, request):
        try:
            client_id = request.data.get('client_id') or request.query_params.get('client_id')
            if not client_id:
                return Response({'error': 'client_id is required'}, status=400)
                
            client = Client.objects.get(id=client_id)
            
            # Get current payments data (CashReceipts)
            from api.models import CashReceipt
            current_payments = CashReceipt.objects.filter(client=client)
            
            # Convert payments to JSON-serializable format
            payments_data = []
            for payment in current_payments:
                payment_data = {
                    'id': payment.id,
                    'date': str(payment.date),
                    'amount': str(payment.amount),
                    'created_at': payment.created_at.isoformat() if payment.created_at else None,
                }
                payments_data.append(payment_data)
            
            # Increment version count
            new_version_number = client.payments_version_count + 1
            
            # Create new version
            version = PaymentVersion.objects.create(
                client=client,
                version_number=new_version_number,
                discussion_completed_at=timezone.now(),
                payments_data=payments_data
            )
            
            # Update client version count
            client.payments_version_count = new_version_number
            client.payments_discussion_completed = True
            client.payments_discussion_completed_at = timezone.now()
            client.save()
            
            serializer = PaymentVersionSerializer(version)
            return Response(serializer.data, status=201)
            
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)


class ClientExpenseVersionViewSet(viewsets.ReadOnlyModelViewSet):
    """Client-accessible expense versions (read-only)"""
    serializer_class = ExpenseVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return versions for the authenticated client
        user = self.request.user
        if hasattr(user, 'client'):
            return ExpenseVersion.objects.filter(client=user.client)
        return ExpenseVersion.objects.none()


class ClientPaymentVersionViewSet(viewsets.ReadOnlyModelViewSet):
    """Client-accessible payment versions (read-only)"""
    serializer_class = PaymentVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return versions for the authenticated client
        user = self.request.user
        if hasattr(user, 'client'):
            return PaymentVersion.objects.filter(client=user.client)
        return PaymentVersion.objects.none()
