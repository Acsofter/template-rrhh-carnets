# Importaciones necesarias de Django y DRF
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Importaciones de las vistas de la aplicación
from .views.CargoView import CargoDetailApiView, CargoListApiView
from .views.DepartamentoView import DepartamentoDetailApiView, DepartamentoListApiView
from .views.DocumentoView import DocumentoDetailApiView, DocumentoListApiView
from .views.HistoricoImpresionView import HistoricoImpresionDetailApiView, HistoricoImpresionListApiView
from .views.FotoPerfilView import FotoApiView
from .views import UserView
from .views import EmpleadosView
from .views.GenerateCarnetView import GenerateCarnetApiView

# Configuración de Swagger para la documentación de la API
schema_view = get_schema_view(
    openapi.Info(
        title="API de Gestión de Carnets",
        default_version='v1',
    ),
    public=True,
    permission_classes=(permissions.IsAuthenticatedOrReadOnly,),
)

# Definición de las URLs de la aplicación
urlpatterns = [
    # URLs para la gestión de empleados
    path('empleados', EmpleadosView.ListApiView.as_view(), name="empleados"),
    path('empleado/<int:personaId>', EmpleadosView.DetailApiView.as_view(), name="empleado")
]

# URLs para la gestión de fotos de perfil
urlpatterns += [
    path('foto', FotoApiView.as_view(), name="foto_perfil")
]

# URLs para la gestión de departamentos
urlpatterns += [
    path('departamentos', DepartamentoListApiView.as_view(), name="departamentos"),
    path('departamento/<int:departamentoId>', DepartamentoDetailApiView.as_view(), name="departamento"),
]

# URLs para la gestión de cargos
urlpatterns += [
    path('cargos', CargoListApiView.as_view(), name="cargos"),
    path('cargo/<int:cargoId>', CargoDetailApiView.as_view(), name="cargo"),
]

# URLs para la gestión de documentos
urlpatterns += [
    path('documentos', DocumentoListApiView.as_view(), name="documentos"),
    path('documento/<int:documentoId>', DocumentoDetailApiView.as_view(), name="documento"),
]

# URLs para la gestión del histórico de impresiones
urlpatterns += [
    path('historico_impresiones', HistoricoImpresionListApiView.as_view(), name="historico_impresiones"),
    path('historico_impresion/<int:historicoImpresionId>', HistoricoImpresionDetailApiView.as_view(), name="historico_impresion"),
]

# URL para generar carnets
urlpatterns += [
    path('view/<int:empleadoId>', GenerateCarnetApiView.as_view(), name="generar_impresiones")
]

# URL para la documentación Swagger
urlpatterns += [
    path('docs', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# URLs para la autenticación de usuarios
urlpatterns += [
    path('register', UserView.RegistrationAPIView.as_view(), name="register"),
    path('register/superuser', UserView.RegistrationSuperuserAPIView.as_view(), name="register_superuser"),
    path('login', UserView.LoginAPIView.as_view(), name="login"),
    path('user', UserView.UserRetrieveUpdateAPIView.as_view(), name="user")
]

# Configuración para servir archivos estáticos en modo DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
