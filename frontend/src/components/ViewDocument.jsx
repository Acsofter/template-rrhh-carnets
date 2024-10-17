import React, { useEffect, useState } from "react";
import userServices from "../services/user.service";

const ViewDocument = (documentId) => {
  const [file, setFile] = useState();

  // Función para obtener el icono del archivo según su extensión
  const getIconFIle = (filename) => {
    let ext = filename.split(".").slice(-1);

    try {
      return require(`../assets/icons/${ext}.png`);
    } catch (error) {
      return require(`../assets/icons/undefined.png`);
    }
  };

  // Función para obtener y mostrar el archivo
  const getFile = () => {
    userServices.getDocument(65).then((res) => {
      const format = res.data.Tipo;
      if (format.includes("image")) {
        // Si es una imagen, mostrarla directamente
        setFile(<img src={res.data.File} alt={res.data.Nombre} />);
      } else if (format.includes("pdf")) {
        // Si es un PDF, mostrarlo en un iframe
        setFile(
          <iframe
            src={res.data.File}
            title={res.data.Nombre}
            width="100%"
            height="600px"
          />
        );
      } else {
        // Para otros tipos de archivos, mostrar un icono y un enlace de descarga
        setFile(
          <div>
            <a href={res.data.File} download={format}>
              <img src={getIconFIle(res.data.Nombre)} alt="" />
            </a>
          </div>
        );
      }
    });
  };

  // Efecto para cargar el archivo al montar el componente
  useEffect(() => {
    getFile();
  }, []);

  return <div>{file}</div>;
};

export default ViewDocument;
