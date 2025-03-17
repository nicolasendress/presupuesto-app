// Importa el componente principal del formulario
import Formulario from "components/Formulario";

/**
 * Componente de página que renderiza el formulario central para generar el presupuesto.
 */
export default function PresupuestoPage() {
  return (
    <main className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Formulario />
      </div>
    </main>
  );
}
