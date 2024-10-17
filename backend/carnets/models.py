import jwt
from django.db import models
from django.conf import settings
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager, PermissionsMixin)
from django.db import models
import time
from datetime import datetime, timedelta

class Departamento(models.Model):
    """Modelo para representar departamentos en la organización."""
    Id = models.AutoField(primary_key=True)
    Descripcion = models.CharField(max_length=150)

class Cargo(models.Model):
    """Modelo para representar cargos en la organización."""
    Id = models.AutoField(primary_key=True)
    Departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='cargos')
    Descripcion = models.CharField(max_length=150)

class Empleado(models.Model):
    """Modelo para representar empleados en la organización."""
    Id = models.AutoField(primary_key=True)
    Nombre = models.CharField(max_length=300)
    Apellido = models.CharField(max_length=300)
    NombreCompleto = models.CharField(max_length=300, null=True)
    Cedula = models.CharField(max_length=20)
    Cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name='empleados')
    Suspendido = models.BooleanField(default=False)
    RazonDeEliminacion = models.TextField(null=True)
    Fecha_creacion = models.DateTimeField(auto_now_add=True)

class Documento(models.Model):
    """Modelo para representar documentos asociados a empleados."""
    Id = models.AutoField(primary_key=True)
    Nombre = models.CharField(max_length=300)
    Tipo = models.CharField(max_length=100)
    Tamaño = models.FloatField()
    Empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='documentos')
    Fecha_creacion = models.DateTimeField(auto_now_add=True)

class HistoricoImpresion(models.Model):
    """Modelo para registrar el historial de impresiones de documentos."""
    Id = models.AutoField(primary_key=True)
    Empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='historico_impresiones')
    EstaImpreso = models.BooleanField(default=False)
    FueEntregado = models.BooleanField(default=False)
    Comentario = models.TextField(null=True)
    CargoAlMomentoDeImprimir = models.TextField(null=True)
    DepartamentoAlMomentoDeImprimir = models.TextField(null=True)
    Fecha_creacion = models.DateTimeField(auto_now_add=True)

class UserManager(BaseUserManager):
    """Gestor personalizado para el modelo de Usuario."""
   
    def create_user(self, username, email, password=None):
        """Crea y guarda un Usuario con el username, email y contraseña dados."""
        if username is None:
            raise TypeError('Los usuarios deben tener un nombre de usuario.')
        if email is None:
            raise TypeError('Los usuarios deben tener una dirección de correo electrónico.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password):
        """Crea y guarda un SuperUsuario con el username, email y contraseña dados."""
        if password is None:
            raise TypeError('Los superusuarios deben tener una contraseña.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user

class Usuario(AbstractBaseUser, PermissionsMixin):
    """Modelo personalizado de Usuario para la autenticación."""
    first_name  = models.CharField(max_length=50) 
    last_name   = models.CharField(max_length=50)
    username    = models.CharField(db_index=True, max_length=255, unique=True)
    email       = models.EmailField(db_index=True, unique=True)
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def token(self):
        """Genera un token JWT para el usuario."""
        return self._generate_jwt_token()

    def get_full_name(self):
        """Retorna el nombre completo del usuario."""
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else None
    
    def get_roles(self):
        """Retorna los roles del usuario."""
        if self.is_anonymous:
            return ["anonymous"]
        roles = []
        if self.is_staff:
            roles.append("staff")
        if self.is_superuser:
            roles.append("superuser")
        return roles

    def get_short_name(self):
        """Retorna el nombre corto del usuario."""
        return self.username

    def _generate_jwt_token(self):
        """Genera un token JWT que contiene el ID del usuario."""
        token = jwt.encode({
            'id': self.pk,
            'sub': int(f"{self.created_at.timestamp():.0f}"),
            'exp': int(str(time.mktime((datetime.now() + timedelta(hours=24)).timetuple()))[:-2]),
            'username': self.username,
            'email': self.email,
            'roles': self.get_roles(),
        }, settings.SECRET_KEY, algorithm='HS256')
        return token
