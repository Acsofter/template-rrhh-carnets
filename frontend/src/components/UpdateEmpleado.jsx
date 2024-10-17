import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import userServices from "../services/user.service";
import Carnet from "./Carnet";
import UploadFiles from "./UploadFiles";
import UploadAndViewFiles from "./UploadAndViewFiles";

const UpdateEmpleado = ({ empleadoId, updateTable }) => {
  // Estados para almacenar la información del empleado
  const [departamentos, setDepartamentos] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [cargos, setCargos] = useState();
  const [cargosAvaliables, setCargosAvaliables] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState(0);
  const [departamento, setDepartamento] = useState({});
  const [cargo, setCargo] = useState({});
  const [documentos, setDocumentos] = useState([]);
  const [entrega_pendiente, setEntregaPendiente] = useState([]);
  const [impresion_pendiente, setImpresionPendiente] = useState([]);
  const [cargoImprimir, setCargoImprimir] = useState();
  const [departamentoImprimir, setDepartamentoImprimir] = useState();
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);

  // Función para imprimir el carnet
  const printCarnet = () => {
    html2canvas(document.querySelector("#print-carnet")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 0.1);
      const pdf = new jsPDF("p", "cm", [5.2, 8.5]);
      pdf.addImage(imgData, "JPEG", 0, 0, 5.2, 8.5);

      pdf.autoPrint();
      pdf.output("dataurlnewwindow");

      // window.open(pdf.output('bloburl'), '_blank');
    });
  };

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    setChanges(true);

    const value = e.target.value;
    const name = e.target.id;

    switch (name) {
      case "Nombre":
        setNombre(value);
        break;
      case "Apellido":
        setApellido(value);
        break;
      case "Cedula":
        setCedula(value);
        break;
      case "Departamento":
        DepartamentoInput(value);
        break;
      case "Cargo":
        CargoInput(value);
        break;
      default:
        break;
    }
  };

  // Manejador para imprimir el carnet
  const HandlerClickPrint = async (e) => {
    if (changes) {
      toast.warning("Favor guardar los cambios");
      return;
    }
    const response = await userServices.setHistorial({
      EstaImpreso: true,
      FueEntregado: false,
      CargoAlMomentoDeImprimir: cargoImprimir,
      DepartamentoAlMomentoDeImprimir: departamentoImprimir,
      Comentario: null,
      Empleado: empleadoId,
    });
    if (!response) {
      toast.error("Error al imprimir el carnet");
      return;
    }
    printCarnet();
    updateEmpleadoId();
    toast.success("Carnet impreso exitosamente");
  };

  // Función para manejar la selección de departamento
  const DepartamentoInput = (deptId) => {
    if (departamentos !== undefined) {
      const dept_info = departamentos.filter((dept) => dept.Id == deptId)[0];
      const cargos_avaliables = cargos.filter(
        (item) => item.Departamento == deptId
      );
      setDepartamento(dept_info);
      setCargosAvaliables(cargos_avaliables);
      setCargo({});
      document.getElementById("Cargo").value = "";
    }
  };

  // Función para manejar la selección de cargo
  const CargoInput = (cargoId) => {
    if (cargos !== undefined) {
      const cargo_info = cargos.filter((item) => item.Id == cargoId)[0];
      setCargo(cargo_info);
    }
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const empleado_info = {
      Nombre: nombre,
      Apellido: apellido,
      Cedula: cedula,
      Cargo: cargo.Id,
    };

    // Manejo de documentos
    if (eliminated.length > 0) {
      eliminated.forEach((docId) => userServices.delDocumento(docId));
      setEliminated([]);
    }

    for (let doc in documentos) {
      doc = documentos[doc];

      if (!doc.hasOwnProperty("Id")) {
        const reader = new FileReader();
        reader.readAsDataURL(doc.file);
        reader.onload = async (event) => {
          const file64 = event.target.result.split(",")[1];
          const data = {
            Nombre: doc.Nombre,
            Tipo: doc.Tipo,
            Tamaño: doc.Tamaño,
            Empleado: empleadoId,
            file: file64,
          };
          await userServices.setDocumento(data);
        };
      }
      if (doc === documentos.slice(-1)[0]) {
        updateTable();
      }
    }

    // Actualización del empleado
    await userServices
      .putEmpleado(empleadoId, empleado_info)
      .then((empleado_data) => {
        const empleadoUpdateResults = empleado_data.data;
        if (empleadoUpdateResults) {
          console.log("empleadoUpdateResults", empleadoUpdateResults.data);
          updateEmpleadoId(empleadoUpdateResults.data);
          setChanges(false);
          toast.success(`Actualizado correctamente!`);
        }

        setLoading(false);
        updateTable();
      });
  };

  // Función para actualizar la información del empleado
  const updateEmpleadoId = async (data = null) => {
    const xempleado = await userServices
      .getEmpleado(empleadoId)
      .then((data_empleado) => {
        return data_empleado.data;
      });

    console.log(xempleado);
    setNombre(xempleado.Nombre);
    setApellido(xempleado.Apellido);
    setCedula(xempleado.Cedula);
    setDocumentos(xempleado.documentos);
    setEntregaPendiente(xempleado.entrega_pendiente);
    setCargoImprimir(xempleado.cargo_descripcion);
    setDepartamentoImprimir(xempleado.dept_descripcion);
    setImpresionPendiente(xempleado.impresion_pendiente);
    return xempleado;
  };

  // Efecto para cargar la información inicial del empleado
  useEffect(() => {
    const setInformationUser = async () => {
      const xempleado = await updateEmpleadoId();

      await userServices.getCargos().then((data_cargos) => {
        setCargos(data_cargos.data);
        const xcargo = data_cargos.data.filter(
          (cargx) => cargx.Id === xempleado.Cargo
        )[0];
        const cargos_avaliables = data_cargos.data.filter(
          (item) => item.Departamento === xcargo.Departamento
        );
        setCargosAvaliables(cargos_avaliables);
        setCargo(xcargo);

        userServices.getDepartamentos().then((data_depts) => {
          setDepartamentos(data_depts.data);
          const xdepartamento = data_depts.data.filter(
            (dept) => dept.Id === xcargo.Departamento
          )[0];
          setDepartamento(xdepartamento);
        });
      });
      return;
    };
    setInformationUser();
  }, []);

  return (
    <>
      <p
        className="fw-bold fs-4 align-middle"
        style={{ color: "#003876dd", textAlign: "center" }}
      >
        ACTUALIZAR
      </p>
      <hr className="m-0 mb-4 fs-4 text-secondary" />
      <div className="create-empleado">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="Nombre" className="form-label fw-bold">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={handleChange}
              className="form-control"
              id="Nombre"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="Apellido" className="form-label fw-bold">
              Apellido
            </label>
            <input
              onChange={handleChange}
              value={apellido}
              type="text"
              className="form-control"
              id="Apellido"
              required
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

                onChange={handleChange}
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
            <select
              className="form-select"
              id="Cargo"
              value={cargo.Id}
              onChange={handleChange}
              required
            >
              <option disabled type="others" value={""}>
                Choose...
              </option>
              {cargosAvaliables?.length > 0 &&
                cargosAvaliables.map((cargo) => {
                  return (
                    <option value={cargo.Id} key={cargo.Id}>
                      {cargo.Descripcion}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="Departamento" className="form-label">
              Departamento
            </label>
            <select
              className="form-select"
              id="Departamento"
              value={departamento.Id}
              onChange={handleChange}
              required
            >
              {
                /* <option  disabled type="others" value="">Choose...</option> */ console.log(
                  "departament.Id",
                  departamento.Id
                )
              }
              {departamentos?.length > 0 &&
                departamentos.map((dept) => {
                  console.log("dept", dept.Id);
                  return (
                    <option value={dept.Id} key={dept.Id}>
                      {dept.Descripcion}
                    </option>
                  );
                })}
            </select>
          </div>
          {/* <div className="mb-3 col-md-12">
            <label htmlFor="formFile" className="form-label">
              Foto perfil
            </label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              onChange={picHandler}
            />
          </div> */}
          <div className="mb-3 col-md-12">
          

            <UploadFiles
              files={documentos}
              setFiles={setDocumentos}
              Eliminated={eliminated}
              setEliminated={setEliminated}
            ></UploadFiles>
          </div>

          <div className="col-md-3">
            {!loading ? (
              <button
                type="submit"
                className="btn btn-primary position-relative"
              >
                Actualizar
                {changes && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                )}
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
          <div className="col-md-3">
            <button className="btn btn-primary " onClick={HandlerClickPrint}>
              Imprimir
            </button>
          </div>

          <div className="col-md-5">
            <span className="badge text-bg-danger">
              {impresion_pendiente.length === 0
                ? ""
                : `Tiene ${impresion_pendiente.length} ${
                    impresion_pendiente.length > 1
                      ? "impresiones pendientes"
                      : "impresion pendiente"
                  }`}
            </span>
            <span className="badge text-bg-danger">
              {entrega_pendiente.length === 0
                ? ""
                : `Tiene ${entrega_pendiente.length} ${
                    entrega_pendiente.length > 1
                      ? "entregas pendientes"
                      : "entrega pendiente"
                  }`}
            </span>
          </div>
        </form>

        <div className="carnet-view">
          <Carnet
            nombre={`${nombre} ${apellido}`}
            cedula={cedula}
            departamento={departamento.Descripcion}
            cargo={cargo.Descripcion}
          />
        </div>
      </div>
    </>
  );
};

export default UpdateEmpleado;