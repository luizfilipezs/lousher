from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date

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

	def list(self, request):
		queryset = Produto.objects.filter(qntd_disponivel__gt=0)
		serializer = ProdutoSerializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request, pk=None):
		produto = get_object_or_404(Produto, pk=pk)
		# Checa a validade da oferta. Se estiver vencida, remove o desconto
		if not produto.oferta is None:
			if produto.oferta.vencimento < date.today():
				produto.oferta = None
				produto.save()
		# Retorna o produto
		serializer = ProdutoSerializer(produto)
		return Response(serializer.data)

	@action(methods=['get'], detail=False)
	def get_ofertas(self, request):
		# pega objetos com oferta e filtra para receber apenas os que têm o
		# vencimento acima da data atual e quantidade disponível maior que zero
		queryset = Produto.objects.all().exclude(oferta=None, qntd_disponivel__lte=0).filter(oferta__vencimento__gt=date.today())
		serializer = ProdutoSerializer(queryset, many=True)
		return Response(serializer.data)

	@action(methods=['get'], detail=False)
	def get_by_type(self, request, *args, **kwargs):
		tipo = kwargs['tipo']
		queryset = Produto.objects.filter(tipo=tipo, qntd_disponivel__gt=0)
		serializer = ProdutoSerializer(queryset, many=True)
		return Response(serializer.data)


# CARRINHO

class ItemCarrinhoViewSet(viewsets.ViewSet):
	permission_classes = [permissions.IsAuthenticated]

	def list(self, request):
		queryset = ItemCarrinho.objects.filter(usuario=request.user)
		serializer = ItemCarrinhoSerializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request, pk=None):
		queryset = ItemCarrinho.objects.filter(usuario=request.user)
		item_carrinho = get_object_or_404(queryset, pk=pk)
		serializer = ItemCarrinhoSerializer(item_carrinho)
		return Response(serializer.data)

	@action(methods=['get'], detail=True)
	def check_product(self, request, *args, **kwargs):
		produto_id = int(kwargs['produto_id'])
		item = ItemCarrinho.objects.filter(usuario=request.user, produto_id=produto_id).first()
		
		if not item is None:
			# Prevent to keep more products than its available quantity
			qntd_disponivel = item.produto.qntd_disponivel
			if item.qntd > qntd_disponivel:
				if qntd_disponivel == 0:
					item.delete()
					return Response(status=404)
				else:
					item.qntd = qntd_disponivel
					item.save()

			serializer = ItemCarrinhoSerializer(item)
			return Response(serializer.data)
		else:
			return Response(status=404)

	@action(methods=['post'], detail=True)
	def change_cart(self, request, *args, **kwargs):
		produto_id = int(kwargs['produto_id'])
		qntd = int(kwargs['qntd'])

		item_carrinho = ItemCarrinho.objects.filter(usuario=request.user, produto_id=produto_id).first()
		has_body = True

		if not item_carrinho is None:
			# Prevent to add more products than its available quantity
			qntd_disponivel = item_carrinho.produto.qntd_disponivel
			if qntd > qntd_disponivel:
				qntd = qntd_disponivel

			# Update existing cart item if qntd > 0, else delete it
			if qntd > 0:
				item_carrinho.qntd = qntd
				item_carrinho.save()
			else:
				item_carrinho.delete()
				has_body = False
		else:
			# Create new cart item
			if qntd > 0:
				item_carrinho = ItemCarrinho.objects.create(
					usuario=request.user,
					produto=Produto.objects.get(pk=produto_id),
					qntd=qntd 
				)
			else:
				has_body = False
		
		# Return 
		if has_body:
			serializer = ItemCarrinhoSerializer(item_carrinho)
			return Response(serializer.data)
		else:
			return Response(status=204)

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
		endereco = EnderecoSerializer(data=request.data)
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