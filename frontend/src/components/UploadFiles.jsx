import { format } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-toastify";

const UploadFiles = ({ files, setFiles, Eliminated, setEliminated }) => {
  // Estado para controlar el arrastre de archivos
  // const [dragEnter, setDragEnter] = useState();
  const [dragOver, setDragOver] = useState();
  const [showDeleteOption, setShowDeleteOption] = useState(false);

  // Manejador para mostrar la opción de eliminar al pasar el mouse
  const handleMouseEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteOption(true);
  };

  // Manejador para ocultar la opción de eliminar al quitar el mouse
  const handleMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteOption(false);
  };

  // Manejador para eliminar un archivo
  const handleClickButtom = (e) => {
    e.preventDefault();
    const __files = [...files];

    if (__files.length > 0) {
      const fileDeleted = __files.splice(e.target.value, 1)[0];
      if (fileDeleted.hasOwnProperty("Id")) {
        if (setEliminated !== undefined) {
          setEliminated([...Eliminated, fileDeleted.Id]);
        }
      }
      setFiles(__files);
    } else {
      setFiles([]);
    }
  };

  // Función para obtener el icono del archivo según su extensión
  const getIconFIle = (filename, ext) => {
    try {
      return require(`../assets/icons/${ext}.png`);
    } catch (error) {
      return require(`../assets/icons/undefined.png`);
    }
  };

  // Manejador para cuando el archivo sale de la zona de arrastre
  const handleDragLeave = (e) => {
    // setDragEnter(false)
    setDragOver(false);
    e.preventDefault();
    e.stopPropagation();
  };

  // Manejador para cuando el archivo está sobre la zona de arrastre
  const handleDragOver = (e) => {
    setDragOver(true);
    e.preventDefault();
    e.stopPropagation();
  };

  // Función para separar el nombre del archivo y su extensión
  const splitFileName = (fileName) => {
    const [fileNameWithoutExtension, extension] =
      fileName.split(/\.(?=[^.]+$)/);

    if (!fileNameWithoutExtension.includes("+uid+")) {
      return [fileNameWithoutExtension, extension];
    }

    const fileNameWithoutUid = fileNameWithoutExtension.split("+uid+")[0];

    return [fileNameWithoutUid, extension];
  };

  // Manejador para cuando se sueltan los archivos en la zona de arrastre
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Obtener los archivos
    const _files = e.target.files ?? e.dataTransfer.files;

    if (_files.length === 0) return null;

    // Nombres de los archivos actuales
    const nameOfCurrentFiles = files.map((element) => {
      return splitFileName(element.Nombre)[0];
    });

    const results = Array.from(_files).map((_file) => {
      const fullname = _file.name;

      // Si el nombre ya existe, no agregar
      if (nameOfCurrentFiles.includes(splitFileName(fullname)[0])) {
        toast.warning(`${fullname.slice(0, 20)}... ya existe.`);
      } else {
        return {
          Nombre: _file.name,
          Tamaño: _file.size,
          Tipo: _file.type,
          file: _file,
          Fecha_creacion: new Date(),
        };
      }
    });

    setFiles([...files, ...results.filter((element) => element !== undefined)]);
    setDragOver(false);
  };

  return (
    <div className="wrapper-upload">
      {/* Zona de arrastre de archivos */}
      <div
        className={"drag-drop-zone"}
        style={dragOver ? { backgroundColor: "#0a51a1b6" } : {}}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        // onDragEnter={e => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
      >
        <label className="custom-file-upload">
          <p className=" fs-6">Elegir Archivos</p>
          <input
            className="btn btn-primary"
            onChange={handleDrop}
            type="file"
            multiple
          />
        </label>
      </div>

      {/* Lista de archivos */}
      <div className="list-files d-flex  flex-wrap">
        {files.length > 0 &&
          files.map((file, index) => {
            if (!file) return;
            const [name, ext] = splitFileName(file.Nombre);
            const size = file.Tamaño;

            return (
              <div key={index} className="item-file">
                <div
                  onMouseLeave={(e) => handleMouseLeave(e)}
                  onMouseEnter={(e) => handleMouseEnter(e)}
                >
                  {!showDeleteOption ? (
                    <img
                      className="icon-table-img"
                      src={getIconFIle(name, ext)}
                      alt=""
                    />
                  ) : (
                    <button
                      onClick={handleClickButtom}
                      value={index}
                      className="btn btn-primary "
                    >
                      x
                    </button>
                  )}
                </div>
                <div className="icon-table-info">
                  <p>{`${name.slice(0, 15)}.${ext}`}</p>
                  <p>{` Size: ${(size / (1024 * 1024)).toFixed(2)}MB`}</p>
                  <p>{format(file.Fecha_creacion, "yyyy/MM/dd kk:mm")}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UploadFiles;
