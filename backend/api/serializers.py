from .models import User, Grupo, Produto, Endereco, ItemCarrinho, Pedido, ItemPedido, Oferta
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
	endereco = EnderecoSerializer()
	status = serializers.SerializerMethodField()

	def get_status(self, obj):
		return obj.get_status_display()

	class Meta:
		model = Pedido
		fields = '__all__'

class ItemPedidoSerializer(serializers.ModelSerializer):
	produto = ProdutoSerializer()
	class Meta:
		model = Pedido
		fields = '__all__'