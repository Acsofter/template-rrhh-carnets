import React, { useEffect, useState } from "react";
import serviciosUsuario from "../services/usuario.service";
import { format } from "date-fns";
import AccionesTablaHistorial from "./AccionesTablaHistorial";
import Paginacion from "./Paginacion";

// Componente para mostrar el historial de acciones
const Historial = () => {
  // Estados para manejar los datos y la paginación
  const [filas, setFilas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [orden, setOrden] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  // Función para obtener y mostrar las filas del historial
  const mostrarFilas = async (promesa) => {
    try {
      const respuesta = await promesa;
      if (respuesta && respuesta.data) {
        setFilas(respuesta.data.resultados);
        setTotalPaginas(respuesta.data.totalPaginas);
      }
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      // Aquí se podría mostrar un mensaje de error al usuario
    }
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    mostrarFilas(
      serviciosUsuario.obtenerHistorial(
        undefined,
        paginaActual,
        orden,
        busqueda,
        fechaInicio,
        fechaFinal
      )
    );
  }, [paginaActual]);

  // Función para manejar el cambio de página
  const manejarCambioPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="contenedor-historial">
      {/* Componente de acciones para la tabla de historial */}
      <AccionesTablaHistorial
        orden={orden}
        setOrden={setOrden}
        mostrarFilas={mostrarFilas}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        paginaActual={paginaActual}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFinal={fechaFinal}
        setFechaFinal={setFechaFinal}
      />

      {/* Tabla de historial */}
      <table className="tabla-historial">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Identificación</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Estado 1</th>
            <th>Estado 2</th>
            <th>Comentario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, indice) => (
            <tr key={indice}>
              <td>{fila.id}</td>
              <td>{fila.nombreEmpleado}</td>
              <td>{fila.identificacionEmpleado}</td>
              <td>{fila.cargoActual}</td>
              <td>{fila.departamentoActual}</td>
              <td>{fila.estado1 ? "Completado" : "Pendiente"}</td>
              <td>{fila.estado2 ? "Completado" : "Pendiente"}</td>
              <td>{fila.comentario}</td>
              <td>{format(new Date(fila.fechaCreacion), "dd/MM/yyyy HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Componente de paginación */}
      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        manejarCambioPagina={manejarCambioPagina}
      />
    </div>
  );
};

export default Historial;
