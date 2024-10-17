import sys
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from ..models import Empleado
from io import BytesIO, StringIO
from django.http import HttpResponse
from django.template.loader import get_template
from django import template
from rest_framework import status
from xhtml2pdf import pisa
from django.conf import settings

class GenerateCarnetApiView(APIView):
    """
    Vista API para generar el carnet de un empleado en formato PDF.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, empleadoId):
        """
        Obtiene un objeto Empleado por su ID.

        Args:
            empleadoId (int): ID del empleado.

        Returns:
            Empleado: Objeto Empleado si existe, None en caso contrario.
        """
        try:
            return Empleado.objects.get(Id=empleadoId)
        except Empleado.DoesNotExist:
            return None

    def get(self, request, empleadoId, *args, **kwargs):
        """
        Genera y devuelve el carnet del empleado en formato PDF.

        Args:
            request (Request): Objeto de solicitud HTTP.
            empleadoId (int): ID del empleado.

        Returns:
            HttpResponse: Respuesta HTTP con el PDF del carnet o un mensaje de error.
        """
        empleado = self.get_object(empleadoId)
        if empleado is None:
            return Response({"MESSAGE": f"No existe ningún empleado con el ID {empleadoId}"}, status=status.HTTP_404_NOT_FOUND)
        if not empleado.FotoPerfil:
            return Response({"MESSAGE": f"El empleado con ID {empleadoId} no tiene foto de perfil"}, status=status.HTTP_404_NOT_FOUND)
        
        nombreCompleto = f"{empleado.Nombre} {empleado.Apellido}".upper()
        cargoDesc = empleado.Cargo.Descripcion.upper()
        deptDesc = empleado.Cargo.Departamento.Descripcion.upper()
        
        try:
            with open(f"{settings.TEMPLATES_PATH}/index.html", "r") as file:
                html_text = file.read().replace("{logo}", f"{settings.TEMPLATES_PATH}/logo.png")\
                                       .replace("{perfil}", f"{settings.DOCUMENTS_PATH}/{empleado.FotoPerfil}")\
                                       .replace("{nombre}", nombreCompleto)\
                                       .replace("{firma}", f"{settings.TEMPLATES_PATH}/firma_carnet.png")\
                                       .replace("{cargo}", cargoDesc)\
                                       .replace("{departamento}", deptDesc)
                
                html_temp = template.Template(html_text).source
                result = BytesIO()
                pdf = pisa.pisaDocument(StringIO(html_temp), result)
                if pdf.err:
                    return HttpResponse("Error al generar el PDF", status=400, content_type='text/plain')
                return HttpResponse(result.getvalue(), content_type='application/pdf')
        except Exception as e:
            return Response({"MESSAGE": "Error al generar el carnet"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
