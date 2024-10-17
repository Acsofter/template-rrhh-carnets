import React, { useContext } from "react";
import { useState, useEffect } from "react";
import userServices from "../services/user.service";
import { AppContext } from "../services/Context";

const UpdateHistorial = ({ historialId, updateTable }) => {
  const GLOBAL = useContext(AppContext);
  // Estados para almacenar la información del historial
  const [nombre, setNombre] = useState("");
  const [comentario, setComentario] = useState(undefined);
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState(0);
  const [impreso, setImpreso] = useState(false);
  const [entregado, setEntregado] = useState(false);
  const [cargo, setCargo] = useState("");
  const [departamento, setDepartamento] = useState("");

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.id;

    switch (name) {
      case "sw_entregado":
        setEntregado(!entregado);
        break;
      // case "sw_impreso":
      // setImpreso(!impreso);
      // break;
      case "txt_comentario":
        setComentario(value);
        break;
      default:
        break;
    }
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    await userServices.putHistory(historialId, {
      // EstaImpreso: impreso,
      FueEntregado: entregado,
      Comentario: comentario !== "" ? comentario : null,
    });
    updateTable();
    GLOBAL.closePopup();
  };

  // Efecto para cargar la información inicial del historial
  useEffect(() => {
    const setInformationUser = async () => {
      await userServices.getHistoryId(historialId).then((data_hist) => {
        const xempleado = data_hist.data.desc_empleado;
        setNombre(xempleado.Nombre);
        setApellido(xempleado.Apellido);
        setCedula(xempleado.Cedula);
        setImpreso(data_hist.data.EstaImpreso);
        setEntregado(data_hist.data.FueEntregado);
        setComentario(data_hist.data.Comentario || "");
        setDepartamento(data_hist.data.DepartamentoAlMomentoDeImprimir);
        setCargo(data_hist.data.CargoAlMomentoDeImprimir);
      });
    };
    setInformationUser();
  }, [historialId]);

  return (
    <>
      <p
        className="fw-bold fs-4 align-middle"
        style={{ color: "#003876dd", textAlign: "center" }}
      >
        DETALLES
      </p>
      <hr className="m-0 mb-4 fs-4 text-secondary" />
      <div className="create-empleado">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Campos de información del empleado */}
          <div className="col-md-4">
            <p className="form-label fw-bold">Nombre</p>
            <p>{nombre}</p>
          </div>
          <div className="col-md-4">
            <p className="form-label fw-bold">Apellido</p>
            <p>{apellido}</p>
          </div>
          <div className="col-md-4">
            <p className="form-label fw-bold">Cedula</p>
            <p>{cedula}</p>
          </div>
          <div className="col-md-4">
            <p className="form-label fw-bold">Cargo</p>
            <p>{cargo}</p>
          </div>
          <div className="col-md-8">
            <p className="form-label fw-bold">Departamento</p>
            <p>{departamento}</p>
          </div>
          <hr />
          {/* Campo de comentario */}
          <div className="col-md-12">
            <label htmlFor="txt_comentario" className="form-label">
              Comentario
            </label>
            <textarea
              className="form-control txt_comentario"
              id="txt_comentario"
              rows="3"
              value={comentario}
              onChange={handleChange}
            ></textarea>
          </div>
          {/* Switches para impreso y entregado */}
          <div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="sw_impreso"
                onChange={handleChange}
                checked={impreso}
                disabled
              />
              <label className="form-check-label" htmlFor="sw_impreso">
                Impreso
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="sw_entregado"
                onChange={handleChange}
                checked={entregado}
              />
              <label className="form-check-label" htmlFor="sw_entregado">
                Entregado
              </label>
            </div>
          </div>
          {/* Botón de actualizar */}
          <div className="col-md-4">
            <button className="btn btn-primary mb-4" type="submit">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateHistorial;
