from django.urls import include, path
from rest_framework import routers
from api import views
from api import in_app_views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'grupos', views.GrupoViewSet)
router.register(r'produtos', views.ProdutoViewSet)
router.register(r'carrinho', views.ItemCarrinhoViewSet, basename='carrinho')
router.register(r'enderecos', views.EnderecoViewSet, basename='enderecos')
router.register(r'pedidos', views.PedidoViewSet, basename='pedidos')
router.register(r'pedidosCliente', views.ClientePedidoViewSet, basename='pedidosCliente')
router.register(r'itensPedidos', views.ItemPedidoViewSet, basename='itensPedidos')
router.register(r'mensagens', views.MensagemContatoView, basename='mensagens')
router.register(r'enviarMensagem', views.MensagemContatoCreateView, basename='enviarMensagem')

urlpatterns = [
	path('email/atualizar_status_pedido/', views.notificar_atualizacao_status_pedido),
	path('produtos/ofertas', views.ProdutoViewSet.as_view({'get': 'get_ofertas'})),
	path('produtos/tipo/<str:tipo>', views.ProdutoViewSet.as_view({'get': 'get_by_type'})),
	path('produtos/search/<str:q>', views.ProdutoViewSet.as_view({'get': 'search'})),
	path('carrinho/produto/<int:produto_id>/', views.ItemCarrinhoViewSet.as_view({'get': 'check_product'})),
	path('carrinho/produto/<int:produto_id>/qntd/<int:qntd>/', views.ItemCarrinhoViewSet.as_view({'post': 'change_cart'})),
	path('enderecos/meu_endereco', views.EnderecoViewSet.as_view({'get': 'get_endereco_usuario'})),
	path('enderecos/meu_endereco/alterar/', views.EnderecoViewSet.as_view({'post': 'alterar_endereco_usuario'})),
	path('', include(router.urls)),
]
