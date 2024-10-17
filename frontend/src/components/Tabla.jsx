import { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import Actions from "./Actions";
import userServices from "../services/user.service";
import React from "react";
import MenuTable from "./MenuTable";
import ActionsTable from "./ActionsTable";

const Tabla = () => {
  // Estados para manejar los datos y la paginación
  const [datos, setDatos] = useState([]);
  const [next, setNext] = useState("");
  const [previous, setPrevious] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [order, setOrder] = useState("");
  const [tableMenu, setTableMenu] = useState(false);
  const [tableMenuInfo, setTableMenuInfo] = useState([0, 0, {}]);

  // Función para mostrar las filas de datos
  const showRows = (data) => {
    data
      .then((results) => {
        if (!results) {
          toast.warning("No hay datos para mostrar");
          return;
        }

        results = results.data;
        setNext(results.next);
        setPrevious(results.previous);
        setDatos(results.results);
        setCurrent(results.current);
        setTotalPages(Math.ceil(results.count / limit));
      })
      .catch((x) =>
        toast.error(x.response.data.MESSAGE || x.response.data.detail)
      );
  };

  // Función para manejar la paginación
  const paginationFunction = (page) => {
    const acts = {
      next: () =>
        next != null && showRows(axios.get(next, { headers: authHeader() })),
      previous: () =>
        previous != null &&
        showRows(axios.get(previous, { headers: authHeader() })),
    };
    acts[page.target.attributes.id.nodeValue]();
  };

  // Función para manejar el clic derecho en una fila
  const rowHandler = (e, index) => {
    e.preventDefault();
    if (!e) return;
    setTableMenuInfo([e.pageX, e.pageY, datos[index]]);
    setTableMenu(true);
  };

  // Función para obtener el icono del archivo
  const getIconFIle = (filename) => {
    let ext = filename.split(".").slice(-1);
    try {
      return require(`../assets/icons/${ext}.png`);
    } catch (error) {
      return require(`../assets/icons/undefined.png`);
    }
  };

  // Función para generar las filas de la tabla
  const rows = () => {
    const limitDocsShow = 4;

    if (datos)
      return [
        datos.map((item, index) => {
          return (
            <tr
              key={item.Id}
              onContextMenu={(e) => {
                e.preventDefault();
                rowHandler(e, index);
              }}
            >
              <th scope="row">{index + 1}</th>
              <td>{item.Nombre}</td>
              <td>{item.Apellido}</td>
              <td>{item.Cedula}</td>
              <td>{item.cargo_descripcion}</td>
              <td>{item.dept_descripcion}</td>
              <td>
                {item.documentos.slice(0, limitDocsShow).map((doc_data) => {
                  return (
                    <img
                      key={doc_data.Id}
                      className="icon-table"
                      src={getIconFIle(doc_data.Nombre)}
                      alt={doc_data.Nombre.split("+uid+")[0]}
                    />
                  );
                })}

                {item.documentos.length > limitDocsShow && (
                  <span className="fw-bold">{`+${
                    item.documentos.slice(limitDocsShow - 1, -1).length
                  }`}</span>
                )}
              </td>
            </tr>
          );
        }),
        // Filas vacías para mantener el tamaño de la tabla
        ...new Array(limit - datos.length).fill(null).map((_, index) => (
          <tr key={index}>
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

  // Manejador de clic fuera del menú de tabla
  const handleClickOutside = () => tableMenu && setTableMenu(false);
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleClickOutside);

  // Función para actualizar la tabla
  const updateTable = () =>
    showRows(userServices.getEmpleados(undefined, current, order));

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    updateTable();
    setInterval(() => {
      setLoading(false);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="table">
      {/* Menú contextual de la tabla */}
      <MenuTable
        positionX={tableMenuInfo[0]}
        positionY={tableMenuInfo[1]}
        show={tableMenu}
        info={tableMenuInfo[2]}
        actualizar={updateTable}
      />
      {/* Componentes de acciones */}
      <Actions actualizar={updateTable} />
      <ActionsTable order={order} showRows={showRows} setOrder={setOrder} />

      {/* Tabla principal */}
      <table className="table ">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Nombres</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Cedula</th>
            <th scope="col">Cargo</th>
            <th scope="col">Departamento</th>
            <th scope="col">Documentos</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? new Array(limit).fill(null).map((_, index) => (
                <tr key={index}>
                  <th>
                    <Skeleton />
                  </th>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              ))
            : rows()}
        </tbody>
      </table>

      {/* Información de paginación */}
      <div className="fw-light fs-6">
        <span className="fw-bold">Pagina {current + 1}</span>
        {` de  ${totalPages}`}
      </div>

      {/* Botones de paginación */}
      <div
        className="pagination-buttoms btn-group m-2"
        role="group"
        aria-label="Second group"
      >
        <button
          id="previous"
          onClick={paginationFunction}
          type="button"
          className={previous ? "btn " : "btn   disabled"}
        >
          {"<"}
        </button>
        <button
          id="next"
          onClick={paginationFunction}
          type="button"
          className={next ? "btn " : "btn   disabled"}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Tabla;
