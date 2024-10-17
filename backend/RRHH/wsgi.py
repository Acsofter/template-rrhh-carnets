"""
Configuración WSGI para el proyecto RRHH.

Este módulo contiene la aplicación WSGI utilizada por los servidores web compatibles con WSGI
para servir tu proyecto Django. Para más información sobre WSGI, consulta:
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

# Importamos el módulo os para interactuar con el sistema operativo
import os

# Importamos la función get_wsgi_application de Django
from django.core.wsgi import get_wsgi_application

# Configuramos la variable de entorno DJANGO_SETTINGS_MODULE
# Esto le indica a Django dónde encontrar el archivo de configuración principal
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'RRHH.settings')

# Creamos la aplicación WSGI
# Esta es la interfaz entre nuestro código Django y el servidor web
application = get_wsgi_application()
