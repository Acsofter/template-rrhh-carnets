import { Link } from "react-router-dom";
import AuthServices from "../services/auth.service";
import userServices from "../services/user.service";
import logo from "../assets/images/logo-.png";
import { useContext } from "react";
import { AuthenticateContext } from "../services/Context";
import avatarImg from "../assets/images/avatar.png";

// Componente de encabezado principal
const Header = () => {
  const auth = useContext(AuthenticateContext);
  const user = userServices.getCurrentUser();

  return (
    auth.authenticated && (
      <div className="header ">
        {/* Sección del título y logo */}
        <div className="title-header d-flex justify-content-center align-items-center flex-column flex-nowrap">
          <img src={logo} alt="" width={120} className="align-center" />
          <div>
            <h2 className="text-center align-middle fw-bold mt-2">
              {" "}
              RECURSOS HUMANOS{" "}
              <span className="badge bg-danger ">
                {new Date().getFullYear()}
              </span>
            </h2>
          </div>
        </div>
        {/* Barra de navegación */}
        <nav className="navbar navbar-expand-lg bg-body-tertiary p-0 ">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto"></ul>
              <span className="navbar-text">
                <div className="">
                  <ul className="navbar-nav">
                    {/* Menú desplegable del usuario */}
                    <li className="nav-item dropdown dropstart">
                      <Link
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img src={avatarImg} alt="" width={30} />
                      </Link>
                      <ul className="dropdown-menu">
                        {/* Nombre de usuario */}
                        <Link className="dropdown-item disabled fw-bold">
                          <img src={avatarImg} alt="" width={20} />{" "}
                          {user.username}
                        </Link>
                        <hr className="dropdown-divider" />

                        {/* Opción para actualizar contraseña */}
                        <li>
                          <Link
                            className="dropdown-item fw-normal text-decoration-none"
                            aria-current="page"
                            to="/actualizarclave"
                          >
                            Actualizar
                          </Link>
                        </li>
                        <hr className="dropdown-divider" />
                        {/* Opción de registro (solo para superusuarios) */}
                        {user.roles.includes("superuser") && (
                          <li>
                            <Link
                              className=" dropdown-item fw-normal text-decoration-none"
                              aria-current="page"
                              to="/register"
                            >
                              Registrar
                            </Link>
                          </li>
                        )}
                        <hr className="dropdown-divider" />
                        {/* Opción para cerrar sesión */}
                        <li>
                          <Link
                            className="dropdown-item text-danger fw-bold text-decoration-none"
                            aria-current="page"
                            onClick={AuthServices.Logout}
                          >
                            Cerrar Sesion
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </span>
            </div>
          </div>
        </nav>
      </div>
    )
  );
};

export default Header;
