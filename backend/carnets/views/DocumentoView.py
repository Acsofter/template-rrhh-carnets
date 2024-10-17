import os
import base64
import sys
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from django.core.files.base import ContentFile
from ..serializers import DocumentoSerializer
from ..models import Documento, Empleado

from django.conf import settings

class DocumentoListApiView(APIView):
    """
    Vista API para listar todos los documentos y crear uno nuevo.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Obtiene una lista de todos los documentos.
        """
        documentos = Documento.objects.all()
        serializer = DocumentoSerializer(documentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def save_file(self, raw_content: ContentFile, filename):
        """
        Guarda el archivo en el sistema de archivos.
        """
        file_path = os.path.join(settings.DOCUMENTS_PATH, filename)
        with open(file_path, 'wb') as file:
            file.write(raw_content.read())

    def post(self, request, *args, **kwargs):
        """
        Crea un nuevo documento.
        """
        empleado = None
        try:
            empleado = Empleado.objects.filter(Id=request.data.get("Empleado")).first()
        except Exception as e:
            return Response({"MESSAGE": "El empleado no existe"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            _file = request.data.get('file')
            decoded_file = base64.b64decode(_file)
            name = request.data.get('Nombre').split(".")[0]
            ext = request.data.get('Nombre').split(".")[-1]
            filename = f"{name}+uid+{uuid.uuid1()}.{ext}"
            _file = ContentFile(decoded_file, filename)
            self.save_file(_file, filename)
        except Exception as e:
            return Response({"MESSAGE": "Error al subir archivos"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'Nombre': filename,
            'Tipo': request.data.get('Tipo'),
            'Tamaño': request.data.get('Tamaño'),
            'Empleado': empleado.Id,
        }

        serializer = DocumentoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DocumentoDetailApiView(APIView):
    """
    Vista API para recuperar, actualizar o eliminar un documento específico.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, documentoId):
        """
        Método auxiliar para obtener un objeto Documento por su ID.
        """
        try:
            return Documento.objects.get(Id=documentoId)
        except Documento.DoesNotExist:
            return None

    def get(self, request, documentoId, *args, **kwargs):
        """
        Recupera los detalles de un documento específico.
        """
        documento = self.get_object(documentoId)
        if not documento:
            return Response(
                {"MESSAGE": f"No se encontró ningún documento con el ID {documentoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DocumentoSerializer(documento)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, documentoId, *args, **kwargs):
        """
        Actualiza los detalles de un documento específico.
        """
        documento = self.get_object(documentoId)
        if not documento:
            return Response(
                {"MESSAGE": f"No se encontró ningún documento con el ID {documentoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        empleado = None
        if request.data.get("Empleado", False):
            try:
                empleado = Empleado.objects.filter(Id=request.data.get("Empleado")).first()
                if not empleado:
                    return Response(
                        {"MESSAGE": f"No se encontró ningún empleado con el ID {request.data.get('Empleado')}"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Exception:
                return Response({"MESSAGE": "El empleado no existe"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'Nombre': request.data.get('Nombre', documento.Nombre),
            'Tipo': request.data.get('Tipo', documento.Tipo),
            'Tamaño': request.data.get('Tamaño', documento.Tamaño),
            'Empleado': empleado.Id if empleado else documento.EmpleadoEmpleado.Id,
        }

        serializer = DocumentoSerializer(instance=documento, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, documentoId, *args, **kwargs):
        """
        Elimina un documento específico.
        """
        documento = self.get_object(documentoId)
        if not documento:
            return Response({"MESSAGE": "El documento no existe"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            os.remove(os.path.join(settings.DOCUMENTS_PATH, documento.Nombre)) 
            documento.delete()
            return Response({"MESSAGE": "Documento eliminado correctamente"}, status=status.HTTP_200_OK)
        except FileNotFoundError:
            documento.delete()
            return Response({"MESSAGE": "Documento eliminado de la base de datos"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"MESSAGE": "Ocurrió un problema al intentar eliminar el archivo"}, status=status.HTTP_400_BAD_REQUEST)
