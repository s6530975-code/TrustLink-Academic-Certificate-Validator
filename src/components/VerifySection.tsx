import React, { useState, useRef } from 'react';
import { 
  UploadCloud, QrCode, Search, FileText, CheckCircle2, AlertTriangle, 
  XCircle, Sparkles, Shield, ArrowRight, FileUp, Info, Loader2, X 
} from 'lucide-react';
import { decodeQrFromImageFile } from '../utils/qrDecoder';

export interface VerificationRequestOptions {
  isDemoMode: boolean;
  demoScenario?: 'genuine' | 'suspicious' | 'invalid' | 'not_registered' | 'legacy_registered';
  customId?: string;
  file?: File;
  fileBase64?: string;
  filename?: string;
  fileType?: string;
  fileSize?: string;
  clientDecodedQr?: string | null;
}

interface VerifySectionProps {
  onStartVerification: (options: VerificationRequestOptions) => void;
  onOpenQrScanner: () => void;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export const VerifySection: React.FC<VerifySectionProps> = ({
  onStartVerification,
  onOpenQrScanner,
  errorMessage,
  onClearError,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [detectedQrInFile, setDetectedQrInFile] = useState<string | null>(null);
  const [manualCertId, setManualCertId] = useState('CERT-2026-IT-101');
  const [activeMethod, setActiveMethod] = useState<'upload' | 'qr' | 'manual'>('upload');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setDetectedQrInFile(null);
    if (onClearError) onClearError();

    // If it's an image, attempt background client-side QR decode immediately
    if (file.type.startsWith('image/')) {
      try {
        const decoded = await decodeQrFromImageFile(file);
        if (decoded) {
          setDetectedQrInFile(decoded);
        }
      } catch (err) {
        console.warn('Client QR scan attempt skipped/failed:', err);
      }
    }
  };

  const triggerRealDocumentVerification = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsReadingFile(true);
    try {
      const fileBase64 = await readFileAsBase64(selectedFile);
      let qrPayload = detectedQrInFile;

      if (!qrPayload && selectedFile.type.startsWith('image/')) {
        try {
          qrPayload = await decodeQrFromImageFile(selectedFile);
        } catch {
          // continue without client QR
        }
      }

      onStartVerification({
        isDemoMode: false,
        file: selectedFile,
        fileBase64,
        filename: selectedFile.name,
        fileType: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        clientDecodedQr: qrPayload,
      });
    } catch (err) {
      console.error('Failed reading file:', err);
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = manualCertId.trim();
    if (!query) return;

    onStartVerification({
      isDemoMode: false,
      customId: query,
    });
  };

  const handleDemoPresetClick = (scenario: 'genuine' | 'suspicious' | 'invalid' | 'not_registered' | 'legacy_registered') => {
    onStartVerification({
      isDemoMode: true,
      demoScenario: scenario,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/20 text-sky-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          Multi-Factor Authenticity Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
          Verify Your Certificate
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Upload any degree or diploma (PDF, JPG, PNG), scan an embedded QR code, or query the on-chain registry to run multi-vector AI forensics and blockchain consensus.
        </p>
      </div>

      {/* Error Notice Banner if previous extraction encountered an issue */}
      {errorMessage && (
        <div
          className={`mb-8 p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-lg transition-all ${
            errorMessage.includes('temporarily unavailable')
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-amber-950/30'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-200 shadow-rose-950/30'
          }`}
        >
          <div className="flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                errorMessage.includes('temporarily unavailable') ? 'text-amber-400' : 'text-rose-400'
              }`}
            />
            <div>
              <span className="font-bold block text-white">
                {errorMessage.includes('temporarily unavailable')
                  ? 'AI Analysis Service Notice:'
                  : errorMessage.includes('API key')
                  ? 'Configuration Notice:'
                  : 'Document Processing Notice:'}
              </span>
              <span>{errorMessage}</span>
              {errorMessage.includes('temporarily unavailable') && (
                <p className="mt-1 text-xs text-amber-300/80">
                  The upstream AI model is experiencing a demand spike. Your document file is intact. Automatic retries and fallback models were executed; please try submitting again in a moment.
                </p>
              )}
            </div>
          </div>
          {onClearError && (
            <button
              onClick={onClearError}
              className={`p-1 rounded-lg transition-colors ${
                errorMessage.includes('temporarily unavailable')
                  ? 'text-amber-400 hover:text-white hover:bg-amber-900/50'
                  : 'text-rose-400 hover:text-white hover:bg-rose-900/50'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Verification Methods Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveMethod('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeMethod === 'upload'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Method 1: Upload Document
        </button>
        <button
          onClick={() => setActiveMethod('qr')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeMethod === 'qr'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Method 2: QR Scanner
        </button>
        <button
          onClick={() => setActiveMethod('manual')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
            activeMethod === 'manual'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-950/50'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          Method 3: Ledger Lookup
        </button>
      </div>

      {/* Card Content Based on Active Method */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {activeMethod === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Upload Real Academic Certificate
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supported formats: <span className="font-semibold text-slate-200">PDF, JPG, JPEG, PNG</span> (Maximum file size: 10 MB)
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                dragActive
                  ? 'border-sky-400 bg-sky-950/20 scale-[1.01]'
                  : selectedFile
                  ? 'border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/60'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center mx-auto mb-4 text-sky-400 shadow-md">
                <UploadCloud className="w-8 h-8" />
              </div>

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/50 text-emerald-300 text-xs font-semibold border border-emerald-500/40 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Selected File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>

                  {detectedQrInFile && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-mono">
                      <QrCode className="w-3.5 h-3.5" />
                      QR Detected: {detectedQrInFile.slice(0, 32)}...
                    </div>
                  )}

                  <p className="text-xs text-slate-400">
                    Click to replace this file or proceed to verify below.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">
                    Drag and drop certificate here, or <span className="text-sky-400 underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Real AI OCR extracts recipient name, registration number, degrees, seals, and digital signatures.
                  </p>
                </div>
              )}
            </div>

            {/* Upload & Verify Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Zero-knowledge privacy: Document contents are processed securely without public leakage.</span>
              </div>

              <button
                id="upload-verify-button"
                onClick={triggerRealDocumentVerification}
                disabled={isReadingFile}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-950/50 transition-all cursor-pointer disabled:opacity-50"
              >
                {isReadingFile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reading Document...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    {selectedFile ? 'Verify This Certificate' : 'Select Certificate to Verify'}
                  </>
                )}
              </button>
            </div>

            {/* Clear, Dedicated DEMO MODE section */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-950/50 border border-amber-500/30 text-amber-300 font-bold text-[10px] tracking-wider uppercase">
                    DEMO MODE
                  </span>
                  <span className="text-xs text-slate-400">
                    Presentation & quick testing presets (simulated test records):
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div 
                  onClick={() => handleDemoPresetClick('genuine')}
                  className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-950/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">✅ Authentic</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/40 px-1.5 py-0.5 rounded">99.2%</span>
                  </div>
                  <div className="text-xs text-white font-semibold truncate">Kaviya Priya</div>
                  <div className="text-[11px] text-slate-400 truncate">B.Tech IT • ABC Engg</div>
                </div>

                <div 
                  onClick={() => handleDemoPresetClick('not_registered')}
                  className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 hover:border-sky-500/50 hover:bg-sky-950/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sky-300 group-hover:text-sky-200">ℹ️ Unregistered</span>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-900/40 px-1.5 py-0.5 rounded">91.4%</span>
                  </div>
                  <div className="text-xs text-white font-semibold truncate">Sakthivel.M (SAEC)</div>
                  <div className="text-[11px] text-slate-400 truncate">Intra Hackathon (No QR)</div>
                </div>

                <div 
                  onClick={() => handleDemoPresetClick('legacy_registered')}
                  className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-950/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200">📜 Legacy Match</span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-900/40 px-1.5 py-0.5 rounded">94.8%</span>
                  </div>
                  <div className="text-xs text-white font-semibold truncate">Priya Sundaram</div>
                  <div className="text-[11px] text-slate-400 truncate">Legacy Archive Match</div>
                </div>

                <div 
                  onClick={() => handleDemoPresetClick('suspicious')}
                  className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-950/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">⚠️ Suspicious</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-900/40 px-1.5 py-0.5 rounded">68.4%</span>
                  </div>
                  <div className="text-xs text-white font-semibold truncate">Arjun Verma</div>
                  <div className="text-[11px] text-slate-400 truncate">Font anomalies</div>
                </div>

                <div 
                  onClick={() => handleDemoPresetClick('invalid')}
                  className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-950/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-rose-300 group-hover:text-rose-200">❌ Revoked</span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-900/40 px-1.5 py-0.5 rounded">14.5%</span>
                  </div>
                  <div className="text-xs text-white font-semibold truncate">Vikram R.</div>
                  <div className="text-[11px] text-slate-400 truncate">Revoked on ledger</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMethod === 'qr' && (
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400 shadow-lg">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Scan Certificate QR Code
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Scan via live camera or upload a QR image to verify the cryptographic payload against the ledger.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <button
                id="scan-qr-code-button"
                onClick={onOpenQrScanner}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                Launch Optical QR Scanner
              </button>

              <div className="pt-4 border-t border-slate-800">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase mb-2">
                  DEMO MODE
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Simulate QR scans with pre-configured mock payloads:
                </p>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleDemoPresetClick('genuine')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 text-xs font-medium cursor-pointer hover:bg-emerald-900/40 transition-colors"
                  >
                    Demo Genuine QR
                  </button>
                  <button
                    onClick={() => handleDemoPresetClick('suspicious')}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-500/30 text-xs font-medium cursor-pointer hover:bg-amber-900/40 transition-colors"
                  >
                    Demo Suspicious QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMethod === 'manual' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Query Certificate Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Direct cryptographic lookup against the EduChain blockchain ledger and registrar database.
              </p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Certificate ID, Register No, or SHA-256 Digest
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCertId}
                    onChange={(e) => setManualCertId(e.target.value)}
                    placeholder="e.g. CERT-2026-IT-101 or 22IT101 or 0x8f3c71..."
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-white font-mono text-sm placeholder-slate-500 outline-hidden transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                    QUERY
                  </div>
                </div>
              </div>

              <button
                id="manual-verify-button"
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                Query Ledger & Registrar Record
              </button>
            </form>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Quick Test IDs (from registrar database):</span>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <button 
                  onClick={() => setManualCertId('CERT-2026-IT-101')} 
                  className="text-sky-400 hover:underline cursor-pointer"
                >
                  CERT-2026-IT-101 (Registered)
                </button>
                <span>•</span>
                <button 
                  onClick={() => setManualCertId('CERT-2025-CS-409')} 
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  CERT-2025-CS-409 (Suspicious)
                </button>
                <span>•</span>
                <button 
                  onClick={() => setManualCertId('CERT-2024-ME-999')} 
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  CERT-2024-ME-999 (Revoked)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
