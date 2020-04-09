from django.contrib.auth.models import AbstractUser
from django.db import models


class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.PositiveIntegerField()
    qntd_estoque = models.PositiveIntegerField(default=0)

class ItemCarrinho(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1) 

class Endereco(models.Model):
    cep = models.CharField(max_length=10)
    bairro = models.CharField(max_length=100)
    rua = models.CharField(max_length=100)
    numero = models.PositiveIntegerField()
    complemento = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    nome_destinatario = models.CharField(max_length=100)

class User(AbstractUser):
    carrinho = models.ManyToManyField(ItemCarrinho)
    enderecos = models.ManyToManyField(Endereco)