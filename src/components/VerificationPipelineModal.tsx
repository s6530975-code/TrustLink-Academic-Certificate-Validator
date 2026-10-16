import React, { useEffect, useState } from 'react';
import { 
  FileText, Search, KeyRound, QrCode, Link2, Cpu, Database, CheckCircle2, 
  Loader2, Sparkles, ShieldCheck 
} from 'lucide-react';

interface VerificationPipelineModalProps {
  isOpen: boolean;
  isServerReady?: boolean;
  statusMessage?: string | null;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, name: 'Reading Certificate', icon: FileText, label: 'Ingesting document payload & OCR buffers' },
  { id: 2, name: 'Extracting Certificate Information', icon: Search, label: 'Parsing candidate credentials & course details' },
  { id: 3, name: 'Validating Digital Signature', icon: KeyRound, label: 'Verifying PKI RSA-SHA256 signature chain' },
  { id: 4, name: 'Checking QR Code', icon: QrCode, label: 'Decoding encrypted payload and URL hash' },
  { id: 5, name: 'Verifying Blockchain Hash', icon: Link2, label: 'Querying EduChain immutable state ledger' },
  { id: 6, name: 'Running AI Forgery Detection', icon: Cpu, label: 'Analyzing font kerning, seals, and pixel noise' },
  { id: 7, name: 'Checking Institution Database', icon: Database, label: 'Confirming active registrar enrollment record' },
  { id: 8, name: 'Generating Final Result', icon: CheckCircle2, label: 'Compiling consensus report & security certificate' },
];

export const VerificationPipelineModal: React.FC<VerificationPipelineModalProps> = ({
  isOpen,
  isServerReady = true,
  statusMessage,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [autoRetryNotice, setAutoRetryNotice] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isOpen && !isServerReady) {
      timer = setTimeout(() => {
        setAutoRetryNotice(true);
      }, 2200);
    } else {
      setAutoRetryNotice(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, isServerReady]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(12);
      setAutoRetryNotice(false);
      return;
    }

    // Step through the pipeline steps
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        // If we reach step index 6 (Step 7: Checking Institution Database),
        // wait for the real server verification to finish if still analyzing
        if (prev === 6 && !isServerReady) {
          setProgress(85);
          return 6;
        }

        if (prev < STEPS.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / STEPS.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, isServerReady, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#090e1a] text-white p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-sky-500/10 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-400 mb-3 shadow-lg shadow-sky-950/40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Verification in Progress...
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Running TrustLink 8-Step Cryptographic & AI Pipeline
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-sky-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-lg font-bold text-white font-['Space_Grotesk']">
              {progress}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Status / Auto-Retry Notice */}
        {(statusMessage || (autoRetryNotice && !isServerReady)) && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5 animate-pulse">
            <Loader2 className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span className="font-medium">
              {statusMessage || "AI analysis service is temporarily busy. Retrying automatically..."}
            </span>
          </div>
        )}

        {/* 8-Step Timeline List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;
            const IconComponent = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                  isCurrent
                    ? 'bg-sky-950/50 border border-sky-500/40 shadow-sm shadow-sky-950/30'
                    : isCompleted
                    ? 'bg-slate-900/40 border border-slate-800/80 text-slate-300'
                    : 'opacity-40 text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-sky-950 text-sky-300 border border-sky-400 animate-pulse'
                      : 'bg-slate-850 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold truncate ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {step.id}. {step.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-sky-400 font-mono animate-pulse uppercase tracking-wider">
                        Running...
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Done ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
