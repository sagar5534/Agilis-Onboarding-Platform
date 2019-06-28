from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:company>/', views.detail, name='detail'),
    path('submit', views.MainForm, name='submit'),
    path('catch', views.catch, name='catch'),
    path('catch2', views.catch2, name='catch2'),
    path('catch3', views.catch3, name='catch3'),
    path('getAddress', views.getAddress, name='getAddress'),
    path('getPhone', views.getPhone, name='getPhone'),
    path('setAddress', views.setAddress, name='setAddress'),
]
   
