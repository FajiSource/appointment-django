from django.urls import path
from .views import (
    # user
    create_user,
    user_list,
    update_user,
    logout_view,
    refresh_token_view,
    update_user_password,

    # client
    create_client,
    client_list,
    update_client,
    # login_client,
    update_client_password,


    # client & user
    # unified_login,
    decrypt_view,
    login_user,
    protected_view,

)

urlpatterns = [
    # user
    path('users/', user_list),            
    path('users/create/', create_user),       
    path('users/<int:pk>/update/', update_user),  
    path('refresh/', refresh_token_view),
    path('users/change-password/<int:pk>', update_user_password),

    # client
     path('users/create-client/', create_client),
     path('users/clients', client_list),
     path('users/<int:pk>/client-update/', update_client),
     path('users/client-change-password/<int:pk>', update_client_password),


    #  client & user
     path('login/', login_user),
     path('decrypt/', decrypt_view),
     path('protected/', protected_view),
     path('logout/', logout_view),
]
