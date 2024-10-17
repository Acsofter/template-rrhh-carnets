import React from "react";
import image404 from "../assets/images/404.svg";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  // Hook para manejar la navegación
  const navigate = useNavigate();

  return (
    <div>
      {/* Imagen para la página 404 */}
      <img width="500" src={image404} alt="" />
      
      {/* Mensaje para el usuario */}
      <span className="fw-bold fs-1">Quieres volver al inicio?</span>
      
      {/* Botón para regresar a la página de inicio */}
      <button
        onClick={() => {
          navigate("/home");
        }}
        className="btn btn-dark"
      >
        ir a Inicio
      </button>
    </div>
  );
};

export default NotFound;
