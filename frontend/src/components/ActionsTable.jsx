import { Link } from "react-router-dom";
import userServices from "../services/user.service";

// Menu de acciones de la tabla Home
const ActionsTable = ({
  order,
  setOrder,
  showRows,
  search,
  setSearch,
  current,
  actualizar,
}) => {
  // Obtiene las informaciones segun el orden seleccionado
  const handleTableActions = (e) => {
    e.preventDefault();

    const orderId = e.target.id;
    setOrder(orderId);
    showRows(userServices.getEmpleados(undefined, current, orderId, search));
  };

  // Obtiene las infomaciones que coincidan con las busquedas
  const handleSearch = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rows = await userServices.getEmpleados(
      undefined,
      undefined,
      order,
      search
    );
    const promRows = new Promise((res, rej) => {
      res(rows);
    });

    promRows.then((response) => {
      if (response.data.count === 0) {
        actualizar();
      } else {
        showRows(promRows);
      }
    });
  };

  return (
    <>
      <ul className="nav nav-tabs z-index-n1 position-absolute">
        <li className="nav-item dropdown">
          <Link
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            role="button"
            aria-expanded="false"
          >
            Ordenar por: <span className="fw-bold">{order || "default"}</span>
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link
                className="dropdown-item"
                id="Nombre"
                onClick={handleTableActions}
              >
                Nombre
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                id="Apellido"
                onClick={handleTableActions}
              >
                Apellido
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                id="Cedula"
                onClick={handleTableActions}
              >
                Cedula
              </Link>
            </li>
            {/* <li><hr className="dropdown-divider"/></li> */}
            <li>
              <Link
                className="dropdown-item"
                id="Cargo"
                onClick={handleTableActions}
              >
                Cargo
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <div className="input-group">
            <input
              type="search"
              className="form-control rounded"
              onKeyDown={(e) => {
                e.key == "Enter" && search && handleSearch(e);
              }}
              placeholder="Buscar..."
              aria-label="Search"
              aria-describedby="search-addon"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              data-mdb-ripple-init
              onClick={handleSearch}
            >
              ir
            </button>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ActionsTable;
