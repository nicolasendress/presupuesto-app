"use client"; // Indica que este componente se renderiza del lado del cliente

import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BotonPDF from "./BotonPDF";
import {
  formatCLP,
  computeTotals,
  obtenerNumeroPresupuesto,
  incrementarNumeroPresupuesto,
} from "@/utils/common";
import { PdfDatos, PdfServicioItem } from "@/types/pdf";

// Estado inicial del formulario, con datos por defecto para la cotización
const initialState: PdfDatos = {
  empresa: "Mi Empresa",
  subtitulo: "Soluciones de Calidad",
  cotizacionTitulo: "Cotización",
  presupuestoNumero: "0000123",
  fechaEmision: new Date(), // Fecha de emisión actual
  fechaVencimiento: new Date(new Date().setDate(new Date().getDate() + 7)), // Vencimiento a 7 días
  cliente: "Juan Pérez",
  direccion: "Calle Ejemplo 123, Ciudad",
  telefono: "+56 9 9876 5432",
  rut: "12345678-9",
  email: "contacto@miempresa.cl",
  proyecto: "Desarrollo Web",
  textoDescriptivo:
    "Este es un ejemplo de cotización para un proyecto de desarrollo web.",
  descuento: 10,
  servicios: [
    {
      numero: "1",
      descripcion: "Hosting Anual",
      precio: "120000",
      cantidad: "1",
    },
    {
      numero: "2",
      descripcion: "Dominio (.cl)",
      precio: "15000",
      cantidad: "1",
    },
  ],
};

/**
 * Componente del formulario de cotización.
 * Permite editar los datos, agregar o eliminar servicios, y mostrar totales.
 */
export default function Formulario() {
  const [datos, setDatos] = useState<PdfDatos>(initialState);

  // Inicializa el número de presupuesto usando sessionStorage al cargar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDatos((prev) => ({
        ...prev,
        presupuestoNumero: obtenerNumeroPresupuesto(),
      }));
    }
  }, []);

  // Actualiza el número de presupuesto al descargar el PDF
  const handleNumeroIncremento = () => {
    const nuevoNumero = incrementarNumeroPresupuesto();
    setDatos((prev) => ({
      ...prev,
      presupuestoNumero: nuevoNumero,
    }));
  };

  // Maneja cambios en inputs y textarea
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: name === "descuento" ? parseInt(value, 10) || 0 : value,
    });
  };

  // Maneja cambios en cada servicio del arreglo
  const handleServicioChange = (
    index: number,
    field: keyof PdfServicioItem,
    value: string
  ) => {
    setDatos((prev) => {
      const nuevos = [...prev.servicios];
      nuevos[index][field] = value;
      return { ...prev, servicios: nuevos };
    });
  };

  // Agrega un nuevo servicio al arreglo de servicios
  const agregarServicio = () => {
    setDatos((prev) => {
      const nuevos = [...prev.servicios];
      const ultimoNumero = nuevos.length
        ? parseInt(nuevos[nuevos.length - 1].numero, 10) || 0
        : 0;
      nuevos.push({
        numero: String(ultimoNumero + 1),
        descripcion: "",
        precio: "",
        cantidad: "",
      });
      return { ...prev, servicios: nuevos };
    });
  };

  // Elimina un servicio del arreglo según su índice
  const eliminarServicio = (index: number) => {
    setDatos((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== index),
    }));
  };

  // Resetea los datos del formulario y el número de presupuesto en sessionStorage
  const handleReset = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("presupuestoNumber");
    }
    setDatos({
      ...initialState,
      presupuestoNumero: obtenerNumeroPresupuesto(),
    });
  };

  // Calcula totales de la cotización utilizando computeTotals
  const { subTotal, discountValue, subTotalConDescuento, iva, total } =
    computeTotals(datos.servicios, datos.descuento);

  return (
    <>
      <div className="card shadow-lg rounded">
        <div className="card-header text-center" style={{ backgroundColor: "inherit" }}>
          <h2 className="form-title">Formulario de Cotización</h2>
        </div>

        <div className="card-body p-4">
          {/* Sección de campos principales: título, fechas y número de presupuesto */}
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <label className="form-label fw-bold">Título Cotización</label>
              <input
                type="text"
                className="form-control"
                name="cotizacionTitulo"
                value={datos.cotizacionTitulo}
                onChange={handleChange}
                placeholder="Ej: Cotización"
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-bold">Fecha de Emisión</label>
              <ReactDatePicker
                selected={datos.fechaEmision}
                onChange={(date: Date | null) => {
                  setDatos((prev) => ({
                    ...prev,
                    fechaEmision: date,
                  }));
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Selecciona fecha"
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-bold">Fecha de Vencimiento</label>
              <ReactDatePicker
                selected={datos.fechaVencimiento}
                onChange={(date: Date | null) => {
                  setDatos((prev) => ({
                    ...prev,
                    fechaVencimiento: date,
                  }));
                }}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Selecciona fecha"
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label fw-bold">Nº Presupuesto</label>
              <input
                type="text"
                className="form-control"
                name="presupuestoNumero"
                value={datos.presupuestoNumero}
                readOnly
                placeholder="Generado automáticamente"
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Datos de la empresa */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Empresa</label>
              <input
                type="text"
                className="form-control"
                name="empresa"
                value={datos.empresa}
                onChange={handleChange}
                placeholder="Ej: DeCodigo"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Subtítulo</label>
              <input
                type="text"
                className="form-control"
                name="subtitulo"
                value={datos.subtitulo}
                onChange={handleChange}
                placeholder="Ej: Soluciones Tecnológicas"
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Datos del cliente */}
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Cliente</label>
              <input
                type="text"
                className="form-control"
                name="cliente"
                value={datos.cliente}
                onChange={handleChange}
                placeholder="Ej: Mario López"
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">Teléfono</label>
              <input
                type="text"
                className="form-control"
                name="telefono"
                value={datos.telefono}
                onChange={handleChange}
                placeholder="Ej: +56 9 1234 5678"
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold">RUT</label>
              <input
                type="text"
                className="form-control"
                name="rut"
                value={datos.rut}
                onChange={handleChange}
                placeholder="Ej: 12345678-9"
              />
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Dirección</label>
              <textarea
                className="form-control"
                name="direccion"
                rows={2}
                value={datos.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle Lateral Y Parque 123, Cualquier Lugar"
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={datos.email}
                onChange={handleChange}
                placeholder="Ej: social@decodigo.cl"
              />
              <label className="form-label fw-bold mt-3">Proyecto</label>
              <input
                type="text"
                className="form-control"
                name="proyecto"
                value={datos.proyecto}
                onChange={handleChange}
                placeholder="Ej: Cotización Residencial"
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* Texto descriptivo y campo para descuento */}
          <div className="mb-3">
            <label className="form-label fw-bold">Texto Descriptivo</label>
            <textarea
              className="form-control"
              name="textoDescriptivo"
              rows={3}
              value={datos.textoDescriptivo}
              onChange={handleChange}
              placeholder="Ej: Explica brevemente la cotización..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Descuento (%)</label>
            <input
              type="number"
              className="form-control"
              name="descuento"
              value={datos.descuento}
              onChange={handleChange}
              placeholder="Ej: 10"
            />
          </div>

          <hr className="my-4" />

          {/* Tabla para administrar los servicios/ítems */}
          <h5 className="mb-3">Servicios / Ítems</h5>
          <div className="table-responsive mb-3">
            <table className="table table-borderless align-middle">
              <thead className="border-bottom">
                <tr className="text-uppercase text-muted">
                  <th className="w-5">N°</th>
                  <th className="w-40">Descripción</th>
                  <th className="w-15 text-end">Precio</th>
                  <th className="w-10 text-center">Cant.</th>
                  <th className="w-15 text-end">Total</th>
                  <th className="w-5"></th>
                </tr>
              </thead>
              <tbody>
                {datos.servicios.map((item, index) => {
                  const precioNum = parseInt(item.precio, 10) || 0;
                  const cantidadNum = parseInt(item.cantidad, 10) || 0;
                  const itemTotal = precioNum * cantidadNum;

                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={item.numero}
                          onChange={(e) =>
                            handleServicioChange(index, "numero", e.target.value)
                          }
                          placeholder="Ej: 1"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={item.descripcion}
                          onChange={(e) =>
                            handleServicioChange(index, "descripcion", e.target.value)
                          }
                          placeholder="Ej: Hosting anual"
                        />
                      </td>
                      <td className="text-end">
                        <input
                          type="text"
                          className="form-control form-control-sm text-end"
                          value={item.precio}
                          onChange={(e) =>
                            handleServicioChange(index, "precio", e.target.value)
                          }
                          placeholder="Ej: 80000"
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="text"
                          className="form-control form-control-sm text-center"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleServicioChange(index, "cantidad", e.target.value)
                          }
                          placeholder="Ej: 1"
                        />
                      </td>
                      <td className="text-end">{formatCLP(itemTotal)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarServicio(index)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Botón para agregar un nuevo servicio */}
          <div className="mb-4">
            <button className="btn btn-primary" onClick={agregarServicio}>
              Agregar Servicio
            </button>
          </div>

          {/* Sección que muestra el resumen de totales calculados */}
          <div className="mb-4 total-price">
            <h6>Resumen de Totales:</h6>
            <p>Subtotal: {formatCLP(subTotal)}</p>
            <p>Descuento: {formatCLP(discountValue)}</p>
            <p>Subtotal con descuento: {formatCLP(subTotalConDescuento)}</p>
            <p>IVA (19%): {formatCLP(iva)}</p>
            <p>Total: {formatCLP(total)}</p>
          </div>

          {/* Botones para previsualizar, descargar el PDF y limpiar el formulario */}
          <div className="mt-4 text-end d-flex gap-2 flex-wrap justify-content-end">
            <BotonPDF datos={datos} onDownload={handleNumeroIncremento} />
            <button className="btn btn-secondary" onClick={handleReset}>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
