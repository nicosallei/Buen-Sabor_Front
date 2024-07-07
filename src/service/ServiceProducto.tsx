export interface Imagen {
  id: number;
  url: string;
}

export interface unidadMedida {
  id: number;
  denominacion: string;
}
export interface sucursal {
  id: number;
  nombre: string;
}
export interface ArticuloInsumo {
  id: number;
  denominacion: string;
  codigo: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  imagenes: Imagen[];
  unidadMedida: unidadMedida;
}

export interface ArticuloManufacturadoDetalle {
  id: number;
  cantidad: number;
  articuloInsumo: ArticuloInsumo;
}

export interface ArticuloProducto {
  id: number;
  denominacion: string;
  descripcion?: string;
  codigo: string;
  precioVenta: number;
  imagenes: Imagen[];
  unidadMedida: unidadMedida;
  tiempoEstimadoMinutos?: number;
  preparacion?: string;
  articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
  sucursal: sucursal;
  categoria: Categoria;
}
interface Categoria {
  id: number;
  denominacion: string;
}

export async function crearManufacturado(
  formData: ArticuloProducto,
  token: string
) {
  console.log("estoy en el crearManufacturado");

  try {
    console.log("estoy en el fetch");

    console.log(formData);

    const urlServer = "http://localhost:8080/api/articulos/manufacturados/";
    const response = await fetch(urlServer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
      body: JSON.stringify({
        codigo: "M-" + formData.codigo,
        categoria: {
          id: formData.categoria.id,
        },
        denominacion: formData.denominacion,
        descripcion: formData.descripcion || "sin descripcion",
        precioVenta: formData.precioVenta,
        imagenes: formData.imagenes,
        unidadMedida: formData.unidadMedida,
        tiempoEstimadoMinutos: formData.tiempoEstimadoMinutos || 0,
        preparacion: formData.preparacion || "sin preparacion",
        sucursal: formData.sucursal,
        articuloManufacturadoDetalles: formData.articuloManufacturadoDetalles,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}

export async function getProductoXSucursal(id: string) {
  const urlServer =
    "http://localhost:8080/api/local/articulo/manufacturado/sucursal/" + id;
  console.log(urlServer);
  const response = await fetch(urlServer, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });

  return await response.json();
}

export const getProductoXId = async (id: string) => {
  try {
    const response = await fetch(
      " http://localhost:8080/api/articulos/manufacturados/" + id
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la promoción");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getProductoXIdBase = async (id: string) => {
  try {
    const response = await fetch(
      " http://localhost:8080/api/articulos/manufacturados/imagenBase64/" + id
    );
    if (!response.ok) {
      throw new Error("Error al obtener los detalles de la promoción");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export async function modificarProductoId(
  formData: any,
  id: number,
  token: string
) {
  try {
    console.log("estoy en el fetc");
    console.log("data" + formData);
    console.log("id:" + id);
    console.log(
      "----------------->" +
        formData.categoria.id +
        "---------" +
        formData.categoria
    );
    const urlServer = `http://localhost:8080/api/articulos/manufacturados/${id}`;
    const response = await fetch(urlServer, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
      mode: "cors",
      body: JSON.stringify({
        id: id,
        codigo: formData.codigo,
        denominacion: formData.denominacion,
        descripcion: formData.descripcion || "sin descripcion",
        precioVenta: formData.precioVenta,
        imagenes: formData.imagenes,
        unidadMedida: formData.unidadMedida,
        tiempoEstimadoMinutos: formData.tiempoEstimadoMinutos || 0,
        preparacion: formData.preparacion || "sin preparacion",
        sucursal: formData.sucursal,
        articuloManufacturadoDetalles: formData.articuloManufacturadoDetalles,
        categoria: formData.categoria,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
export async function deleteProductoXId(id: string, token: string) {
  const urlServer = "http://localhost:8080/api/articulos/manufacturados/" + id;
  await fetch(urlServer, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
}
export async function activarProductoXId(id: string, token: string) {
  const urlServer =
    "http://localhost:8080/api/articulos/manufacturados/reactivate/" + id;
  await fetch(urlServer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });
}

export async function getCategoria(id: number) {
  const urlServer = "http://localhost:8080/api/local/traerTodo/" + id;
  console.log(urlServer);
  const response = await fetch(urlServer, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "cors",
  });

  return await response.json();
}
