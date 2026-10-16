import React, { useState } from 'react';
import { 
  History, Search, Filter, CheckCircle2, AlertTriangle, 
  XCircle, Download, ExternalLink, Calendar, Building2 
} from 'lucide-react';
import { VerificationHistoryItem } from '../types';

interface VerificationHistoryViewProps {
  history: VerificationHistoryItem[];
  onSelectVerification: (certId: string) => void;
  onOpenReport: () => void;
}

export const VerificationHistoryView: React.FC<VerificationHistoryViewProps> = ({
  history,
  onSelectVerification,
  onOpenReport,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'SUSPICIOUS' | 'INVALID'>('ALL');
  const [institutionFilter, setInstitutionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique institutions for filter
  const institutions = Array.from(new Set(history.map((h) => h.institution)));

  const filteredHistory = history.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesInst = institutionFilter === 'ALL' || item.institution === institutionFilter;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verificationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesInst && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-sky-400" />
            Immutable Audit Trail
          </div>
          <h2 className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Verification History
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete cryptographic log of all academic certificate validations executed on TrustLink.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          Export Audit Log
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, certificate ID, verification ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'VERIFIED', 'SUSPICIOUS', 'INVALID'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Institution Filter Dropdown */}
        <select
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-sky-400 outline-hidden cursor-pointer"
        >
          <option value="ALL">All Institutions</option>
          {institutions.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
      </div>

      {/* History Table (Requested Schema: Verification ID | Student | Institution | Date | Status) */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Verification ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Institution</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.verificationId} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-300">
                      {item.verificationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{item.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.certificateId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-medium text-slate-200">{item.institution}</div>
                      <div className="text-[11px] text-slate-400">{item.course}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          item.status === 'VERIFIED'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                            : item.status === 'SUSPICIOUS'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                            : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {item.status === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {item.status === 'SUSPICIOUS' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        {item.status === 'INVALID' && <XCircle className="w-3 h-3 text-rose-400" />}
                        {item.status} ({item.genuinenessScore}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectVerification(item.certificateId)}
                        className="px-3 py-1 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-500/20 font-semibold text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        View Report <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No verification records matching your selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
