from .models import User, Produto, Endereco, ItemCarrinho, Pedido, ItemPedido
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['url', 'username', 'email']

class ProdutoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Produto
		fields = '__all__'

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