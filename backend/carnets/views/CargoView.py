from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..serializers import CargoSerializer
from ..models import Cargo


class CargoListApiView(APIView):
    """
    Vista API para listar todos los cargos y crear uno nuevo.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CargoSerializer

    def get(self, request, *args, **kwargs):
        """
        Obtiene una lista de todos los cargos ordenados por descripción.
        """
        cargos = Cargo.objects.all().order_by("Descripcion")
        serializer = self.serializer_class(cargos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Crea un nuevo cargo.
        Verifica si ya existe un cargo con la misma descripción en el mismo departamento.
        """
        if request.data.get("Descripcion", False):
            if Cargo.objects.filter(Descripcion=request.data.get("Descripcion"), 
                                    Departamento=request.data.get("Departamento")).exists():
                return Response(
                    {"MESSAGE": "Ya existe un cargo con este nombre en este departamento"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CargoDetailApiView(APIView):
    """
    Vista API para recuperar, actualizar o eliminar un cargo específico.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CargoSerializer

    def get_object(self, cargoId):
        """
        Método auxiliar para obtener un objeto Cargo por su ID.
        """
        try:
            return Cargo.objects.get(Id=cargoId)
        except Cargo.DoesNotExist:
            return None

    def get(self, request, cargoId, *args, **kwargs):
        """
        Recupera los detalles de un cargo específico.
        """
        cargo = self.get_object(cargoId)
        if not cargo:
            return Response(
                {"MESSAGE": f"No se encontró ningún cargo con el ID {cargoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.serializer_class(cargo)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, cargoId, *args, **kwargs):
        """
        Actualiza los detalles de un cargo específico.
        """
        cargo = self.get_object(cargoId)
        if not cargo:
            return Response(
                {"MESSAGE": f"No se encontró ningún cargo con el ID {cargoId}"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.serializer_class(instance=cargo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, cargoId, *args, **kwargs):
        """
        Elimina un cargo específico.
        """
        cargo = self.get_object(cargoId)
        if not cargo:
            return Response(
                {"MESSAGE": "El cargo no existe"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        cargo.delete()
        return Response(
            {"MESSAGE": "Cargo eliminado correctamente"}, 
            status=status.HTTP_200_OK
        )


