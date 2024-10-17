import React, { useEffect, useState } from "react";
import serviciosUsuario from "../services/usuario.service";
import { toast } from "react-toastify";
import VistaPrevia from "./VistaPrevia";
import SubirArchivos from "./SubirArchivos";
import axios from "axios";

// Componente para crear un nuevo empleado
const CrearEmpleado = ({ funcionCierre }) => {
  // Estados para almacenar la información del formulario
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [cargosDisponibles, setCargosDisponibles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [cargoDeshabilitado, setCargoDeshabilitado] = useState(true);
  const [departamento, setDepartamento] = useState({});
  const [cargo, setCargo] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Función para manejar la búsqueda de información por identificación
  const manejarBusquedaPorIdentificacion = (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && identificacion.length === 11) {
      e.preventDefault();

      // Aquí iría la lógica para buscar información por identificación
      // Por ejemplo:
      // const url = "URL_DEL_SERVICIO_DE_BUSQUEDA";
      // axios.get(url, { params: { identificacion: identificacion } })
      //   .then((respuesta) => {
      //     const persona = respuesta.data;
      //     if (persona.nombres) {
      //       setNombre(persona.nombres);
      //       setApellido(persona.apellidos);
      //     } else {
      //       toast.error("Identificación no encontrada");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error al buscar información:", error);
      //     toast.error("Error al buscar información. Intente de nuevo.");
      //   });
    }
  };

  // Función para manejar cambios en los campos del formulario
  const manejarCambio = (e) => {
    const valor = e.target.value;
    const campo = e.target.id;

    switch (campo) {
      case "Nombre":
        setNombre(valor);
        break;
      case "Apellido":
        setApellido(valor);
        break;
      case "Identificacion":
        setIdentificacion(valor);
        break;
      case "Departamento":
        seleccionarDepartamento(valor);
        break;
      case "Cargo":
        seleccionarCargo(valor);
        break;
      default:
        break;
    }
  };

  // Función para manejar la selección de departamento
  const seleccionarDepartamento = (idDepartamento) => {
    if (departamentos) {
      const infoDepartamento = departamentos.find(
        (dept) => dept.Id === idDepartamento
      );
      const cargosDelDepartamento = cargos.filter(
        (item) => item.Departamento === idDepartamento
      );
      setDepartamento(infoDepartamento);
      setCargosDisponibles(cargosDelDepartamento);
      setCargoDeshabilitado(false);
      document.getElementById("Cargo").value = "";
    }
  };

  // Función para manejar la selección de cargo
  const seleccionarCargo = (idCargo) => {
    if (cargos) {
      const infoCargo = cargos.find((item) => item.Id === idCargo);
      setCargo(infoCargo);
    }
  };

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Crear el empleado
      const empleadoCreado = await serviciosUsuario.crearEmpleado({
        Nombre: nombre,
        Apellido: apellido,
        Identificacion: identificacion,
        Cargo: cargo.Id,
      });

      if (!empleadoCreado || !empleadoCreado.data) {
        throw new Error("Error al crear el empleado");
      }

      // Subir documentos si existen
      if (documentos.length > 0) {
        for (const doc of documentos) {
          const lector = new FileReader();
          lector.onload = async (evento) => {
            const archivo64 = evento.target.result.split(",")[1];
            await serviciosUsuario.subirDocumento({
              Nombre: doc.Nombre,
              Tipo: doc.Tipo,
              Tamaño: doc.Tamaño,
              Empleado: empleadoCreado.data.Id,
              archivo: archivo64,
            });
          };
          lector.readAsDataURL(doc.archivo);
        }
      }

      toast.success("Empleado creado exitosamente");
      funcionCierre();
    } catch (error) {
      console.error("Error al crear el empleado:", error);
      toast.error("Error al crear el empleado. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Efecto para cargar departamentos y cargos al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaDepartamentos = await serviciosUsuario.obtenerDepartamentos();
        respuestaDepartamentos && setDepartamentos(respuestaDepartamentos.data);

        const respuestaCargos = await serviciosUsuario.obtenerCargos();
        respuestaCargos && setCargos(respuestaCargos.data);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        toast.error("Error al cargar datos. Por favor, recargue la página.");
      }
    }
    cargarDatos();
  }, []);

  return (
    <>
      <h2 className="titulo-formulario">AGREGAR EMPLEADO</h2>
      <hr className="separador-formulario" />
      <div className="crear-empleado">
        <form className="formulario-empleado" onSubmit={manejarEnvio}>
          {/* Campos del formulario */}
          {/* ... (aquí irían los campos de nombre, apellido, identificación, etc.) */}

          {/* Selector de departamento */}
          <div className="campo-formulario">
            <label htmlFor="Departamento" className="etiqueta-campo">
              Departamento
            </label>
            <select
              className="selector-campo"
              id="Departamento"
              defaultValue=""
              onChange={manejarCambio}
              required
            >
              <option disabled value="">Seleccione...</option>
              {departamentos?.map((dept) => (
                <option value={dept.Id} key={dept.Id}>
                  {dept.Descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de cargo */}
          <div className="campo-formulario">
            <label htmlFor="Cargo" className="etiqueta-campo">
              Cargo
            </label>
            <select
              disabled={cargoDeshabilitado}
              className="selector-campo"
              id="Cargo"
              defaultValue=""
              onChange={manejarCambio}
              required
            >
              <option disabled value="">Seleccione...</option>
              {cargosDisponibles?.map((cargo) => (
                <option value={cargo.Id} key={cargo.Id}>
                  {cargo.Descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Componente para subir archivos */}
          <div className="campo-formulario">
            <SubirArchivos
              archivos={documentos}
              setArchivos={setDocumentos}
            />
          </div>

          {/* Botón de envío */}
          <div className="campo-formulario">
            {!cargando ? (
              <button className="boton-enviar" type="submit">
                Agregar Empleado
              </button>
            ) : (
              <button className="boton-cargando" type="button" disabled>
                <span className="indicador-carga" aria-hidden="true"></span>
                <span role="status"> Cargando...</span>
              </button>
            )}
          </div>
        </form>

        {/* Vista previa del carnet */}
        <div className="vista-previa-carnet">
          <VistaPrevia
            nombre={`${nombre} ${apellido}`}
            identificacion={identificacion}
            departamento={departamento.Descripcion}
            cargo={cargo.Descripcion}
          />
        </div>
      </div>
    </>
  );
};

export default CrearEmpleado;