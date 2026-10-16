import React, { useState } from 'react';
import { 
  Link2, CheckCircle2, ShieldCheck, Copy, Check, Server, 
  Cpu, ArrowDown, ExternalLink, Network, Database, Lock 
} from 'lucide-react';
import { BlockchainVerificationInfo } from '../types';

interface BlockchainViewProps {
  blockchainInfo: BlockchainVerificationInfo;
  certificateId?: string;
  studentName?: string;
}

export const BlockchainView: React.FC<BlockchainViewProps> = ({
  blockchainInfo,
  certificateId = 'CERT-2026-IT-101',
  studentName = 'Kaviya Priya',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isMatched = blockchainInfo.status.includes('MATCHED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-2">
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            Distributed Ledger Technology (DLT) Proof
          </div>
          <h2 className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Blockchain Hash Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero-knowledge cryptographic timestamping on the decentralized EduChain consortium network.
          </p>
        </div>

        {/* Big Blockchain Status Pill */}
        <div className="flex items-center gap-3 bg-[#090e1a] px-5 py-3.5 rounded-2xl border border-slate-800 shadow-xl">
          <div className={`w-3.5 h-3.5 rounded-full ${isMatched ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]' : 'bg-rose-400'}`} />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Blockchain Status
            </div>
            <div className={`text-lg font-bold font-['Space_Grotesk'] ${isMatched ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isMatched ? 'VERIFIED & IMMUTABLE' : 'UNCONFIRMED / MISMATCH'}
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Network
          </span>
          <span className="text-xs font-bold text-white block truncate">
            {blockchainInfo.network}
          </span>
          <span className="text-[11px] text-sky-400 font-mono mt-1 block">
            Consensus: PoA (18 Nodes)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Block Height
          </span>
          <span className="text-sm font-bold text-emerald-400 font-mono block">
            #{blockchainInfo.blockNumber}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Confirmations: 256+
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Timestamp
          </span>
          <span className="text-xs font-bold text-white block">
            {blockchainInfo.timestamp}
          </span>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            NTP Atomic Sync
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
            Verification Status
          </span>
          <span className="text-xs font-bold text-sky-300 block">
            {blockchainInfo.status}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Zero-Knowledge Verified
          </span>
        </div>
      </div>

      {/* Hashes and Transaction Data Container */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
          On-Chain Cryptographic Digests
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Certificate SHA-256 Hash</span>
              <span className="text-sky-300 break-all font-semibold">{blockchainInfo.certificateHash}</span>
            </div>
            <button
              onClick={() => copyText('hash', blockchainInfo.certificateHash)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedKey === 'hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'hash' ? 'Copied' : 'Copy Hash'}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Blockchain Transaction ID (TxID)</span>
              <span className="text-indigo-300 break-all font-semibold">{blockchainInfo.transactionId}</span>
            </div>
            <button
              onClick={() => copyText('tx', blockchainInfo.transactionId)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedKey === 'tx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'tx' ? 'Copied' : 'Copy TxID'}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Smart Contract Registry Address</span>
              <span className="text-emerald-300 break-all font-semibold">{blockchainInfo.contractAddress}</span>
            </div>
            <button
              onClick={() => copyText('contract', blockchainInfo.contractAddress)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedKey === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'contract' ? 'Copied' : 'Copy Address'}
            </button>
          </div>
        </div>
      </div>

      {/* VISUAL BLOCKCHAIN TIMELINE (Requested in Section 7) */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            Cryptographic Lifecycle Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visual progression of immutable verification on the distributed network
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute top-6 bottom-6 left-6 sm:left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-sky-500 via-indigo-500 to-emerald-400 opacity-40 rounded-full" />

          <div className="space-y-8 relative z-10">
            {blockchainInfo.timeline.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse sm:text-right' : 'sm:text-left'
                }`}
              >
                {/* Content Box */}
                <div className="w-full sm:w-[calc(50%-2rem)] p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
                  <div className="flex items-center gap-2 mb-1 justify-start sm:justify-inherit">
                    <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">
                      Stage {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
                    {item.step}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Node Center Circle */}
                <div className="w-12 h-12 rounded-2xl bg-[#020617] border-2 border-sky-400 flex items-center justify-center shrink-0 text-sky-300 shadow-lg shadow-sky-950/30 sm:mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-sky-400" />
                </div>

                {/* Empty spacer for grid balance */}
                <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
