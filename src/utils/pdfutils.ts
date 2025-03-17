// Importa funciones y tipos necesarios de pdf-lib y otros módulos utilitarios
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";
import { formatCLP, computeTotals } from "@/utils/common";
import { PdfDatos, PdfServicioItem } from "@/types/pdf";

/**
 * Función auxiliar para dividir un texto en líneas, simulando el comportamiento de word-wrap.
 * @param text - Texto a dividir.
 * @param maxWidth - Ancho máximo permitido para cada línea.
 * @param font - Fuente utilizada para medir el texto.
 * @param fontSize - Tamaño de la fuente.
 * @returns Arreglo de cadenas, cada una representando una línea.
 */
function splitTextIntoLines(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines;
}

/**
 * Genera un documento PDF usando la información proporcionada en 'datos'.
 * Se incluye la creación de secciones para encabezado, cliente, ítems, totales y pie de página.
 * @param datos - Datos necesarios para la generación del PDF, conforme a la interfaz PdfDatos.
 * @returns Un Uint8Array con los bytes del PDF generado.
 */
export async function generatePDF(datos: PdfDatos): Promise<Uint8Array> {
  try {
    // Dimensiones de una página A4
    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const marginLeft = 50;
    let currentY = height - 60; // margen superior

    // Datos de cabecera con valores por defecto si no se proporcionan
    const empresa = datos.empresa || "DeCodigo";
    const subtitulo = datos.subtitulo || "Diseño a tu alcance";
    const cotizacionTitulo = datos.cotizacionTitulo || "Cotización";
    const presupuestoNumero = datos.presupuestoNumero || "0000001";

    // Formateo de fechas a formato local "es-CL"
    const fechaEmision = datos.fechaEmision
      ? new Date(datos.fechaEmision).toLocaleDateString("es-CL")
      : "";
    const fechaVencimiento = datos.fechaVencimiento
      ? new Date(datos.fechaVencimiento).toLocaleDateString("es-CL")
      : "";

    // Otros datos del PDF
    const textoDescriptivo = datos.textoDescriptivo || "";
    const cliente = datos.cliente || "";
    const direccion = datos.direccion || "";
    const telefono = datos.telefono || "";
    const rut = datos.rut || "";
    const email = datos.email || "";
    const proyecto = datos.proyecto || "";
    const descuento = datos.descuento || 0;

    // Calcular totales utilizando computeTotals definido en common.ts
    const { subTotal, discountValue, subTotalConDescuento, iva, total } =
      computeTotals(datos.servicios, descuento);

    // ========== ENCABEZADO ==========
    page.drawText(empresa, {
      x: marginLeft,
      y: currentY,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 25;

    page.drawText(subtitulo, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 25;

    page.drawText(`Fecha Emisión: ${fechaEmision}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    // Sección derecha del encabezado
    const rightX = width - 180;
    let rightY = height - 60 - 25;

    page.drawText(cotizacionTitulo, {
      x: rightX,
      y: rightY,
      size: 14,
      font,
    });
    rightY -= 15;

    page.drawText(`Presupuesto Nº ${presupuestoNumero}`, {
      x: rightX,
      y: rightY,
      size: 10,
      font,
    });
    rightY -= 15;

    page.drawText(`F.Venc.: ${fechaVencimiento}`, {
      x: rightX,
      y: rightY,
      size: 10,
      font,
    });

    // Espacio después del encabezado
    currentY -= 110;

    // ========== TEXTO DESCRIPTIVO ==========
    const maxWidthText = width - marginLeft * 2;
    const fontSize = 10;

    const descLines = splitTextIntoLines(
      textoDescriptivo,
      maxWidthText,
      font,
      fontSize
    );

    for (const line of descLines) {
      page.drawText(line, {
        x: marginLeft,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      currentY -= fontSize + 8;
    }

    currentY -= 30;

    // ========== SECCIÓN CLIENTE ==========
    page.drawText("CLIENTE", {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(cliente, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    // Soporta direcciones con saltos de línea
    direccion.split("\n").forEach((line) => {
      page.drawText(line, {
        x: marginLeft,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    });

    page.drawText(`Fono: ${telefono}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`RUT: ${rut}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`Email: ${email}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 30;

    // ========== SECCIÓN PROYECTO ==========
    page.drawText(`PROYECTO: ${proyecto}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 40;

    // ========== TABLA DE ÍTEMS ==========
    // Encabezados de la tabla
    page.drawText("N°", {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("DESCRIPCIÓN", {
      x: marginLeft + 40,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("PRECIO", {
      x: marginLeft + 220,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("CANT.", {
      x: marginLeft + 290,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText("TOTAL", {
      x: marginLeft + 360,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    currentY -= 15;

    // Itera sobre cada servicio para dibujar una fila en la tabla
    datos.servicios.forEach((item: PdfServicioItem) => {
      const precioNum = parseInt(item.precio, 10) || 0;
      const cantNum = parseInt(item.cantidad, 10) || 0;
      const lineTotal = precioNum * cantNum;

      page.drawText(item.numero, {
        x: marginLeft,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(item.descripcion, {
        x: marginLeft + 40,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(formatCLP(precioNum), {
        x: marginLeft + 220,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(String(item.cantidad), {
        x: marginLeft + 300,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(formatCLP(lineTotal), {
        x: marginLeft + 360,
        y: currentY,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      currentY -= 15;
    });

    currentY -= 40;

    // ========== TOTALES ==========
    page.drawText(`SUBTOTAL: ${formatCLP(subTotal)}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`DESCUENTO (${descuento}%): -${formatCLP(discountValue)}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`SUBTOTAL C/DCTO: ${formatCLP(subTotalConDescuento)}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`19% IVA: ${formatCLP(iva)}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText(`TOTAL: ${formatCLP(total)}`, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 60;

    // ========== FIRMA / APROBADO ==========
    page.drawText("APROBADO POR", {
      x: width - 200,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText("Daniel Morales", {
      x: width - 200,
      y: currentY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    currentY -= 15;

    page.drawText("@DeCodigo", {
      x: width - 200,
      y: currentY,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 20;

    // ========== PIE DE PÁGINA ==========
    page.drawText("social@decodigo.cl", {
      x: marginLeft,
      y: currentY,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    currentY -= 15;

    page.drawText("Calle Lateral 122, Santiago, Chile", {
      x: marginLeft,
      y: currentY,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Guarda y retorna los bytes del PDF generado
    return pdfDoc.save();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    throw error;
  }
}
