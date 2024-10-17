import React, { useContext } from "react";
import { useState, useEffect } from "react";
import userServices from "../services/user.service";
import { toast } from "react-toastify";
import { AppContext } from "../services/Context";

const UpdateDepartamento = ({ closeFunc }) => {
  const { showPopup } = useContext(AppContext);

  // Estados para manejar los datos del departamento
  const [departamentos, setDepartamentos] = useState([]);
  const [newDepartamento, setNewDepartamento] = useState("");
  const [departamento, setDepartamento] = useState([]);

  // Función para manejar la actualización del departamento
  const updateHandler = (e) => {
    e.preventDefault();

    newDepartamento &&
      userServices
        .putDepartamento(departamento.Id, {
          Descripcion: newDepartamento,
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
      case "NewDepartamento":
        setNewDepartamento(value);
        break;
      case "Departamentos":
        const item = departamentos.filter((item) => item.Id == value)[0];
        setDepartamento(item);
        setNewDepartamento(item.Descripcion);
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
    }
    get_infos();
  }, []);

  return (
    <div className="create-cargo">
      <p
        className="fw-bold fs-4 align-middle"
        style={{ color: "#003876dd", textAlign: "center" }}
      >
        ACTUALIZAR DEPARTAMENTO
      </p>
      <hr className="text-secondary" />

      <form className="row g-3">
        {/* Selector de departamentos */}
        <div className="col-md-12">
          <label htmlFor="Departamentos" className="form-label fw-bold">
            Elegir departamento
          </label>
          <select
            className="form-select"
            id="Departamentos"
            defaultValue=""
            onChange={handleChange}
            required
          >
            <option disabled type="others" value={""}>
              Choose...
            </option>
            {departamentos?.length > 0 &&
              departamentos.map((item) => {
                return (
                  <option value={item.Id} key={item.Id}>
                    {item.Descripcion}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Campo para el nuevo nombre del departamento */}
        <div className="col-md-12">
          <label htmlFor="Nombre" className="form-label ">
            Nuevo nombre
          </label>
          <input
            type="text"
            value={newDepartamento}
            onChange={handleChange}
            className="form-control"
            id="NewDepartamento"
            required
          />
        </div>

        {/* Botón para editar el departamento */}
        <div className="col-2">
          <button
            className="btn btn-primary ml-4"
            onClick={updateHandler}
            type="submit"
          >
            Editar
          </button>
        </div>
        {/* Botón para eliminar el departamento (comentado) */}
        {/* <div className="col-10">
        <button className="btn btn-danger"  onClick={() => {if (departamento.Id) showPopup(<DeleteElement id={departamento.Id} type={"departamento"} updateTable={closeFunc} message={"Tambien se eliminaran los cargos y empleados asignados a este departamento"}/>)}} type="submit">Eliminar</button>
        </div> */}
      </form>
    </div>
  );
};

export default UpdateDepartamento;
