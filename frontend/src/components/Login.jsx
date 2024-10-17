import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../services/Contexto";
import serviciosAutenticacion from "../services/autenticacion.service";
import { toast } from "react-toastify";
// import img_logo  from "../assets/images/logo-.png";

// Componente de inicio de sesión
const InicioSesion = () => {
  // Estado para almacenar los datos del formulario
  const [datosFormulario, setDatosFormulario] = useState({
    usuario: "",
    contrasena: "",
  });

  // Hook de navegación
  const navegar = useNavigate();

  // Contexto de autenticación
  const { iniciarSesion } = useContext(ContextoAutenticacion);

  // Función para manejar cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario({ ...datosFormulario, [name]: value });
  };

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      // Intento de inicio de sesión
      const respuesta = await serviciosAutenticacion.iniciarSesion(datosFormulario);
      if (respuesta.data.token) {
        // Almacenar el token en el almacenamiento local
        localStorage.setItem("token", respuesta.data.token);
        // Actualizar el estado de autenticación
        iniciarSesion(respuesta.data);
        // Redirigir al usuario a la página de inicio
        navegar("/inicio");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error("Error de inicio de sesión. Por favor, verifique sus credenciales.");
    }
  };

  return (
    <div className="contenedor-inicio-sesion">
      <div className="formulario-inicio-sesion">
        <h2 className="titulo-inicio-sesion">Iniciar Sesión</h2>
        <form onSubmit={manejarEnvio}>
          <div className="campo-formulario">
            <label htmlFor="usuario" className="etiqueta-campo">
              Usuario:
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={datosFormulario.usuario}
              onChange={manejarCambio}
              required
              className="entrada-campo"
            />
          </div>
          <div className="campo-formulario">
            <label htmlFor="contrasena" className="etiqueta-campo">
              Contraseña:
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={datosFormulario.contrasena}
              onChange={manejarCambio}
              required
              className="entrada-campo"
            />
          </div>
          <button type="submit" className="boton-inicio-sesion">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default InicioSesion;
