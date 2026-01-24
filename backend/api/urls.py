from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    ClientViewSet, MeView, ProjectViewSet, AdminProgressViewSet, AdminExpenseViewSet,AdminClientViewSet, AdminDashboardView, ClientDashboardView, ExpenseViewSet, ProjectProgressViewSet, MessageViewSet, cash_receipt_views
)
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



urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/admin/dashboard/', AdminDashboardView.as_view()),
    path('api/client/dashboard/', ClientDashboardView.as_view()),
    path('api/admin/cash-receipts/', cash_receipt_views.create_cash_receipt, name='create-cash-receipt'),
    path('api/admin/payments/', cash_receipt_views.get_admin_client_payments, name='get-admin-client-payments'),
    path('api/client/payments/', cash_receipt_views.get_client_cash_receipts, name='get-client-payments'),
    path('auth/me/', MeView.as_view()),
    path('login/', CustomAuthToken.as_view(), name='custom-login'),

]