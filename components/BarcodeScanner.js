"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result && scanning) {
          setScanning(false);
          onScan(result.getText());
          onClose();
        }
        if (err && err.name !== "NotFoundException") {
          setError("Camera error: " + err.message);
        }
      })
      .catch((e) => setError("Camera access denied: " + e.message));

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-sm mx-4">
        <div className="bg-blue-700 px-4 py-3 flex items-center justify-between">
          <span className="text-white font-bold">Barcode Scanner</span>
          <button onClick={onClose} className="text-white text-xl font-bold">✕</button>
        </div>

        <div className="relative">
          <video ref={videoRef} className="w-full" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-red-500 w-64 h-32 rounded-lg opacity-70" />
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="px-4 py-3 text-center text-gray-500 text-sm">
          Barcode को box के अंदर रखो
        </div>
      </div>
    </div>
  );
}