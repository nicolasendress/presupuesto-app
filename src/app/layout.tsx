import "bootstrap/dist/css/bootstrap.min.css"; // Importa estilos de Bootstrap globalmente
import "./globals.css";                        // Importa estilos globales personalizados
import { ReactNode } from "react";

export const metadata = {
  title: "Generador de Presupuesto",
  description: "Aplicación para generar presupuestos de servicios"
};

/**
 * Layout principal de la aplicación.
 * Envuelve todas las páginas y proporciona estilos y metadatos globales.
 * Se han removido las clases de tema oscuro para evitar conflictos con los estilos globales.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body className="m-0 p-0">
        {children}
      </body>
    </html>
  );
}
