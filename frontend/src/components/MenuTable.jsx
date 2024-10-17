import React, { useContext } from "react";
import { AppContext } from "../services/Context";
import UpdateEmpleado from "./UpdateEmpleado";
import { Link } from "react-router-dom";
import DeleteElement from "./DeleteElement";
import { useNavigate } from "react-router-dom";
import InactiveEmpleado from "./InactiveEmpleado";

// Menu que se muestra al hacer click derecho sobre una fila
const MenuTable = ({ positionX, positionY, show, info, actualizar }) => {
  const { showPopup } = useContext(AppContext);
  const navigate = useNavigate();

  const toHistory = (e) => {
    e.preventDefault();
    navigate("/history", { state: { cedula: info.Cedula } });
  };

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
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">
              {`${info.NombreCompleto}`.slice(0, 20) + "..."}
            </div>
          </div>
          {info.Suspendido ? (
            <span className="badge bg-secondary  color- rounded-pill">
              Inactivo
            </span>
          ) : (
            <span className="badge bg-primary color- rounded-pill">Activo</span>
          )}
        </li>
        <Link
          className="list-group-item list-group-item-action"
          aria-current="true"
          onClick={() =>
            showPopup(
              !info.Suspendido ? (
                <UpdateEmpleado empleadoId={info.Id} updateTable={actualizar} />
              ) : (
                <InactiveEmpleado
                  empleadoId={info.Id}
                  updateTable={actualizar}
                />
              ),
              "900px"
            )
          }
        >
          <small>Ver</small>
        </Link>
        <Link
          className="list-group-item list-group-item-action"
          aria-current="true"
          onClick={toHistory}
        >
          <small>Historial</small>
        </Link>

        {!info.Suspendido && (
          <Link
            className="list-group-item list-group-item-action"
            aria-current="true"
            onClick={() =>
              showPopup(
                <DeleteElement
                  id={info.Id}
                  type={"empleado"}
                  updateTable={actualizar}
                />
              )
            }
          >
            <small>Suspender</small>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MenuTable;
