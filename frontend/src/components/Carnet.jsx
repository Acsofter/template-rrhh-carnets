import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import Skeleton from "react-loading-skeleton";
import userServices from "../services/user.service";
import { IoReloadCircleSharp } from "react-icons/io5";

// Vista previa del carnet
const Carnet = (data) => {
  const [fotoPerfil, setFotoPerfil] = useState(false);
  const { nombre, cedula, cargo, departamento } = data;
  const colorsSkeletons = { baseColor: "#003876", highlightColor: "#0a51a1b6" };

  useEffect(() => {
    userServices.resizeTextToFit(".divToResize");
  }, [nombre, cargo, departamento]);

  const getFotoPerfil = (cedula) => {
    if (!cedula || cedula.length < 11) {
      return setFotoPerfil(false);
    }
    console.log("cedula", cedula);
    userServices.getFotoPerfil(cedula).then((response) => {
      if (!response) {
        return setFotoPerfil(false);
      }
      setFotoPerfil(response.image ?? false);
    });
  };

useEffect(() => {
    getFotoPerfil(cedula);
  }, [cedula]);

  return (
    <div>
      <div className="carnet-wrapper" id="print-carnet">
        <div className="header">
          <img src={logo} alt="" />
        </div>
        <div className="image ">
          {!fotoPerfil ? (
            <div className="flex">
              <span>No se pudo cargar intente de nuevo</span>
              <IoReloadCircleSharp
                role="button"
                className="block"
                size={125}
                onClick={() => getFotoPerfil(cedula)}
              />
            </div>
          ) : (
            <img src={fotoPerfil} alt="" width={175} height={185} />
          )}
        </div>
        <div className="footer divToResize p-1">
          {nombre ? (
            <span className="fw-bolder text-white ">
              {nombre.toUpperCase()}
            </span>
          ) : (
            <Skeleton {...colorsSkeletons} width={290} height={20} />
          )}
          {cargo ? (
            <span className="fw-bolder text-white">{cargo.toUpperCase()}</span>
          ) : (
            <Skeleton {...colorsSkeletons} width={290} height={20} />
          )}
          {departamento ? (
            <span className="fw-bolder text-white">
              {departamento.toUpperCase()}
            </span>
          ) : (
            <Skeleton {...colorsSkeletons} width={290} height={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Carnet;
