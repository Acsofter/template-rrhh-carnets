"""
Configuración de URLs para el proyecto RRHH.

La lista `urlpatterns` enruta las URLs a las vistas correspondientes. Para más información, consulta:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/

Ejemplos:
Vistas basadas en funciones
    1. Importa la vista: from mi_app import views
    2. Añade una URL a urlpatterns:  path('', views.home, name='home')
Vistas basadas en clases
    1. Importa la vista: from other_app.views import Home
    2. Añade una URL a urlpatterns:  path('', Home.as_view(), name='home')
Incluyendo otro URLconf
    1. Importa la función include: from django.urls import include, path
    2. Añade una URL a urlpatterns:  path('blog/', include('blog.urls'))
"""
# Importaciones necesarias de Django
from django.contrib import admin
from django.urls import path, include

# Lista de patrones de URL para el proyecto
urlpatterns = [
    # URL para el panel de administración de Django
    path('admin/', admin.site.urls),
    
    # URL para las APIs de la aplicación 'carnets'
    # Incluye todas las URLs definidas en carnets.urls
    path("api/v1/carnets/", include("carnets.urls"))
]
