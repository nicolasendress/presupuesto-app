/**
 * Define la interfaz para cada ítem/servicio que se incluirá en el PDF.
 */
export interface PdfServicioItem {
    numero: string;
    descripcion: string;
    precio: string;
    cantidad: string;
  }
  
  /**
   * Define la interfaz que contiene todos los datos necesarios para generar el PDF.
   */
  export interface PdfDatos {
    empresa: string;
    subtitulo: string;
    cotizacionTitulo: string;
    presupuestoNumero: string;
    fechaEmision: Date | null;       // Fecha de emisión (puede ser nula)
    fechaVencimiento: Date | null;   // Fecha de vencimiento (puede ser nula)
    cliente: string;
    direccion: string;
    telefono: string;
    rut: string;
    email: string;
    proyecto: string;
    textoDescriptivo: string;
    descuento: number;
    servicios: PdfServicioItem[];    // Lista de servicios o ítems a incluir en la cotización
  }
  