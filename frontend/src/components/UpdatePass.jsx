import React, { useState } from "react";
import { toast } from "react-toastify";
import AuthServices from "../services/auth.service";
import Actions from "./Actions";
import ImgLogin from "../assets/images/login.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdatePass = () => {
  // Estados para manejar los campos del formulario
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para reiniciar los campos del formulario
  const updateData = (data) => {
    setPassword("")
    setConfirmPassword("")
    setCurrentPassword("")
    setLoading(false)
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    // Llamada al servicio para actualizar la contraseña
    await AuthServices.UpdatePass(currentPassword, password).then((response) => {
        if (response){
          toast.success("contraseña actualizada")
        }
        updateData()
    })
    
  };

  return (
    <>
      <div className="table">
        <Actions></Actions>
      </div>
      <div className="register">
        <div className="register-container">
          <div className="form-register-wrapper">
            <p className="fw-bold fs-1 mb-3 ">Actualizar</p>

            <form onSubmit={handleSubmit}>
              {/* Campo para la contraseña actual */}
              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña Actual:</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required/>
              </div>
              {/* Campo para la nueva contraseña */}
              <div className="form-group mt-3">
                <label htmlFor="password">Contraseña: </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required/>
              </div>
              {/* Campo para confirmar la nueva contraseña */}
              <div className="form-group mt-3">
                <label htmlFor="confirmPassword">Confirmar contraseña: </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                required/>
              </div>
              {/* Botón para actualizar la contraseña */}
              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={loading}
              >
                Actualizar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePass;
