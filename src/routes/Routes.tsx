import React from "react";
import { Routes, Route } from "react-router-dom";
import Empresa from "../components/pages/empresa/Empresa";
import Sucursal from "../components/pages/sucursal/Sucursal";
import Categorias from "../components/pages/categorias/Categorias";
import Productos from "../components/pages/productos/Productos";
import Insumo from "../components/pages/insumos/Insumos";
import CompraCategoria from "../components/pages/compra/categoria/CompraCategoria";
import CompraProductos from "../components/pages/compra/productos/CompraProductos";
import UnidadMedida from "../components/pages/unidadMedida/UnidadMedida";
import CategoriasPorSucursal from "../components/pages/categorias/CategoriasPorSucursal";
import Promocion from "../components/pages/promocion/Promocion";

import Empleados from "../components/pages/empleado/Empleado";

import Pedidos from "../components/pages/pedidos/Pedidos";
import SeleccionSucursal from "../components/pages/compra/sucursales/SeleccionSucursal";
import Login from "../components/pages/login-crear/login";
import RegistroCliente from "../components/pages/login-crear/CrearUsuarioCliente";
import Estadistica from "../components/pages/estadistica/Estadistica";
import RegistroEmpleado from "../components/pages/login-crear/CrearUsuarioEmpleado";
import { AuthenticationGuard } from "../components/auth0/AuthenticationGuard";
import ErrorPage from "../components/User/ErrorPage";
import CallbackPage from "../components/auth0/CallbackPage";
import LoginHandler from "../components/ui/LoginHandler";
import EmpleadoProfileCard from "../components/pages/perfil/EmpleadoProfileCard";
import Graficos from "../components/pages/estadistica/Graficos";

const Rutas: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/empresas"
        element={<AuthenticationGuard component={Empresa} />}
      />
      <Route
        path="/sucursal/:id"
        element={<AuthenticationGuard component={Sucursal} />}
      />
      <Route
        path="/categorias"
        element={<AuthenticationGuard component={Categorias} />}
      />

      <Route
        path="/empleados"
        element={<AuthenticationGuard component={Empleados} />}
      />

      <Route
        path="/categorias/porSucursal"
        element={<AuthenticationGuard component={CategoriasPorSucursal} />}
      />

      <Route
        path="/productos"
        element={<AuthenticationGuard component={Productos} />}
      />
      <Route
        path="/insumos"
        element={<AuthenticationGuard component={Insumo} />}
      />
      <Route
        path="/unidadMedida"
        element={<AuthenticationGuard component={UnidadMedida} />}
      />
      <Route
        path="/compra"
        element={<AuthenticationGuard component={SeleccionSucursal} />}
      />
      <Route
        path="/compra/categorias/:sucursalId"
        element={<AuthenticationGuard component={CompraCategoria} />}
      />
      <Route
        path="/compra/productos/:categoriaId"
        element={<AuthenticationGuard component={CompraProductos} />}
      />
      <Route
        path="/estadistica"
        element={<AuthenticationGuard component={Estadistica} />}
      />
      <Route
        path="/promociones"
        element={<AuthenticationGuard component={Promocion} />}
      />
      <Route
        path="/Pedidos"
        element={<AuthenticationGuard component={Pedidos} />}
      />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/registro-cliente" element={<RegistroCliente />} />
      <Route path="/registro/empleado" element={<RegistroEmpleado />} />
      <Route
        path="/"
        element={<AuthenticationGuard component={LoginHandler} />}
      />
      <Route path="/perfil" element={<EmpleadoProfileCard />} />
      <Route path="/graficos" element={<Graficos />} />
    </Routes>
  );
};

export default Rutas;
