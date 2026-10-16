import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Shield, QrCode, KeyRound, 
  Link2, Cpu, FileText, Download, Printer, ArrowLeft, ExternalLink, 
  Eye, Check, AlertCircle, Copy, Sparkles, Building2, Calendar, Award 
} from 'lucide-react';
import { VerificationResult } from '../types';
import { CertificateParchment } from './CertificateParchment';

interface ResultDashboardProps {
  result: VerificationResult;
  onReset: () => void;
  onOpenReport: () => void;
  onOpenAiForensics: () => void;
  onOpenBlockchain: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onReset,
  onOpenReport,
  onOpenAiForensics,
  onOpenBlockchain,
}) => {
  const [showParchmentModal, setShowParchmentModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const isVerified = result.overallStatus === 'VERIFIED';
  const isSuspicious = result.overallStatus === 'SUSPICIOUS';
  const isRevoked = result.overallStatus === 'REVOKED';
  const isNotRegistered = result.overallStatus === 'NOT_REGISTERED' || (result.overallStatus as any) === 'NOT VERIFIED';
  const isUnverifiable = result.overallStatus === 'UNVERIFIABLE';
  const isNeedsManualReview = result.overallStatus === 'NEEDS_MANUAL_REVIEW';
  const isInvalid = result.overallStatus === 'INVALID';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Verify Another Certificate
        </button>

        <div className="flex items-center gap-3">
          {result.fileInfo && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-[180px]">{result.fileInfo.filename}</span>
              <span className="text-slate-500">({result.fileInfo.fileSize})</span>
            </div>
          )}

          <button
            onClick={() => setShowParchmentModal(!showParchmentModal)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            {showParchmentModal ? 'Hide Parchment' : 'View Parchment'}
          </button>

          <button
            id="download-report-cta"
            onClick={onOpenReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-950/50 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Optional In-Page Parchment Preview */}
      {showParchmentModal && (
        <div className="p-4 sm:p-6 rounded-3xl bg-[#090e1a]/95 border border-slate-800 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Digital Certificate Parchment Preview
            </h4>
            <span className="text-xs text-slate-400">High-Resolution Vector Rendering</span>
          </div>
          <CertificateParchment
            studentName={result.studentName}
            registerNumber={result.registerNumber}
            institution={result.institution}
            course={result.course}
            graduationYear={result.graduationYear}
            verificationStatus={result.overallStatus}
            blockchainHash={result.blockchainInfo.certificateHash}
            cgpaOrGrade={result.cgpaOrGrade}
          />
        </div>
      )}

      {/* HERO RESULT CARD */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 border shadow-2xl backdrop-blur-xl overflow-hidden ${
          isVerified
            ? 'bg-gradient-to-br from-[#041a14]/90 via-[#07131e]/90 to-[#020617]/95 border-emerald-500/30 shadow-emerald-950/20'
            : isSuspicious
            ? 'bg-gradient-to-br from-[#1f1505]/90 via-[#15111b]/90 to-[#020617]/95 border-amber-500/30 shadow-amber-950/20'
            : isRevoked
            ? 'bg-gradient-to-br from-[#200508]/90 via-[#16060c]/90 to-[#020617]/95 border-rose-500/40 shadow-rose-950/20'
            : isNotRegistered
            ? 'bg-gradient-to-br from-[#071a2e]/90 via-[#0a1120]/90 to-[#020617]/95 border-sky-500/30 shadow-sky-950/20'
            : isUnverifiable
            ? 'bg-gradient-to-br from-[#1c1825]/90 via-[#0e0c15]/90 to-[#020617]/95 border-purple-500/30 shadow-purple-950/20'
            : 'bg-gradient-to-br from-[#1f060b]/90 via-[#160a12]/90 to-[#020617]/95 border-rose-500/30 shadow-rose-950/20'
        }`}
      >
        {/* Decorative corner glow */}
        <div 
          className={`absolute top-0 right-0 w-80 h-80 blur-3xl pointer-events-none ${
            isVerified ? 'bg-emerald-500/10' : isSuspicious ? 'bg-amber-500/10' : isNotRegistered ? 'bg-sky-500/10' : 'bg-rose-500/10'
          }`} 
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          {/* Status Header */}
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg shrink-0 ${
                isVerified
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-emerald-950/30'
                  : isSuspicious
                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-amber-950/30'
                  : isRevoked
                  ? 'bg-rose-950/80 text-rose-400 border-rose-500/40 shadow-rose-950/30'
                  : isNotRegistered
                  ? 'bg-sky-950/80 text-sky-400 border-sky-500/40 shadow-sky-950/30'
                  : isUnverifiable
                  ? 'bg-purple-950/80 text-purple-400 border-purple-500/40 shadow-purple-950/30'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40 shadow-rose-950/30'
              }`}
            >
              {isVerified ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-9 h-9" />
              ) : isNotRegistered ? (
                <AlertCircle className="w-9 h-9" />
              ) : isUnverifiable ? (
                <Eye className="w-9 h-9" />
              ) : (
                <XCircle className="w-9 h-9" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk'] ${
                    isVerified
                      ? 'text-emerald-300'
                      : isSuspicious
                      ? 'text-amber-300'
                      : isRevoked
                      ? 'text-rose-400'
                      : isNotRegistered
                      ? 'text-sky-300'
                      : isUnverifiable
                      ? 'text-purple-300'
                      : 'text-rose-400'
                  }`}
                >
                  {isVerified && '✅ CERTIFICATE VERIFIED'}
                  {isSuspicious && '⚠️ SUSPICIOUS / ANOMALIES DETECTED'}
                  {isRevoked && '❌ CERTIFICATE REVOKED'}
                  {isNotRegistered && 'ℹ️ UNREGISTERED CREDENTIAL (NOT FOUND IN DATABASE)'}
                  {isUnverifiable && '🔍 UNVERIFIABLE / LOW RESOLUTION SCAN'}
                  {isNeedsManualReview && '📋 NEEDS MANUAL INSTITUTIONAL REVIEW'}
                  {isInvalid && '❌ CERTIFICATE INVALID / TAMPERED'}
                </span>

                {result.isDemoData ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30">
                    {result.demoLabel || 'DEMO MODE (Simulated Record)'}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-sky-950/50 text-sky-300 border border-sky-500/30">
                    Real Document Extraction
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
                {isVerified && 'The academic certificate matches active registrar cryptographic records and shows no visual or ledger tampering.'}
                {isSuspicious && 'Formatting anomalies or minor discrepancies detected. Manual institutional verification advised.'}
                {isRevoked && 'Critical alert: This certificate was officially marked as REVOKED by the issuing academic registrar.'}
                {isNotRegistered && 'This certificate is not currently registered in the TrustLink database or EduChain ledger. AI visual inspection detected no tampering. Lack of digital registration is NOT proof of fraud.'}
                {isUnverifiable && 'The document image could not be processed cleanly. Please upload a higher resolution or uncropped scan.'}
                {isInvalid && 'Authenticity check failed. Forensic inspection detected document alterations or broken cryptographic signatures.'}
              </p>
            </div>
          </div>

          {/* Genuineness Score Pill */}
          <div className="flex items-center gap-4 bg-slate-900/90 px-5 py-3 rounded-2xl border border-slate-800 shadow-md shrink-0">
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                AI Vision & Forensic
              </div>
              <div className="text-xs text-slate-400">
                Authenticity Score
              </div>
            </div>
            <div
              className={`text-3xl sm:text-4xl font-black font-['Space_Grotesk'] ${
                isVerified
                  ? 'text-emerald-400'
                  : isSuspicious
                  ? 'text-amber-400'
                  : isNotRegistered
                  ? 'text-sky-400'
                  : 'text-rose-400'
              }`}
            >
              {result.genuinenessScore}%
              <span className="text-xs font-normal text-slate-400 block -mt-1 font-sans">
                {isVerified ? 'Genuine' : isNotRegistered ? 'Visual Score' : isSuspicious ? 'Assessment' : 'Confidence'}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Credential Details */}
        <div className="relative z-10 pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Extracted Certificate Credentials:
            </span>
            {result.fileInfo && (
              <span className="text-[11px] text-sky-400 font-mono">
                Source: {result.fileInfo.filename} ({result.fileInfo.fileSize})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Recipient / Student Name</span>
              <span className="text-sm font-bold text-white font-serif tracking-wide truncate block">
                {result.studentName || 'Not Detected'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Register / Roll Number</span>
              <span className="text-sm font-bold text-sky-300 font-mono truncate block">
                {result.registerNumber || 'Not Detected'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Institution Name</span>
              <span className="text-sm font-bold text-white truncate block">
                {result.institution || 'Not Detected'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Course / Event Name</span>
              <span className="text-sm font-bold text-white truncate block">
                {result.eventName || result.course || 'Not Detected'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Certificate Type / Degree</span>
              <span className="text-sm font-bold text-slate-200 truncate block">
                {result.certificateType || result.degree || 'Certificate of Appreciation'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Department / Year</span>
              <span className="text-sm font-bold text-emerald-400 truncate block">
                {result.department || 'Not Detected'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Certificate ID / Serial</span>
              <span className="text-sm font-bold text-sky-300 font-mono truncate block">
                {result.certificateId || 'N/A (Not Printed)'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Issue / Event Date</span>
              <span className="text-sm font-bold text-slate-200">
                {result.issueDate || result.timestamp.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Breakdown (Available vs Missing) */}
        {((result.evidenceAvailable && result.evidenceAvailable.length > 0) || (result.evidenceMissing && result.evidenceMissing.length > 0)) && (
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.evidenceAvailable && result.evidenceAvailable.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 block flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Evidence Present:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.evidenceAvailable.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.evidenceMissing && result.evidenceMissing.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Digital Ledger Evidence Missing (Unregistered):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.evidenceMissing.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Reasons & Audit Summary */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Verification Findings & Explanations:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                {isVerified ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                ) : isSuspicious ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                ) : isNotRegistered ? (
                  <AlertCircle className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                )}
                <span>{reason}</span>
              </div>
            ))}
          </div>
          {isNotRegistered && (
            <div className="mt-3 p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200">
              <div className="font-semibold flex items-center gap-1.5 mb-1 text-sky-300">
                <Building2 className="w-4 h-4" /> Next Steps & Manual Verification
              </div>
              <p className="text-[11px] text-slate-300">
                {result.recommendation || `Contact ${result.institution || "the issuing college"} to verify offline records. Institutional registrars can register this credential on TrustLink to enable one-click cryptographic verification.`}
              </p>
            </div>
          )}
          {isSuspicious && (
            <p className="text-[11px] text-amber-300/90 italic mt-2 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
              * Note: AI analysis provides an assessment based on visual indicators and should not be used as the sole determinant for administrative actions.
            </p>
          )}
        </div>
      </div>

      {/* 4 INDIVIDUAL VERIFICATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: QR CODE VERIFICATION */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    QR CODE VERIFICATION
                  </h4>
                  <span className="text-[11px] text-slate-400">Encrypted Optical Token</span>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  result.qrStatus.includes('VALID')
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : result.qrStatus.includes('SUSPICIOUS')
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                }`}
              >
                Status: {result.qrStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.qrDetails}
            </p>

            {result.qrPayload && (
              <div className="mt-2.5 p-2 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                <span className="text-slate-400 text-[10px] block font-sans">Decoded Optical QR Payload:</span>
                {result.qrPayload}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Payload Signature: ECDSA Secp256k1</span>
            <span className="text-sky-400 font-mono">Format: TrustLink-V2</span>
          </div>
        </div>

        {/* CARD 2: DIGITAL SIGNATURE */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    DIGITAL SIGNATURE
                  </h4>
                  <span className="text-[11px] text-slate-400">PKI Registrar Authentication</span>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  result.digitalSignatureStatus.includes('VALID')
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : result.digitalSignatureStatus.includes('SUSPICIOUS')
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                }`}
              >
                Status: {result.digitalSignatureStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.digitalSignatureDetails}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Algorithm: RSA-SHA256 (2048-bit)</span>
            <span className="text-emerald-400 font-mono">Chain: Root CA Trusted</span>
          </div>
        </div>

        {/* CARD 3: BLOCKCHAIN VERIFICATION */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    BLOCKCHAIN VERIFICATION
                  </h4>
                  <span className="text-[11px] text-slate-400">EduChain Distributed Ledger</span>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  result.blockchainInfo.status.includes('MATCHED')
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : result.blockchainInfo.status.includes('UNVERIFIED')
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                    : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                }`}
              >
                Status: {result.blockchainInfo.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 font-mono text-[11px]">
                <div className="text-slate-400 text-[10px] uppercase">Certificate Hash:</div>
                <div className="text-sky-300 truncate flex items-center justify-between">
                  <span>{result.blockchainInfo.certificateHash}</span>
                  <button
                    onClick={() => copyToClipboard(result.blockchainInfo.certificateHash)}
                    className="p-1 hover:text-white cursor-pointer"
                    title="Copy Hash"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Verification ID:</span>
                  <span className="text-white font-mono">{result.verificationId}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                  <span className="text-slate-300 font-mono truncate block">{result.timestamp}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono text-[11px]">Block #{result.blockchainInfo.blockNumber}</span>
            <button
              onClick={onOpenBlockchain}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Explore Ledger <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 4: AI FORGERY DETECTION */}
        <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    AI FORGERY DETECTION
                  </h4>
                  <span className="text-[11px] text-slate-400">Multi-Vector Vision Analysis</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-sky-300 block">
                  {result.aiMetrics.genuinenessScore}% Genuine
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Document Structure:</span>
                <span className={`font-semibold ${result.aiMetrics.documentStructure === 'Authentic' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.aiMetrics.documentStructure}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Font Consistency:</span>
                <span className={`font-semibold ${result.aiMetrics.fontConsistency === 'Passed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.aiMetrics.fontConsistency}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Seal/Logo Analysis:</span>
                <span className={`font-semibold ${result.aiMetrics.sealLogoAnalysis === 'Passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.aiMetrics.sealLogoAnalysis}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Text Tampering:</span>
                <span className={`font-semibold ${result.aiMetrics.textTampering === 'Not Detected' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.aiMetrics.textTampering}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 sm:col-span-2">
                <span className="text-slate-300">Image Manipulation:</span>
                <span className={`font-semibold ${result.aiMetrics.imageManipulation === 'Not Detected' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.aiMetrics.imageManipulation}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 truncate max-w-[200px]">Model: ResNet-Forensics & Gemini</span>
            <button
              onClick={onOpenAiForensics}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Detailed AI Report <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
