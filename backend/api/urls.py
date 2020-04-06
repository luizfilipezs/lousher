from django.urls import include, path
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'produtos', views.ProdutoViewSet)
router.register(r'enderecos', views.EnderecoViewSet)
router.register(r'enderecos-usuario', views.EnderecosUsuarioViewSet, basename='enderecos-usuario')

urlpatterns = [
  path('', include(router.urls)),
]