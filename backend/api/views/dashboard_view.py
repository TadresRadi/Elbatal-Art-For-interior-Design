from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Prefetch
from django.core.exceptions import ObjectDoesNotExist

from api.models import Client, Project, Expense
from api.permissions import IsAdmin


class BaseDashboardView(APIView):
    """Base class for dashboard views with common functionality."""
    
    def _get_client_expenses_summary(self, client):
        """Get expenses summary for a client."""
        expenses = Expense.objects.filter(client=client)
        return {
            'total': float(expenses.aggregate(total=Sum('amount'))['total'] or 0),
            'paid': float(expenses.filter(status='paid').aggregate(total=Sum('amount'))['total'] or 0),
            'pending': float(expenses.filter(status='pending').aggregate(total=Sum('amount'))['total'] or 0),
            'upcoming': float(expenses.filter(status='upcoming').aggregate(total=Sum('amount'))['total'] or 0),
            'count': expenses.count()
        }
    
    def _format_date(self, date):
        """Format date to string or return None."""
        return date.strftime('%Y-%m-%d') if date else None
    
    def _build_project_data(self, project, include_expenses=False):
        """Build project data dictionary."""
        project_data = {
            'id': project.id,
            'title': project.title,
            'client_id': project.client.id,
            'client_name': project.client.user.username,
            'total_budget': float(project.total_budget),
            'status': project.status,
            'start_date': self._format_date(project.start_date),
            'expected_end_date': self._format_date(project.expected_end_date),
        }
        
        if include_expenses:
            expenses_summary = self._get_client_expenses_summary(project.client)
            project_data.update({
                'total_expenses': expenses_summary['total'],
                'expenses_count': expenses_summary['count']
            })
        
        return project_data


class AdminDashboardView(BaseDashboardView):
    """Admin dashboard view with comprehensive statistics."""
    permission_classes = [IsAdmin]

    def get(self, request):
        """Get admin dashboard statistics."""
        try:
            # Get overall statistics
            total_expenses = Expense.objects.aggregate(total=Sum("amount"))["total"] or 0
            
            # Get projects with optimized queries
            projects = Project.objects.select_related('client').prefetch_related(
                Prefetch('client__expenses', queryset=Expense.objects.all())
            ).all()
            
            projects_data = []
            for project in projects:
                project_data = self._build_project_data(project, include_expenses=True)
                projects_data.append(project_data)
            
            # Get clients with their projects
            clients = Client.objects.select_related('user').prefetch_related(
                Prefetch('project_set', queryset=Project.objects.select_related('client'))
            ).all()
            
            clients_data = []
            for client in clients:
                client_projects = client.project_set.all()
                client_projects_data = []
                
                for project in client_projects:
                    expenses_summary = self._get_client_expenses_summary(client)
                    project_data = {
                        'id': project.id,
                        'title': project.title,
                        'total_budget': float(project.total_budget),
                        'total_expenses': expenses_summary['total'],
                        'status': project.status,
                        'start_date': self._format_date(project.start_date),
                        'expected_end_date': self._format_date(project.expected_end_date),
                    }
                    client_projects_data.append(project_data)
                
                clients_data.append({
                    'id': client.id,
                    'username': client.user.username,
                    'email': client.user.email,
                    'phone': client.phone,
                    'address': client.address,
                    'status': client.status,
                    'projects': client_projects_data,
                    'expenses_discussion_completed': client.expenses_discussion_completed,
                    'payments_discussion_completed': client.payments_discussion_completed,
                    'expenses_version_count': client.expenses_version_count,
                    'payments_version_count': client.payments_version_count,
                })

            return Response({
                'clients_count': Client.objects.count(),
                'projects_count': Project.objects.count(),
                'expenses_count': Expense.objects.count(),
                'total_expenses': float(total_expenses),
                'projects': projects_data,
                'clients': clients_data
            })
            
        except Exception as e:
            return Response(
                {'error': 'Failed to load admin dashboard data.'},
                status=500
            )


class ClientDashboardView(BaseDashboardView):
    """Client dashboard view with personalized data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get client dashboard data."""
        try:
            user = request.user
            
            # Get the client associated with this user
            try:
                client = Client.objects.select_related('user').get(user=user)
            except ObjectDoesNotExist:
                return Response(
                    {'error': 'Client not found'}, 
                    status=404
                )
            
            # Get expenses with optimized query
            expenses = Expense.objects.filter(client=client).order_by('-date')
            expenses_summary = self._get_client_expenses_summary(client)
            
            # Build expenses data
            expenses_data = []
            for expense in expenses:
                bill_url = request.build_absolute_uri(expense.bill.url) if expense.bill else None
                expenses_data.append({
                    "id": expense.id,
                    "description": expense.description,
                    "amount": float(expense.amount),
                    "date": str(expense.date),
                    "status": expense.status,
                    "bill_url": bill_url,
                    "created_at": expense.created_at.isoformat(),
                    "updated_at": expense.updated_at.isoformat(),
                })
            
            # Get project data with related objects
            project = getattr(client, 'project', None)
            project_progress = 0
            project_status = 'active'
            
            if project:
                project_progress = getattr(project.progress, 'percentage', 0) if hasattr(project, 'progress') else 0
                project_status = project.status
            
            # Build response
            response_data = {
                'project': {
                    'title': project.title if project else f'Project for {client.user.username}',
                    'status': project_status,
                    'client_username': client.user.username,
                    'client_phone': client.phone,
                    'client_address': client.address,
                    'client_budget': float(client.budget) if client.budget else 0,
                    'progress': project_progress,
                    'start_date': self._format_date(project.start_date) if project else None,
                    'expected_end_date': self._format_date(project.expected_end_date) if project else None,
                    'expenses_discussion_completed': client.expenses_discussion_completed,
                    'payments_discussion_completed': client.payments_discussion_completed,
                    'expenses_discussion_completed_at': client.expenses_discussion_completed_at.isoformat() if client.expenses_discussion_completed_at else None,
                    'payments_discussion_completed_at': client.payments_discussion_completed_at.isoformat() if client.payments_discussion_completed_at else None,
                },
                'expenses': expenses_data,
                'client_info': {
                    'username': client.user.username,
                    'email': client.user.email,
                    'phone': client.phone,
                    'address': client.address,
                    'budget': float(client.budget) if client.budget else 0,
                    'is_active': client.is_active,
                    'status': client.status,
                    'created_at': client.created_at.isoformat(),
                },
                'expenses_summary': expenses_summary,
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response(
                {'error': 'Failed to load client dashboard data.'},
                status=500
            )