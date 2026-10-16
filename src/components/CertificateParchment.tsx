import React from 'react';
import { Award, ShieldCheck, CheckCircle, QrCode } from 'lucide-react';

interface CertificateParchmentProps {
  studentName?: string;
  registerNumber?: string;
  institution?: string;
  course?: string;
  degree?: string;
  graduationYear?: number | string;
  issueDate?: string;
  qrCodeUrl?: string;
  verificationStatus?: 'VERIFIED' | 'INVALID' | 'SUSPICIOUS';
  blockchainHash?: string;
  cgpaOrGrade?: string;
}

export const CertificateParchment: React.FC<CertificateParchmentProps> = ({
  studentName = 'Kaviya Priya',
  registerNumber = '22IT101',
  institution = 'ABC Engineering College',
  course = 'B.Tech Information Technology',
  degree = 'Bachelor of Technology',
  graduationYear = 2026,
  issueDate = '2026-05-20',
  qrCodeUrl,
  verificationStatus = 'VERIFIED',
  blockchainHash,
  cgpaOrGrade = '8.94 First Class with Distinction',
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-b from-[#FDFBF7] to-[#F7F4EC] text-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl border-4 border-amber-600/40 font-serif select-none overflow-hidden">
      {/* Decorative Ornate Guilloche Border */}
      <div className="absolute inset-2 border-2 border-dashed border-amber-700/30 rounded-lg pointer-events-none" />
      <div className="absolute inset-4 border border-amber-800/20 rounded-md pointer-events-none" />

      {/* Background Watermark Crest */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Award className="w-80 h-80 text-amber-900" />
      </div>

      {/* Verification Status Watermark Badge (when tested) */}
      {verificationStatus === 'VERIFIED' && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-500/50 shadow-sm text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified Authentic
        </div>
      )}
      {verificationStatus === 'SUSPICIOUS' && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 border border-amber-500/50 shadow-sm text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
          ⚠️ Suspicious Flag
        </div>
      )}
      {verificationStatus === 'INVALID' && (
        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 text-rose-800 border border-rose-500/50 shadow-sm text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
          ❌ Invalid / Revoked
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 border border-amber-600/40 mb-2 shadow-inner">
          <Award className="w-7 h-7 text-amber-800" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase font-['Space_Grotesk']">
          {institution}
        </h2>
        <p className="text-xs tracking-widest text-amber-900/80 uppercase font-sans font-semibold mt-0.5">
          Office of the University Registrar • Academic Division
        </p>
      </div>

      {/* Certificate Title */}
      <div className="text-center my-3 border-y border-amber-700/20 py-2">
        <p className="text-[11px] uppercase tracking-widest text-slate-500 font-sans">
          This is to officially certify that
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-950 my-1.5 tracking-tight italic font-serif">
          {studentName}
        </h3>
        <p className="text-xs text-slate-600 font-sans">
          Register Number: <strong className="font-mono text-slate-900">{registerNumber}</strong>
        </p>
      </div>

      {/* Degree Statement */}
      <div className="text-center px-4 my-4 leading-relaxed text-xs sm:text-sm text-slate-700">
        has successfully fulfilled all academic requirements prescribed by the Senate and is hereby conferred the degree of
        <div className="my-2">
          <span className="inline-block text-base sm:text-lg font-bold text-slate-900 font-sans border-b-2 border-amber-500/40 pb-0.5">
            {course}
          </span>
        </div>
        with specialization and honors rating of <span className="font-semibold text-slate-900">{cgpaOrGrade}</span>,
        graduating in the Class of <strong className="text-slate-900 font-sans">{graduationYear}</strong>.
      </div>

      {/* Footer Details: Signatures, Seal Stamp & QR Code */}
      <div className="mt-6 pt-4 border-t border-amber-800/20 flex items-end justify-between gap-4 font-sans text-xs">
        {/* Registrar Signature */}
        <div className="text-center">
          <div className="font-serif italic text-base text-slate-800 tracking-wide mb-1 border-b border-slate-400 pb-0.5 font-bold">
            Dr. R. Ramanathan
          </div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
            Registrar & Controller of Examinations
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Date: {issueDate}
          </div>
        </div>

        {/* Embossed Gold Foil Seal Stamp */}
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border-2 border-amber-600 shadow-md flex items-center justify-center p-1">
            <div className="w-full h-full rounded-full border border-dashed border-amber-800/60 flex flex-col items-center justify-center text-center text-amber-950 font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-900" />
              <span className="text-[7px] uppercase tracking-tighter leading-none mt-0.5">OFFICIAL SEAL</span>
            </div>
          </div>
          <span className="text-[8px] font-mono text-amber-900/80 mt-1 uppercase">EduChain Secured</span>
        </div>

        {/* QR Code */}
        <div className="text-center flex flex-col items-center">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="Certificate Verification QR" 
              className="w-16 h-16 rounded bg-white p-1 border border-slate-300 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-white border border-slate-300 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-700" />
            </div>
          )}
          <span className="text-[9px] text-slate-500 font-mono mt-1">
            Scan to Verify
          </span>
        </div>
      </div>

      {/* Blockchain Hash Micro-Footprint */}
      {blockchainHash && (
        <div className="mt-3 text-center text-[9px] font-mono text-slate-400 truncate max-w-full font-sans">
          Blockchain SHA-256 Digest: {blockchainHash}
        </div>
      )}
    </div>
  );
};
