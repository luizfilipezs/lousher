"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

# For using Angular

from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf.urls import url

from api import in_app_views

urlpatterns = [
    path('', in_app_views.index, name='index'),
	path('pedidos', in_app_views.gerenciar_pedidos, name='gerenciar_pedidos'),
	path('mensagens', in_app_views.gerenciar_mensagens, name='gerenciar_mensagens'),
    path('admin/', admin.site.urls),
    path('auth/login/', obtain_jwt_token),
    path('auth/signup/', include('rest_auth.registration.urls')),
    path('auth/refresh-token/', refresh_jwt_token),
    path('api/', include('api.urls')),
]