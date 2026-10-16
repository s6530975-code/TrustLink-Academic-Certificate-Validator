import React, { useState } from 'react';
import { 
  Briefcase, ShieldCheck, QrCode, Search, Download, 
  FileCheck, Clock, CheckCircle2, AlertTriangle, XCircle, ArrowRight 
} from 'lucide-react';
import { VerificationHistoryItem } from '../types';

interface EmployerPortalProps {
  onVerifyId: (certId: string) => void;
  onOpenScanner: () => void;
  onOpenReport: () => void;
  history: VerificationHistoryItem[];
}

export const EmployerPortal: React.FC<EmployerPortalProps> = ({
  onVerifyId,
  onOpenScanner,
  onOpenReport,
  history,
}) => {
  const [certInput, setCertInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    onVerifyId(certInput.trim());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                Employer & University Verifier Portal
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950/40 text-sky-300 border border-sky-500/30 uppercase">
                Fast-Track HR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              One-click instant candidate academic credential screening with audited compliance logs.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-[#090e1a] px-3.5 py-2 rounded-xl border border-slate-800">
          Organization: <strong className="text-white">TechCorp Global Recruitment</strong>
        </div>
      </div>

      {/* Main 2-Column Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Search ID Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Search Candidate Certificate ID
              </h3>
              <p className="text-xs text-slate-400">Instant on-chain background check</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="e.g. CERT-2026-IT-101"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm placeholder-slate-500 focus:border-sky-400 outline-hidden"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-950/50 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Candidate Credentials
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400">
            Try candidate: <button onClick={() => setCertInput('CERT-2026-IT-101')} className="text-sky-400 hover:underline cursor-pointer">Kaviya Priya (CERT-2026-IT-101)</button>
          </div>
        </div>

        {/* Scan Optical QR Code Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Scan Candidate Certificate QR
                </h3>
                <p className="text-xs text-slate-400">Scan from printed resume or mobile screen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-3">
              Aim your camera at the physical parchment or PDF resume QR badge to instantly decrypt signatures and verify on EduChain.
            </p>
          </div>

          <button
            onClick={onOpenScanner}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-sky-400" />
            Launch Camera QR Scanner
          </button>
        </div>
      </div>

      {/* Recent Candidate Screenings Table */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Recent Verification Audits
            </h3>
            <p className="text-xs text-slate-400">Exportable HR compliance records</p>
          </div>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            Download Latest Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Verification ID</th>
                <th className="pb-3 px-3">Candidate / Student</th>
                <th className="pb-3 px-3">Institution</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Result</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((item) => (
                <tr key={item.verificationId} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-mono font-semibold text-sky-300">
                    {item.verificationId}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {item.studentName}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.institution}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {item.date}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'VERIFIED'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : item.status === 'SUSPICIOUS'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {item.status} ({item.genuinenessScore}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onVerifyId(item.certificateId)}
                      className="text-sky-400 hover:underline font-semibold cursor-pointer"
                    >
                      Re-Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
