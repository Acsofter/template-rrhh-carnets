# Importamos el manejador de excepciones predeterminado de Django Rest Framework
from rest_framework.views import exception_handler

def core_exception_handler(exc, context):
    """
    Manejador de excepciones personalizado para la aplicación.
    
    Este manejador extiende el comportamiento del manejador de excepciones
    predeterminado de Django Rest Framework.

    Args:
        exc: La excepción que se ha producido.
        context: El contexto de la solicitud.

    Returns:
        Una respuesta HTTP con los detalles de la excepción.
    """
    # Llamamos al manejador de excepciones predeterminado primero
    response = exception_handler(exc, context)

    # Definimos los manejadores para tipos específicos de excepciones
    handlers = {
        'ValidationError': _handle_generic_error
        # Puedes añadir más manejadores para otros tipos de excepciones aquí
    }
   
    # Obtenemos el nombre de la clase de la excepción
    exception_class = exc.__class__.__name__

    if exception_class in handlers:
        # Si tenemos un manejador específico para esta excepción, lo usamos
        return handlers[exception_class](exc, context, response)

    # Si no hay un manejador específico, devolvemos la respuesta predeterminada
    return response

def _handle_generic_error(exc, context, response):
    """
    Manejador para errores genéricos de validación.

    Este manejador modifica la estructura de la respuesta para los errores
    de validación, colocando todos los errores bajo una clave 'errores'.

    Args:
        exc: La excepción que se ha producido.
        context: El contexto de la solicitud.
        response: La respuesta generada por el manejador predeterminado.

    Returns:
        La respuesta modificada con la nueva estructura de errores.
    """
    # Modificamos la estructura de la respuesta
    response.data = {
        'errores': response.data
    }

    return response
