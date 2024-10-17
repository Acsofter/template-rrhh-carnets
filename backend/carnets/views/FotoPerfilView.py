import base64
import os
from ..models import Empleado
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.conf import settings

def buscar_imagen(nombre_imagen):
    """
    Busca una imagen en el directorio de imágenes y la devuelve como una cadena base64.

    Args:
        nombre_imagen (str): Nombre de la imagen a buscar.

    Returns:
        str: Cadena base64 de la imagen encontrada, o cadena vacía si no se encuentra.
    """
    try:
        extensiones_imagenes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
        tipo_mime = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.tiff': 'image/tiff'
        }
               
        nombre_imagen_normalizado = nombre_imagen.lower()
        for archivo in os.listdir(settings.PICTURES_PATH):
            if any(archivo.lower().endswith(ext) for ext in extensiones_imagenes):
                if os.path.splitext(archivo.lower())[0] == os.path.splitext(nombre_imagen_normalizado)[0]:
                    ruta_completa = os.path.join(settings.PICTURES_PATH, archivo)
                    with open(ruta_completa, "rb") as imagen_file:
                        imagen_base64 = base64.b64encode(imagen_file.read()).decode('utf-8')
                        extension = os.path.splitext(archivo.lower())[1]
                        mime_type = tipo_mime.get(extension, 'application/octet-stream')
                        
                        url_data = f"data:{mime_type};base64,{imagen_base64}"

                        return url_data  
        
        return "" 
    except Exception as e:
        print(f"Error al buscar la imagen: {e}")
        return ""
    

class FotoApiView(APIView):
    """
    Vista API para obtener la foto de perfil de un empleado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Obtiene la foto de perfil de un empleado basado en su número de cédula.

        Args:
            request (Request): Objeto de solicitud HTTP.

        Returns:
            Response: Respuesta HTTP con la imagen en base64 o un mensaje de error.
        """
        cedula = request.GET.get("cedula")

        if not cedula:
            return Response({"MESSAGE": "Especifique una cédula"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            persona = Empleado.objects.get(Cedula=cedula)

            if not persona:
                return Response({"MESSAGE": f"No existe ningún empleado con la cédula {cedula}."}, status=status.HTTP_404_NOT_FOUND)
            
            imagen_bs4 = buscar_imagen(cedula)
            return Response({
                "image": imagen_bs4
            }, status=status.HTTP_200_OK)

        except Empleado.DoesNotExist:
            return Response({"MESSAGE": f"No existe ningún empleado con la cédula {cedula}."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"MESSAGE": "Error al procesar la solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
