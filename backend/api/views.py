from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .utils import gerar_json
from .debug import terminal, DecoratorTools as decorators

from .models import ItemCarrinho


def testing(request):
    return HttpResponse('ok', status=200)

def getItensCarrinho(request):
	if request.user.is_authenticated:
		itens = ItemCarrinho.objects.filter(usuario=request.user)
		itens = [{'id': item.produto.id, 'quantidade': item.quantidade} for item in itens]
		return JsonResponse(itens)
	else:
		return HttpResponse(content='É preciso iniciar sessão para ver esta página.', status=403)