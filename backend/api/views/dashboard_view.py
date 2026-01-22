from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdmin
from django.db.models import Sum

from api.models import Client, Project, Expense

class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # إجمالي المصاريف
        total_expenses = Expense.objects.aggregate(total=Sum("amount"))["total"] or 0

        # بيانات المشاريع
        projects_data = []
        for project in Project.objects.all():
            project_total_expenses = Expense.objects.filter(project=project).aggregate(total=Sum('amount'))['total'] or 0
            projects_data.append({
                "id": project.id,
                "title": project.title,
                "client_id": project.client.id,
                "client_name": project.client.user.username,
                "total_budget": project.total_budget,
                "total_expenses": project_total_expenses
            })

        # بيانات العملاء مع مشاريعهم
        clients_data = []
        for client in Client.objects.all():
            client_projects = Project.objects.filter(client=client)
            client_projects_data = []
            for project in client_projects:
                project_expenses = Expense.objects.filter(project=project).aggregate(total=Sum('amount'))['total'] or 0
                client_projects_data.append({
                    "id": project.id,
                    "title": project.title,
                    "total_budget": project.total_budget,
                    "total_expenses": project_expenses
                })
            clients_data.append({
                "id": client.id,
                "username": client.user.username,
                "projects": client_projects_data
            })

        return Response({
            "clients_count": Client.objects.count(),
            "projects_count": Project.objects.count(),
            "expenses_count": Expense.objects.count(),
            "total_expenses": total_expenses,
            "projects": projects_data,
            "clients": clients_data
        })

class ClientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get the client associated with this user
        try:
            client = Client.objects.get(user=user)
        except Client.DoesNotExist:
            return Response({'error': 'Client not found'}, status=404)
        
        # Get client's project (OneToOne relationship)
        project_data = None
        try:
            project = client.project  # Using related_name from Project model
            project_data = {
                "id": project.id,
                "title": project.title,
                "status": project.status or "active",
                "total_budget": project.total_budget,
                "start_date": project.start_date,
                "expected_end_date": project.expected_end_date,
                "description": project.description,
                "total_spent": project.total_spent,
                "remaining_budget": project.remaining_budget,
                "client_username": client.user.username,
                "client_phone": client.phone,
                "client_address": client.address,
                "client_budget": client.budget,
                "created_at": project.created_at
            }
        except Project.DoesNotExist:
            project_data = None
        
        # Get expenses for this client's project
        expenses_data = []
        if project_data:
            expenses = project.expenses.all()  # Using related_name from Expense model
            for expense in expenses:
                expenses_data.append({
                    "id": expense.id,
                    "description": expense.description,
                    "amount": expense.amount,
                    "date": expense.date,
                })
        
        return Response({
            'project': project_data,
            'expenses': expenses_data,
            'client_info': {
                'username': client.user.username,
                'phone': client.phone,
                'address': client.address,
                'budget': client.budget,
                'is_active': client.is_active,
                'created_at': client.created_at
            }
        })