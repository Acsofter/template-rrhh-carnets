import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../services/Context";

// Componente para mostrar una ventana emergente (popup)
const VentanaEmergente = ({ children, abierta, cerrar, ancho }) => {
  // Acceso al contexto global de la aplicación

  // Si la ventana no está abierta, no renderizar nada
  if (!abierta) return null;

  return (
    <div className="fondo-ventana-emergente">
      <div className="contenedor-ventana-emergente" style={{ minWidth: ancho, maxWidth: ancho }}>
        {/* Encabezado de la ventana emergente */}
        <div className="encabezado-ventana-emergente">
          <div className="contenedor-circulos">
            {/* Aquí se pueden agregar elementos decorativos si se desea */}
            {/* Por ejemplo: <span className="circulo"></span> */}
          </div>
          {/* Botón para cerrar la ventana emergente */}
          <button
            className="boton-cerrar-ventana"
            onClick={cerrar}
          >
            X
          </button>
        </div>
        {/* Contenido de la ventana emergente */}
        <div className="cuerpo-ventana-emergente">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VentanaEmergente;
