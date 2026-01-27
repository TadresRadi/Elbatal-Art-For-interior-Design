from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from accounts.models import UserProfile
from api.models import Client
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_staff or user.is_superuser:
            role = 'admin'
            client_id = None
        else:
            # client فقط لو مش admin
            try:
                client = Client.objects.get(user=user)
                role = 'client'
                client_id = client.id
            except Client.DoesNotExist:
                role = 'client'  # لو مش مرتبط بـ Client، ممكن نغيرها لاحقًا
                client_id = None

        data = {
            'id': user.id,
            'username': user.username,
            'role': role,
            'client_id': client_id
        }

        return Response(data)
    
class CustomAuthToken(APIView):

    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({'detail': 'Username and password required.'}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            if not user:
                return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

            # إذا كان admin، يسمح له بالدخول بدون Client requirement
            if user.is_superuser or user.is_staff:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_id': user.id,
                    'username': user.username,
                    'role': 'admin'
                })

            # لو Client، يتحقق من وجود client ونشاطه
            try:
                client = Client.objects.get(user=user)
                if client.is_deleted or not client.is_active:
                    return Response({'detail': 'This client account is inactive or deleted.'}, status=status.HTTP_403_FORBIDDEN)
            except Client.DoesNotExist:
                return Response({'detail': 'This account is not a client.'}, status=status.HTTP_403_FORBIDDEN)

            # إنشاء JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user_id': user.id,
                'username': user.username,
                'role': 'client',
                'client_id': client.id
            })
        except Exception as e:
            return Response({
                'detail': f"Internal server error: {str(e)}",
                'error_type': type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)