from django.contrib import admin
from .models import (User, Endereco, Grupo, Produto, Pedido, Oferta, MensagemContato)


admin.site.register(User)
admin.site.register(Endereco)

@admin.register(Grupo)
class GrupoAdmin(admin.ModelAdmin):
	list_display = ('id', 'tipo', 'classe', 'docura',)
	search_fields = ['tipo']

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
	list_display = ('id', 'grupo', 'ano', 'preco', 'oferta',)
	search_fields = ['grupo', 'ano']

@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
	list_display = ('porcentagem', 'vencimento',)
	search_fields = ['porcentagem', 'vencimento']

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
	list_display = ('__str__', 'status',)
	search_fields = ['__str__', 'status']

@admin.register(MensagemContato)
class MensagemContatoAdmin(admin.ModelAdmin):
	list_display = ('assunto', 'nome', 'email',)
	search_fields = ['email', 'nome', 'assunto']