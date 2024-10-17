import base64
import os
from django.contrib.auth import authenticate
from django.http import FileResponse, JsonResponse
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework import status
from .models import Cargo, Departamento, Documento, Empleado, HistoricoImpresion
from .models import Usuario
from django.conf import settings

class EmpleadoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Empleado."""
    cargo_descripcion = serializers.SerializerMethodField()
    dept_descripcion = serializers.SerializerMethodField()
    documentos = serializers.SerializerMethodField()
    entrega_pendiente = serializers.SerializerMethodField()
    impresion_pendiente = serializers.SerializerMethodField()

    class Meta:
        model = Empleado
        fields = ["Id", "Nombre", "Apellido", "NombreCompleto", "Cedula", "RazonDeEliminacion", "Suspendido",  "Cargo", "cargo_descripcion", "dept_descripcion", "entrega_pendiente", "impresion_pendiente", "documentos"]

    def get_impresion_pendiente(self, obj):
        """Obtiene las impresiones pendientes del empleado."""
        try:
            return [x.Id for x in HistoricoImpresion.objects.filter(Empleado=obj.Id, EstaImpreso=False)]
        except Exception as e:
            print("Error (get_impresion_pendiente): ", e)
            return []
    
    def get_entrega_pendiente(self, obj):
        """Obtiene las entregas pendientes del empleado."""
        try:
            return [x.Id for x in HistoricoImpresion.objects.filter(Empleado=obj.Id, FueEntregado=False)]
        except Exception as e:
            print("Error (get_entrega_pendiente): ", e)
            return []

    def get_cargo_descripcion(self, obj):
        """Obtiene la descripción del cargo del empleado."""
        try:
            return obj.Cargo.Descripcion
        except Exception as e:
            print("Error (get_cargo_descripcion): ", e)
            return []
    
    def get_dept_descripcion(self, obj):
        """Obtiene la descripción del departamento del empleado."""
        try:
            return obj.Cargo.Departamento.Descripcion
        except Exception as e:
            print("Error (get_dept_descripcion): ", e)
            return []
    
    def get_documentos(self, empleado):
        """Obtiene los documentos asociados al empleado."""
        try:
            docs_queryset = Documento.objects.filter(Empleado = empleado.Id)
            if docs_queryset.count > 0:
                docs_details = DocumentoSerializer(docs_queryset, many=True)
            return docs_details
        except Exception as e:
            print("Error (get_documentos): ", e)
            return []
        
    def create(self, validated_data):
        """Crea un nuevo empleado."""
        print("validated_data: ", validated_data)
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = "__all__"

class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = "__all__"

class DocumentoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Documento."""
    File = serializers.SerializerMethodField()

    class Meta:
        model = Documento
        fields = ["Id", "Nombre", "Tipo", "Tamaño", "Empleado", "File"]

    def get_File(self, document):
        """Obtiene el contenido del archivo del documento."""
        try:
            file_path = os.path.join(settings.DOCUMENTS_PATH, document.Nombre)
            with open(file_path, 'rb') as file:
                content = base64.b64encode(file.read()).decode("utf-8")
                return f"data:{document.Tipo};base64,{content}"
        except Exception as e:
            print(f"Error (get_File): ", e)
            return False

class HistoricoImpresionSerializer(serializers.ModelSerializer):
    desc_empleado = serializers.SerializerMethodField()
    class Meta:
        model = HistoricoImpresion
        fields = ["Id", "Empleado", "EstaImpreso", "FueEntregado", "Comentario", "Fecha_creacion", "DepartamentoAlMomentoDeImprimir", "CargoAlMomentoDeImprimir", "desc_empleado" ]

    
    def get_desc_empleado(self, request):
        _empleado = request.Empleado
        return {
            "Nombre": _empleado.Nombre,
            "Apellido": _empleado.Apellido,
            "Cedula": _empleado.Cedula,
            "Cargo": _empleado.Cargo.Descripcion,
            "NombreCompleto": _empleado.NombreCompleto,
            "Suspendido": _empleado.Suspendido
        }
    
    def update(self, instance, validated_data):
        instance.EstaImpreso = validated_data.get("EstaImpreso", instance.EstaImpreso)
        instance.FueEntregado = validated_data.get("FueEntregado", instance.FueEntregado)
        instance.Comentario = validated_data.get("Comentario", instance.Comentario)
        instance.save()
        return instance

        
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = Usuario 
        fields = ['email', 'username', 'password', 'token']

    def create(self, validated_data):
        return Usuario.objects.create_user(**validated_data)


class RegistrationSuperuserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = Usuario 
        fields = ['email', 'username', 'password', 'token']

    def create(self, validated_data):
        return Usuario.objects.create_superuser(**validated_data)


class LoginSerializer(serializers.Serializer):
    """Serializer para el proceso de login."""
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        """Valida las credenciales de login."""
        username = data.get("username")
        password = data.get("password")

        if not username:
            raise serializers.ValidationError("Se requiere el nombre de usuario")
        
        if not password:
            raise serializers.ValidationError("Se requiere la contraseña")
        
        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Credenciales incorrectas")

        if not user.is_active:
            raise serializers.ValidationError("Este usuario se encuentra suspendido")
        
        return {
            "username": user.username,
            "token": user.token,
        }

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )

    class Meta:
        model = Usuario
        fields = ('username', 'password', 'token', )

        read_only_fields = ('token',)

    def update(self, instance, validated_data):
        
        password = validated_data.get('password', None)
        
        for (key, value) in validated_data.items():
            setattr(instance, key, value)

        if password is not None:
            instance.set_password(password)
            

  
        instance.save()

        return instance
