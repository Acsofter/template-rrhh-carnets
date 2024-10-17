from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..serializers import DepartamentoSerializer
from ..models import Departamento

class DepartamentoListApiView(APIView):
    """
    Vista API para listar todos los departamentos y crear uno nuevo.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Obtiene una lista de todos los departamentos ordenados por descripción.
        """
        departamentos = Departamento.objects.all().order_by("Descripcion")
        serializer = DepartamentoSerializer(departamentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Crea un nuevo departamento.
        Verifica si ya existe un departamento con el mismo nombre.
        """
        if request.data.get("Descripcion", False):
            if Departamento.objects.filter(Descripcion=request.data.get("Descripcion")).exists():
                return Response(
                    {"MESSAGE": "Ya existe un departamento con este nombre"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = DepartamentoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DepartamentoDetailApiView(APIView):
    """
    Vista API para recuperar, actualizar o eliminar un departamento específico.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, departamentoId):
        """
        Método auxiliar para obtener un objeto Departamento por su ID.
        """
        try:
            return Departamento.objects.get(Id=departamentoId)
        except Departamento.DoesNotExist:
            return None

    def get(self, request, departamentoId, *args, **kwargs):
        """
        Recupera los detalles de un departamento específico.
        """
        departamento = self.get_object(departamentoId)
        if not departamento:
            return Response(
                {"MESSAGE": f"No se encontró ningún departamento con el ID {departamentoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = DepartamentoSerializer(departamento)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, departamentoId, *args, **kwargs):
        """
        Actualiza los detalles de un departamento específico.
        """
        departamento = self.get_object(departamentoId)
        if not departamento:
            return Response(
                {"MESSAGE": f"No se encontró ningún departamento con el ID {departamentoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DepartamentoSerializer(instance=departamento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, departamentoId, *args, **kwargs):
        """
        Elimina un departamento específico.
        """
        departamento = self.get_object(departamentoId)
        if not departamento:
            return Response(
                {"MESSAGE": "El departamento no existe"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        departamento.delete()
        return Response(
            {"MESSAGE": "Departamento eliminado correctamente"}, 
            status=status.HTTP_200_OK
        )
