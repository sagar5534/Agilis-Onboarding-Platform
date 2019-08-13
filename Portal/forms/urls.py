from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:company>/', views.detail, name='detail'),
    path('submit', views.MainForm, name='submit'),
    path('catchCompany', views.catchCompany, name='catchCompany'),
    path('catchPorting', views.catchPorting, name='catchPorting'),
    path('catch411', views.catch411, name='catch411'),
    path('catch911', views.catch911, name='catch911'),
    path('catchExt', views.catchExt, name='catchExt'),
    path('getAddress', views.getAddress, name='getAddress'),
    path('getPhone', views.getPhone, name='getPhone'),
    path('setAddress', views.setAddress, name='setAddress'),
]
   
