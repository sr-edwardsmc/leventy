"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import QrScanner from "qr-scanner";
import QrFrame from "@/public/assets/qr-frame.svg";
import "./qr-scanner.css";
import { validateTicket } from "@/app/dashboard/(dashboard)/tickets/actions";
import { TRaver, type TTicket } from "@/types/events";

const QrReader = ({ onClose }: { onClose: () => void }) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const [QRValidationStatus, setQRValidationStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidQr, setInvalidQr] = useState<TTicket | null>(null);
  const [ticket, setTicket] = useState<TTicket | null>(null);
  const [ticketOwner, setTicketOwner] = useState<TRaver | null>(null);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    scanner?.current?.stop();
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          console.error(err);
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  useEffect(() => {
    (async () => {
      if (!scannedResult) return;
      setIsLoading(true);
      try {
        const response = await validateTicket(scannedResult);

        if (response?.status === "success") {
          setQRValidationStatus("valid");
          setTicket(response.ticket!);
          setTicketOwner(response.ticket!.raver!);
        } else {
          if (response?.status === "error") {
            setInvalidQr(response.ticket!);
          }
          setQRValidationStatus(`Error - ${response.message}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [scannedResult]);

  const handleCloseClick = () => {
    setScannedResult(undefined);
    setQRValidationStatus("");
    setTicket(null);
    setTicketOwner(null);
    onClose();
  };

  return (
    <>
      {!scannedResult && (
        <div className="qr-reader">
          {/* QR */}
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
        </div>
      )}
      {
        // If loading QR show a fullsckreen with gray background and text "Loading" with an icon of spinner
        scannedResult && isLoading && (
          <div className="w-full h-[100vh]">
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-400">
              <div className="text-white text-2xl font-bold flex flex-col items-center justify-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
                <span className="">Validando...</span>
              </div>
            </div>
          </div>
        )
      }
      {
        // If success QR show a fullsckreen with green background and text "Valid" with an icon of checkmark
        scannedResult && QRValidationStatus === "valid" && !isLoading && (
          <div className="w-full h-[100vh] relative">
            <span
              className="absolute top-4 left-4 text-white text-4xl font-bold border border-white rounded-full px-4"
              onClick={handleCloseClick}
            >
              X
            </span>
            <div className="flex flex-col items-center justify-center w-full h-full bg-green-400">
              <span
                className="absolute top-4 left-4 text-white text-4xl font-bold border border-white rounded-full px-4"
                onClick={handleCloseClick}
              >
                X
              </span>
              <div className="text-white text-2xl font-bold flex flex-col items-center justify-center">
                <span className="p-5 rounded-full bg-white mb-2">✅</span>
                <span className="">Valido: Ingreso aprobado.</span>
                <span>
                  Etapa: {ticket?.ticketing.name} - ${ticket?.ticketing.price}
                </span>
                <span className="">{ticketOwner?.fullName}</span>
                <span>{ticketOwner?.idNumber} </span>
              </div>
            </div>
          </div>
        )
      }
      {
        // If error QR show a fullsckreen with red background and text "Invalid" with an icon of cross
        scannedResult && QRValidationStatus !== "valid" && !isLoading && (
          <div className="w-full h-[100vh]">
            <span
              className="absolute top-4 left-4 text-white text-4xl font-bold border border-white rounded-full px-4"
              onClick={handleCloseClick}
            >
              X
            </span>
            <div className="flex flex-col items-center justify-center w-full h-full bg-rose-400">
              <div className="text-white text-2xl font-bold flex flex-col justify-center items-center text-center">
                <span className="w-20 h-20 rounded-full bg-white mb-2 flex justify-center items-center">
                  <span className="text-red font-bold text-3xl">X</span>
                </span>
                <span className="">{QRValidationStatus}</span>
                {invalidQr && (
                  <span className="">
                    Validado a las: {""}
                    {invalidQr.checkedAt!.toISOString().substring(11, 19)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export { QrReader };
