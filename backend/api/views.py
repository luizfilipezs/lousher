from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import datetime

from .models import User, Produto, Endereco, ItemCarrinho, Pedido, ItemPedido
from .serializers import UserSerializer, ProdutoSerializer, EnderecoSerializer, ItemCarrinhoSerializer, PedidoSerializer, ItemPedidoSerializer

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

	@action(methods=['get'], detail=False)
	def get_ofertas(self, request):
		# pega objetos com oferta e filtra para receber apenas os que têm o vencimento acima da data atual
		queryset = Produto.objects.all().exclude(oferta=None).filter(oferta__vencimento__gt=datetime.date.today())
		serializer = ProdutoSerializer(quersyset, many=True)
		return Response(serializer.data)


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

	def update(self, request, pk=None):
		endereco = get_object_or_404(request.user.enderecos, pk=pk)
		endereco = EnderecoSerializer(endereco, request.data)
		if endereco.is_valid():
			endereco.save()
			return Response(endereco.data)
		
		return Response(status=400)

	def destroy(self, request, pk=None):
		Endereco.objects.filter(pk=pk).delete()
		return Response(status=200)

# PEDIDO

class PedidoViewSet(viewsets.ModelViewSet):
	queryset = Pedido.objects.all().order_by('-id')
	serializer_class = PedidoSerializer
	permission_classes = [permissions.IsAuthenticated]

	def list(self, request):
		queryset = Pedido.objects.filter(usuario=request.user)
		serializer = PedidoSerializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request, pk=None):
		pedido = get_object_or_404(Pedido, pk=pk)
		serializer = PedidoSerializer(pedido)
		return Response(serializer.data)

class ItemPedidoViewSet(viewsets.ModelViewSet):
	queryset = ItemPedido.objects.all()
	serializer_class = ItemPedidoSerializer
	permission_classes = [permissions.IsAuthenticated]