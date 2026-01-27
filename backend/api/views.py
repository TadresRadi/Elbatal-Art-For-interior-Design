from django.shortcuts import render
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate
from api.models import Client

def custom_login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"detail": "اسم المستخدم أو كلمة المرور خطأ"}, status=401)

        # Check if user is superuser (admin) - allow login without Client requirement
        if user.is_superuser:
            # For superusers, create a token and return success
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_superuser": user.is_superuser,
                    "role": "admin"
                }
            })

        # For regular users, check if they have a Client profile
        try:
            client = Client.objects.get(user=user)
        except Client.DoesNotExist:
            return Response({"detail": "هذا الحساب غير مفعل كعميل"}, status=403)

        # For client users, create a token and return success with client info
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_superuser": user.is_superuser,
                "role": "client"
            },
            "client": {
                "id": client.id,
                "phone": client.phone,
                "address": client.address,
                "budget": str(client.budget),
                "status": client.status
            }
        })
    except Exception as e:
        return Response({
            "detail": f"Internal server error: {str(e)}",
            "error_type": type(e).__name__
        }, status=500)