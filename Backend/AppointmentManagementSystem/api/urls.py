from django.urls import path
from .views import (
    # user
    create_user,
    user_list,
    update_user,
    # login_user,
    logout_view,
    refresh_token_view,
    protected_view,
    update_user_password,

    # client
    create_client,
    client_list,
    update_client,
    # login_client,
    update_client_password,


    # client & user
    unified_login,
    decrypt_view
)

urlpatterns = [
    # user
    path('users/', user_list),            
    path('users/create/', create_user),       
    path('users/<int:pk>/update/', update_user),  
    # path('login/', login_user),
    path('logout/', logout_view),
    path('refresh/', refresh_token_view),
    path('protected/', protected_view),
    path('users/change-password/<int:pk>', update_user_password),

    # client
     path('clients/create/', create_client),
     path('clients/', client_list),
     path('clients/<int:pk>/update/', update_client),
    #  path('clients/login', login_client),
     path('clients/change-password/<int:pk>', update_client_password),


    #  client & user
     path('login/', unified_login),
     path('decrypt/', decrypt_view),
]
