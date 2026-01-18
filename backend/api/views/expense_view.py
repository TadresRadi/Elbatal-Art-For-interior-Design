from multiprocessing.connection import Client
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from api.models import Expense
from api.serializers import ExpenseSerializer
from api.permissions import IsClient

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        user = self.request.user
        try:
            client = user.client
            return Expense.objects.filter(project__client=client)
        except Client.DoesNotExist:
            return Expense.objects.none()