import axios from "axios";
import authHeader from "./auth-header";
import { toast } from "react-toastify";
import AuthServices from "./auth.service";
const baseURL = AuthServices.baseURL;

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// obtener el usuario actual mediante el token
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return parseJwt(JSON.parse(user));
  } catch (e) {
    return null;
  }
};

// NOT IMPROVED
const userPermission = (user) => {};

// obtener todos los empleados paginados
const getEmpleados = async (limit = 10, offset = 0, order, search = null) => {
  offset = offset * 10;

  try {
    const empleados = await axios
      .get(`${baseURL}/empleados`, {
        params: {
          limit: limit,
          offset: offset,
          order: order,
          search: search,
        },
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
      });

    return empleados;
  } catch (error) {
    console.log("error", error);
  }
};

// obtener un empleado por el ID
const getEmpleado = async (empleadoId) => {
  try {
    const empleado = await axios
      .get(`${baseURL}/empleado/${empleadoId}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return empleado;
  } catch (error) {
    console.log("error", error);
  }
};

// Actualizar un usuario especifico
const putEmpleado = async (empleadoId, data) => {
  try {
    const empleado = await axios
      .put(`${baseURL}/empleado/${empleadoId}`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return empleado;
  } catch (error) {
    console.log("error", error);
  }
};

// Actualizar un cargo en especifico
const putCargo = async (cargoId, data) => {
  try {
    const cargo = await axios
      .put(`${baseURL}/cargo/${cargoId}`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return cargo;
  } catch (error) {
    console.log("error", error);
  }
};

// Actualizar un departamento en especifico
const putDepartamento = async (deptId, data) => {
  try {
    const departamento = await axios
      .put(`${baseURL}/departamento/${deptId}`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return departamento;
  } catch (error) {
    console.log("error", error);
  }
};

// Actualizar un historial en especifico (EstaImpreso o FueEntregado)
const putHistory = async (historyId, data) => {
  try {
    const history = await axios
      .put(`${baseURL}/historico_impresion/${historyId}`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return history;
  } catch (error) {
    console.log("error", error);
  }
};

// Actualizar una foto de perfil. NOTA: esto deberia ser "putDocument"
const putFotoPerfil = async (documentId, data) => {
  try {
    const cargo = await axios
      .put(`${baseURL}/document/${documentId}`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return cargo;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener un cargo en especifico
const getCargo = async (id) => {
  try {
    const cargo = await axios
      .get(`${baseURL}/cargo/${id}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return cargo;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener un documento en especifico
const getDocument = async (id) => {
  try {
    const document = await axios
      .get(`${baseURL}/documento/${id}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return document;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener un historial en especifico
const getHistoryId = async (historialId) => {
  try {
    const history = await axios
      .get(`${baseURL}/historico_impresion/${historialId}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });

    return history;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener un pdf de un empleado en especifico
const getCarnetView = async (empleadoId) => {
  try {
    const view = await axios
      .get(`${baseURL}/view/${empleadoId}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return view;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtenter todos los cargos sin paginacion
const getCargos = async () => {
  try {
    const cargos = await axios
      .get(`${baseURL}/cargos`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return cargos;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener todos los departamentos sin paginacion
const getDepartamentos = async () => {
  try {
    const departamentos = await axios
      .get(`${baseURL}/departamentos`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return departamentos;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener todos los historiales paginados
const getHistory = async (
  limit = 10,
  offset = 0,
  order,
  search,
  fechaInicio = "",
  fechaFinal = ""
) => {
  offset = offset * 10;
  try {
    const historial = await axios
      .get(`${baseURL}/historico_impresiones`, {
        headers: authHeader(),
        params: {
          limit: limit,
          offset: offset,
          order: order,
          search: search || null,
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        },
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return;
      });
    return historial;
  } catch (error) {
    console.log("error", error);
  }
};

// Obtener foto de perfil del usuario con su cedula
const getFotoPerfil = async (cedula) => {
  try {
    const foto = await axios
      .get(`${baseURL}/foto?cedula=${cedula}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return foto.data;
  } catch (error) {
    console.log("error", error);
  }
};

// Agregar un empleado
const setEmpleado = async (data) => {
  try {
    const empleado = await axios
      .post(`${baseURL}/empleados`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return empleado;
  } catch (error) {
    console.log("error", error);
  }
};

// Agregar un departamento
const setDepartamento = async (data) => {
  try {
    const dept = await axios
      .post(`${baseURL}/departamentos`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return dept;
  } catch (error) {
    console.log("error", error);
  }
};

// Agregar un cargo
const setCargo = async (data) => {
  try {
    const cargo = await axios
      .post(`${baseURL}/cargos`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return cargo;
  } catch (error) {
    console.log("error", error);
  }
};

// Agregar un documento
const setDocumento = async (data) => {
  try {
    const document = await axios
      .post(`${baseURL}/documentos`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return document;
  } catch (error) {
    console.log("error", error);
  }
};

// Eliminar un documento
const delDocumento = async (docId) => {
  try {
    const document = await axios
      .delete(`${baseURL}/documento/${docId}`, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return document;
  } catch (error) {
    console.log("error", error);
  }
};

// Estos metodos se han omitido para evitar problemas con la eliminacion en cascada hacia el historial

// Eliminar un empleado
// const delEmpleado = async (empleadoId, data) => {
//     const empleado = await axios.delete(
//         `${baseURL}/empleado/${empleadoId}`,
//         {
//             data: {
//             data
//         },
//             headers:
//             authHeader()
//         }).catch(
//             (x) => {
//                 toast.error(x.response.data.MESSAGE || x.response.data.detail)
//                 return
//             }
//         )
//         return empleado
// }

// Eliminar un cargo
// const delCargo = async (cargoId) => {
//     const cargo = await axios.delete(
//         `${baseURL}/cargo/${cargoId}`,
//         {
//             headers:
//             authHeader()
//         }).catch(
//             (x) => {
//                 toast.error(x.response.data.MESSAGE || x.response.data.detail)
//                 return
//             }
//         )
//         return cargo
// }

// Eliminar un departamento
// const delDepartamento = async (departamentoId) => {
//     const dept = await axios.delete(
//         `${baseURL}/departamento/${departamentoId}`,
//         {
//             headers:
//             authHeader()
//         }).catch(
//             (x) => {
//                 toast.error(x.response.data.MESSAGE || x.response.data.detail)
//                 return
//             }
//         )
//         return dept
// }

// Agregar un historial
const setHistorial = async (data) => {
  // data:
  // EstaImpreso, Fue_Entregado, Comentario, DocumentoId, EmpleadoId
  try {
    const historial = await axios
      .post(`${baseURL}/historico_impresiones`, data, {
        headers: authHeader(),
      })
      .catch((x) => {
        toast.error(x.response.data.MESSAGE || x.response.data.detail);
        return {};
      });
    return historial;
  } catch (error) {
    console.log("error", error);
  }
};

const resizeTextToFit = (divToResize) => {
  try {
    const div = document.querySelector(divToResize);
    const maxWidth = parseInt(window.getComputedStyle(div).width);
    const maxHeight = parseInt(window.getComputedStyle(div).height);
    let fontSize = parseInt(window.getComputedStyle(div).fontSize) + 1;

    let textWidth, textHeight;
    do {
      fontSize--;
      div.style.fontSize = `${fontSize}px`;
      textWidth = div.scrollWidth;
      textHeight = div.scrollHeight;
    } while ((textWidth > maxWidth || textHeight > maxHeight) && fontSize > 0);
  } catch (e) {
    console.log(e);
  }
};

const userServices = {
  userPermission,

  getEmpleados,
  getEmpleado,
  getCurrentUser,
  getCargos,
  getCargo,
  getDepartamentos,
  getDocument,
  getHistory,
  getHistoryId,
  getFotoPerfil,

  setEmpleado,
  setCargo,
  setDepartamento,
  setDocumento,
  setHistorial,

  putEmpleado,
  putCargo,
  putFotoPerfil,
  putHistory,
  putDepartamento,

  delDocumento,

  resizeTextToFit,
  // delDepartamento,
  // delEmpleado,
  // delCargo,
};

export default userServices;
