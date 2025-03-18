import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
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
 * Dibuja el encabezado del PDF, incluyendo empresa, título, subtítulo, número de presupuesto y fechas.
 * @returns La nueva posición Y tras finalizar el encabezado.
 */
async function drawHeader(
  page: PDFPage,
  datos: PdfDatos,
  regularFont: PDFFont,
  boldFont: PDFFont,
  width: number,
  height: number,
  marginLeft: number,
  marginRight: number
): Promise<number> {
  let headerY = height - 60;

  // Fila 1: Empresa (izquierda) y Cotización (derecha)
  page.drawText(datos.empresa || "DeCodigo", {
    x: marginLeft,
    y: headerY,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  const rightX = width - 180;
  page.drawText(datos.cotizacionTitulo || "Cotización", {
    x: rightX,
    y: headerY,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  headerY -= 25;

  // Fila 2: Subtítulo (izquierda) y Presupuesto Nº (derecha)
  page.drawText(datos.subtitulo || "Diseño a tu alcance", {
    x: marginLeft,
    y: headerY,
    size: 10,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  page.drawText(`Presupuesto Nº ${datos.presupuestoNumero || "0000001"}`, {
    x: rightX,
    y: headerY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  headerY -= 25;

  // Fila 3: Fechas de Emisión (izquierda) y F.Venc. (derecha)
  const fechaEmision = datos.fechaEmision ? new Date(datos.fechaEmision).toLocaleDateString("es-CL") : "";
  const fechaVencimiento = datos.fechaVencimiento ? new Date(datos.fechaVencimiento).toLocaleDateString("es-CL") : "";
  page.drawText(`Fecha Emisión: ${fechaEmision}`, {
    x: marginLeft,
    y: headerY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  const vencText = `F.Venc.: ${fechaVencimiento}`;
  const vencTextWidth = regularFont.widthOfTextAtSize(vencText, 10);
  page.drawText(vencText, {
    x: width - marginRight - vencTextWidth,
    y: headerY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });

  return headerY - 50; // Deja espacio para la siguiente sección
}

/**
 * Dibuja el texto descriptivo del PDF.
 * @returns La nueva posición Y tras finalizar el bloque de descripción.
 */
function drawDescription(
  page: PDFPage,
  textoDescriptivo: string,
  currentY: number,
  regularFont: PDFFont,
  width: number,
  marginLeft: number
): number {
  const maxWidthText = width - marginLeft * 2;
  const fontSize = 10;
  const descLines = splitTextIntoLines(textoDescriptivo, maxWidthText, regularFont, fontSize);
  for (const line of descLines) {
    page.drawText(line, {
      x: marginLeft,
      y: currentY,
      size: fontSize,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    currentY -= fontSize + 8;
  }
  return currentY - 30;
}

/**
 * Dibuja la sección del cliente.
 * @returns La nueva posición Y tras finalizar la sección de cliente.
 */
function drawClienteSection(
  page: PDFPage,
  datos: PdfDatos,
  regularFont: PDFFont,
  boldFont: PDFFont,
  currentY: number,
  marginLeft: number
): number {
  currentY -= 20;
  page.drawText("CLIENTE", {
    x: marginLeft,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 25;
  page.drawText(datos.cliente, {
    x: marginLeft,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 15;
  datos.direccion.split("\n").forEach((line: string) => {
    page.drawText(line, {
      x: marginLeft,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    currentY -= 15;
  });
  page.drawText(`Fono: ${datos.telefono}`, {
    x: marginLeft,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 15;
  page.drawText(`RUT: ${datos.rut}`, {
    x: marginLeft,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 15;
  page.drawText(`Email: ${datos.email}`, {
    x: marginLeft,
    y: currentY,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  return currentY - 30;
}

/**
 * Dibuja la sección del proyecto.
 * @returns La nueva posición Y tras finalizar la sección del proyecto.
 */
function drawProyectoSection(
  page: PDFPage,
  datos: PdfDatos,
  boldFont: PDFFont,
  currentY: number,
  marginLeft: number
): number {
  currentY -= 30;
  page.drawText(`PROYECTO: ${datos.proyecto}`, {
    x: marginLeft,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  return currentY - 20;
}

/**
 * Dibuja la tabla de ítems (servicios) y sus respectivos totales.
 * @returns La nueva posición Y tras finalizar la tabla.
 */
function drawItemsTable(
  page: PDFPage,
  datos: PdfDatos,
  regularFont: PDFFont,
  boldFont: PDFFont,
  currentY: number,
  marginLeft: number,
  width: number,
  marginRight: number
): number {
  // Encabezados de la tabla
  page.drawText("N°", { x: marginLeft, y: currentY, size: 10, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText("DESCRIPCIÓN", { x: marginLeft + 40, y: currentY, size: 10, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText("PRECIO", { x: marginLeft + 220, y: currentY, size: 10, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText("CANT.", { x: marginLeft + 290, y: currentY, size: 10, font: boldFont, color: rgb(0, 0, 0) });
  const totalColumnRight = width - marginRight;
  const totalHeader = "TOTAL";
  const totalHeaderWidth = boldFont.widthOfTextAtSize(totalHeader, 10);
  page.drawText(totalHeader, {
    x: totalColumnRight - totalHeaderWidth,
    y: currentY,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 15;
  datos.servicios.forEach((item: PdfServicioItem) => {
    const precioNum = parseInt(item.precio, 10) || 0;
    const cantNum = parseInt(item.cantidad, 10) || 0;
    const lineTotal = precioNum * cantNum;
    page.drawText(item.numero, { x: marginLeft, y: currentY, size: 10, font: regularFont, color: rgb(0, 0, 0) });
    page.drawText(item.descripcion, { x: marginLeft + 40, y: currentY, size: 10, font: regularFont, color: rgb(0, 0, 0) });
    page.drawText(formatCLP(precioNum), { x: marginLeft + 220, y: currentY, size: 10, font: regularFont, color: rgb(0, 0, 0) });
    page.drawText(String(item.cantidad), { x: marginLeft + 300, y: currentY, size: 10, font: regularFont, color: rgb(0, 0, 0) });
    const totalText = formatCLP(lineTotal);
    const totalTextWidth = regularFont.widthOfTextAtSize(totalText, 10);
    page.drawText(totalText, { x: totalColumnRight - totalTextWidth, y: currentY, size: 10, font: regularFont, color: rgb(0, 0, 0) });
    currentY -= 15;
  });
  return currentY - 40;
}

/**
 * Dibuja la sección de totales (subtotal, descuento, IVA y total).
 * @returns La nueva posición Y tras finalizar la sección de totales.
 */
function drawTotals(
  page: PDFPage,
  computed: ReturnType<typeof computeTotals>,
  discountPercentage: number,
  regularFont: PDFFont,
  boldFont: PDFFont,
  currentY: number,
  width: number,
  marginRight: number
): number {
  const titleTotals = "TOTALES";
  const titleTotalsWidth = boldFont.widthOfTextAtSize(titleTotals, 12);
  page.drawText(titleTotals, {
    x: width - marginRight - titleTotalsWidth,
    y: currentY,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0)
  });
  currentY -= 15;
  const fontSizeTotals = 10;
  const drawRightAlignedText = (text: string) => {
    const textWidth = regularFont.widthOfTextAtSize(text, fontSizeTotals);
    page.drawText(text, {
      x: width - marginRight - textWidth,
      y: currentY,
      size: fontSizeTotals,
      font: regularFont,
      color: rgb(0, 0, 0)
    });
    currentY -= 15;
  };
  drawRightAlignedText(`SUBTOTAL: ${formatCLP(computed.subTotal)}`);
  drawRightAlignedText(`DESCUENTO (${discountPercentage}%): -${formatCLP(computed.discountValue)}`);
  drawRightAlignedText(`SUBTOTAL C/DCTO: ${formatCLP(computed.subTotalConDescuento)}`);
  drawRightAlignedText(`19% IVA: ${formatCLP(computed.iva)}`);
  drawRightAlignedText(`TOTAL: ${formatCLP(computed.total)}`);
  return currentY;
}

/**
 * Dibuja el pie de página del PDF en una zona fija, incluyendo:
 * - Bloque izquierdo: Información de contacto (correo y dirección).
 * - Bloque derecho: Información de aprobación.
 * 
 * Se usa una posición fija (footerY) para que ambos bloques queden siempre en la parte inferior.
 * @param page - Página del PDF en la que se dibuja.
 * @param regularFont - Fuente a utilizar para el texto.
 * @param marginLeft - Margen izquierdo.
 * @param width - Ancho total de la página.
 * @param marginRight - Margen derecho.
 */
function drawFooter(
  page: PDFPage,
  regularFont: PDFFont,
  marginLeft: number,
  width: number,
  marginRight: number
): void {
  // Definimos una posición fija para el pie de página (a 40 puntos del borde inferior)
  const footerY = 40;

  // Bloque izquierdo: Información de contacto
  page.drawText("social@decodigo.cl", {
    x: marginLeft,
    y: footerY + 20,
    size: 8,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
  page.drawText("Calle Lateral 122, Santiago, Chile", {
    x: marginLeft,
    y: footerY + 10,
    size: 8,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });

  // Bloque derecho: Información de aprobación
  const rightBlockX = width - marginRight - 150; // Ajusta este valor según sea necesario
  page.drawText("APROBADO POR", {
    x: rightBlockX,
    y: footerY + 20,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  page.drawText("Daniel Morales", {
    x: rightBlockX,
    y: footerY + 10,
    size: 10,
    font: regularFont,
    color: rgb(0, 0, 0)
  });
  page.drawText("@DeCodigo", {
    x: rightBlockX,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4)
  });
}

/**
 * Función principal para generar el PDF utilizando los datos proporcionados.
 * Se divide la creación en secciones: encabezado, descripción, cliente, proyecto, tabla de ítems, totales y pie de página.
 * @param datos - Datos necesarios para la generación del PDF.
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

    // Embebe las fuentes regulares y en negrita
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Márgenes básicos
    const marginLeft = 50;
    const marginRight = 50;
    let currentY = height - 60;

    // Sección de ENCABEZADO
    currentY = await drawHeader(page, datos, regularFont, boldFont, width, height, marginLeft, marginRight);
    
    // Sección de TEXTO DESCRIPTIVO
    currentY = drawDescription(page, datos.textoDescriptivo || "", currentY, regularFont, width, marginLeft);
    
    // Sección CLIENTE
    currentY = drawClienteSection(page, datos, regularFont, boldFont, currentY, marginLeft);
    
    // Sección PROYECTO
    currentY = drawProyectoSection(page, datos, boldFont, currentY, marginLeft);
    
    // TABLA DE ÍTEMS
    currentY = drawItemsTable(page, datos, regularFont, boldFont, currentY, marginLeft, width, marginRight);
    
    // Se calculan y dibujan los TOTALES
    const computed = computeTotals(datos.servicios, datos.descuento);
    currentY = drawTotals(page, computed, datos.descuento, regularFont, boldFont, currentY, width, marginRight);
    
    // Se dibuja el PIE DE PÁGINA en una zona fija al final de la página
    drawFooter(page, regularFont, marginLeft, width, marginRight);

    return pdfDoc.save();
  } catch (error) {
    console.error("Error generando el PDF:", error);
    throw error;
  }
}
