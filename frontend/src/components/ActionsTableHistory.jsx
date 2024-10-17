import { format } from "date-fns";
import { Link } from "react-router-dom";
import serviciosUsuario from "../services/usuario.service";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Componente para las acciones de la tabla de historial
const ActionsTableHistory = ({
  orden,
  setOrden,
  mostrarFilas,
  busqueda,
  setBusqueda,
  paginaActual,
  fechaInicio,
  fechaFinal,
  setFechaFinal,
  setFechaInicio,
}) => {
  // Función para generar el PDF del historial
  const generarPDF = async () => {
    // Obtener los datos del historial
    const respuesta = await serviciosUsuario.obtenerHistorial(
      -1,
      null,
      orden,
      busqueda,
      fechaInicio,
      fechaFinal
    );
    const datos = respuesta.data;

    // Crear el cuerpo de la tabla para el PDF
    const cuerpoTabla = [
      [
        { text: "ID", style: "encabezadoTabla" },
        { text: "Nombre", style: "encabezadoTabla" },
        { text: "Identificación", style: "encabezadoTabla" },
        { text: "Cargo", style: "encabezadoTabla" },
        { text: "Departamento", style: "encabezadoTabla" },
        { text: "Estado 1", style: "encabezadoTabla" },
        { text: "Estado 2", style: "encabezadoTabla" },
        { text: "Comentario", style: "encabezadoTabla" },
      ],
      ...datos.resultados.map((item, index) => [
        index + 1,
        item.nombreEmpleado.toUpperCase(),
        item.identificacionEmpleado,
        item.cargoActual,
        item.departamentoActual,
        item.estado1 ? "Completado" : "Pendiente",
        item.estado2 ? "Completado" : "Pendiente",
        item.comentario,
      ]),
    ];

    // Definición del documento PDF
    const definicionDocumento = {
      content: [
        // Encabezado del documento
        {
          columns: [
            {
              // Aquí iría el logo de la institución
              image: "URL_DEL_LOGO",
              width: 100,
            },
            [
              {
                text: "Reporte de Historial",
                style: "tituloReporte",
                width: "*",
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: "Total de registros:",
                        style: "subtituloReporte",
                        width: "*",
                      },
                      {
                        text: datos.total,
                        style: "valorSubtitulo",
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: "Desde:",
                        style: "subtituloReporte",
                        width: "*",
                      },
                      {
                        text: fechaInicio
                          ? format(fechaInicio, "yyyy/MM/dd")
                          : "----/--/--",
                        style: "valorSubtitulo",
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: "Hasta:",
                        style: "subtituloReporte",
                        width: "*",
                      },
                      {
                        text: fechaFinal
                          ? format(fechaFinal, "yyyy/MM/dd")
                          : "----/--/--",
                        style: "valorSubtitulo",
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },

        // Tabla del reporte
        {
          style: "tabla",
          table: {
            headerRows: 1,
            widths: [
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: cuerpoTabla,
          },
          layout: "lightHorizontalLines",
        },
      ],
      // Estilos del documento
      styles: {
        // ... (aquí irían los estilos del documento, que se han omitido por brevedad)
      },
    };

    // Generar y abrir el PDF
    pdfMake.createPdf(definicionDocumento).open();
  };

  // Manejar el cambio de orden en la tabla
  const manejarAccionesTabla = (e) => {
    e.preventDefault();
    const idOrden = e.target.id;
    setOrden(idOrden);
    mostrarFilas(
      serviciosUsuario.obtenerHistorial(
        undefined,
        paginaActual,
        idOrden,
        busqueda,
        fechaInicio,
        fechaFinal
      )
    );
  };

  // Realizar la búsqueda en el historial
  const manejarBusqueda = async (e) => {
    e.preventDefault();
    mostrarFilas(
      serviciosUsuario.obtenerHistorial(
        undefined,
        undefined,
        orden,
        busqueda,
        fechaInicio,
        fechaFinal
      )
    );
  };

  return (
    <>
      <ul className="nav nav-tabs">
        {/* Botón para generar PDF */}
        <li>
          <button className="btn btn-secondary btn-sm" onClick={generarPDF}>
            Generar PDF
          </button>
        </li>

        {/* Menú desplegable para ordenar */}
        <li className="nav-item dropdown">
          <Link
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            Ordenar por: <span className="fw-bold">{orden || "predeterminado"}</span>
          </Link>
          <ul className="dropdown-menu">
            {/* Opciones de ordenamiento */}
            <li>
              <Link
                className="dropdown-item"
                id="Estado_1"
                onClick={manejarAccionesTabla}
              >
                Estado 1
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                id="Estado_2"
                onClick={manejarAccionesTabla}
              >
                Estado 2
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                id="Comentario"
                onClick={manejarAccionesTabla}
              >
                Comentario
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                id="Fecha_creacion"
                onClick={manejarAccionesTabla}
              >
                Fecha
              </Link>
            </li>
          </ul>
        </li>

        {/* Selector de fecha de inicio */}
        <li>
          <div className="input-group input-group-sm color-secondary ">
            <span className="input-group-text">Desde</span>
            <input
              onChange={(e) => setFechaInicio(e.target.value)}
              value={fechaInicio}
              type="datetime-local"
              className="border border-1 color-secondary border secondary p2"
            />
          </div>
        </li>
        <span> / </span>
        {/* Selector de fecha final */}
        <li>
          <div className="input-group input-group-sm color-secondary ">
            <span className="input-group-text">Hasta</span>
            <input
              onChange={(e) => setFechaFinal(e.target.value)}
              value={fechaFinal}
              type="datetime-local"
              className="border border-1 color-secondary border secondary p2"
            />
          </div>
        </li>

        {/* Campo de búsqueda */}
        <li className="nav-item">
          <div className="input-group">
            <input
              type="search"
              className="form-control rounded"
              placeholder="Buscar..."
              onKeyDown={(e) => {
                e.key === "Enter" && busqueda && manejarBusqueda(e);
              }}
              aria-label="Buscar"
              aria-describedby="search-addon"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={manejarBusqueda}
            >
              Buscar
            </button>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ActionsTableHistory;