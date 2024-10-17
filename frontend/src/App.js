import "./App.css";
import Login from "./components/Login.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import { ToastContainer } from "react-toastify";
import AuthVerify from "./services/auth.verify.jsx";
import { useState } from "react";
import { AuthenticateContext, AppContext } from "./services/Context.jsx";
import CreateEmpleado from "./components/CreateEmpleado.jsx";
import Popup from "./components/Popup.jsx";
import _History from "./components/History.jsx";
import NotFound from "./components/NotFound.jsx";
import Register from "./components/Register.jsx";
import UpdatePass from "./components/UpdatePass";
import { FileUpload } from "./components/FileUpload.jsx";

const App = () => {
  // Estado para manejar la autenticación
  const [authenticated, setAutenticated] = useState(false);
  // Estados para manejar el popup
  const [openPopup, setOpenPopup] = useState(false);
  const [children, setChildren] = useState();
  const [width, setWidth] = useState(false);

  // Función para mostrar el popup
  const showPopup = (component, _width) => {
    setWidth(_width);
    setOpenPopup(true);
    setChildren(component);
  };

  // Función para cerrar el popup
  const closePopup = () => setOpenPopup(false);

  return (
    <AuthenticateContext.Provider value={{ authenticated, setAutenticated }}>
      <AppContext.Provider value={{ showPopup, closePopup }}>
        <div className="App">
          {/* Componente Popup */}
          <Popup
            open={openPopup}
            close={() => setOpenPopup(false)}
            width={width}
          >
            {children}
          </Popup>

          {/* Configuración del contenedor de notificaciones */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="dark"
          />

          {/* Componente de encabezado */}
          <Header></Header>
          <main>
            {/* Definición de rutas */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/empleado" element={<CreateEmpleado />} />
              <Route path="/home" element={<Home />} />
              <Route path="/actualizarclave" element={<UpdatePass />} />
              <Route path="/history" element={<_History />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Componente para verificar la autenticación */}
            <AuthVerify />
          </main>
        </div>
      </AppContext.Provider>
    </AuthenticateContext.Provider>
  );
};

export default App;
