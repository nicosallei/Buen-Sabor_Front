import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import EmpleadoService from "../../service/auth0Service/EmpleadoService";
import SucursalService from "../../service/auth0Service/SucursalService";
import { RolEmpleado } from "../../types/usuario/Usuario";

const LoginHandler: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const navigate = useNavigate();
  const empleadoService = new EmpleadoService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmpleado = async () => {
      if (isAuthenticated && user?.email) {
        try {
          localStorage.removeItem("rol");
          localStorage.removeItem("email");
          localStorage.removeItem("auth_token");

          const sucursalService = new SucursalService();
          const token = await getAccessTokenSilently();
          localStorage.setItem("auth_token", token);

          const empleado = await empleadoService.getEmpleadoByEmail(
            `${url}`,
            user.email,
            token
          );

          if (empleado) {
            localStorage.setItem("email", empleado.email);

            if (empleado.rol === RolEmpleado.ADMINISTRADOR) {
              localStorage.setItem("rol", empleado.rol);
              localStorage.removeItem("sucursal_id");
              localStorage.removeItem("selectedSucursalNombre");
              localStorage.removeItem("empresa_id");
              navigate("/unidadMedida");
            } else if (
              empleado.rol === RolEmpleado.EMPLEADO_COCINA ||
              empleado.rol === RolEmpleado.EMPLEADO_REPARTIDOR
            ) {
              localStorage.setItem("rol", empleado.rol);
              localStorage.setItem(
                "sucursal_id",
                empleado.sucursal.id.toString()
              );
              localStorage.setItem(
                "empresa_id",
                empleado.sucursal.empresa.id.toString()
              );

              const sucursal = await sucursalService.getById(
                `${url}`,
                empleado.sucursal.id,
                token
              );
              localStorage.setItem("selectedSucursalNombre", sucursal.nombre);
              navigate("/insumos");
            }
          } else {
            throw new Error("Empleado no encontrado");
          }
        } catch (error) {
          console.error("Error al obtener el empleado:", error);
          logout(); // Redirige al login de Auth0
        }
      } else {
        navigate("/");
      }
    };

    fetchEmpleado();
  }, [isAuthenticated, user, getAccessTokenSilently, navigate, logout]);

  return <div>Cargando...</div>;
};

export default LoginHandler;
