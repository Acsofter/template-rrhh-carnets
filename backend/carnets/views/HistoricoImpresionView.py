from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from ..serializers import HistoricoImpresionSerializer
from ..models import HistoricoImpresion, Empleado
from ..pagination import Pagination 


class HistoricoImpresionListApiView(APIView):
    """
    Vista API para listar y crear registros de histórico de impresión.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_groups(self, params):
        """
        Filtra empleados basados en los parámetros de búsqueda.

        Args:
            params (str): Parámetros de búsqueda.

        Returns:
            QuerySet: Conjunto de objetos HistoricoImpresion filtrados.
        """
        empleados = Empleado.objects.filter(Nombre__contains=params) | \
                    Empleado.objects.filter(Apellido__contains=params) | \
                    Empleado.objects.filter(Cedula__contains=params)
        result = set(emp.Id for emp in empleados)
        return HistoricoImpresion.objects.filter(Empleado__in=result)

    def get(self, request, *args, **kwargs):
        """
        Obtiene una lista paginada de registros de histórico de impresión.

        Args:
            request (Request): Objeto de solicitud HTTP.

        Returns:
            Response: Respuesta paginada con los registros de histórico de impresión.
        """
        paginator = Pagination()
        search = request.GET.get("search", False)
        order = request.GET.get("order", "-Fecha_creacion")
        
        fechaInicio = request.GET.get("fechaInicio", "")
        fechaFinal  = request.GET.get("fechaFinal", "")
       
        if search and search != "":
            historico_impresiones = self.get_groups(search)
        else:
            historico_impresiones = HistoricoImpresion.objects.all()
        
        try:
            if fechaInicio or fechaFinal:
                historico_impresiones = historico_impresiones.filter(Fecha_creacion__range=(fechaInicio, fechaFinal))
        except Exception as e:
            print(f"Error al filtrar por fecha: {e}")
        
        if order:
            try:
                historico_impresiones = historico_impresiones.order_by(order)
            except Exception as e:
                print(f"Error al ordenar: {e}")
        
        page = paginator.paginate_queryset(historico_impresiones, request)

        serializer = HistoricoImpresionSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        """
        Crea un nuevo registro de histórico de impresión.

        Args:
            request (Request): Objeto de solicitud HTTP con los datos del nuevo registro.

        Returns:
            Response: Respuesta con los datos del nuevo registro creado o errores de validación.
        """
        empleado = None
        if request.data.get("Empleado", False):
            try:
                empleado = Empleado.objects.filter(Id=request.data.get("Empleado")).first()
                if not empleado:
                    return Response({"MESSAGE": f"No existe ningún empleado con el ID {request.data.get('Empleado')}"}, 
                                    status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({"MESSAGE": "El empleado no existe"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'Empleado': empleado.Id,
            'EstaImpreso': request.data.get('EstaImpreso'),
            'FueEntregado': request.data.get('FueEntregado'),
            'Comentario': request.data.get('Comentario'),
            'CargoAlMomentoDeImprimir': request.data.get('CargoAlMomentoDeImprimir'),
            'DepartamentoAlMomentoDeImprimir': request.data.get('DepartamentoAlMomentoDeImprimir')
        }

        serializer = HistoricoImpresionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HistoricoImpresionDetailApiView(APIView):
    """
    Vista API para recuperar, actualizar y eliminar registros específicos de histórico de impresión.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, historicoImpresionId):
        """
        Obtiene un objeto HistoricoImpresion por su ID.

        Args:
            historicoImpresionId (int): ID del registro de histórico de impresión.

        Returns:
            HistoricoImpresion: Objeto HistoricoImpresion si existe, None en caso contrario.
        """
        try:
            return HistoricoImpresion.objects.get(Id=historicoImpresionId)
        except HistoricoImpresion.DoesNotExist:
            return None

    def get(self, request, historicoImpresionId, *args, **kwargs):
        """
        Recupera un registro específico de histórico de impresión.

        Args:
            request (Request): Objeto de solicitud HTTP.
            historicoImpresionId (int): ID del registro de histórico de impresión.

        Returns:
            Response: Respuesta con los datos del registro o un mensaje de error.
        """
        historico_impresion = self.get_object(historicoImpresionId)
        if not historico_impresion:
            return Response({"MESSAGE": f"No existe ningún histórico de impresión con el ID {historicoImpresionId}"}, 
                            status=status.HTTP_404_NOT_FOUND)
        serializer = HistoricoImpresionSerializer(historico_impresion)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, historicoImpresionId, *args, **kwargs):
        """
        Actualiza un registro específico de histórico de impresión.

        Args:
            request (Request): Objeto de solicitud HTTP con los datos a actualizar.
            historicoImpresionId (int): ID del registro de histórico de impresión.

        Returns:
            Response: Respuesta con los datos actualizados o un mensaje de error.
        """
        historico_impresion = self.get_object(historicoImpresionId)
        if not historico_impresion:
            return Response({"MESSAGE": f"No existe ningún histórico de impresión con el ID {historicoImpresionId}"}, 
                            status=status.HTTP_404_NOT_FOUND)
        empleado = None
        if request.data.get("Empleado", False):
            try:
                empleado = Empleado.objects.filter(Id=request.data.get("Empleado")).first()
                if not empleado:
                    return Response({"MESSAGE": f"No existe ningún empleado con el ID {request.data.get('Empleado')}"}, 
                                    status=status.HTTP_400_BAD_REQUEST)
            except Exception:
                return Response({"MESSAGE": "El empleado no existe"}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'EstaImpreso': request.data.get('EstaImpreso', historico_impresion.EstaImpreso),
            'FueEntregado': request.data.get('FueEntregado', historico_impresion.FueEntregado),
            'Comentario': request.data.get('Comentario', historico_impresion.Comentario)
        }

        serializer = HistoricoImpresionSerializer(instance=historico_impresion, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, historicoImpresionId, *args, **kwargs):
        """
        Elimina un registro específico de histórico de impresión.

        Args:
            request (Request): Objeto de solicitud HTTP.
            historicoImpresionId (int): ID del registro de histórico de impresión.

        Returns:
            Response: Respuesta indicando el éxito de la operación o un mensaje de error.
        """
        historico_impresion = self.get_object(historicoImpresionId)
        if not historico_impresion:
            return Response({"MESSAGE": "El registro de histórico de impresión no existe"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        historico_impresion.delete()
        return Response({"MESSAGE": "Registro de histórico de impresión eliminado correctamente"}, 
                        status=status.HTTP_200_OK)
