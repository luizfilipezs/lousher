from .models import User, Produto, Endereco, ItemCarrinho, Pedido, ItemPedido, Oferta
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['url', 'username', 'email']

class OfertaSerializer(serializers.ModelSerializer):
	class Meta:
		model = Oferta
		fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
	oferta = OfertaSerializer()
	# choices
	pais = serializers.SerializerMethodField()
	regiao = serializers.SerializerMethodField()
	tipo = serializers.SerializerMethodField()
	cor = serializers.SerializerMethodField()
	docura = serializers.SerializerMethodField()
	classe = serializers.SerializerMethodField()
	sabor = serializers.SerializerMethodField()
	
	class Meta:
		model = Produto
		fields = '__all__'

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

class ItemCarrinhoSerializer(serializers.ModelSerializer):
	produto = ProdutoSerializer()
	class Meta:
		model = ItemCarrinho
		fields = '__all__'

class EnderecoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Endereco
		fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
	endereco = EnderecoSerializer()
	class Meta:
		model = Pedido
		fields = '__all__'

class ItemPedidoSerializer(serializers.ModelSerializer):
	produto = ProdutoSerializer()
	class Meta:
		model = Pedido
		fields = '__all__'