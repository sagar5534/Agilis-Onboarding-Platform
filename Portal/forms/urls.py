from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from . import views

# URL patterns for Login

urlpatterns = [
    path('', views.index, name='index'),
]


   
