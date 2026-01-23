from rest_framework import serializers
from django.db.models import Sum
from api.models import Client, ProjectProgress
from django.contrib.auth.models import User

class ClientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    progress = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    paid = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id','name','username','email','progress','total','paid','status',
                  'phone','address','budget','created_at']

    def get_progress(self, obj):
        if hasattr(obj, 'project') and hasattr(obj.project, 'progress'):
            return obj.project.progress.percentage
        return 0

    def get_total(self, obj):
        return float(obj.expenses.aggregate(total=Sum('amount'))['total'] or 0)

    def get_paid(self, obj):
        return float(obj.expenses.filter(status='paid').aggregate(total=Sum('amount'))['total'] or 0)

    def get_status(self, obj):
        if hasattr(obj, 'project'):
            return obj.project.status
        return 'pending'