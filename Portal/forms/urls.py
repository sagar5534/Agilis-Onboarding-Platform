from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from . import views

urlpatterns = [

    path('', views.index, name='index'),
    path('<int:company>/', views.detail, name='detail'),
    path('<int:company>/submit', views.MainForm, name='submit'),
    path('<int:company>/catch', views.catch, name='catch'),

]
   
