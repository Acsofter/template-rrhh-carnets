"""
Configuración ASGI para el proyecto RRHH.

ASGI (Asynchronous Server Gateway Interface) permite que tu aplicación Django
se ejecute en servidores web asíncronos y en tiempo real.

Este archivo expone la aplicación ASGI como una variable de módulo llamada ``application``.

Para más información sobre este archivo, consulta:
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

# Importamos el módulo os para interactuar con el sistema operativo
import os

# Importamos la función get_asgi_application de Django
from django.core.asgi import get_asgi_application

# Configuramos la variable de entorno DJANGO_SETTINGS_MODULE
# Esto le dice a Django dónde encontrar el archivo de configuración principal
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'RRHH.settings')

# Creamos la aplicación ASGI
application = get_asgi_application()
