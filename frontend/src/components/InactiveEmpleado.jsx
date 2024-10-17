import React, { useContext } from "react";
import { useState, useEffect } from "react";
import userServices from "../services/user.service";
import { toast } from "react-toastify";
import Carnet from "./Carnet";
import { AppContext, AuthenticateContext } from "../services/Context";
import UpdateEmpleado from "./UpdateEmpleado";

const InactiveEmpleado = ({ empleadoId, updateTable }) => {
  const GLOBAL = useContext(AppContext);
  const auth = useContext(AuthenticateContext);

  // Estados para almacenar la información del empleado
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState();
  const [RazonDeEliminacion, setRazonDeEliminacion] = useState("");

  // Función para manejar la reactivación del empleado
  const handleSubmit = async (e) => {
    e.preventDefault();

    await userServices
      .putEmpleado(empleadoId, { Suspendido: false })
      .then((empleado_data) => {
        toast.success(`Usuario Habilitado!`);
        GLOBAL.showPopup(
          <UpdateEmpleado
            empleadoId={empleado_data.data.Id}
            updateTable={updateTable}
          />,
          "900px"
        );
        updateTable();
      });
  };

  // Función para obtener y actualizar la información del empleado
  const updateEmpleadoId = async () => {
    const xempleado = await userServices
      .getEmpleado(empleadoId)
      .then((data_empleado) => {
        return data_empleado.data;
      });

    setNombre(xempleado.Nombre);
    setApellido(xempleado.Apellido);
    setCedula(xempleado.Cedula);
    setFotoPerfil(xempleado.foto_file);
    setRazonDeEliminacion(xempleado.RazonDeEliminacion ?? "");

    return xempleado;
  };

  // Efecto para cargar la información del empleado al montar el componente
  useEffect(
    () => {
      console.log("auth.authenticated", auth.authenticated);
      const setInformationUser = async () => {
        const xempleado = await updateEmpleadoId();

        await userServices.getCargos().then((data_cargos) => {
          const xcargo = data_cargos.data.filter(
            (cargx) => cargx.Id === xempleado.Cargo
          )[0];
          setCargo(xcargo.Descripcion);

          userServices.getDepartamentos().then((data_depts) => {
            const xdepartamento = data_depts.data.filter(
              (dept) => dept.Id === xcargo.Departamento
            )[0];
            setDepartamento(xdepartamento.Descripcion);
          });
        });
        return;
      };
      setInformationUser();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [empleadoId, setLoading]
  );

  return (
    auth.authenticated && (
      <>
        <p
          className="fw-bold fs-4 align-middle"
          style={{ color: "#003876dd", textAlign: "center" }}
        >
          SUSPENDIDO
        </p>
        <hr className="m-0 mb-4 fs-4 text-secondary" />
        <div className="create-empleado">
          {/* Formulario para mostrar y editar la información del empleado */}
          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Campos de información del empleado */}
            <div className="col-md-4">
              <label htmlFor="Nombre" className="form-label fw-bold">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                className="form-control"
                id="Nombre"
                disabled
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="Apellido" className="form-label fw-bold">
                Apellido
              </label>
              <input
                value={apellido}
                type="text"
                className="form-control"
                id="Apellido"
                disabled
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="Cedula" className="form-label fw-bold">
                Cedula
              </label>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupPrepend2">
                  #
                </span>
                <input
                  type="tel"
                  value={cedula}
                  pattern="[0-9]{11}"
                  className="form-control"
                  id="Cedula"
                  aria-describedby="inputGroupPrepend2"
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="Cargo" className="form-label">
                Cargo
              </label>
              <input
                type="text"
                value={cargo}
                className="form-control"
                id="Cargo"
                disabled
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="Departamento" className="form-label ">
                Departamento
              </label>
              <input
                type="text"
                value={departamento}
                className="form-control"
                id="Departamento"
                disabled
              />
            </div>

            <div className="col-md-12">
              <label htmlFor="txt_comentario" className="form-label">
                Razon de exclusion
              </label>
              <textarea
                className="form-control txt_comentario"
                id="txt_comentario"
                rows="3"
                value={RazonDeEliminacion}
                disabled
              ></textarea>
            </div>

            {/* Botón para habilitar al empleado */}
            <div className="col-md-3">
              {!loading ? (
                <button
                  type="submit"
                  className="btn btn-primary position-relative"
                >
                  Habilitar
                </button>
              ) : (
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    className="spinner-grow spinner-grow-sm"
                    aria-hidden="true"
                  ></span>
                  <span role="status"> Cargando</span>
                </button>
              )}
            </div>
          </form>
          {/* Componente para mostrar el carnet del empleado */}
          <div className="carnet-view">
            <Carnet
              nombre={`${nombre}  ${apellido}`}
              foto={fotoPerfil}
              departamento={departamento}
              cargo={cargo}
            />
          </div>
        </div>
      </>
    )
  );
};

export default InactiveEmpleado;
