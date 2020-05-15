from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date

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
    enderecos = models.ManyToManyField(Endereco)

    def __str__(self):
        return self.get_full_name()

class Oferta(models.Model):
    descricao = models.CharField(max_length=70)
    preco_oferta = models.PositiveIntegerField()
    vencimento = models.DateField()

    def __str__(self):
        return self.descricao

class Produto(models.Model):
    TIPOS = [
        ('merlot', 'Merlot'),
        ('cabernet_suavignon', 'Cabernet Suavignon'),
        ('carmenere', 'Carménère'),
        ('tannat', 'Tannat'),
        ('pinot_noir', 'Pinot Noir'),
        ('chardonnay', 'Chardonnay')
    ]

    CORES = [
        ('tinto', 'Tinto'),
        ('branco', 'Branco'),
        ('rose', 'Rosé')
    ]

    DOCURA = [
        ('seco', 'Seco'),
        ('meio-seco', 'Meio seco'),
        ('doce', 'Doce')
    ]

    brasil = 'brasil'
    PAIS = [
        (brasil, 'Brasil')
    ]

    oeste_gaucho = 'oeste_gaucho'
    REGIAO = [
        (oeste_gaucho, 'Oeste Gaúcho'),
        ('serra_gaucha', 'Serra Gaúcha')
    ]

    CLASSE = [
        ('mesa', 'De mesa'),
        ('leve', 'Leve'),
        ('champagne', 'Champagne'),
        ('composto', 'Composto'),
        ('licoroso', 'Licoroso')
    ]

    SABOR = [
        ('abaunilhado', 'Abaunilhado'),
        ('amadeirado', 'Amadeirado'),
        ('amendoado', 'Amendoado'),
        ('amanteigado', 'Amanteigado'),
        ('austero', 'Austero'),
        ('carnoso', 'Carnoso'),
        ('defumado', 'Defumado')
    ]

    descricao = models.CharField(max_length=220, default='Sem descrição disponível.')
    preco = models.PositiveIntegerField()
    qntd_estoque = models.PositiveIntegerField(default=0)
    qntd_disponivel = models.PositiveIntegerField(default=0)
    pais = models.CharField(max_length=20, choices=PAIS, default=brasil)
    regiao = models.CharField(max_length=30, choices=REGIAO, default=oeste_gaucho)
    oferta = models.ForeignKey(Oferta, null=True, blank=True, on_delete=models.SET_NULL)
    ano = models.PositiveIntegerField(default=date.today().year, verbose_name='Ano (safra)')
    mililitros = models.PositiveIntegerField(verbose_name='Conteúdo em mililitros (ml)', default=750)
    # informações para vinhos
    tipo = models.CharField(max_length=30, choices=TIPOS, blank=True)
    cor = models.CharField(max_length=10, choices=CORES, blank=True)
    docura = models.CharField(max_length=10, choices=DOCURA, blank=True)
    classe = models.CharField(max_length=30, choices=CLASSE, blank=True)
    sabor = models.CharField(max_length=20, choices=SABOR, blank=True)

    def __str__(self):
        return self.nome

class ItemCarrinho(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    qntd = models.PositiveIntegerField(default=1) 

    def __str__(self):
        return f"{self.produto} x {self.qntd}, de {self.usuario}"

class Pedido(models.Model):
    primeiro_status = 'processando_pag'
    STATUS = [
        (primeiro_status, 'processando pag.'),
        ('preparando', 'preparando envio'),
        ('despachado', 'despachado'),
        ('entregue', 'entregue'),
        ('suspenso', 'suspenso'),
        ('cancelado', 'cancelado')
    ]

    usuario = models.ForeignKey(User, on_delete=models.PROTECT)
    endereco = models.ForeignKey(Endereco, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS, default=primeiro_status)
    observacoes = models.CharField(max_length=300, blank=True)
    data_pedido = models.DateField(auto_now_add=True, null=True)

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    qntd = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.produto} x {self.qntd} | ID pedido: {self.pedido.id}"