"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { generatePDF } from "@/utils/pdfutils";
import { PdfDatos } from "@/types/pdf";

interface Props {
  datos: PdfDatos;
  onDownload: () => void;
}

/**
 * Componente que ofrece dos acciones:
 * - Previsualizar el PDF generado.
 * - Descargar el PDF.
 * Además, maneja errores y la gestión de la URL de previsualización.
 */
export default function BotonPDF({ datos, onDownload }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Genera una previsualización del PDF y la muestra en un modal
  const handleGeneratePreview = async () => {
    try {
      const pdfBytes = await generatePDF(datos);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setShowModal(true);
      setError(null);
    } catch (err) {
      console.error("Error en previsualización:", err);
      setError("Error al generar la previsualización del PDF.");
    }
  };

  // Descarga el PDF generado y actualiza el número de presupuesto
  const handleDownload = async () => {
    try {
      const pdfBytes = await generatePDF(datos);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const fileName =
        datos.proyecto && datos.proyecto.trim() !== ""
          ? `${datos.proyecto}.pdf`
          : "Presupuesto.pdf";
      saveAs(blob, fileName);
      onDownload();  // Incrementa el número de presupuesto tras la descarga
    } catch (err) {
      console.error("Error al descargar:", err);
      setError("Error al descargar el PDF.");
    }
  };

  // Cierra el modal y revoca la URL de previsualización para liberar memoria
  const handleCloseModal = () => {
    setShowModal(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <>
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary shadow rounded-pill px-4"
          onClick={handleGeneratePreview}
        >
          Previsualizar PDF
        </button>
        <button
          className="btn btn-success shadow rounded-pill px-4"
          onClick={handleDownload}
        >
          Descargar PDF
        </button>
      </div>

      {error && <div className="text-danger mt-2">{error}</div>}

      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div
              className="modal-content"
              style={{
                backgroundColor: "#424242",
                border: "none",
              }}
            >
              <div
                className="modal-header p-2"
                style={{
                  borderBottom: "none",
                  backgroundColor: "#424242",
                  margin: 0,
                }}
              >
                <h5 className="modal-title text-white mb-0">
                  Previsualización del PDF
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  style={{ outline: "none" }}
                ></button>
              </div>

              <div
                className="modal-body p-0"
                style={{
                  margin: 0,
                  backgroundColor: "#424242",
                }}
              >
                {previewUrl && (
                  <iframe
                    src={previewUrl}
                    title="PDF Preview"
                    className="w-100"
                    style={{
                      height: "600px",
                      border: "none",
                      backgroundColor: "#424242",
                    }}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
