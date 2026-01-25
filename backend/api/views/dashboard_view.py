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
            project_total_expenses = Expense.objects.filter(client=project.client).aggregate(total=Sum('amount'))['total'] or 0

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
                project_expenses = Expense.objects.filter(client=client).aggregate(total=Sum('amount'))['total'] or 0

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
        
        # Calculate client stats from expenses
        expenses = Expense.objects.filter(client=client)
        total_paid = expenses.filter(status='paid').aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or 0
        
        # Get expenses data
        expenses_data = []
        for expense in expenses.order_by('-date'):
            bill_url = request.build_absolute_uri(expense.bill.url) if expense.bill else None
            expenses_data.append({
                "id": expense.id,
                "description": expense.description,
                "amount": expense.amount,
                "date": expense.date,
                "status": expense.status,
                "bill_url": bill_url
            })
        
        # Get the client's project and progress
        project = getattr(client, 'project', None)
        project_progress = 0
        project_status = 'active'
        
        if project and hasattr(project, 'progress'):
            project_progress = project.progress.percentage
            project_status = project.status
        
        return Response({
            'project': {
                'title': project.title if project else f'Project for {client.user.username}',
                'status': project_status,
                'client_username': client.user.username,
                'client_phone': client.phone,
                'client_address': client.address,
                'client_budget': client.budget,
                'progress': project_progress,
                'start_date': project.start_date.strftime('%Y-%m-%d') if project and project.start_date else None,
                'expected_end_date': project.expected_end_date.strftime('%Y-%m-%d') if project and project.expected_end_date else None,
                'expenses_discussion_completed': client.expenses_discussion_completed,
                'payments_discussion_completed': client.payments_discussion_completed,
                'expenses_discussion_completed_at': client.expenses_discussion_completed_at,
                'payments_discussion_completed_at': client.payments_discussion_completed_at
            },
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