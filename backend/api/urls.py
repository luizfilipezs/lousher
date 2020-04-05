from django.urls import include, path
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'produtos/read-only', views.ProdutoReadOnlyViewSet)
router.register(r'produtos', views.ProdutoViewSet)

urlpatterns = [
  path('', include(router.urls)),
]