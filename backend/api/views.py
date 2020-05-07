from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import User, Produto, Endereco, ItemCarrinho
from .serializers import UserSerializer, ProdutoSerializer, EnderecoSerializer, ItemCarrinhoSerializer

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


# CARRINHO

class CarrinhoViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = ItemCarrinho.objects.filter(usuario=request.user)
        serializer = ItemCarrinhoSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, produto_id=None):
        queryset = ItemCarrinho.objects.filter(usuario=request.user, produto_id=produto_id)
        serializer = ItemCarrinhoSerializer(queryset)
        return Response(serializer.data)

    def create(self, request):
        item_carrinho = ItemCarrinhoSerializer(request.data)
        if item_carrinho.is_valid():
            item_carrinho.save()
        return Response(serializer.data)

    def update(self, request, pk=None):
        queryset = ItemCarrinho.objects.filter(usuario=request.user)
        item_carrinho = get_object_or_404(queryset, pk=pk)
        obj_atualizado = ItemCarrinhoSerializer(item_carrinho, request.data)
        if obj_atualizado.is_valid():
            obj_atualizado.save()
            return Response(endereco.data)
		
        return Response(status=400)

    def destroy(self, request, pk=None):
        ItemCarrinho.objects.filter(pk=pk).delete()
        return Response(status=200)


# ENDERECO

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
		endereco = EnderecoSerializer(request.data)
		if endereco.is_valid():
			endereco.save()
			request.user.enderecos.add(endereco)
			return Response(endereco.data)
		
		return Response(status=400)
		"""
		novo_endereco = Endereco(**request.data)
		novo_endereco.save()
		request.user.enderecos.add(novo_endereco)
		serializer = EnderecoSerializer(novo_endereco)
		return Response(serializer.data)
		"""

	def update(self, request, pk=None):
		endereco = get_object_or_404(request.user.enderecos, pk=pk)
		endereco = EnderecoSerializer(endereco, request.data)
		if endereco.is_valid():
			endereco.save()
			return Response(endereco.data)
		
		return Response(status=400)

		"""
		queryset = request.user.enderecos
		endereco = get_object_or_404(queryset, pk=pk)

		endereco.cep = request.data['cep']
		endereco.bairro = request.data['bairro']
		endereco.rua = request.data['rua']
		endereco.numero = request.data['numero']
		endereco.complemento = request.data['complemento']
		endereco.telefone = request.data['telefone']
		endereco.email = request.data['email']
		endereco.nome_destinatario = request.data['nome_destinatario']
		endereco.save()
		
		serializer = EnderecoSerializer(endereco)
		return Response(serializer.data)
		"""

	def destroy(self, request, pk=None):
		Endereco.objects.filter(pk=pk).delete()
		return Response(status=200)