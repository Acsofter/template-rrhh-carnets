import base64
import os
import uuid
from ..models import Empleado, Cargo, Documento
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..serializers import DocumentoSerializer, EmpleadoSerializer
from ..pagination import Pagination 
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404

from django.conf import settings


class ListApiView(APIView):
    """
    Vista API para listar todos los empleados y crear uno nuevo.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_groups(self, params):
        """
        Método auxiliar para filtrar empleados por nombre completo o cédula.
        """
        return Empleado.objects.filter(NombreCompleto__contains=params) | Empleado.objects.filter(Cedula__contains=params)
    
    def get(self, request, *args, **kwargs):
        """
        Obtiene una lista paginada de empleados, con opción de búsqueda y ordenamiento.
        """
        try:
            paginator = Pagination()
            search = request.GET.get("search", False)
            order = request.GET.get("order", "-Fecha_creacion")

            if search:
                empleados = self.get_groups(search)
            else:
                empleados = Empleado.objects.all()  

            page = paginator.paginate_queryset(empleados.order_by("Suspendido", order), request)
                
            serializer = EmpleadoSerializer(page, many=True, context={"all": True})

            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"MESSAGE": "Error al obtener la lista de empleados"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Crea un nuevo empleado.
        """
        try:
            cedula = request.data.get("Cedula", None)
            empleado_found = Empleado.objects.filter(Cedula=cedula).first()
            if empleado_found:
                return Response({"MESSAGE": "Ya existe un empleado con este número de cédula"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = EmpleadoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"MESSAGE": "Error al crear el empleado"}, status=status.HTTP_400_BAD_REQUEST)


class DetailApiView(APIView):
    """
    Vista API para recuperar, actualizar o eliminar un empleado específico.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, personaId):
        """
        Método auxiliar para obtener un objeto Empleado por su ID.
        """
        return get_object_or_404(Empleado, Id=personaId)

    def get(self, request, personaId, *args, **kwargs):
        """
        Recupera los detalles de un empleado específico.
        """
        empleado = self.get_object(personaId)
        serializer = EmpleadoSerializer(empleado)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, personaId, *args, **kwargs):
        """
        Actualiza los detalles de un empleado específico.
        """
        empleado = self.get_object(personaId)
        cargo = None
        
        cedula = request.data.get("Cedula", False)

        if cedula:
            cedula_exist = Empleado.objects.filter(Cedula=cedula).exclude(Id=empleado.Id).first()
            if cedula_exist:
                return Response({"MESSAGE": "La cédula ya está en uso por otro empleado"}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get("Cargo", False):
            cargo = get_object_or_404(Cargo, Id=request.data.get("Cargo"))

        nombres = request.data.get("Nombre", empleado.Nombre)
        apellidos = request.data.get("Apellido", empleado.Apellido)

        data = {
            "Id": empleado.Id,  
            "Nombre": nombres,
            "Apellido": apellidos,
            "NombreCompleto": f"{nombres} {apellidos}",
            "Cedula": request.data.get("Cedula", empleado.Cedula),
            "Cargo": cargo.Id if cargo else empleado.Cargo.Id,
            "Suspendido": request.data.get("Suspendido", empleado.Suspendido),
            "RazonDeEliminacion": request.data.get("RazonDeEliminacion", empleado.RazonDeEliminacion)
        }
            
        serializer = EmpleadoSerializer(instance=empleado, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, personaId, *args, **kwargs):
        """
        Elimina (suspende) un empleado específico.
        """
        empleado = self.get_object(personaId)
        empleado.delete()        
        return Response({"MESSAGE": "Empleado suspendido"}, status=status.HTTP_200_OK)
