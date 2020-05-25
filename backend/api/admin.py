from django.contrib import admin
from .models import (User, Endereco, Produto, Pedido, Oferta)


admin.site.register(User)
admin.site.register(Endereco)
admin.site.register(Pedido)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
	list_display = ('grupo', 'ano', 'preco', 'oferta',)
	search_fields = ['grupo', 'ano']

@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
	list_display = ('porcentagem', 'vencimento',)
	search_fields = ['porcentagem', 'vencimento']