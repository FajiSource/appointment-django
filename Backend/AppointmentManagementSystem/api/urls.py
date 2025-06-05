from django.urls import path
from .views import (
    create_user,
    user_list,
    update_user,
    login_user,
    logout_view,
    refresh_token_view,
    protected_view,

)

urlpatterns = [
    path('users/', user_list),            
    path('users/create/', create_user),       
    path('users/<int:pk>/update/', update_user),  
    path('login/', login_user),
    path('logout/', logout_view),
    path('refresh/', refresh_token_view),
    path('protected/', protected_view),
]
