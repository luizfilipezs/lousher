from django.urls import include, path
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'produtos', views.ProdutoViewSet)
router.register(r'enderecos', views.EnderecoViewSet, basename='enderecos')
router.register(r'pedidos', views.PedidoViewSet, basename='pedidos')
router.register(r'itensPedidos', views.ItemPedidoViewSet, basename='itensPedidos')

urlpatterns = [
	path('', include(router.urls)),
	path('produtos/ofertas', UserViewSet.as_view()),
]
