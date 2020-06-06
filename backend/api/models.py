from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import date

class Endereco(models.Model):
    uf = models.CharField(max_length=2, default='RS')
    cidade = models.CharField(max_length=28, default='Três Palmeiras')
    rua = models.CharField(max_length=100)
    numero = models.PositiveIntegerField()
    cep = models.CharField(max_length=10)
    bairro = models.CharField(max_length=100)
    complemento = models.CharField(max_length=100)
    nome_destinatario = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nome_destinatario} | {self.telefone}"

class User(AbstractUser):
    endereco = models.OneToOneField(Endereco, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return self.username

class Oferta(models.Model):
    porcentagem = models.PositiveIntegerField(default=10, validators=[MinValueValidator(1), MaxValueValidator(100)])
    vencimento = models.DateField()

    def __str__(self):
        return f"{self.porcentagem}% | Até {self.vencimento.strftime('%d/%m/%Y')}"

class Grupo(models.Model):
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
        ('fino', 'Fino'),
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
    pais = models.CharField(max_length=20, choices=PAIS, default=brasil)
    regiao = models.CharField(max_length=30, choices=REGIAO, default=oeste_gaucho)
    mililitros = models.PositiveIntegerField(verbose_name='Conteúdo em mililitros (ml)', default=750)
    vol_alcoolico = models.FloatField(verbose_name='Vol. Alcoólico', null=True, blank=True, default=None)
    # informações para vinhos
    tipo = models.CharField(max_length=30, choices=TIPOS, blank=True)
    cor = models.CharField(max_length=10, choices=CORES, blank=True)
    docura = models.CharField(max_length=10, choices=DOCURA, blank=True)
    classe = models.CharField(max_length=30, choices=CLASSE, blank=True)
    sabor = models.CharField(max_length=20, choices=SABOR, blank=True)

    def __str__(self):
        return self.get_tipo_display()

class Produto(models.Model):
    grupo = models.ForeignKey(Grupo, null=True, on_delete=models.PROTECT)
    preco = models.PositiveIntegerField()
    ano = models.PositiveIntegerField(default=date.today().year, verbose_name='Ano (safra)')
    qntd_estoque = models.PositiveIntegerField(default=0)
    qntd_disponivel = models.PositiveIntegerField(default=0)
    oferta = models.ForeignKey(Oferta, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.grupo} {self.preco}"

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

class MensagemContato(models.Model):
    nome = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=50, null=True, blank=True)
    assunto = models.CharField(max_length=50, null=True, blank=True)
    mensagem = models.CharField(max_length=200, null=True, blank=True)
    data_envio = models.DateField(auto_now_add=True, null=True)

    def __str__(self):
        return f"De: {self.email} | Assunto: {self.assunto}"

    class Meta:
        verbose_name = _('Mensagem')
        verbose_name_plural = _('Mensagens')