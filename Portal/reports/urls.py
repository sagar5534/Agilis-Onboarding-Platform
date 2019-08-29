from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('Ext', views.CreateExtensionsForm, name='CreateExtensionsForm'),
    path('PBX', views.CreatePBXForm, name='CreatePBXForm'),
    path('Port', views.CreatePortingForm, name='CreatePortingForm'),

]
