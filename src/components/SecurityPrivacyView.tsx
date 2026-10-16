import React from 'react';
import { 
  ShieldCheck, Lock, KeyRound, Link2, Users, EyeOff, 
  FileCheck, Server, Sparkles, CheckCircle2 
} from 'lucide-react';

export const SecurityPrivacyView: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      desc: 'All certificate documents and transmitted verification payloads are encrypted with AES-256 at rest and TLS 1.3 in transit.',
      badge: 'AES-256 & TLS 1.3',
    },
    {
      icon: KeyRound,
      title: 'JWT-Based Secure Authentication',
      desc: 'Role-based session tokens with HMAC-SHA256 signatures, short-lived expiries, and cryptographic integrity protection.',
      badge: 'Stateless JWT',
    },
    {
      icon: FileCheck,
      title: 'X.509 PKI Digital Signatures',
      desc: 'University registrars sign academic certificates using 2048-bit asymmetric RSA and ECDSA cryptographic keypairs.',
      badge: 'PKI Signed',
    },
    {
      icon: Link2,
      title: 'Blockchain Certificate Hashing',
      desc: 'SHA-256 document digests are permanently stamped onto the decentralized EduChain consortium blockchain with validator consensus.',
      badge: 'Immutable Ledger',
    },
    {
      icon: Users,
      title: 'Granular Role-Based Access (RBAC)',
      desc: 'Explicit permission tiers separate Student access, Registrar issuance tools, Employer screening, and Administrator monitoring.',
      badge: 'RBAC Enforced',
    },
    {
      icon: EyeOff,
      title: 'Zero-Knowledge Privacy Protection',
      desc: 'Student personal data is never publicly exposed or sold. Verification is conducted via zero-knowledge cryptographic hash checks.',
      badge: 'FERPA & GDPR Compliant',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          Enterprise-Grade Trust & Compliance
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
          Security & Privacy Architecture
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          How TrustLink protects university academic integrity and student privacy through zero-knowledge cryptographic verification.
        </p>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityFeatures.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#090e1a]/95 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk'] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                  {item.badge}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Data Protection Commitment Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090e1a]/95 border border-sky-500/20 text-xs sm:text-sm text-slate-300 space-y-3">
        <h4 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-400" />
          Strict Non-Public Disclosure Policy
        </h4>
        <p className="leading-relaxed">
          In strict compliance with international student data protection regulations (such as FERPA and GDPR Article 9), TrustLink does not maintain publicly indexable directories of student credentials or grades. An academic certificate can only be queried by authorized holders presenting the physical document, the signed QR optical token, or an authenticated registrar ID.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-sky-300">
          <span>✓ Zero PII Stored on Public Blockchains</span>
          <span>✓ Deterministic One-Way Hashes Only</span>
          <span>✓ Full Institutional Revocation Controls</span>
        </div>
      </div>
    </div>
  );
};
