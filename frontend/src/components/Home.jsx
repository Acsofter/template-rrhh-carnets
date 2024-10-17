import React, { useState, useEffect, useContext } from "react";
import { ContextoAutenticacion } from "../services/Contexto";
import serviciosUsuario from "../services/usuario.service";
import Skeleton from "react-loading-skeleton";
import Acciones from "./Acciones";
import MenuTabla from "./MenuTabla";
import Paginacion from "./Paginacion";
import AccionesTabla from "./AccionesTabla";

// Componente principal de la página de inicio
const Inicio = () => {
  // Contexto de autenticación
  const autenticacion = useContext(ContextoAutenticacion);

  // Estados para manejar la paginación y los datos
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [datos, setDatos] = useState([]);
  const [siguiente, setSiguiente] = useState("");
  const [anterior, setAnterior] = useState("");
  const [cargando, setCargando] = useState(true);
  const [orden, setOrden] = useState();
  const [menuTablaVisible, setMenuTablaVisible] = useState(false);
  const [infoMenuTabla, setInfoMenuTabla] = useState([0, 0, {}]);
  const [busqueda, setBusqueda] = useState("");

  const limiteFilas = 10; // Número de filas por página

  // Función para mostrar las filas con la información de los empleados
  const mostrarFilas = async (datos) => {
    let resultados = await datos;
    if (!resultados) return false;

    resultados = resultados.data;
    const totalPaginas = Math.ceil(resultados.total / limiteFilas);

    setSiguiente(resultados.siguiente);
    setAnterior(resultados.anterior);
    setDatos(resultados.resultados);
    setPaginaActual(resultados.paginaActual);
    setTotalPaginas(totalPaginas);
  };

  // Función para manejar la paginación
  const manejarPaginacion = (pagina) => {
    const acciones = {
      siguiente: () =>
        siguiente != null && mostrarFilas(serviciosUsuario.obtenerEmpleados(undefined, siguiente, orden, busqueda)),
      anterior: () =>
        anterior != null && mostrarFilas(serviciosUsuario.obtenerEmpleados(undefined, anterior, orden, busqueda)),
      numero: () =>
        mostrarFilas(serviciosUsuario.obtenerEmpleados(undefined, pagina.target.attributes.value.nodeValue, orden, busqueda)),
    };

    acciones[pagina.target.attributes.id.nodeValue]();
  };

  // Función para manejar el clic derecho sobre una fila
  const manejarFilaContextual = (e, indice) => {
    e.preventDefault();
    if (!e) return;
    setInfoMenuTabla([e.pageX, e.pageY, datos[indice]]);
    setMenuTablaVisible(true);
  };

  // Función para obtener el icono del archivo
  const obtenerIconoArchivo = (nombreArchivo) => {
    let extension = nombreArchivo.split(".").slice(-1)[0].toLowerCase();
    try {
      return require(`../assets/icons/${extension}.png`);
    } catch (error) {
      return require(`../assets/icons/undefined.png`);
    }
  };

  // Función para renderizar las filas de la tabla
  const renderizarFilas = () => {
    const limiteDocumentosMostrados = 4;
    if (datos)
      return [
        datos.map((item, indice) => (
          <tr
            key={item.Id}
            onContextMenu={(e) => manejarFilaContextual(e, indice)}
            className={`${item.Suspendido ? "deshabilitado" : ""}`}
          >
            <th scope="row">{paginaActual * limiteFilas + (indice + 1)}</th>
            <td>{item.Nombre}</td>
            <td>{item.Apellido}</td>
            <td>{item.Identificacion}</td>
            <td>
              <span className={`badge rounded-pill ${item.Suspendido ? "text-bg-secondary" : "text-bg-primary"}`}>
                {item.Suspendido ? "Inactivo" : "Activo"}
              </span>
            </td>
            <td>{item.cargo_descripcion}</td>
            <td>{item.dept_descripcion}</td>
            <td>
              {item.documentos.slice(0, limiteDocumentosMostrados).map((doc) => (
                <img
                  key={doc.Id}
                  id={doc.Id}
                  className="icono-tabla"
                  src={obtenerIconoArchivo(doc.Nombre)}
                  alt={doc.Nombre.split("+uid+")[0]}
                  style={{ width: "23px", height: "20px" }}
                />
              ))}
              {item.documentos.length > limiteDocumentosMostrados && (
                <span className="fw-bold">{`+${item.documentos.slice(limiteDocumentosMostrados - 1, -1).length}`}</span>
              )}
            </td>
          </tr>
        )),
        ...Array(limiteFilas - datos.length).fill(null).map((_, indice) => (
          <tr key={`empty-${indice}`}>
            <th>&nbsp;</th>
            <td>&nbsp;</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        )),
      ];
  };

  // Función para desactivar el menú contextual
  const manejarClicFuera = () => menuTablaVisible && setMenuTablaVisible(false);
  document.addEventListener("click", manejarClicFuera);
  window.addEventListener("resize", manejarClicFuera);

  // Función para actualizar la tabla por defecto
  const actualizarTablaPorDefecto = () => {
    setBusqueda(null);
    mostrarFilas(serviciosUsuario.obtenerEmpleados());
  };

  // Función para actualizar la tabla
  const actualizarTabla = () =>
    mostrarFilas(serviciosUsuario.obtenerEmpleados(undefined, paginaActual, orden, busqueda));

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    if (autenticacion.autenticado) {
      actualizarTabla();
      setTimeout(() => {
        setCargando(false);
      }, 500);
    }
  }, [autenticacion]);

  return (
    autenticacion.autenticado && (
      <div className="tabla">
        <MenuTabla
          posicionX={infoMenuTabla[0]}
          posicionY={infoMenuTabla[1]}
          visible={menuTablaVisible}
          info={infoMenuTabla[2]}
          actualizar={actualizarTabla}
          setBusqueda={setBusqueda}
        />
        <Acciones actualizar={actualizarTablaPorDefecto} />
        <AccionesTabla
          orden={orden}
          mostrarFilas={mostrarFilas}
          setOrden={setOrden}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          paginaActual={paginaActual}
          actualizar={actualizarTablaPorDefecto}
        />

        <table className="table inicio">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Nombres</th>
              <th scope="col">Apellidos</th>
              <th scope="col">Identificación</th>
              <th scope="col">Estado</th>
              <th scope="col">Cargo</th>
              <th scope="col">Departamento</th>
              <th scope="col">Documentos</th>
            </tr>
          </thead>

          <tbody>
            {cargando
              ? Array(limiteFilas).fill(null).map((_, indice) => (
                  <tr key={`skeleton-${indice}`}>
                    <th><Skeleton /></th>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                  </tr>
                ))
              : renderizarFilas()}
          </tbody>
        </table>

        <div>
          <Paginacion
            anterior={anterior}
            setPaginaActual={setPaginaActual}
            paginaActual={paginaActual}
            siguiente={siguiente}
            mostrarFilas={mostrarFilas}
            orden={orden}
            busqueda={busqueda}
            limiteFilas={limiteFilas}
            totalPaginas={totalPaginas}
          />
        </div>
      </div>
    )
  );
};

export default Inicio;