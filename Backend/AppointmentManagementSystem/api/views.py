from django.shortcuts import render
from .models import User
from .serializers import UserSerializer
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from auditlog.middleware import set_actor
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate #database for users
# Create your views here.
@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
def update_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#---LOGIN/AUTH/JWT--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        set_actor(user)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            "message": "Login successful",
            "user": user.username,  # Add this line
        }, status=status.HTTP_200_OK)

        # Pull config from SIMPLE_JWT
        cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE", "access_token")
        cookie_secure = settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False)
        cookie_httponly = settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True)
        cookie_samesite = settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax")
        access_token_lifetime = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        refresh_token_lifetime = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

        # Set Access Token in Cookie
        response.set_cookie(
            key=cookie_name,
            value=access_token,
            httponly=cookie_httponly,
            secure=cookie_secure,
            samesite=cookie_samesite,
            max_age=access_token_lifetime,
            path='/'
        )

        # Optionally set Refresh Token in Cookie too
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=cookie_httponly,
            secure=cookie_secure,
            samesite=cookie_samesite,
            max_age=refresh_token_lifetime,
            path='/'
        )

        return response
    else:
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({'message': 'Logged out successfully'}, status=200)
    
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    
    # Optional: also set expired manually (double safety)
    response.set_cookie('access_token', '', expires=0, httponly=True)
    response.set_cookie('refresh_token', '', expires=0, httponly=True)

    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({'error': 'No refresh token'}, status=401)

    try:
        cookie_secure = settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False)
        cookie_httponly = settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True)
        cookie_samesite = settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax")
        access_token_lifetime = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())

        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)

        res = Response({'access': access}, status=200)
        res.set_cookie(
            'access_token',
            access,
            httponly=cookie_httponly,
            samesite=cookie_samesite,
            secure=cookie_secure,
            max_age=access_token_lifetime, # 👈 Make it persist
            path="/"
        )

        return res
    except Exception:
        return Response({'detail': 'Invalid refresh token'}, status=403)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "authenticated": True,
        "user": request.user.username,
        'usertype': request.user.usertype
    })
    