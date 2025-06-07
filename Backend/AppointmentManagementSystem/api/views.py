from django.shortcuts import render
from .models import User
from utils.jwe_utils import encrypt_data,decrypt_data
from .serializers import UserSerializer,UserClientSerializer
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from auditlog.middleware import set_actor
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import authenticate 
from django.contrib.auth.hashers import check_password,make_password

from .permission import IsSuperUser,IsStaff,IsClient
# Create your views here.

##############################  create

#  user
@api_view(['POST'])
@permission_classes([IsSuperUser])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#  client
@api_view(['POST'])
@permission_classes([AllowAny])
def create_client(request):
    serializer = UserClientSerializer(data=request.data)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

##############################  update

# user
@api_view(['PUT', 'PATCH'])
@permission_classes([IsSuperUser,IsStaff])
def update_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# client
@api_view(['PUT', 'PATCH'])
@permission_classes([IsClient])
def update_client(request, pk):
    user = get_object_or_404(User, pk=pk)
    serializer = UserClientSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        with set_actor(request.user):
            serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

##############################  list


@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsSuperUser])
def client_list(request):
    if request.method == 'GET':
        users = User.objects.filter(position="Client")
        serializer = UserClientSerializer(users, many=True)
        return Response(serializer.data)

##############################  update password

@api_view(['PUT', 'PATCH'])
@permission_classes([IsSuperUser,IsStaff])
def update_user_password(request, pk):
    user = get_object_or_404(User, pk=pk)
    password = request.data.get('password')
    old_password = request.data.get('old_password')

    if not password or not old_password:
        return Response({"error": "Both old and new passwords are required"}, status=status.HTTP_400_BAD_REQUEST)

    if not check_password(old_password, user.password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(password)
    user.save()
    return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsClient])
def update_client_password(request, pk):
    user = get_object_or_404(User, pk=pk)
    password = request.data.get('password')
    old_password = request.data.get('old_password')

    if not password or not old_password:
        return Response({"error": "Both old and new passwords are required"}, status=status.HTTP_400_BAD_REQUEST)

    if not check_password(old_password, user.password):
        return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(password)
    user.save()
    return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

#---LOGIN/AUTH/JWT--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def decrypt_view(request):
    encrypted = request.data.get("data")
    try:
        decrypted = decrypt_data(encrypted)
        return Response(decrypted, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)



# user login and authentication
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

        payload = {
            "message": "Login successful",
            "user": user.username,
            "access_token": access_token,
        }

        encrypted = encrypt_data(payload)  

        response = Response({"encrypted_data": encrypted}, status=status.HTTP_200_OK)

        cookie_name = settings.SIMPLE_JWT.get("AUTH_COOKIE", "access_token")
        cookie_secure = settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False)
        cookie_httponly = settings.SIMPLE_JWT.get("AUTH_COOKIE_HTTP_ONLY", True)
        cookie_samesite = settings.SIMPLE_JWT.get("AUTH_COOKIE_SAMESITE", "Lax")
        access_token_lifetime = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        refresh_token_lifetime = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

        response.set_cookie(
            key=cookie_name,
            value=access_token,
            httponly=cookie_httponly,
            secure=cookie_secure,
            samesite=cookie_samesite,
            max_age=access_token_lifetime,
            path='/'
        )

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
# ****************************************************************************************************************************************************

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
            max_age=access_token_lifetime,
            path="/"
        )

        return res
    except Exception:
        return Response({'detail': 'Invalid refresh token'}, status=403)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    user = request.user
    return Response({
        "authenticated": True,
        "user": user.username,
        "usertype":user.position,
    })
