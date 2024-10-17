import React from "react";
import serviciosUsuario from "../services/usuario.service";

// Componente de paginación para tablas
const Paginacion = ({
  anterior,
  setPaginaActual,
  paginaActual,
  siguiente,
  mostrarFilas,
  orden,
  busqueda,
  limiteFilas,
  totalPaginas,
}) => {
  // Función para manejar el cambio de página
  const manejarCambioPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    mostrarFilas(
      serviciosUsuario.obtenerDatos(undefined, numeroPagina, orden, busqueda)
    );
  };

  // Función para generar los botones de paginación
  const generarBotonesPaginacion = () => {
    const botones = [];
    const paginasVisibles = 5; // Número de botones de página visibles

    let inicioRango = Math.max(0, paginaActual - Math.floor(paginasVisibles / 2));
    let finRango = Math.min(totalPaginas - 1, inicioRango + paginasVisibles - 1);

    // Ajustar el rango si estamos cerca del final
    if (finRango - inicioRango + 1 < paginasVisibles) {
      inicioRango = Math.max(0, finRango - paginasVisibles + 1);
    }

    // Botón para la primera página
    if (inicioRango > 0) {
      botones.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => manejarCambioPagina(0)}>
            1
          </button>
        </li>
      );
      if (inicioRango > 1) {
        botones.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Botones para las páginas en el rango
    for (let i = inicioRango; i <= finRango; i++) {
      botones.push(
        <li
          key={i}
          className={`page-item ${paginaActual === i ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => manejarCambioPagina(i)}
          >
            {i + 1}
          </button>
        </li>
      );
    }

    // Botón para la última página
    if (finRango < totalPaginas - 1) {
      if (finRango < totalPaginas - 2) {
        botones.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      botones.push(
        <li key="last" className="page-item">
          <button
            className="page-link"
            onClick={() => manejarCambioPagina(totalPaginas - 1)}
          >
            {totalPaginas}
          </button>
        </li>
      );
    }

    return botones;
  };

  return (
    <nav aria-label="Navegación de páginas">
      <ul className="pagination justify-content-center">
        {/* Botón para ir a la página anterior */}
        <li className={`page-item ${!anterior ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => manejarCambioPagina(paginaActual - 1)}
            disabled={!anterior}
          >
            Anterior
          </button>
        </li>

        {/* Botones de paginación generados dinámicamente */}
        {generarBotonesPaginacion()}

        {/* Botón para ir a la página siguiente */}
        <li className={`page-item ${!siguiente ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => manejarCambioPagina(paginaActual + 1)}
            disabled={!siguiente}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Paginacion;
