from django.contrib import admin
from .models import (User, Endereco, Produto, Pedido, Oferta)


admin.site.register(User)
admin.site.register(Endereco)
admin.site.register(Pedido)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
	list_display = ('nome', 'preco', 'tipo', 'ano', 'oferta',)
	search_fields = ['nome']

@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
	list_display = ('descricao', 'preco_oferta', 'vencimento',)
	search_fields = ['descricao', 'preco_oferta']