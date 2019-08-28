from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('', views.CreateExtensionsForm, name='CreateExtensionsForm'),
]
