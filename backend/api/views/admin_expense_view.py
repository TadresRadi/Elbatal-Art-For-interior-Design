from rest_framework import viewsets, status
from rest_framework.response import Response
from api.permissions import IsAdmin

from api.models import Expense
from api.serializers import ExpenseCreateSerializer


class AdminExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseCreateSerializer
    permission_classes = [IsAdmin]

    http_method_names = ['post', 'get', 'delete']