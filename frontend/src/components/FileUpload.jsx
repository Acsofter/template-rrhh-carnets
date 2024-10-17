import React, { useState } from "react";
import {
  PiNumberCircleOne,
  PiNumberCircleTwo,
  PiNumberCircleThree,
} from "react-icons/pi";

// import { Step1 } from "./Step1";
// import { Step2 } from "./Step2";
// import { Step3 } from "./Step3";

// Contexto para compartir datos del proceso de carga de archivos
export const FileUploadContext = React.createContext({
  fileData: {},
  uploadStatus: {},
  setFileData: (args) => {},
  setUploadStatus: (args) => {},
  nextStep: () => {},
});

export const FileUpload = () => {
  // Estado para almacenar los datos del archivo
  const [fileData, setFileData] = useState([]);
  // Estado para almacenar el estado de carga de cada fila
  const [uploadStatus, setUploadStatus] = useState([{ status: "pending" }]);
  // Estado para controlar el paso actual del proceso
  const [step, setStep] = useState(0);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    fileData.forEach(async (row, index) => {
      if (uploadStatus[index].status === "pending") {
        console.log("index: ", index);
        // Aquí iría la lógica de carga al servidor (comentada actualmente)
        
        // Actualiza el estado de carga para esta fila
        setUploadStatus((prev) => {
          const copy = [...prev];
          copy[index] = { status: "success" };
          return copy;
        });
      }
    });

    nextStep();
  };

  // Definición de los pasos del proceso
  const steps = [
    {
      title: "Cargar Archivo",
      icon: <PiNumberCircleOne className="inline mx-1 text-xl" />,
      content: <></>,
    },
    {
      title: "Enviar Informaciones",
      icon: <PiNumberCircleTwo className="inline mx-1 text-xl" />,
      content: <></>,
    },
    {
      title: "Finalizar",
      icon: <PiNumberCircleThree className="inline mx-1 text-xl" />,
      content: <></>,
    },
  ];

  // Función para avanzar al siguiente paso
  const nextStep = () => setStep(step + 1);

  return (
    <FileUploadContext.Provider
      value={{ fileData, uploadStatus, setUploadStatus, setFileData, nextStep }}
    >
      <div className="container-fluid p-4 w-100">
        {/* Línea de tiempo horizontal (actualmente estática) */}
        <div class="container-fluid">
          {/* ... (código de la línea de tiempo) ... */}
        </div>

        {/* Contenedor para el contenido del paso actual */}
        <div className="border border-top-0 border-bottom-0 p-5">
          {/* {steps[step].content} */}
        </div>

        {/* Barra de navegación inferior */}
        <div className="border rounded-bottom p-4 d-flex justify-content-between">
          {step > 0 && (
            <>
              {/* Botón para retroceder */}
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => setStep(step - 1)}
              >
                Atrás
              </button>
              {/* Botón para cancelar */}
              <button className="btn btn-secondary mx-1">Cancelar</button>
            </>
          )}
          {step === 1 && (
            // Botón para enviar (solo visible en el paso 1)
            <button className="btn btn-success mx-1" onClick={handleSubmit}>
              Enviar
            </button>
          )}
        </div>
      </div>
    </FileUploadContext.Provider>
  );
};
