import React, { useState } from 'react';
import { QrCode, Camera, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedCertId: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [scanning, setScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedScan = (certId: string) => {
    setScanning(false);
    setTimeout(() => {
      onScanComplete(certId);
      onClose();
    }, 400);
  };

  const startLiveCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const videoEl = document.getElementById('qr-camera-video') as HTMLVideoElement;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Camera access not granted or unavailable in preview container. Use quick preset scanning below.');
      setCameraActive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#090e1a] text-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-['Space_Grotesk']">Scan Certificate QR Code</h3>
            <p className="text-xs text-slate-400">Position the QR code inside the optical target box</p>
          </div>
        </div>

        {/* Viewfinder Target Area */}
        <div className="relative w-full aspect-square rounded-xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center my-4">
          {/* Real camera video tag if permitted */}
          <video
            id="qr-camera-video"
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {/* Scanner Viewfinder Overlay */}
          <div className="relative z-10 w-56 h-56 border-2 border-sky-400/80 rounded-2xl flex flex-col items-center justify-center p-4">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-sky-400 -mt-1 -ml-1 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-sky-400 -mt-1 -mr-1 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-sky-400 -mb-1 -ml-1 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-sky-400 -mb-1 -mr-1 rounded-br-lg" />

            {/* Scanning laser line animation */}
            <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce" />

            <QrCode className="w-20 h-20 text-slate-700/60" />
            <span className="text-[11px] font-mono text-sky-300/80 mt-3 text-center">
              Align certificate QR code within frame
            </span>
          </div>

          {!cameraActive && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
              <button
                onClick={startLiveCamera}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-sky-950/50 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Enable Webcam Scanner
              </button>
            </div>
          )}
        </div>

        {cameraError && (
          <div className="mb-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Quick Demo QR Code Triggers */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Simulate Instant Optical QR Scans:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulatedScan('CERT-2026-IT-101')}
              className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-300 text-xs text-center transition-all cursor-pointer"
            >
              <div className="font-bold">Scan Genuine</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">22IT101</div>
            </button>
            <button
              onClick={() => handleSimulatedScan('CERT-2025-CS-409')}
              className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 text-amber-300 text-xs text-center transition-all cursor-pointer"
            >
              <div className="font-bold">Scan Suspicious</div>
              <div className="text-[10px] text-amber-400/80 font-mono">21CS409</div>
            </button>
            <button
              onClick={() => handleSimulatedScan('CERT-2024-ME-999')}
              className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/50 text-rose-300 text-xs text-center transition-all cursor-pointer"
            >
              <div className="font-bold">Scan Invalid</div>
              <div className="text-[10px] text-rose-400/80 font-mono">20ME999</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
