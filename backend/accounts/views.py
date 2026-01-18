from django.shortcuts import render
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate
from api.models import Client

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=400)

        # تحقق أن العميل موجود ومفعل
        try:
            client = Client.objects.get(user=user)
            if not client.is_active or client.is_deleted:
                return Response({"error": "Account is inactive or deleted"}, status=403)
        except Client.DoesNotExist:
            return Response({"error": "Client does not exist"}, status=403)

        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})