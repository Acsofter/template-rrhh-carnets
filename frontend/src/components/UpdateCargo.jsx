import React from "react";
import { useState, useEffect } from "react";
import userServices from "../services/user.service";
import { toast } from "react-toastify";

const UpdateCargo = ({ closeFunc }) => {
  // Estados para manejar los datos del cargo
  const [cargo, setCargo] = useState();
  const [newCargo, setNewCargo] = useState("");
  const [cargos, setCargos] = useState([]);

  const [departamentos, setDepartamentos] = useState([]);
  const [departamento, setDepartamento] = useState({});

  // Función para manejar la actualización del cargo
  const updateHandler = (e) => {
    e.preventDefault();
    if (!cargo) return;

    newCargo &&
      userServices
        .putCargo(cargo.Id, {
          Descripcion:
            newCargo == cargo.Descripcion ? cargo.Descripcion : newCargo,
          Departamento: departamento.Id,
        })
        .then((x) => {
          if (!x) return;
          toast.success("Cargo actualizado");
          closeFunc();
        });
  };

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.id;

    switch (name) {
      case "Cargos":
        const item = cargos.filter((item) => item.Id == value)[0];
        setNewCargo(item.Descripcion);
        setCargo(item);
        setDepartamento(
          departamentos.filter((dept) => dept.Id == item.Departamento)[0]
        );
        break;
      case "NewCargo":
        setNewCargo(value);
        break;
      case "Departamento":
        setDepartamento(departamentos.filter((item) => item.Id == value)[0]);
        break;
      default:
        break;
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    async function get_infos() {
      const depts = await userServices.getDepartamentos();
      depts && setDepartamentos(depts.data);

      const _cargos = await userServices.getCargos();
      _cargos && setCargos(_cargos.data);
    }
    get_infos();
  }, []);

  return (
    <div className="create-cargo">
      <p
        className="fw-bold fs-4 align-middle"
        style={{ color: "#003876dd", textAlign: "center" }}
      >
        ACTUALIZAR CARGO
      </p>
      <hr className="text-secondary" />

      <form className="row g-3">
        {/* Selector de cargos */}
        <div className="col-md-6">
          <label htmlFor="Cargos" className="form-label fw-bold">
            Cargos
          </label>
          <select
            className="form-select"
            id="Cargos"
            defaultValue=""
            onChange={handleChange}
            required
          >
            <option disabled type="others" value={""}>
              Choose...
            </option>
            {cargos?.length > 0 &&
              cargos.map((item) => {
                return (
                  <option value={item.Id} key={item.Id}>
                    {item.Descripcion}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Campo para el nuevo nombre del cargo */}
        <div className="col-md-6">
          <label htmlFor="Nombre" className="form-label ">
            Nuevo nombre
          </label>
          <input
            type="text"
            value={newCargo}
            onChange={handleChange}
            className="form-control"
            id="NewCargo"
            required
          />
        </div>

        {/* Selector de departamento */}
        <div className="col-md-12">
          <label htmlFor="Departamento" className="form-label">
            Departamento
          </label>
          <select
            className="form-select"
            id="Departamento"
            value={departamento.Id ? departamento.Id : ""}
            onChange={handleChange}
            required
          >
            <option disabled type="others" value={""}>
              Choose...
            </option>
            {departamentos?.length > 0 &&
              departamentos.map((dept) => {
                return (
                  <option value={dept.Id} key={dept.Id}>
                    {dept.Descripcion}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Botón para editar el cargo */}
        <div className="col-2">
          <button
            className="btn btn-primary ml-4"
            onClick={updateHandler}
            type="submit"
          >
            Editar
          </button>
        </div>
        {/* Botón para eliminar el cargo (comentado) */}
        {/* <div className="col-10">
        <button className="btn btn-danger"  onClick={() =>{ if (cargo.Id)  showPopup(<DeleteElement id={cargo.Id} type={"cargo"} updateTable={closeFunc} message={"Tambien se eliminaran los empleados que lleven asignado este cargo"}/>)}} type="submit">Eliminar</button>
        </div> */}
      </form>
    </div>
  );
};

export default UpdateCargo;
