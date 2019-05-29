from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from . import views

# URL patterns for Login

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.loginProtocol, name='loginProtocol'),
    path('logout/', views.logoutProtocol, name='logoutProtocol'),

    path('password_reset/', auth_views.PasswordResetView.as_view() , name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    #Reset for new user
    path('reset/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_newuser'),

]
 
   
