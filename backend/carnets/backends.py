# Importamos las bibliotecas y módulos necesarios
import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import Usuario

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Clase personalizada para autenticación JWT (JSON Web Token).
    Extiende la clase BaseAuthentication de Django Rest Framework.
    """
    authentication_header_prefix = 'Bearer'

    def authenticate(self, request):
        """
        Método para autenticar la solicitud.
        """
        # Inicializamos el usuario de la solicitud como None
        request.user = None

        # Obtenemos el encabezado de autorización
        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()

        # Verificamos si el encabezado de autorización está presente y tiene el formato correcto
        if not auth_header:
            return None

        if len(auth_header) == 1:
            # Encabezado inválido: solo contiene el prefijo
            return None
        elif len(auth_header) > 2:
            # Encabezado inválido: contiene más de dos partes
            return None

        # Decodificamos el prefijo y el token
        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != auth_header_prefix:
            # El prefijo no coincide con el esperado
            return None

        # Autenticamos las credenciales
        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        """
        Método para autenticar las credenciales del token.
        """
        try:
            # Decodificamos el token JWT
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except Exception:
            # Si hay un error al decodificar, la sesión ha expirado
            msg = 'Sesión Expirada'
            raise exceptions.AuthenticationFailed(msg, code=403)

        try:
            # Intentamos obtener el usuario asociado al token
            user = Usuario.objects.get(pk=payload['id'])
        except Usuario.DoesNotExist:
            # Si el usuario no existe, el token es inválido
            msg = 'Usuario no encontrado'
            raise exceptions.AuthenticationFailed(msg, code=401)

        if not user.is_active:
            # Si el usuario está desactivado, no permitimos la autenticación
            msg = 'Usuario desactivado'
            raise exceptions.AuthenticationFailed(msg, code=401)

        # Retornamos el usuario autenticado y el token
        return (user, token)
