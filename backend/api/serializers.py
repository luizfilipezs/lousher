from .models import User, Grupo, Produto, Endereco, ItemCarrinho, Pedido, ItemPedido, Oferta, MensagemContato
from rest_framework import serializers
from decimal import Decimal


class EnderecoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Endereco
		fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
	endereco = EnderecoSerializer()
	class Meta:
		model = User
		fields = '__all__'

class OfertaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Oferta
		fields = '__all__'

class GrupoSerializer(serializers.ModelSerializer):
	# choices
	pais = serializers.SerializerMethodField()
	regiao = serializers.SerializerMethodField()
	tipo = serializers.SerializerMethodField()
	cor = serializers.SerializerMethodField()
	docura = serializers.SerializerMethodField()
	classe = serializers.SerializerMethodField()
	sabor = serializers.SerializerMethodField()

	def get_pais(self, obj):
		return obj.get_pais_display()

	def get_regiao(self, obj):
		return obj.get_regiao_display()

	def get_tipo(self, obj):
		return obj.get_tipo_display()

	def get_cor(self, obj):
		return obj.get_cor_display()

	def get_docura(self, obj):
		return obj.get_docura_display()

	def get_classe(self, obj):
		return obj.get_classe_display()

	def get_sabor(self, obj):
		return obj.get_sabor_display()
	
	class Meta:
		model = Grupo
		fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
	nome = serializers.SerializerMethodField()
	grupo = GrupoSerializer()
	oferta = OfertaSerializer()
	preco_oferta = serializers.SerializerMethodField()

	def get_preco_oferta(self, obj):
		if not obj.oferta is None:
			preco = obj.preco * (1 - (obj.oferta.porcentagem / 100))
			return int(preco)
		else:
			return None

	def get_nome(self, obj):
		return f"{obj.grupo.get_tipo_display()} {obj.ano}"
	
	class Meta:
		model = Produto
		fields = '__all__'

class ItemCarrinhoSerializer(serializers.ModelSerializer):
	produto = ProdutoSerializer()
	class Meta:
		model = ItemCarrinho
		fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
	endereco = EnderecoSerializer(read_only=True)
	status = serializers.SerializerMethodField()
	data_pedido = serializers.DateField(format="%d/%m/%Y")

	def get_status(self, obj):
		return obj.get_status_display()

	class Meta:
		model = Pedido
		fields = '__all__'

class CreatePedidoSerializer(serializers.ModelSerializer):

	STATUS = [
		('analise', 'em análise'),
		('preparando', 'preparando envio'),
		('despachado', 'despachado'),
		('entregue', 'entregue'),
		('suspenso', 'suspenso'),
		('cancelado', 'cancelado')
    ]

	endereco_id = serializers.PrimaryKeyRelatedField(queryset=Endereco.objects.all())
	status = serializers.ChoiceField(choices=STATUS)

	class Meta:
		model = Pedido
		fields = ['usuario', 'endereco_id', 'observacoes', 'status']
	
	def create(self, validated_data):
		return Pedido.objects.create(
			usuario=validated_data.get('usuario'),
			endereco=validated_data.get('endereco_id'),
			observacoes=validated_data.get('observacoes')
		)

class ItemPedidoSerializer(serializers.ModelSerializer):
	produto = ProdutoSerializer()

	class Meta:
		model = ItemPedido
		fields = '__all__'

class CreateItemPedidoSerializer(serializers.ModelSerializer):
	#produto = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all()) it's valid too
	produto_id = serializers.PrimaryKeyRelatedField(queryset=Produto.objects.all())
	pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all())

	class Meta:
		model = ItemPedido
		fields = ['pedido', 'produto_id', 'qntd']
	
	def create(self, validated_data):
		return ItemPedido.objects.create(
			pedido=validated_data.get('pedido'),
			produto=validated_data.get('produto_id'),
			qntd=validated_data.get('qntd')
		)

class MensagemContatoSerializer(serializers.ModelSerializer):
	data_envio = serializers.DateField(format="%d/%m/%Y")
	class Meta:
		model = MensagemContato
		fields = '__all__'