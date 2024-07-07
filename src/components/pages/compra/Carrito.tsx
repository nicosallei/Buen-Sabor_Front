import { useEffect, useState } from "react";
import { Card, Button, InputNumber, Avatar, Radio, Modal } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  removeToCarrito,
  incrementarCantidad,
  decrementarCantidad,
  limpiarCarrito,
  enviarPedido,
  cambiarCantidad,
  enviarPedidoDomicilio,
} from "../../../redux/slice/Carrito.slice";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import CheckoutMP from "../../mercadoPago/CheckoutMP";
import {
  TipoEnvio,
  DomicilioDto,
  ClienteDto,
  FormaPago,
} from "../../../types/compras/interface";
import DireccionForm from "./formulario/DireccionForm";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { setPedidoRealizado } from "../../../redux/slice/Pedido.silice";

const Carrito = () => {
  const imagenPorDefecto = "http://localhost:8080/images/sin-imagen.jpg";
  const dispatch = useAppDispatch();
  const carrito = useAppSelector((state) => state.cartReducer);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  //const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<TipoEnvio>(
    TipoEnvio.RETIRO_LOCAL
  );
  const [direccionEnvio, setDireccionEnvio] = useState<DomicilioDto | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState<FormaPago | null>(null);
  const pedidoRealizado = useSelector(
    (state: RootState) => state.pedido.pedidoRealizado
  );

  const quitarDelCarrito = (productoId: number) => {
    dispatch(removeToCarrito({ id: productoId }));
  };

  const incrementar = (productoId: number) => {
    dispatch(incrementarCantidad({ id: productoId }));
  };

  const decrementar = (productoId: number) => {
    dispatch(decrementarCantidad({ id: productoId }));
  };

  const limpiar = () => {
    dispatch(limpiarCarrito());
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precioVenta * item.cantidad,
    0
  );

  const handleEnviarPedido = async () => {
    if (!metodoPago) {
      toast.error("Por favor, selecciona un método de pago.");
      return;
    }
    if (metodoEntrega === TipoEnvio.DELIVERY && !direccionEnvio) {
      toast.error("Por favor, ingresa una dirección de envío.");
      return;
    }
    try {
      let resultAction;
      const ClienteDto: ClienteDto = {
        id: 1,
      };
      if (metodoEntrega === TipoEnvio.DELIVERY) {
        resultAction = await dispatch(
          enviarPedidoDomicilio({
            direccionEnvio,
            tipoEnvio: metodoEntrega,
            formaPago: metodoPago,
            cliente: ClienteDto,
          })
        );
      } else {
        resultAction = await dispatch(
          enviarPedido({
            tipoEnvio: metodoEntrega,
            cliente: ClienteDto,
            formaPago: metodoPago,
          })
        );
      }
      const preferenceId = unwrapResult(resultAction);

      setPreferenceId(preferenceId);
      dispatch(setPedidoRealizado(true));
      toast.success("Pedido realizado con éxito. Ahora realiza el pago.");
    } catch (err) {
      console.error("Error al realizar el pedido", err);
      toast.error("Error al realizar el pedido.");
    }
  };

  useEffect(() => {
    if (pedidoRealizado) {
      console.log("pedidoRealizado actualizado:", pedidoRealizado);
      // Aquí puedes poner cualquier otra lógica que dependa de la actualización de pedidoRealizado
    }
  }, [pedidoRealizado]);

  const cambiarCantidadProducto = (productoId: number, cantidad: number) => {
    dispatch(cambiarCantidad({ id: productoId, cantidad }));
  };

  const handleMetodoEntregaChange = (e: any) => {
    if (pedidoRealizado) {
      return; // Evita cambiar el método de entrega si ya se realizó el pedido
    }

    const metodo = e.target.value;
    setMetodoEntrega(metodo);

    if (metodo === TipoEnvio.DELIVERY) {
      setModalVisible(true);
      setMetodoPago(FormaPago.MERCADOPAGO); // Solo permite MercadoPago para envío a domicilio
    } else {
      setMetodoPago(null); // Resetea el método de pago si cambia a retiro en local
      setModalVisible(false);
    }
  };

  const handleModalOk = (values: DomicilioDto) => {
    setDireccionEnvio(values);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setMetodoEntrega(TipoEnvio.RETIRO_LOCAL);
    setModalVisible(false);
  };

  const handleMetodoPagoChange = (e: any) => {
    setMetodoPago(e.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Carrito</h1>
      {carrito.map((item) => {
        const subtotal = item.producto.precioVenta * item.cantidad;
        const imagenAMostrar =
          item.producto.imagenes.length > 0
            ? "http://localhost:8080/images/" + item.producto.imagenes[0].url
            : imagenPorDefecto;
        return (
          <Card key={item.id} style={{ width: 300, marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Card.Meta
                avatar={<Avatar src={imagenAMostrar} />}
                title={item.producto.denominacion}
                description={
                  <>
                    Cantidad:
                    <InputNumber
                      min={1}
                      value={item.cantidad}
                      onChange={(value) =>
                        cambiarCantidadProducto(item.id, value ?? 0)
                      }
                      disabled={pedidoRealizado}
                    />
                    <br />
                    Subtotal: {subtotal}
                  </>
                }
              />
              <p>Precio: ${item.producto.precioVenta}</p>
            </div>
            {!pedidoRealizado && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  <Button
                    type="primary"
                    icon={<MinusOutlined />}
                    onClick={() => decrementar(item.id)}
                    style={{ marginRight: "5px" }}
                  />

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => incrementar(item.id)}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => quitarDelCarrito(item.id)}
                />
              </div>
            )}
          </Card>
        );
      })}
      {carrito.length > 0 && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Radio.Group
              onChange={handleMetodoEntregaChange}
              value={metodoEntrega}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }} // Estilos agregados para mejorar el diseño
              disabled={pedidoRealizado} // Evita que se cambie el valor si el pedido está realizado
            >
              <Radio value={TipoEnvio.RETIRO_LOCAL}>Retiro en Local</Radio>
              <Radio value={TipoEnvio.DELIVERY}>Envío a Domicilio</Radio>
            </Radio.Group>
          </div>

          {direccionEnvio && metodoEntrega === TipoEnvio.DELIVERY && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Dirección de Envío:</h3>
              <p>
                calle: {direccionEnvio.calle}, Numero: {direccionEnvio.numero},
                codigo postal: {direccionEnvio.cp}
              </p>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            {metodoEntrega && (
              <Radio.Group
                onChange={handleMetodoPagoChange}
                value={metodoPago}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }} // Estilos agregados para mejorar el diseño
                disabled={pedidoRealizado} // Evita que se cambie el valor si el pedido está realizado
              >
                <Radio value={FormaPago.MERCADOPAGO}>MercadoPago</Radio>
                {metodoEntrega === TipoEnvio.RETIRO_LOCAL && (
                  <Radio value={FormaPago.EFECTIVO}>Efectivo</Radio>
                )}
              </Radio.Group>
            )}
          </div>
        </>
      )}

      <h2 style={{ textAlign: "center" }}>Total: {total}</h2>
      {!pedidoRealizado && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={limpiar}
          >
            Limpiar carrito
          </Button>
          <Button type="primary" onClick={handleEnviarPedido}>
            Realizar pedido
          </Button>
        </div>
      )}

      {preferenceId && metodoPago !== FormaPago.EFECTIVO && (
        <CheckoutMP preferenceId={preferenceId} />
      )}

      <Modal
        title="Ingresar dirección de envío"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <DireccionForm
          initialValues={{
            calle: "",
            numero: "",
            localidad: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
            cp: 0,
            pais: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
            provincia: 0, // Asegúrate de que este valor sea válido según los datos de tu aplicación
          }}
          onSubmit={handleModalOk}
          onCancel={handleModalCancel}
        />
      </Modal>
    </div>
  );
};

export default Carrito;
