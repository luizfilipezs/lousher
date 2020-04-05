from django.shortcuts import render
from rest_framework import viewsets, mixins
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Produto
from .serializers import UserSerializer, ProdutoSerializer


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

class ProdutoReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Produto.objects.all().order_by('id')
	serializer_class = ProdutoSerializer
	permission_classes = [permissions.AllowAny]

class ProdutoViewSet(viewsets.ModelViewSet):
	queryset = Produto.objects.all().order_by('id')
	serializer_class = ProdutoSerializer
	permission_classes = [permissions.IsAdminUser]

"""
class ProdutoViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin):
	queryset = Produto.objects.all().order_by('id')
	serializer_class = ProdutoSerializer
	permission_classes = [permissions.AllowAny]
"""