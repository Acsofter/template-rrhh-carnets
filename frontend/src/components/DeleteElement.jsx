import React, { useContext, useState } from "react";
import { AppContext } from "../services/Context";
import serviciosUsuario from "../services/usuario.service";
import { toast } from "react-toastify";

// Componente para manejar la eliminación o suspensión de elementos
const EliminarElemento = ({ id, tipo, actualizarTabla, mensaje }) => {
  // Acceso al contexto global de la aplicación
  const GLOBAL = useContext(AppContext);
  
  // Estado para almacenar la razón de eliminación o suspensión
  const [razon, setRazon] = useState("");

  // Función para manejar la eliminación o suspensión de elementos
  const eliminar = (e) => {
    e.preventDefault();

    // Suspender al empleado (cambiar estado a inactivo)
    serviciosUsuario
      .actualizarEmpleado(id, { Activo: false, RazonInactivacion: razon })
      .then(() => {
        toast.success("Empleado suspendido exitosamente");
        actualizarTabla();
        GLOBAL.cerrarVentanaEmergente();
      })
      .catch((error) => {
        console.error("Error al suspender el empleado:", error);
        toast.error("Error al suspender el empleado. Por favor, intente de nuevo.");
      });

    // Código comentado para eliminar otros tipos de elementos
    // Este código puede ser adaptado según las necesidades de cada institución
    /*
    const elementosEliminables = {
      "cargo": serviciosUsuario.eliminarCargo,
      "departamento": serviciosUsuario.eliminarDepartamento
    };

    if (tipo !== "empleado") {
      elementosEliminables[tipo](id)
        .then((respuesta) => {
          toast.success(respuesta.MENSAJE);
          actualizarTabla();
          GLOBAL.cerrarVentanaEmergente();
        })
        .catch((error) => {
          console.error(`Error al eliminar ${tipo}:`, error);
          toast.error(`Error al eliminar ${tipo}. Por favor, intente de nuevo.`);
        });
    }
    */
  };

  return (
    <div className="contenedor-eliminar-elemento">
      <form className="formulario-eliminar">
        <div className="campo-formulario">
          <div className="contenido-campo">
            <>
              <h5 className="titulo-confirmacion">
                ¿Está seguro de suspender a este usuario?
              </h5>
              <p className="descripcion-accion">
                Aun suspendido, podrá reactivarlo después si es necesario.
              </p>
              <label htmlFor="razon_suspension" className="etiqueta-campo">
                Razón de suspensión
              </label>
              <textarea
                className="area-texto-razon"
                id="razon_suspension"
                rows="3"
                onChange={(e) => setRazon(e.target.value)}
              ></textarea>
            </>
            {/* Código comentado para otros tipos de elementos
            {tipo !== "empleado" && (
              <>
                <h5 className="titulo-confirmacion">
                  ¿Está seguro de eliminar este elemento?
                </h5>
                <p className="descripcion-accion">
                  Si lo elimina, no podrá recuperarlo.
                </p>
              </>
            )}
            */}
          </div>
        </div>
        <div className="contenedor-botones">
          <button
            type="button"
            className="boton-cancelar"
            onClick={GLOBAL.cerrarVentanaEmergente}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="boton-confirmar"
            onClick={eliminar}
          >
            Sí, estoy seguro
          </button>
        </div>
      </form>
    </div>
  );
};

export default EliminarElemento;
