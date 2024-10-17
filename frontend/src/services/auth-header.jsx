// Función para obtener el encabezado de autorización
const authHeader = () => {
  // Obtener el usuario del almacenamiento local
  const user = JSON.parse(localStorage.getItem("user"));

  // Si existe un usuario, devolver el encabezado de autorización con el token
  if (user) {
    return {
      Authorization: "Bearer " + user,
    };
  }

  // Si no hay usuario, devolver un objeto vacío
  return {};
};

export default authHeader;
