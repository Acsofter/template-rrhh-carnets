# Importamos las clases necesarias de Django
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Importamos los modelos que queremos registrar en el admin
from .models import Usuario, Empleado

# Registramos el modelo Usuario con la clase UserAdmin
# UserAdmin proporciona una interfaz de administración completa para usuarios
admin.site.register(Usuario, UserAdmin)

# Registramos el modelo Empleado con la interfaz de administración predeterminada
admin.site.register(Empleado)
