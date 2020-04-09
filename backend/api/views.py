from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import User, Produto, Endereco, ItemCarrinho
from .serializers import UserSerializer, ProdutoSerializer, EnderecoSerializer

from api.permission_classes import IsAdminOrReadOnly


# USER

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

# PRODUTO

class ProdutoViewSet(viewsets.ModelViewSet):
	queryset = Produto.objects.all().order_by('-id')
	serializer_class = ProdutoSerializer
	permission_classes = [IsAdminOrReadOnly]



"""
# ENDEREÇO

class EnderecoViewSet(viewsets.ModelViewSet):
	queryset = Endereco.objects.all().order_by('id')
	serializer_class = EnderecoSerializer
	permission_classes = [permissions.IsAdminUser]

class EnderecosUsuarioViewSet(viewsets.ViewSet):
	permission_classes = [permissions.IsAuthenticated]
	
	def list(self, request):
		queryset = Endereco.objects.filter(usuario=request.user)
		serializer = EnderecoSerializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request, pk=None):
		queryset = Endereco.objects.all()
		endereco = get_object_or_404(queryset, pk=pk)
		serializer = EnderecoSerializer(endereco)
		return Response(serializer.data)
"""