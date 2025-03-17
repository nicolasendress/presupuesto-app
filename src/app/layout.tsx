import "bootstrap/dist/css/bootstrap.min.css"; // Importa estilos de Bootstrap globalmente
import "./globals.css";                        // Importa estilos globales personalizados
import { ReactNode } from "react";

export const metadata = {
  title: "Generador de Presupuesto",
  description: "Aplicación para generar presupuestos de servicios",
};

/**
 * Layout principal de la aplicación.
 * Envuelve todas las páginas y proporciona estilos y metadatos globales.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head />
      <body className="bg-dark text-light m-0 p-0">
        {children}
      </body>
    </html>
  );
}
