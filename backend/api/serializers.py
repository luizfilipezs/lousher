from .models import User, Produto, Endereco, ItemCarrinho
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