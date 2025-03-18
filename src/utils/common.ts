/**
 * Formatea un número a pesos chilenos sin decimales.
 * @param value - Número a formatear.
 * @returns String formateado en CLP.
 */
export function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Define la interfaz para los totales calculados.
 */
export interface Totals {
  subTotal: number;
  discountValue: number;
  subTotalConDescuento: number;
  iva: number;
  total: number;
}

/**
 * Calcula los totales de la cotización a partir de los servicios y el descuento.
 * @param servicios - Arreglo de ítems, cada uno con precio y cantidad.
 * @param descuento - Porcentaje de descuento a aplicar.
 * @returns Objeto con los totales: subtotal, descuento, subtotal con descuento, IVA y total.
 */
export function computeTotals(
  servicios: { precio: string; cantidad: string }[],
  descuento: number
): Totals {
  const subTotal = servicios.reduce((acc, s) => {
    const precioNum = parseInt(s.precio, 10) || 0;
    const cantNum = parseInt(s.cantidad, 10) || 0;
    return acc + precioNum * cantNum;
  }, 0);

  const discountValue = Math.round(subTotal * (descuento / 100));
  const subTotalConDescuento = subTotal - discountValue;
  const iva = Math.round(subTotalConDescuento * 0.19);
  const total = subTotalConDescuento + iva;

  return { subTotal, discountValue, subTotalConDescuento, iva, total };
}

/**
 * Obtiene el número de presupuesto almacenado en sessionStorage.
 * Si no existe, lo inicializa en "0000001".
 * @returns Número de presupuesto formateado.
 */
export function obtenerNumeroPresupuesto(): string {
  if (typeof window !== "undefined") {
    try {
      const num = sessionStorage.getItem("presupuestoNumber");
      if (num !== null) {
        return num.padStart(7, "0");
      } else {
        sessionStorage.setItem("presupuestoNumber", "1");
        return "0000001";
      }
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      return "0000001";
    }
  }
  return "0000001";
}

/**
 * Incrementa el número de presupuesto en sessionStorage y lo retorna formateado.
 * @returns Nuevo número de presupuesto.
 */
export function incrementarNumeroPresupuesto(): string {
  if (typeof window !== "undefined") {
    try {
      const num = sessionStorage.getItem("presupuestoNumber");
      const number = num ? parseInt(num, 10) : 0;
      const newNumber = (number + 1).toString();
      sessionStorage.setItem("presupuestoNumber", newNumber);
      return newNumber.padStart(7, "0");
    } catch (error) {
      console.error("Error accessing sessionStorage:", error);
      return "0000001";
    }
  }
  return "0000001";
}
