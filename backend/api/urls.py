from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.testing, name='testing'),
    path('cart/', views.getItensCarrinho, name='get_cart_items'),
]
