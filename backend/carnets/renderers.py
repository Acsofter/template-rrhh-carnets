import json

from rest_framework.renderers import JSONRenderer


class UserJSONRenderer(JSONRenderer):
    """
    Renderizador personalizado para la respuesta JSON de usuarios.
    Extiende JSONRenderer de Django Rest Framework.
    """
    charset = 'utf-8'

    def render(self, data, media_type=None, renderer_context=None):
        """
        Renderiza los datos en formato JSON.

        Args:
            data: Los datos a renderizar.
            media_type: El tipo de medio de la respuesta (no utilizado en este método).
            renderer_context: El contexto del renderizador (no utilizado en este método).

        Returns:
            str: Una cadena JSON que representa los datos del usuario.
        """
        # Comprueba si hay errores en los datos
        errors = data.get("errores", None)

        # Comprueba si hay un token en los datos
        token = data.get('token', None)

        # Si hay errores, renderiza los datos tal cual
        if errors is not None:
            return super(UserJSONRenderer, self).render(data)

        # Si hay un token y es de tipo bytes, lo decodifica
        if token is not None and isinstance(token, bytes):
            data['token'] = token.decode('utf-8')

        # Envuelve los datos del usuario en una clave 'user'
        return json.dumps({
            'user': data
        })
