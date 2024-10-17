import React, { useContext, useState } from "react";
import AuthServices from "../services/auth.service";
import { toast } from "react-toastify";
import ImgLogin from "../assets/images/login.jpg";
import { AuthenticateContext } from "../services/Context";
import userServices from "../services/user.service";
import Actions from "./Actions";

const Register = () => {
  const auth = useContext(AuthenticateContext);

  // Estados para almacenar los datos del formulario
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [superuser, setSuperuser] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para manejar el envío del formulario
  const formSubmited = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Verificar que las contraseñas coincidan
    if (!(pass === pass2)) {
      toast.warning("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Llamada al servicio de registro
    await AuthServices.Register(user, email, pass, superuser)
      .then((response) => {
        const message = `usuario: ${response.data.user.username}, email: ${response.data.user.email}. creado!`;
        toast.success(message);
      })
      .catch(() => {
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Función para verificar permisos y autenticación
  const checkPermissionsAndAuth = () => {
    if (auth.authenticated) {
      if (userServices.getCurrentUser().roles.includes("superuser")) {
        return true;
      }
    }

    return false;
  };

  return (
    checkPermissionsAndAuth() && (
      <>
        <div className="table">
          <Actions></Actions>
        </div>
        <div className="register">
          <div className="register-container">
            {/* <div className="img-login-wrapper">
            </div> */}
            <div className="form-register-wrapper">
              <p className="fw-bold fs-1 mb-3 ">Registro</p>
              {/* Formulario de registro */}
              <form onSubmit={(e) => formSubmited(e)} className="form-register">
                {/* Campo de usuario */}
                <div className="mb-1">
                  <label
                    htmlFor="inputUser"
                    className="form-label fw-semibold "
                  >
                    Usuario
                  </label>
                  <input
                    onChange={(e) => setUser(e.target.value)}
                    type="text"
                    id="inputUser"
                    className="form-control col-12"
                    name="user"
                    aria-describedby="emailHelp"
                    required
                  />
                  <div id="emailHelp" className="form-text"></div>
                </div>
                {/* Campo de correo electrónico */}
                <div className="mb-1">
                  <label
                    htmlFor="inputEmail"
                    className="form-label fw-semibold"
                  >
                    Correo Electronico
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    id="inputEmail"
                    className="form-control "
                    name="email"
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    aria-describedby="emailHelp"
                    required
                  />
                  <div id="emailHelp" className="form-text"></div>
                </div>
                {/* Campo de contraseña */}
                <div className="mb-1 ">
                  <label htmlFor="inputPass" className="form-label fw-semibold">
                    Contraseña
                  </label>
                  <input
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    id="inputPass"
                    className="form-control "
                    pattern="(?=.*[A-Za-z]).{8,}"
                    title="Debe contener al menos 8 caracteres y alguna letra"
                    name="password"
                    required
                  />
                </div>
                {/* Campo de confirmación de contraseña */}
                <div className="mb-1">
                  <label
                    htmlFor="inputPass2"
                    className="form-label fw-semibold"
                  >
                    Confirmar Contraseña
                  </label>
                  <input
                    onChange={(e) => setPass2(e.target.value)}
                    type="password"
                    id="inputPass2"
                    className="form-control"
                    pattern="(?=.*[A-Za-z]).{8,}"
                    title="Debe contener al menos 8 caracteres y alguna letra "
                    name="password2"
                    required
                  />
                </div>

                {/* Checkbox para agregar privilegios de superusuario */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onClick={() => setSuperuser(!superuser)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Agregar privilegios
                  </label>
                </div>
                <div>
                  {/* Botón de registro */}
                  {!loading ? (
                    <button
                      type="submit"
                      className="btn btn-primary position-relative"
                    >
                      Registrarse
                    </button>
                  ) : (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-grow spinner-grow-sm"
                        aria-hidden="true"
                      ></span>
                      <span role="status"> Cargando..</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Register;
