from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test


# Início

def index(request):
    return render(request, 'index.html')

# Painel de controle personalizado

@user_passes_test(lambda u: u.is_superuser, login_url='/admin/')
def gerenciar_mensagens(request):
    return render(request, 'mensagens.html')

@user_passes_test(lambda u: u.is_superuser, login_url='/admin/')
def gerenciar_pedidos(request):
    return render(request, 'pedidos.html')