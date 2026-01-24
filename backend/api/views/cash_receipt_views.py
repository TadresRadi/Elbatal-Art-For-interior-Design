from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..models.cash_receipt import CashReceipt
from ..models.client import Client
from django.core.exceptions import ValidationError


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cash_receipt(request):
    """
    Create a new cash receipt for a client
    """
    try:
        client_id = request.data.get('client_id')
        date = request.data.get('date')
        amount = request.data.get('amount')
        
        if not all([client_id, date, amount]):
            return Response(
                {'error': 'Missing required fields: client_id, date, amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate client exists
        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response(
                {'error': 'Client not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create cash receipt
        cash_receipt = CashReceipt.objects.create(
            client=client,
            date=date,
            amount=amount
        )
        
        # Return the created cash receipt data
        return Response({
            'id': cash_receipt.id,
            'client_id': cash_receipt.client.id,
            'date': cash_receipt.date,
            'amount': cash_receipt.amount,
            'created_at': cash_receipt.created_at
        }, status=status.HTTP_201_CREATED)
        
    except ValidationError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Internal server error: ' + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_admin_client_payments(request):
    """
    Get all cash receipts for a specific client (admin access) or all cash receipts if no client_id provided
    """
    try:
        client_id = request.query_params.get('client_id')
        
        if client_id:
            # Get receipts for specific client
            try:
                client = Client.objects.get(id=client_id)
            except Client.DoesNotExist:
                return Response(
                    {'error': 'Client not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            cash_receipts = CashReceipt.objects.filter(client=client).order_by('-created_at')
        else:
            # Get all cash receipts from all clients
            cash_receipts = CashReceipt.objects.all().order_by('-created_at')
        
        receipts_data = []
        for receipt in cash_receipts:
            receipts_data.append({
                'id': receipt.id,
                'client_id': receipt.client.id,
                'date': receipt.date,
                'amount': receipt.amount,
                'created_at': receipt.created_at
            })
        
        return Response(receipts_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': 'Internal server error: ' + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client_cash_receipts(request):
    """
    Get all cash receipts for the authenticated client
    """
    try:
        # Get client from authenticated user
        user = request.user
        
        # Try to get client through the reverse relationship
        try:
            client = user.client
        except Client.DoesNotExist:
            return Response(
                {'error': 'Client not found for this user'},
                status=status.HTTP_404_NOT_FOUND
            )
        except AttributeError:
            return Response(
                {'error': 'User is not associated with a client'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get cash receipts for the client
        cash_receipts = CashReceipt.objects.filter(client=client).order_by('-created_at')
        
        # Format the response
        receipts_data = []
        for receipt in cash_receipts:
            receipts_data.append({
                'id': receipt.id,
                'client_id': receipt.client.id,
                'date': receipt.date,
                'amount': receipt.amount,
                'created_at': receipt.created_at
            })
        
        return Response(receipts_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': 'Internal server error: ' + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
