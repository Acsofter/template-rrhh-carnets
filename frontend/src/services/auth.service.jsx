// import "dotenv/config"
import axios from "axios";
import { toast } from "react-toastify";
import authHeader from "./auth-header";

const debug = false;
const baseURL = debug
  ? "http://127.0.0.1:8000/api/v1/carnets"
  : "http://172.17.200.11:9090/api/v1/carnets";

// Función para registrar un nuevo usuario
const Register = async (username, email, password, superuser = false) => {
  try {
    const data = {
      username: username,
      email: email,
      password: password,
    };

    const usuario = await axios
      .post(
        superuser ? `${baseURL}/register/superuser` : `${baseURL}/register`,
        data,
        {
          headers: authHeader(),
        }
      )
      .catch((x) => {
        toast.error(x.message);
        return false;
      });
    return usuario;
  } catch (error) {
    console.log("error", error);
  }
};

// Función para actualizar la contraseña del usuario
const UpdatePass = async (currentPassword, newPassword) => {
  try {
    const data = {
      currentPassword: currentPassword,
      password: newPassword,
    };

    const usuario = await axios
      .put(`${baseURL}/user`, data, {
        headers: authHeader(),
      })
      .then((response) => {
        const user_info = response.data.user;
        localStorage.setItem("user", JSON.stringify(user_info.token));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${user_info.token}`;
        return true;
      })
      .catch((x) => {
        toast.error(x.response.data.user.message || x.message);
        console.log("error", x.response.data.user.message);
        return false;
      });

    return usuario;
  } catch (error) {
    toast.error(error);
    console.log("error", error);
  }
};

// Función para iniciar sesión
const Login = async (username, password) => {
  try {
    const data = {
      username: username,
      password: password,
    };

    const user = await axios
      .post(`${baseURL}/login`, data)
      .then((res) => {
        const user_info = res.data.user;
        localStorage.setItem("user", JSON.stringify(user_info.token));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${user_info.token}`;
        return res.data;
      })
      .catch((x) => {
        if (x.response.status === 400) {
          toast.warning("Credenciales incorrectas");
          return false;
        }
        toast.error(x.response);
        return false;
      });
    return user;
  } catch (error) {
    console.log(error);
  }
};

// Función para cerrar sesión
const Logout = () => {
  const data = localStorage.removeItem("user");
  window.location.href = "/login";
  return data;
};

// Función para verificar el token del usuario
const Check_token = async () => {
  try {
    const headers = authHeader();
    if (!headers.Authorization) return false;

    const user = await axios
      .get(`${baseURL}/user`, {
        headers: headers,
      })
      .then((data) => {
        return true;
      })
      .catch((x) => {
        toast.error(x.message);
        console.log("error", x);
        AuthServices.Logout();
        return false;
      });

    return user;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

// Objeto con todos los servicios de autenticación
const AuthServices = {
  Login,
  Register,
  Logout,
  UpdatePass,
  Check_token,
  baseURL,
};

export default AuthServices;
