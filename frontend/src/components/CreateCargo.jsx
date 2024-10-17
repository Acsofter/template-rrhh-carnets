import React, { useState } from "react";
import { useForm } from "react-hook-form";
import serviciosUsuario from "../services/usuario.service";
import { toast } from "react-toastify";

// Componente para crear un nuevo cargo
const CrearCargo = ({ funcionCierre }) => {
  // Estado para controlar si el formulario está siendo enviado
  const [enviando, setEnviando] = useState(false);

  // Configuración del formulario utilizando react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Función para manejar el envío del formulario
  const manejarEnvio = async (datos) => {
    setEnviando(true);
    try {
      // Llamada al servicio para crear un nuevo cargo
      const respuesta = await serviciosUsuario.crearCargo(datos);
      if (respuesta.status === 201) {
        toast.success("Cargo creado exitosamente");
        funcionCierre(); // Cerrar el formulario después de crear el cargo
      }
    } catch (error) {
      console.error("Error al crear el cargo:", error);
      toast.error("Error al crear el cargo. Por favor, intente de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Crear Nuevo Cargo</h2>
      <form onSubmit={handleSubmit(manejarEnvio)}>
        {/* Campo para el nombre del cargo */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre del Cargo
          </label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
            id="nombre"
            {...register("nombre", { required: "Este campo es requerido" })}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre.message}</div>
          )}
        </div>

        {/* Campo para la descripción del cargo */}
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
            id="descripcion"
            rows="3"
            {...register("descripcion", { required: "Este campo es requerido" })}
          ></textarea>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion.message}</div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={funcionCierre}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando}
          >
            {enviando ? "Creando..." : "Crear Cargo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearCargo;
