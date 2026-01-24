from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction

from api.models.client import Client
from api.models.project import Project
from api.models.progress import ProjectProgress
from accounts.models import UserProfile


class ClientCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)

    budget = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    project_title = serializers.CharField(max_length=150)

    # ✅ إضافة الحقول الجديدة
    start_date = serializers.DateField(required=False , allow_null=True)
    expected_end_date = serializers.DateField(required=False , allow_null=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']

        phone = validated_data.get('phone', '')
        address = validated_data.get('address', '')
        budget = validated_data.get('budget', 0)
        project_title = validated_data['project_title']

        start_date = validated_data.get('start_date', None)
        expected_end_date = validated_data.get('expected_end_date', None)

        # 1️⃣ إنشاء User
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=username
        )

        # 2️⃣ إنشاء Profile
        UserProfile.objects.create(
            user=user,
            role='client'
        )

        # 3️⃣ إنشاء Client
        client = Client.objects.create(
            user=user,
            phone=phone,
            address=address,
            budget=budget
        )

        # 4️⃣ إنشاء Project مع start_date و expected_end
        project_obj = Project.objects.create(
            client=client,
            title=project_title,
            total_budget=budget,
            start_date=start_date,
            expected_end_date=expected_end_date
        )

        # 5️⃣ إنشاء Progress تلقائيًا
        ProjectProgress.objects.create(
            project=project_obj,
            percentage=0
        )

        return client