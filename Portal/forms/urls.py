from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:company>/', views.detail, name='detail'),
    path('submit', views.MainForm, name='submit'),

    #Catching Info -> Mysql to Site
    path('catchCompany', views.catchCompany, name='catchCompany'),
    path('catchPorting', views.catchPorting, name='catchPorting'),
    path('catchToll', views.catchToll, name='catchToll'),
    path('catchTollRemove', views.catchTollRemove, name='catchTollRemove'),
    path('catch411', views.catch411, name='catch411'),
    path('catch911', views.catch911, name='catch911'),
    path('catchExt', views.catchExt, name='catchExt'),
    path('catchUpload', views.catchUpload, name='catchUpload'),
    path('catchConfirm', views.catchConfirm, name='catchConfirm'),
    path('getAddress', views.getAddress, name='getAddress'),
    path('getPhone', views.getPhone, name='getPhone'),
    path('setAddress', views.setAddress, name='setAddress'),

    #Init Values
    path('initCompany', views.initCompany, name='initCompany'),
    path('initPort', views.initPort, name='initPort'),
    path('init911', views.init911, name='init911'),
    path('init411', views.init411, name='init411'),
    path('initExt', views.initExt, name='initExt'),
    path('initUpload', views.initUpload, name='initUpload'),
    path('initTollPort', views.initTollPort, name='initTollPort'),


]