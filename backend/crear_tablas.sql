use RRHH_Carnets;
BEGIN TRANSACTION
--
-- Crear la tabla auth_group
CREATE TABLE [auth_group] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [name] nvarchar(150) NOT NULL UNIQUE
);

-- Crear la tabla auth_permission
CREATE TABLE [auth_permission] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [name] nvarchar(255) NOT NULL,
    [content_type_id] int NOT NULL,
    [codename] nvarchar(100) NOT NULL UNIQUE
);

-- Create model Departamento
--
CREATE TABLE [carnets_departamento] ([Id] int NOT NULL PRIMARY KEY IDENTITY (1, 1), [Descripcion] nvarchar(150) NOT NULL);
--
-- Create model Usuario
--
CREATE TABLE [carnets_usuario] ([id] bigint NOT NULL PRIMARY KEY IDENTITY (1, 1), [password] nvarchar(128) NOT NULL, [last_login] datetimeoffset NULL, [is_superuser] bit NOT NULL, [first_name] nvarchar(50) NOT NULL, [last_name] nvarchar(50) NOT NULL, [username] nvarchar(255) NOT NULL UNIQUE, [email] nvarchar(254) NOT NULL UNIQUE, [is_active] bit NOT NULL, [is_staff] bit NOT NULL, [created_at] datetimeoffset NOT NULL, [updated_at] datetimeoffset NOT NULL);
CREATE TABLE [carnets_usuario_groups] ([id] bigint NOT NULL PRIMARY KEY IDENTITY (1, 1), [usuario_id] bigint NOT NULL, [group_id] int NOT NULL);
CREATE TABLE [carnets_usuario_user_permissions] ([id] bigint NOT NULL PRIMARY KEY IDENTITY (1, 1), [usuario_id] bigint NOT NULL, [permission_id] int NOT NULL);
--
-- Create model Cargo
--
CREATE TABLE [carnets_cargo] ([Id] int NOT NULL PRIMARY KEY IDENTITY (1, 1), [Descripcion] nvarchar(150) NOT NULL, [Departamento_id] int NOT NULL);
--
-- Create model Empleado
--
CREATE TABLE [carnets_empleado] ([Id] int NOT NULL PRIMARY KEY IDENTITY (1, 1), [Nombre] nvarchar(300) NOT NULL, [Apellido] nvarchar(300) NOT NULL, [NombreCompleto] nvarchar(300) NULL, [Cedula] nvarchar(20) NOT NULL, [Suspendido] bit NOT NULL, [RazonDeEliminacion] nvarchar(max) NULL, [Fecha_creacion] datetimeoffset NOT NULL, [Cargo_id] int NOT NULL);
--
-- Create model Documento
--
CREATE TABLE [carnets_documento] ([Id] int NOT NULL PRIMARY KEY IDENTITY (1, 1), [Nombre] nvarchar(300) NOT NULL, [Tipo] nvarchar(100) NOT NULL, [Tama±o] double precision NOT NULL, [Fecha_creacion] datetimeoffset NOT NULL, [Empleado_id] int NOT NULL);
--
-- Create model HistoricoImpresion
--
CREATE TABLE [carnets_historicoimpresion] ([Id] int NOT NULL PRIMARY KEY IDENTITY (1, 1), [EstaImpreso] bit NOT NULL, [FueEntregado] bit NOT NULL, [Comentario] nvarchar(max) NULL, [CargoAlMomentoDeImprimir] nvarchar(max) NULL, [DepartamentoAlMomentoDeImprimir] nvarchar(max) NULL, [Fecha_creacion] datetimeoffset NOT NULL, [Empleado_id] int NOT NULL);
ALTER TABLE [carnets_usuario_user_permissions] ADD CONSTRAINT [carnets_usuario_user_permissions_usuario_id_53377945_fk_carnets_usuario_id] FOREIGN KEY ([usuario_id]) REFERENCES [carnets_usuario] ([id]);
CREATE INDEX [carnets_historicoimpresion_Empleado_id_e8319874] ON [carnets_historicoimpresion] ([Empleado_id]);
CREATE INDEX [carnets_usuario_user_permissions_usuario_id_53377945] ON [carnets_usuario_user_permissions] ([usuario_id]);
CREATE INDEX [carnets_usuario_groups_group_id_21f8f2ca] ON [carnets_usuario_groups] ([group_id]);
CREATE UNIQUE INDEX [carnets_usuario_user_permissions_usuario_id_permission_id_29acad74_uniq] ON [carnets_usuario_user_permissions] ([usuario_id], [permission_id]) WHERE [usuario_id] IS NOT NULL AND [permission_id] IS NOT NULL;
CREATE UNIQUE INDEX [carnets_usuario_groups_usuario_id_group_id_6a86a1ae_uniq] ON [carnets_usuario_groups] ([usuario_id], [group_id]) WHERE [usuario_id] IS NOT NULL AND [group_id] IS NOT NULL;
CREATE INDEX [carnets_documento_Empleado_id_7aa1ab5e] ON [carnets_documento] ([Empleado_id]);
ALTER TABLE [carnets_usuario_groups] ADD CONSTRAINT [carnets_usuario_groups_group_id_21f8f2ca_fk_auth_group_id] FOREIGN KEY ([group_id]) REFERENCES [auth_group] ([id]);
CREATE INDEX [carnets_cargo_Departamento_id_c69cdad3] ON [carnets_cargo] ([Departamento_id]);
ALTER TABLE [carnets_usuario_groups] ADD CONSTRAINT [carnets_usuario_groups_usuario_id_1c10a150_fk_carnets_usuario_id] FOREIGN KEY ([usuario_id]) REFERENCES [carnets_usuario] ([id]);
ALTER TABLE [carnets_empleado] ADD CONSTRAINT [carnets_empleado_Cargo_id_e49b9fc9_fk_carnets_cargo_Id] FOREIGN KEY ([Cargo_id]) REFERENCES [carnets_cargo] ([Id]);
ALTER TABLE [carnets_documento] ADD CONSTRAINT [carnets_documento_Empleado_id_7aa1ab5e_fk_carnets_empleado_Id] FOREIGN KEY ([Empleado_id]) REFERENCES [carnets_empleado] ([Id]);
ALTER TABLE [carnets_cargo] ADD CONSTRAINT [carnets_cargo_Departamento_id_c69cdad3_fk_carnets_departamento_Id] FOREIGN KEY ([Departamento_id]) REFERENCES [carnets_departamento] ([Id]);
ALTER TABLE [carnets_usuario_user_permissions] ADD CONSTRAINT [carnets_usuario_user_permissions_permission_id_cb2e1cc3_fk_auth_permission_id] FOREIGN KEY ([permission_id]) REFERENCES [auth_permission] ([id]);
CREATE INDEX [carnets_empleado_Cargo_id_e49b9fc9] ON [carnets_empleado] ([Cargo_id]);
CREATE INDEX [carnets_usuario_groups_usuario_id_1c10a150] ON [carnets_usuario_groups] ([usuario_id]);
ALTER TABLE [carnets_historicoimpresion] ADD CONSTRAINT [carnets_historicoimpresion_Empleado_id_e8319874_fk_carnets_empleado_Id] FOREIGN KEY ([Empleado_id]) REFERENCES [carnets_empleado] ([Id]);
CREATE INDEX [carnets_usuario_user_permissions_permission_id_cb2e1cc3] ON [carnets_usuario_user_permissions] ([permission_id]);
COMMIT;


-- Tabla auth_group
CREATE TABLE [auth_group] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [name] nvarchar(150) NOT NULL UNIQUE
);

-- Tabla auth_permission
CREATE TABLE [auth_permission] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [name] nvarchar(255) NOT NULL,
    [content_type_id] int NOT NULL,
    [codename] nvarchar(100) NOT NULL UNIQUE
);

-- Tabla auth_user
CREATE TABLE [auth_user] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [password] nvarchar(128) NOT NULL,
    [last_login] datetimeoffset NULL,
    [is_superuser] bit NOT NULL,
    [username] nvarchar(150) NOT NULL UNIQUE,
    [first_name] nvarchar(30) NOT NULL,
    [last_name] nvarchar(150) NOT NULL,
    [email] nvarchar(254) NOT NULL,
    [is_staff] bit NOT NULL,
    [is_active] bit NOT NULL,
    [date_joined] datetimeoffset NOT NULL
);
-- Tabla auth_user
CREATE TABLE [auth_user] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [password] nvarchar(128) NOT NULL,
    [last_login] datetimeoffset NULL,
    [is_superuser] bit NOT NULL,
    [username] nvarchar(150) NOT NULL UNIQUE,
    [first_name] nvarchar(30) NOT NULL,
    [last_name] nvarchar(150) NOT NULL,
    [email] nvarchar(254) NOT NULL,
    [is_staff] bit NOT NULL,
    [is_active] bit NOT NULL,
    [date_joined] datetimeoffset NOT NULL
);



-- Tabla auth_user_groups (Relación muchos a muchos)
CREATE TABLE [auth_user_groups] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [user_id] int NOT NULL,
    [group_id] int NOT NULL,
    CONSTRAINT [auth_user_groups_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [auth_user]([id]),
    CONSTRAINT [auth_user_groups_group_id_fk] FOREIGN KEY ([group_id]) REFERENCES [auth_group]([id])
);




-- Tabla auth_usuario_user_permissions (Relación muchos a muchos)
CREATE TABLE [auth_usuario_user_permissions] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [user_id] int NOT NULL,
    [permission_id] int NOT NULL,
    CONSTRAINT [auth_usuario_user_permissions_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [auth_user]([id]),
    CONSTRAINT [auth_usuario_user_permissions_permission_id_fk] FOREIGN KEY ([permission_id]) REFERENCES [auth_permission]([id])
);




-- Tabla django_content_type
CREATE TABLE [django_content_type] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [app_label] nvarchar(100) NOT NULL,
    [model] nvarchar(100) NOT NULL,
    UNIQUE ([app_label], [model])
);


-- Tabla django_admin_log
CREATE TABLE [django_admin_log] (
    [id] int NOT NULL PRIMARY KEY IDENTITY (1, 1),
    [action_time] datetimeoffset NOT NULL,
    [object_id] nvarchar(max) NULL,
    [object_repr] nvarchar(200) NOT NULL,
    [action_flag] smallint NOT NULL,
    [change_message] nvarchar(max) NOT NULL,
    [content_type_id] int NULL,
    [user_id] int NOT NULL,
    CONSTRAINT [django_admin_log_content_type_id_fk] FOREIGN KEY ([content_type_id]) REFERENCES [django_content_type]([id]),
    CONSTRAINT [django_admin_log_user_id_fk] FOREIGN KEY ([user_id]) REFERENCES [auth_user]([id])
);


-- Tabla django_session
CREATE TABLE [django_session] (
    [session_key] nvarchar(40) NOT NULL PRIMARY KEY,
    [session_data] nvarchar(max) NOT NULL,
    [expire_date] datetimeoffset NOT NULL
);

-- Índices y claves foráneas para auth_user
CREATE INDEX [auth_user_username_idx] ON [auth_user] ([username]);
CREATE INDEX [auth_user_email_idx] ON [auth_user] ([email]);

-- Índices para relaciones muchos a muchos en auth
CREATE INDEX [auth_user_groups_user_id_idx] ON [auth_user_groups] ([user_id]);
CREATE INDEX [auth_usuario_user_permissions_user_id_idx] ON [auth_usuario_user_permissions] ([user_id]);

-- Índices y claves foráneas para django_admin_log
CREATE INDEX [django_admin_log_content_type_id_idx] ON [django_admin_log] ([content_type_id]);
CREATE INDEX [django_admin_log_user_id_idx] ON [django_admin_log] ([user_id]);
