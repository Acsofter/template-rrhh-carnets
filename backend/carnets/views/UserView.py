from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework  import permissions 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView

from ..renderers import UserJSONRenderer
from ..serializers import UserSerializer
from ..models import Usuario

from ..serializers import RegistrationSerializer, LoginSerializer, UserSerializer, RegistrationSuperuserSerializer

class RegistrationAPIView(APIView):
    """
    Vista API para el registro de usuarios regulares.
    """
    permission_classes = (permissions.IsAdminUser,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        """
        Crea un nuevo usuario regular.

        Args:
            request (Request): Objeto de solicitud HTTP con los datos del nuevo usuario.

        Returns:
            Response: Respuesta con los datos del usuario creado o errores de validación.
        """
        user = dict(request.data)
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RegistrationSuperuserAPIView(APIView):
    """
    Vista API para el registro de superusuarios.
    """
    permission_classes = (permissions.IsAdminUser,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = RegistrationSuperuserSerializer

    def post(self, request):
        """
        Crea un nuevo superusuario.

        Args:
            request (Request): Objeto de solicitud HTTP con los datos del nuevo superusuario.

        Returns:
            Response: Respuesta con los datos del superusuario creado o errores de validación.
        """
        user = dict(request.data)
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    """
    Vista API para el inicio de sesión de usuarios.
    """
    permission_classes = (permissions.AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def post(self, request):
        """
        Autentica a un usuario y devuelve un token de acceso.

        Args:
            request (Request): Objeto de solicitud HTTP con las credenciales del usuario.

        Returns:
            Response: Respuesta con el token de acceso o errores de autenticación.
        """
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Vista API para recuperar y actualizar la información del usuario autenticado.
    """
    permission_classes = (permissions.IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Recupera la información del usuario autenticado.

        Args:
            request (Request): Objeto de solicitud HTTP.

        Returns:
            Response: Respuesta con los datos del usuario autenticado.
        """
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        """
        Actualiza la información del usuario autenticado.

        Args:
            request (Request): Objeto de solicitud HTTP con los datos a actualizar.

        Returns:
            Response: Respuesta con los datos actualizados del usuario o errores de validación.
        """
        try:
            if not request.user.check_password(request.data.get('currentPassword', "")):
                return Response({"message": "Contraseña incorrecta."}, status.HTTP_400_BAD_REQUEST)
           
            serializer = self.serializer_class(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as exception:
            return Response({"message": "Error al actualizar el usuario."}, status=status.HTTP_400_BAD_REQUEST)
