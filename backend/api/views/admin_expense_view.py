from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from api.permissions import IsAdmin

from api.models import Expense
from api.serializers import ExpenseSerializer


class AdminExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    http_method_names = ['post', 'get', 'delete', 'patch', 'put']

    def get_queryset(self):
        client_id = self.request.query_params.get('client_id')
        if client_id:
            return Expense.objects.filter(client_id=client_id).order_by('-date')
        return Expense.objects.all().order_by('-date')