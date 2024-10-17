import React, { useContext, useState } from "react";
import CreateEmpleado from "./CreateEmpleado";
import CreateDepartamento from "./CreateDepartamento";
import CreateCargo from "./CreateCargo";
import { AppContext } from "../services/Context.jsx";
import UpdateCargo from "./UpdateCargo.jsx";
import { Link } from "react-router-dom";
import _History from "./History.jsx";
import UpdateDepartamento from "./UpdateDepartamento.jsx";

// Componente de menú principal de la página, siempre estático
const Actions = ({ actualizar }) => {
  const GLOBAL = useContext(AppContext);

  // Función para cerrar el popup y actualizar los datos
  const closeAndUpdate = async () => {
    await actualizar();
    GLOBAL.closePopup();
  };

  return (
    <>
      {/* Barra de navegación principal */}
      <nav className="navbar navbar-expand mt-2 mb-2 " data-bs-theme="dark">
        <div className="container-fluid">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Enlace al historial */}
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link  ${
                    window.location.pathname === "/history"
                      ? "active fw-bold"
                      : null
                  }`}
                  aria-current="page"
                  to={"/history"}
                >
                  Historial
                </Link>
              </li>

              {/* Menú desplegable de Empleado */}
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${
                    window.location.pathname === "/home"
                      ? "active fw-bold"
                      : null
                  }`}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Empleado
                </Link>

                <ul className="dropdown-menu">
                  {/* Opción para ver todos los empleados */}
                  <li >
                    <Link
                      className={`dropdown-item  `}
                      aria-current="page"
                      to={"/home"}
                    >
                      Ver todo
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Opción para agregar un nuevo empleado */}
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => {
                        GLOBAL.showPopup(
                          <CreateEmpleado closeFunc={closeAndUpdate} />,
                          "900px"
                        );
                      }}
                    >
                      Agregar
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Menú desplegable de Departamento */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Departamento
                </Link>
                <ul className="dropdown-menu">
                  {/* Opción para agregar un nuevo departamento */}
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => {
                        GLOBAL.showPopup(
                          <CreateDepartamento closeFunc={closeAndUpdate} />,
                          "500px"
                        );
                      }}
                    >
                      Agregar
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Opción para editar un departamento existente */}
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => {
                        GLOBAL.showPopup(
                          <UpdateDepartamento closeFunc={closeAndUpdate} />,
                          "500px"
                        );
                      }}
                    >
                      Editar
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Menú desplegable de Cargo */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Cargo
                </Link>
                <ul className="dropdown-menu">
                  {/* Opción para agregar un nuevo cargo */}
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => {
                        GLOBAL.showPopup(
                          <CreateCargo closeFunc={closeAndUpdate} />,
                          "500px"
                        );
                      }}
                    >
                      Agregar
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* Opción para editar un cargo existente */}
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => {
                        GLOBAL.showPopup(
                          <UpdateCargo closeFunc={closeAndUpdate} />,
                          "600px"
                        );
                      }}
                    >
                      Editar
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Botón para actualizar los datos */}
            <button className="btn btn-outline-light" onClick={actualizar}>
              Actualizar
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Actions;
