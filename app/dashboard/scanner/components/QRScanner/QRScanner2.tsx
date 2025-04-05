"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import QrScanner from "qr-scanner";
import QrFrame from "@/public/assets/qr-frame.svg";
import "./qr-scanner.css";
import { validateTicket } from "@/app/dashboard/(dashboard)/tickets/actions";
import { TRaver, type TTicket } from "@/types/events";

type QRValidationStatus = "idle" | "scanning" | "valid" | "invalid" | "error";

const QRScanner2 = ({ onClose }: { onClose: () => void }) => {
  // Refs
  const scanner = useRef<QrScanner | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);

  // State
  const [cameraState, setCameraState] = useState<
    "active" | "inactive" | "error"
  >("inactive");
  const [validationStatus, setValidationStatus] =
    useState<QRValidationStatus>("idle");
  const [scannedData, setScannedData] = useState<string>("");
  const [ticket, setTicket] = useState<TTicket | null>(null);
  const [ticketOwner, setTicketOwner] = useState<TRaver | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Cleanup scanner instance
  const cleanupScanner = useCallback(() => {
    if (scanner.current) {
      scanner.current.stop();
      scanner.current.destroy();
      scanner.current = null;
    }
  }, []);

  // Initialize QR Scanner
  const initScanner = useCallback(async () => {
    if (!videoEl.current || scanner.current) return;

    try {
      scanner.current = new QrScanner(
        videoEl.current,
        (result) => {
          setScannedData(result.data);
          setValidationStatus("scanning");
          scanner.current?.pause();
        },
        {
          onDecodeError: (error) => {
            console.warn("QR Scan Error:", error);
          },
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl.current || undefined,
          maxScansPerSecond: 5, // Limitar escaneos por segundo para mejor rendimiento
          returnDetailedScanResult: true,
        }
      );

      await scanner.current.start();
      setCameraState("active");
    } catch (error) {
      console.error("Camera Error:", error);
      setCameraState("error");
      setErrorMessage(
        "Error al acceder a la cámara. Por favor verifica los permisos."
      );
    }
  }, []);

  // Validate scanned ticket
  const validateScannedTicket = useCallback(async (data: string) => {
    try {
      const response = await validateTicket(data);

      if (response?.status === "success") {
        setValidationStatus("valid");
        setTicket(response.ticket || null);
        setTicketOwner(response.ticket?.raver || null);
      } else {
        setValidationStatus("invalid");
        setErrorMessage(response?.message || "Ticket inválido");
        setTicket(response?.ticket || null);
      }
    } catch (error) {
      console.error("Validation Error:", error);
      setValidationStatus("error");
      setErrorMessage("Error al validar el ticket. Intente nuevamente.");
    }
  }, []);

  // Reset scanner state
  const resetScanner = useCallback(() => {
    setScannedData("");
    setValidationStatus("idle");
    setTicket(null);
    setTicketOwner(null);
    setErrorMessage("");
    if (scanner.current && cameraState === "active") {
      scanner.current.start();
    }
  }, [cameraState]);

  // Handle close
  const handleClose = useCallback(() => {
    cleanupScanner();
    onClose();
  }, [onClose, cleanupScanner]);

  // Effects
  useEffect(() => {
    initScanner();
    return () => cleanupScanner();
  }, [initScanner, cleanupScanner]);

  useEffect(() => {
    if (scannedData && validationStatus === "scanning") {
      validateScannedTicket(scannedData);
    }
  }, [scannedData, validationStatus, validateScannedTicket]);

  // Camera error handling
  useEffect(() => {
    if (cameraState === "error") {
      console.error("Camera access denied or not available");
    }
  }, [cameraState]);

  // Loading state
  if (validationStatus === "scanning") {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white mb-4"></div>
        <p className="text-white text-xl font-semibold">Validando ticket...</p>
      </div>
    );
  }

  // Valid ticket
  if (validationStatus === "valid" && ticket && ticketOwner) {
    return (
      <div className="fixed inset-0 bg-green-600 flex flex-col items-center justify-center z-50 p-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="bg-white rounded-full p-4 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">¡Ticket Válido!</h2>
        <p className="text-white text-lg mb-1">{ticketOwner.fullName}</p>
        <p className="text-white mb-4">{ticketOwner.idNumber}</p>

        <div className="bg-white bg-opacity-20 rounded-lg p-4 w-full max-w-md">
          <p className="text-white font-medium">{ticket.ticketing.name}</p>
          <p className="text-white">Precio: ${ticket.ticketing.price}</p>
        </div>
      </div>
    );
  }

  // Invalid/Error states
  if (validationStatus === "invalid" || validationStatus === "error") {
    return (
      <div className="fixed inset-0 bg-red-600 flex flex-col items-center justify-center z-50 p-4">
        <button
          onClick={resetScanner}
          className="absolute top-4 right-4 bg-white text-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl"
          aria-label="Reintentar"
        >
          ↻
        </button>

        <div className="bg-white rounded-full p-4 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-white text-2xl font-bold mb-4">
          {validationStatus === "invalid"
            ? "Ticket Inválido"
            : "Error de Validación"}
        </h2>

        <p className="text-white text-center mb-6">{errorMessage}</p>

        {ticket?.checkedAt && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-white">
              Validado anteriormente:{" "}
              {new Date(ticket.checkedAt).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Camera error
  if (cameraState === "error") {
    return (
      <div className="fixed inset-0 bg-gray-800 flex flex-col items-center justify-center z-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-white text-xl font-bold mb-4 text-center">
          Error de Cámara
        </h2>
        <p className="text-gray-300 text-center mb-6">{errorMessage}</p>

        <button
          onClick={initScanner}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          Reintentar
        </button>

        <button
          onClick={handleClose}
          className="mt-4 text-gray-300 hover:text-white"
        >
          Cerrar
        </button>
      </div>
    );
  }

  // Main scanner view
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 bg-white bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl z-10"
        aria-label="Cerrar escáner"
      >
        ×
      </button>

      <div className="relative w-full max-w-2xl h-96">
        <video
          ref={videoEl}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        <div
          ref={qrBoxEl}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative border-4 border-white rounded-lg w-64 h-64">
            <Image
              src={QrFrame}
              alt="Marco de escaneo QR"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-full inline-block">
            Escanear código QR del ticket
          </p>
        </div>
      </div>
    </div>
  );
};

export { QRScanner2 };
