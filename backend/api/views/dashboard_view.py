from rest_framework.views import APIView
from rest_framework.response import Response
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