from django.shortcuts import render
from django.contrib.auth.decorators import login_required


# Início

def index(request):
    return render(request, 'index.html')

# Painel de controle personalizado

@login_required(login_url='/admin/')
def gerenciar_mensagens(request):
    return render(request, 'mensagens.html')

@login_required(login_url='/admin/')
def gerenciar_pedidos(request):
    return render(request, 'pedidos.html')