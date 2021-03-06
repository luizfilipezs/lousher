from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date
from .email import EnviarEmail
import json

from api.permission_classes import IsAdminOrReadOnly

from .models import (
	User,
	Grupo,
	Produto, 
	Endereco, 
	ItemCarrinho, 
	Pedido, 
	ItemPedido, 
	MensagemContato
)

from .serializers import (
	UserSerializer,
	GrupoSerializer,
	ProdutoSerializer,
	EnderecoSerializer,
	ItemCarrinhoSerializer,
	PedidoSerializer,
	AdminCreatePedidoSerializer,
	CreatePedidoSerializer,
	ItemPedidoSerializer,
	CreateItemPedidoSerializer,
	MensagemContatoSerializer,
	CreateMensagemContatoSerializer
)

from django.db.models import Transform, CharField, Q

class LowerCase(Transform):
	lookup_name = 'lower'
	function = 'LOWER'
	bilateral = True

CharField.register_lookup(LowerCase)

# EMAIL

@api_view(['POST'])
def notificar_atualizacao_status_pedido(request):
	data = request.data

	if "usuario_id" in data and "pedido_id" in data:
		usuario_id = data['usuario_id']
		pedido_id = data['pedido_id']

		mensagem_adicional = ""
		if "mensagem_adicional" in data:
			mensagem_adicional = data["mensagem_adicional"]

		try:
			usuario_id = int(usuario_id)
			pedido_id = int(usuario_id)
		except ValueError:
			return Response(f"Os valores dos campos 'usuario_id' e 'pedido_id' devem ser números inteiros, mas os valores recebidos foram ${usuario_id} e ${pedido_id}", status=400)

		EnviarEmail.atualizacao_status_pedido(usuario_id, pedido_id, mensagem_adicional)
		return Response(status=200)
	else:
		return Response('Um ou mais campos faltando! Esperado: "usuario_id" e "pedido_id". Recebido: ' + json.dumps(data), status=400)

@api_view(['POST'])
def responder_mensagem(request):
	data = request.data
	required_fields = ['mensagem_id', 'resposta']

	for field in required_fields:
		if not field in data.keys():
			return Response(status=400)

	EnviarEmail.responder_mensagem(int(data['mensagem_id']), data['resposta'])
	return Response(status=200)

# USER

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticated]

# GRUPO

class GrupoViewSet(viewsets.ModelViewSet):
	queryset = Grupo.objects.all()
	serializer_class = GrupoSerializer
	permission_classes = [IsAdminOrReadOnly]

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
		# Checa a validade da oferta. Se estiver vencida, a remove
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
		queryset = Produto.objects.filter(grupo__tipo=tipo, qntd_disponivel__gt=0).order_by('-ano')
		serializer = ProdutoSerializer(queryset, many=True)
		return Response(serializer.data)

	@action(methods=['get'], detail=False)
	def search(self, request, *args, **kwargs):
		q = kwargs['q']
		y = 0

		try:
			y = int(q)
		except ValueError:
			y = 0

		queryset = Produto.objects.filter(
			Q(grupo__tipo__unaccent__lower__trigram_similar=q) |
			Q(grupo__classe__unaccent__lower__trigram_similar=q) |
			Q(grupo__cor__unaccent__lower__trigram_similar=q) |
			Q(grupo__docura__unaccent__lower__trigram_similar=q) |
			Q(grupo__sabor__unaccent__lower__trigram_similar=q) |
			Q(ano=y)
		).exclude(qntd_disponivel__lt=1)

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

class EnderecoViewSet(viewsets.ModelViewSet):
	queryset = Endereco.objects.all()
	serializer_class = EnderecoSerializer
	permission_classes = [permissions.IsAuthenticated]
	
	@action(methods=['get'], detail=True)
	def get_endereco_usuario(self, request):
		endereco = request.user.endereco
		if not endereco is None:
			serializer = EnderecoSerializer(endereco)
			return Response(serializer.data)
		else:
			return Response(status=404)
	
	@action(methods=['post'], detail=True)
	def alterar_endereco_usuario(self, request):
		serializer = EnderecoSerializer(data=request.data)
		if serializer.is_valid():
			model = serializer.save()
			request.user.endereco = model
			request.user.save()
			return Response(serializer.data)
		return Response(status=403)


# PEDIDO

class PedidoViewSet(viewsets.ModelViewSet):
	queryset = Pedido.objects.all().order_by('-id')
	serializer_class = PedidoSerializer
	permission_classes = [permissions.IsAdminUser]
	
	def partial_update(self, request, pk=None):
		obj = self.get_object()

		partial_data = {}
		mensagem_adicional = ''

		if 'pedido' in request.data:
			partial_data = request.data['pedido']
			mensagem_adicional = request.data['mensagem_adicional']
		else:
			partial_data = request.data
		
		serializer = AdminCreatePedidoSerializer(obj, partial_data, partial=True)
		
		if serializer.is_valid():
			serializer.save()
			# envia email
			EnviarEmail.atualizacao_status_pedido(request.user.id, obj.id, mensagem_adicional)

			return Response(serializer.data)
		return Response(serializer.errors, status=400)

	@action(methods=['GET'], detail=True)
	def itens(self, request, pk):
		pedido = self.get_object()
		itens_pedido = ItemPedido.objects.filter(pedido=pedido)

		serializer = ItemPedidoSerializer(itens_pedido, many=True)
		return Response(serializer.data)

class ClientePedidoViewSet(viewsets.ModelViewSet):
	queryset = Pedido.objects.all().order_by('-id')
	serializer_class = PedidoSerializer
	permission_classes = [permissions.IsAuthenticated]

	def create(self, request):
		serializer = CreatePedidoSerializer(data=request.data)
		if serializer.is_valid():
			model = serializer.save()
			response_serializer = PedidoSerializer(model)

			# limpa carrinho do usuário
			ItemCarrinho.objects.filter(usuario=request.user).delete()

			# envia email
			EnviarEmail.atualizacao_status_pedido(request.user.id, model.id)

			return Response(response_serializer.data)
		return Response(status=400)

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

	def create(self, request):
		serializer = CreateItemPedidoSerializer(data=request.data)
		if serializer.is_valid():
			model = serializer.save()
			response_serializer = ItemPedidoSerializer(model)
			return Response(response_serializer.data)
		return Response(status=400)

# CONTATO

class MensagemContatoCreateView(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
	serializer_class = CreateMensagemContatoSerializer
	permission_classes = [permissions.AllowAny]

class MensagemContatoView(viewsets.ModelViewSet):
	queryset = MensagemContato.objects.all().order_by('-id')
	serializer_class = MensagemContatoSerializer
	permission_classes = [permissions.IsAdminUser]