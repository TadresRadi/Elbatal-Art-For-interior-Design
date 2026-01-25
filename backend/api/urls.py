from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    ClientViewSet, MeView, ProjectViewSet, AdminProgressViewSet, AdminExpenseViewSet,AdminClientViewSet, AdminDashboardView, ClientDashboardView, ExpenseViewSet, ProjectProgressViewSet, MessageViewSet, cash_receipt_views, WorkItemViewSet, get_work_items
)
from api.views.version_views import ExpenseVersionViewSet, PaymentVersionViewSet, ClientExpenseVersionViewSet, ClientPaymentVersionViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views.auth_view import CustomAuthToken

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'progress', ProjectProgressViewSet, basename='progress')
router.register(r'messages', MessageViewSet, basename='message')
router.register('admin/clients', AdminClientViewSet, basename='admin-clients')
router.register('admin/expenses', AdminExpenseViewSet, basename='admin-expenses')
router.register('admin/progress', AdminProgressViewSet, basename='admin-progress')
router.register('admin/work-items', WorkItemViewSet, basename='admin-work-items')

# Version ViewSets with client_id parameter
router.register(r'admin/expense-versions', ExpenseVersionViewSet, basename='admin-expense-versions')
router.register(r'admin/payment-versions', PaymentVersionViewSet, basename='admin-payment-versions')

# Client-accessible version endpoints (read-only)
router.register(r'client/expense-versions', ClientExpenseVersionViewSet, basename='client-expense-versions')
router.register(r'client/payment-versions', ClientPaymentVersionViewSet, basename='client-payment-versions')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/admin/dashboard/', AdminDashboardView.as_view()),
    path('api/client/dashboard/', ClientDashboardView.as_view()),
    path('api/admin/cash-receipts/', cash_receipt_views.create_cash_receipt, name='create-cash-receipt'),
    path('api/admin/payments/', cash_receipt_views.get_admin_client_payments, name='get-admin-client-payments'),
    path('api/client/payments/', cash_receipt_views.get_client_cash_receipts, name='get-client-payments'),
    path('api/work-items/', get_work_items, name='get-work-items'),
    path('auth/me/', MeView.as_view()),
    path('login/', CustomAuthToken.as_view(), name='custom-login'),

]