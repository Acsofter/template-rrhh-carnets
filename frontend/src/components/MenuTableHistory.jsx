import React, { useContext } from "react";
import { AppContext } from "../services/Context";
import UpdateHistorial from "./UpdateHistorial.jsx";
import { Link } from "react-router-dom";

// Componente para mostrar un menú contextual en la tabla de historial
const MenuTableHistory = ({ positionX, positionY, show, info, actualizar }) => {
  const { showPopup } = useContext(AppContext);

  // Si no se debe mostrar, no renderizar nada
  if (!show) return;

  return (
    <div
      className="menu-table-wrapper"
      style={{
        left: `${positionX + 4}px`,
        top: `${positionY}px`,
      }}
    >
      <div className="list-group">
        {/* Elemento que muestra información básica del empleado */}
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              {`${info.desc_empleado.Nombre} ${info.desc_empleado.Apellido}`.slice(
                0,
                20
              ) + "..."}
            </div>
          </div>
          {/* Indicador de estado del empleado (Activo/Inactivo) */}
          {info.desc_empleado.Suspendido ? (
            <span className="badge bg-secondary  color- rounded-pill">
              Inactivo
            </span>
          ) : (
            <span className="badge bg-primary color- rounded-pill">Activo</span>
          )}
        </li>
        {/* Enlace para ver más detalles del historial */}
        <Link
          className="list-group-item list-group-item-action"
          aria-current="true"
          onClick={() =>
            showPopup(
              <UpdateHistorial
                historialId={info.Id}
                updateTable={actualizar}
              />,
              "700px"
            )
          }
        >
          <small>Ver</small>
        </Link>
        {/* Comentario: Opción de entrega desactivada */}
        {/* <Link className="list-group-item list-group-item-action" aria-current="true" onClick={() => showPopup(<DeleteElement id={info.Id} type={"empleado"} updateTable={actualizar}/>)} >
                <small>Entregar</small>
            </Link> */}
      </div>
    </div>
  );
};

export default MenuTableHistory;
