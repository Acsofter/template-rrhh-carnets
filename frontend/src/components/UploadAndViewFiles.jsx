import React from "react";
import { TbCloudUp, TbCloudX } from "react-icons/tb";

const UploadFiles = ({ files, setFiles, Eliminated, setEliminated }) => {
  // Estado para manejar el arrastre de archivos (comentado)
  // const [dragEnter, setDragEnter] = useState();
  console.log(
    "files, setFiles, Eliminated, setEliminated: ",
    files,
    setFiles,
    Eliminated,
    setEliminated
  );

  // Función para separar el nombre y la extensión del archivo
  const separate_name_and_extension = (filename) => {
    const splitted = filename.split(".");
    return {
      name: splitted.slice(0, splitted.length - 1).join("."),
      ext: splitted[splitted.length - 1],
    };
  };

  // Función para obtener el icono del archivo según su extensión
  const get_icon_file = React.useCallback(({ ext }) => {
    try {
      return require(`../assets/icons/${ext}.png`);
    } catch (error) {
      return require(`../assets/icons/undefined.png`);
    }
  }, []);

  // Manejador para cuando se sueltan archivos en la zona de arrastre
  const handle_drop = async (event) => {
    event.preventDefault();

    const files_received = Array.from(event.dataTransfer.files);
    await handlefiles(files_received);
  };

  // Función para procesar los archivos recibidos
  const handlefiles = async (files_received) => {
    let documentos_to_add = [];

    for (const file_details of files_received) {
      const reader = new FileReader();
      reader.readAsDataURL(file_details);

      const result = await new Promise((resolve) => {
        reader.onload = ({ target }) => {
          resolve(target?.result ?? null);
        };
      });

      if (result && typeof result === "string")
        documentos_to_add.push({
          id: Date.now() + files.indexOf(file_details),
          nombre: file_details.name,
          tamano: file_details.size,
          tipo: file_details.type,
          file: result.split(",")[1],
          fecha_creacion: new Date(),
        });
    }

    if (documentos_to_add.length > 0) {
      setFiles([...files, ...documentos_to_add]);
    }

    // Manejador para la selección de archivos mediante el botón
    const handle_file_select = (event) => {
      if (event.target.files) {
        const files = Array.from(event.target.files);
        handlefiles(files);
      }
    };

    // Función para eliminar un documento
    const eliminar_documento = (id) => {
      setEliminated([...Eliminated, id]);
      setFiles(files.filter((file) => file.id !== id));
    };

    // Componente de interfaz de usuario
    return (
      <div className="">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="custom-file-upload">
            <input
              type="file"
              id="dropzone-file"
              multiple
              onChange={handle_file_select}
              style={{ display: "none" }}
            />
            <div
              className="file-drop-area"
              onDrop={handle_drop}
              onDragOver={(event) => event.preventDefault()}
            >
              <svg
                className="file-icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                {/* SVG Path */}
              </svg>
              <p className="file-text">
                <span className="font-semibold">Pulsa para seleccionar</span> o
                arrastrar tus archivos
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400"></p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
        {/* Lista de archivos */}
        <ul className="file-list">
          {files.map((doc, index) => (
            <li key={doc.id} className="file-item">
              <span className="file-index">{index + 1}. </span>
              <img
                className="file-icon"
                src={get_icon_file(separate_name_and_extension(doc.nombre))}
                alt=""
              />
              <span className="w-full ">
                {doc.nombre.split("+uid+")[0]}{" "}
                <span className="text-gray-400 text-[.6rem]">
                  ({(doc.tamano / 1024).toFixed(2)} KB){" "}
                  {doc.file ? (
                    <TbCloudX className={`inline-block w-4 text-red-500`} />
                  ) : (
                    <TbCloudUp className={`inline-block w-4 text-green-500`} />
                  )}
                </span>
              </span>
              <button
                className="btn btn-danger"
                onClick={() => eliminar_documento(doc.id)}
              >
                x
              </button>
            </li>
          ))}
        </ul>
        {/* Contador de archivos */}
        <span className="text-xs text-slate-500 dark:text-gray-300 text-right w-full block pt-1">
          <span className="font-semibold">{files.length}</span> archivos en
          total...
        </span>
      </div>
    );
  };
};
export default UploadFiles;
