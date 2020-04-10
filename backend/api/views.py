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

class EnderecoViewSet(viewsets.ViewSet):
	permission_classes = [permissions.IsAuthenticated]
	
	def list(self, request):
		queryset = request.user.enderecos
		serializer = EnderecoSerializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request, pk=None):
		queryset = request.user.enderecos
		endereco = get_object_or_404(queryset, pk=pk)
		serializer = EnderecoSerializer(endereco)
		return Response(serializer.data)

	def create(self, request):
		novo_endereco = Endereco.objects.create(request.data)
		request.user.enderecos.add(EnderecoSerializer(novo_endereco))
		return Response(status=201)

	def update(self, request, pk=None):
		endereco = EnderecoSerializer(request.data)
		Endereco.objects.filter(pk=pk).update(endereco)
		return Response(endereco.data)

	def destroy(self, request, pk=None):
		Endereco.objects.filter(pk=pk).delete()
		return Response(status=200)
