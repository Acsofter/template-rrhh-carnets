import React, { useState } from "react";
import serviciosUsuario from "../services/usuario.service";
import { toast } from "react-toastify";

// Componente para crear un nuevo departamento
const CrearDepartamento = ({ funcionCierre }) => {
  // Estado para almacenar el nombre del departamento
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  // Función para manejar el envío del formulario
  const manejarEnvio = (evento) => {
    evento.preventDefault();

    // Llamada al servicio para crear un nuevo departamento
    serviciosUsuario
      .crearDepartamento({
        Descripcion: nombreDepartamento,
      })
      .then((respuesta) => {
        if (!respuesta) return;
        // Mostrar mensaje de éxito y cerrar el formulario
        toast.success("Departamento creado correctamente.");
        funcionCierre();
      })
      .catch((error) => {
        // Manejar errores y mostrar mensaje de error
        console.error("Error al crear el departamento:", error);
        toast.error("Error al crear el departamento. Por favor, intente de nuevo.");
      });
  };

  // Función para manejar cambios en el campo de entrada
  const manejarCambio = (evento) => {
    setNombreDepartamento(evento.target.value);
  };

  return (
    <div className="crear-departamento">
      <h2 className="titulo-formulario">CREAR DEPARTAMENTO</h2>
      <hr className="separador-formulario" />

      <form className="formulario-departamento" onSubmit={manejarEnvio}>
        <div className="campo-formulario">
          <label htmlFor="nombreDepartamento" className="etiqueta-campo">
            Nombre del Departamento
          </label>
          <input
            onChange={manejarCambio}
            type="text"
            className="entrada-campo"
            id="nombreDepartamento"
            required
            placeholder="Ingrese el nombre del departamento"
          />
        </div>

        <div className="contenedor-botones">
          <button className="boton-crear" type="submit">
            Crear Departamento
          </button>
          <button className="boton-cancelar" type="button" onClick={funcionCierre}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearDepartamento;
