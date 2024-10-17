from collections import OrderedDict
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class Pagination(LimitOffsetPagination):
    """
    Clase personalizada para la paginación de resultados en la API.
    Extiende LimitOffsetPagination de Django Rest Framework.
    """
    # Número predeterminado de elementos por página
    default_limit = 10
    
    # Parámetro de consulta para especificar el número de página
    page_query_param = 'page'
    
    # Parámetro de consulta para especificar el número de elementos por página
    page_size_query_param = 'count'
    
    def get_paginated_response(self, data):
        """
        Método para generar la respuesta paginada.
        
        Args:
            data: Los datos a paginar.
        
        Returns:
            Response: Un objeto Response con los datos paginados y metadatos.
        """
        # Imprime información de depuración (considerar eliminar en producción)
        print("self.offset ", self.offset, "self.limit ", self.limit)
        
        return Response(OrderedDict([
            ('count', self.count),  # Número total de elementos
            ('next', self.get_next_link()),  # Enlace a la siguiente página
            ('previous', self.get_previous_link()),  # Enlace a la página anterior
            ('current', (self.offset // self.limit)),  # Página actual (basada en 0)
            ('results', data),  # Los datos paginados
        ]))

    # Método alternativo comentado (puede ser útil para futura referencia)
    # def get_paginated_response(self, data):
    #     return Response({
    #         'links': {
    #             'next': self.get_next_link(),
    #             'previous': self.get_previous_link()
    #         },
    #         # 'total': ,
    #         'page': int(data.GET.get('page', 1)), 
    #         'page_size': int(data.GET.get('page_size', self.page_size)),
    #         'results': data
    #     })
