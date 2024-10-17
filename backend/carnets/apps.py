# Importamos la clase AppConfig de Django
from django.apps import AppConfig


# Definimos la configuración de la aplicación 'carnets'
class CarnetsConfig(AppConfig):
    # Especificamos el tipo de campo automático para las claves primarias
    # BigAutoField es recomendado para nuevos proyectos en Django 3.2+
    default_auto_field = 'django.db.models.BigAutoField'
    
    # Nombre de la aplicación
    name = 'carnets'

    # Puedes añadir más configuraciones específicas de la aplicación aquí
    # Por ejemplo, señales de inicio, carga de datos iniciales, etc.
