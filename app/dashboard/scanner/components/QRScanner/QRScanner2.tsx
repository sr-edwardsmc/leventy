"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import QrScanner from "qr-scanner";
import QrFrame from "@/public/assets/qr-frame.svg";
import "./qr-scanner.css";
import { validateTicket } from "@/app/dashboard/(dashboard)/tickets/actions";
import { TRaver, type TTicket } from "@/types/events";

const QrReader2 = ({ onClose }: { onClose: () => void }) => {
  // QR States
  const scanner = useRef<QrScanner | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false);

  const [QRValidationStatus, setQRValidationStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidQr, setInvalidQr] = useState<TTicket | null>(null);
  const [ticket, setTicket] = useState<TTicket | null>(null);
  const [ticketOwner, setTicketOwner] = useState<TRaver | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>(
    undefined
  );

  // Start scanner function - separate for reuse
  const startScanner = async () => {
    if (!videoEl.current || !scanner.current) return;

    try {
      await scanner.current.start();
      setQrOn(true);
      setError(null);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setQrOn(false);
      setError("No se pudo iniciar la cámara. Verifique los permisos.");
    }
  };

  // Stop scanner function - separate for reuse
  const stopScanner = () => {
    if (scanner.current) {
      scanner.current.stop();
    }
  };

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    if (!result?.data) {
      return; // Ignore empty results
    }

    // Stop scanner and set result
    stopScanner();
    setScannedResult(result.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // Just log the error but don't stop scanning
    console.log("Scan error (normal during scanning):", err);
  };

  // Initialize scanner
  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      try {
        // Instantiate the QR Scanner
        scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
          onDecodeError: onScanFail,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          overlay: qrBoxEl?.current || undefined,
        });

        // Start QR Scanner
        startScanner();
      } catch (initError) {
        console.error("Scanner initialization error:", initError);
        setError(
          "Error al inicializar el escáner. Intente recargar la página."
        );
      }
    }

    // Clean up on unmount
    return () => {
      stopScanner();
    };
  }, []);

  // Handle camera permissions
  useEffect(() => {
    if (!qrOn && error) {
      // Show a better UI message instead of an alert
      console.error("Camera error:", error);
    }
  }, [qrOn, error]);

  // Validate QR code
  useEffect(() => {
    let isMounted = true;

    const validateQrCode = async () => {
      if (!scannedResult) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await validateTicket(scannedResult);

        // Check if component is still mounted before updating state
        if (!isMounted) return;

        if (response?.status === "success") {
          setQRValidationStatus("valid");
          setTicket(response.ticket || null);
          setTicketOwner(response.ticket?.raver || null);
        } else {
          if (response?.status === "error") {
            setInvalidQr(response.ticket || null);
          }
          setQRValidationStatus(
            `Error - ${response?.message || "Desconocido"}`
          );
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Validation error:", error);
        setQRValidationStatus("Error - Error de conexión o validación");
        setError("Error al validar el código QR. Intente nuevamente.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    validateQrCode();

    return () => {
      isMounted = false;
    };
  }, [scannedResult]);

  // Reset and restart scanning
  const handleCloseClick = () => {
    setScannedResult(undefined);
    setQRValidationStatus("");
    setTicket(null);
    setTicketOwner(null);
    setInvalidQr(null);
    setError(null);

    // Restart scanner if closing validation screen
    if (scanner.current) {
      startScanner();
    }

    onClose();
  };

  // Retry scanning
  const handleRetry = () => {
    setScannedResult(undefined);
    setQRValidationStatus("");
    setTicket(null);
    setTicketOwner(null);
    setInvalidQr(null);
    setError(null);

    // Restart scanner
    if (scanner.current) {
      startScanner();
    }
  };

  return (
    <>
      {!scannedResult && (
        <div className="qr-reader relative">
          <video ref={videoEl}></video>
          <div ref={qrBoxEl} className="qr-box">
            <Image
              src={QrFrame}
              alt="Qr Frame"
              width={256}
              height={256}
              className="qr-frame"
            />
          </div>

          {/* Camera error message */}
          {error && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center p-4 text-center">
              <div className="text-white text-xl font-bold mb-4">{error}</div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleRetry}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Close button for scanner */}
          <button
            className="absolute top-4 left-4 text-white text-2xl font-bold border border-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleCloseClick}
          >
            X
          </button>
        </div>
      )}

      {/* Loading screen */}
      {scannedResult && isLoading && (
        <div className="w-full h-[100vh]">
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-400">
            <div className="text-white text-2xl font-bold flex flex-col items-center justify-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
              <span className="">Validando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Valid QR success screen */}
      {scannedResult && QRValidationStatus === "valid" && !isLoading && (
        <div className="w-full h-[100vh] relative">
          <button
            className="absolute top-4 left-4 text-white text-2xl font-bold border border-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleCloseClick}
          >
            X
          </button>
          <div className="flex flex-col items-center justify-center w-full h-full bg-green-400">
            <div className="text-white text-2xl font-bold flex flex-col items-center justify-center">
              <span className="p-5 rounded-full bg-white mb-2">✅</span>
              <span className="">Válido: Ingreso aprobado.</span>
              {ticket?.ticketing && (
                <span>
                  Etapa: {ticket.ticketing.name} - ${ticket.ticketing.price}
                </span>
              )}
              {ticketOwner?.fullName && (
                <span className="">{ticketOwner.fullName}</span>
              )}
              {ticketOwner?.idNumber && <span>{ticketOwner.idNumber}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Invalid QR error screen */}
      {scannedResult && QRValidationStatus !== "valid" && !isLoading && (
        <div className="w-full h-[100vh] relative">
          <button
            className="absolute top-4 left-4 text-white text-2xl font-bold border border-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleCloseClick}
          >
            X
          </button>
          <div className="flex flex-col items-center justify-center w-full h-full bg-rose-400">
            <div className="text-white text-2xl font-bold flex flex-col justify-center items-center text-center p-4">
              <span className="w-20 h-20 rounded-full bg-white mb-2 flex justify-center items-center">
                <span className="text-rose-500 font-bold text-3xl">X</span>
              </span>
              <span className="mb-2">{QRValidationStatus}</span>
              {invalidQr?.checkedAt && (
                <span className="mb-4">
                  Validado a las:{" "}
                  {new Date(invalidQr.checkedAt)
                    .toISOString()
                    .substring(11, 19)}
                </span>
              )}
              <button
                className="mt-4 px-6 py-2 bg-white text-rose-500 rounded-md font-bold"
                onClick={handleRetry}
              >
                Escanear Otro
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { QrReader2 };
