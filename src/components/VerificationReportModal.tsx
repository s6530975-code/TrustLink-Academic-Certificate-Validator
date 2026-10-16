import React, { useRef } from 'react';
import { 
  Shield, Award, Download, Printer, X, CheckCircle2, 
  AlertTriangle, XCircle, QrCode, KeyRound, Link2, Cpu, Building2 
} from 'lucide-react';
import { VerificationResult } from '../types';

interface VerificationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: VerificationResult;
}

export const VerificationReportModal: React.FC<VerificationReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const isVerified = result.overallStatus === 'VERIFIED';
  const isSuspicious = result.overallStatus === 'SUSPICIOUS';

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print preview blocked by sandbox environment:', e);
    }
  };

  const handleDownloadPDF = () => {
    // Open print preview which allows saving as PDF in all modern browsers
    try {
      window.print();
    } catch (e) {
      console.warn('PDF export blocked by sandbox environment:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Action Header Bar (Excluded from Print) */}
        <div className="bg-[#090e1a] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-sm font-['Space_Grotesk']">
              Official Verification Audit Report
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm shadow-sky-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div ref={reportRef} className="p-8 sm:p-12 space-y-8 print:p-0">
          {/* Header with TrustLink Logo & Verification ID */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-cyan-300">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
                  TRUST<span className="text-blue-600">LINK</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">
                  Academic Certificate Authenticity Validator • Official Audit
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Verification ID
              </div>
              <div className="text-sm font-bold font-mono text-blue-900">
                {result.verificationId}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                Issued: {result.timestamp}
              </div>
            </div>
          </div>

          {/* Final Verification Status Banner */}
          <div
            className={`p-5 rounded-2xl border flex items-center justify-between ${
              isVerified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : isSuspicious
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {isVerified ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <h2 className="text-lg font-bold uppercase font-['Space_Grotesk']">
                  Final Status: {result.overallStatus}
                </h2>
                <p className="text-xs opacity-80">
                  Consensus rating calculated across optical, cryptographic, and neural verification checks.
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black font-['Space_Grotesk']">
                {result.genuinenessScore}%
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
                Authenticity
              </span>
            </div>
          </div>

          {/* Certificate Credentials Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Certificate Credentials
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <strong className="text-slate-900 text-sm">{result.studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Register Number:</span>
                <strong className="text-slate-900 font-mono text-sm">{result.registerNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Institution:</span>
                <strong className="text-slate-900">{result.institution}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Course / Degree:</span>
                <strong className="text-slate-900">{result.course}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Year of Graduation:</span>
                <strong className="text-slate-900">{result.graduationYear}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Certificate ID:</span>
                <strong className="text-slate-900 font-mono">{result.certificateId}</strong>
              </div>
            </div>
          </div>

          {/* 4 Pillars Audit Breakdown Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Multi-Pillar Verification Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* QR Verification Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    QR Verification
                  </span>
                  <span className="font-bold text-emerald-600">{result.qrStatus}</span>
                </div>
                <p className="text-[11px] text-slate-600">{result.qrDetails}</p>
              </div>

              {/* Digital Signature Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    Digital Signature
                  </span>
                  <span className="font-bold text-emerald-600">{result.digitalSignatureStatus}</span>
                </div>
                <p className="text-[11px] text-slate-600">{result.digitalSignatureDetails}</p>
              </div>

              {/* Blockchain Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-indigo-600" />
                    Blockchain Hash
                  </span>
                  <span className="font-bold text-emerald-600">{result.blockchainInfo.status}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono truncate">
                  Hash: {result.blockchainInfo.certificateHash}
                </p>
                <div className="text-[10px] text-slate-500">Block #{result.blockchainInfo.blockNumber} • EduChain Mainnet</div>
              </div>

              {/* AI Analysis Result */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-600" />
                    AI Analysis Result
                  </span>
                  <span className="font-bold text-cyan-700">{result.aiMetrics.genuinenessScore}% Score</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Structure: {result.aiMetrics.documentStructure} • Seal: {result.aiMetrics.sealLogoAnalysis}
                </p>
                <div className="text-[10px] text-slate-500">Manipulation: {result.aiMetrics.imageManipulation}</div>
              </div>
            </div>
          </div>

          {/* Audit Trail & Watermark Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <div>
              Verification Timestamp: <span className="text-slate-800">{result.timestamp}</span>
            </div>
            <div>
              Audit Certified by: <strong className="text-slate-800 font-sans">TrustLink Consortium CA</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
