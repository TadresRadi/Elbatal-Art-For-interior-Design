from django.shortcuts import render
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate
from api.models import Client

# Create your views here.
from django.contrib.auth import authenticate
from requests import Response
from api.models import Client

def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "اسم المستخدم أو كلمة المرور خطأ"}, status=401)

    # لو مفيش Client مرتبط بالـ User، منع الدخول
    try:
        client = Client.objects.get(user=user)
    except Client.DoesNotExist:
        return Response({"detail": "هذا الحساب غير مفعل كعميل"}, status=403)