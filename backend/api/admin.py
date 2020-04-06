from django.contrib import admin
from .models import (User, Endereco, Produto)


admin.site.register(User)
admin.site.register(Endereco)
admin.site.register(Produto)