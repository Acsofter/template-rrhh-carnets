import React, { useEffect, useState } from "react";
import serviciosUsuario from "../services/usuario.service";

// Componente para mostrar una vista previa de la información del empleado
const VistaPrevia = ({ nombre, identificacion, departamento, cargo }) => {
  // Estado para almacenar la foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Efecto para cargar la foto de perfil cuando cambia la identificación
  useEffect(() => {
    const cargarFotoPerfil = async () => {
      if (identificacion && identificacion.length === 11) {
        try {
          const respuesta = await serviciosUsuario.obtenerFotoPerfil(identificacion);
          if (respuesta && respuesta.imagen) {
            setFotoPerfil(respuesta.imagen);
          } else {
            setFotoPerfil(null);
          }
        } catch (error) {
          console.error("Error al cargar la foto de perfil:", error);
          setFotoPerfil(null);
        }
      } else {
        setFotoPerfil(null);
      }
    };

    cargarFotoPerfil();
  }, [identificacion]);

  return (
    <div className="contenedor-vista-previa">
      <div className="tarjeta-empleado">
        {/* Sección superior de la tarjeta */}
        <div className="seccion-superior">
          {/* Aquí se podría agregar un logo o imagen de la institución */}
        </div>

        {/* Sección de la foto de perfil */}
        <div className="seccion-foto">
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt="Foto de perfil"
              className="foto-perfil"
            />
          ) : (
            <div className="foto-perfil-placeholder">
              <span>Sin foto</span>
            </div>
          )}
        </div>

        {/* Sección de información del empleado */}
        <div className="seccion-info">
          <p className="nombre-empleado">{nombre || "Nombre del Empleado"}</p>
          <p className="cargo-empleado">{cargo || "Cargo del Empleado"}</p>
          <p className="departamento-empleado">
            {departamento || "Departamento del Empleado"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VistaPrevia;
