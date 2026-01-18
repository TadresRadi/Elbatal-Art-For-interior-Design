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

    budget = serializers.DecimalField(max_digits=12, decimal_places=2)
    project_title = serializers.CharField(max_length=150)

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
        budget = validated_data['budget']
        project_title = validated_data['project_title']

        # 1️⃣ Create User
        user = User.objects.create_user(
            username=username,
            password=password
        )

        # 2️⃣ Create Profile
        UserProfile.objects.create(
            user=user,
            role='client'
        )

        # 3️⃣ Create Client
        client = Client.objects.create(
            user=user,
            phone=phone,
            address=address,
            budget=budget
        )

        # 4️⃣ Create Project (خزن الـ instance)
        project_obj = Project.objects.create(
            client=client,
            title=project_title,
            total_budget=budget
        )

        # 5️⃣ Create Progress automatically (استخدم الـ instance)
        ProjectProgress.objects.create(
            project=project_obj,
            percentage=0
        )

        return client