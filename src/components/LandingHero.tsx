import React from 'react';
import { Shield, QrCode, Cpu, Link2, Award, CheckCircle2, ArrowRight, Sparkles, FileCheck, Database, KeyRound, Search } from 'lucide-react';
import { CertificateParchment } from './CertificateParchment';

interface LandingHeroProps {
  onStartVerification: () => void;
  onExploreAi: () => void;
  onSelectPreset: (scenario: 'genuine' | 'suspicious' | 'invalid') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartVerification,
  onExploreAi,
  onSelectPreset,
}) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden text-slate-100">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Subtitle & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/20 text-sky-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Next-Gen Academic Integrity & Zero-Trust Protocol
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Space_Grotesk']">
              Verify Academic Certificates in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300">Seconds</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              An AI-powered certificate verification platform that detects forged and tampered academic documents using QR codes, digital signatures, blockchain hashing and AI analysis.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-verify-btn"
                onClick={onStartVerification}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-950/50 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Shield className="w-4 h-4 text-sky-200" />
                Verify Certificate
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                id="hero-how-it-works-btn"
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Quick Demo Scenario Badges */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Instant Interactive Demo:
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onSelectPreset('genuine')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Kaviya Priya (22IT101) - Genuine 99.2%
                </button>
                <button
                  onClick={() => onSelectPreset('suspicious')}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  ⚠️ Tampered Name/Font - Suspicious
                </button>
                <button
                  onClick={() => onSelectPreset('invalid')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  ❌ Revoked/Forged Hash - Invalid
                </button>
              </div>
            </div>

            {/* Platform Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-sky-400 font-['Space_Grotesk']">99%+</div>
                <div className="text-xs text-slate-400 font-medium">Verification Accuracy</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-indigo-400 font-['Space_Grotesk']">&lt; 2.5s</div>
                <div className="text-xs text-slate-400 font-medium">Instant Verification</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-emerald-400 font-['Space_Grotesk']">SHA-256</div>
                <div className="text-xs text-slate-400 font-medium">Secure Blockchain Hashing</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-xs">
                <div className="text-2xl font-extrabold text-violet-400 font-['Space_Grotesk']">Multi-Layer</div>
                <div className="text-xs text-slate-400 font-medium">AI Forgery Detection</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual illustration of digital certificate with interactive indicators */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle decorative aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative rounded-2xl border border-slate-800 bg-[#090e1a]/95 p-4 shadow-2xl backdrop-blur-xl">
                {/* Visual Security Overlay Indicators */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-slate-300 font-semibold">BLOCK #4892104</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    EduChain Secured
                  </div>
                </div>

                {/* Scaled certificate card representation */}
                <div className="transform scale-[0.88] origin-top -mb-6">
                  <CertificateParchment
                    studentName="Kaviya Priya"
                    registerNumber="22IT101"
                    institution="ABC Engineering College"
                    course="B.Tech Information Technology"
                    graduationYear={2026}
                    issueDate="2026-05-20"
                    verificationStatus="VERIFIED"
                    blockchainHash="0x8f3c71b96a92e10a5611cf098192db87d3a014e7cf4120bf485a39cb2e77b102"
                  />
                </div>

                {/* Floating security indicators overlay */}
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                    <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">QR Code: Valid</div>
                      <div className="text-[10px] text-emerald-400/80 font-mono">ECDSA Signed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200">
                    <Cpu className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">AI Score: 99.2%</div>
                      <div className="text-[10px] text-sky-400/80">Tamper Free</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                    <Link2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">Hash Matched</div>
                      <div className="text-[10px] text-indigo-300/80">Consensus Confirmed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
                    <KeyRound className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px]">Digital Signature</div>
                      <div className="text-[10px] text-purple-300/80">Registrar Key Valid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="py-16 bg-[#020617] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400 font-sans mb-2">
              Multi-Layer Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              How TrustLink Validates Authenticity
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              A comprehensive 5-pillar security framework engineered to make academic credential fraud mathematically and forensically impossible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Pillar 1: QR Code */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center mb-4 text-sky-400 group-hover:scale-110 transition-transform">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Pillar 1</div>
                <h4 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">QR Code Verification</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decodes encrypted payload containing certificate metadata and signature hash directly from official registrar records.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                Encrypted Payload
              </div>
            </div>

            {/* Pillar 2: Digital Signature */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Pillar 2</div>
                <h4 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">Digital Signature</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verifies Public Key Infrastructure (PKI) cryptographic signatures with the authorized university controller's private key.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                RSA-SHA256 / ECDSA
              </div>
            </div>

            {/* Pillar 3: Blockchain Hash */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Link2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Pillar 3</div>
                <h4 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">Blockchain Hashing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Matches immutable cryptographic SHA-256 digests committed into decentralized EduChain blocks with validator consensus.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                Tamper-Proof Ledger
              </div>
            </div>

            {/* Pillar 4: AI Forgery Detection */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center mb-4 text-violet-400 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">Pillar 4</div>
                <h4 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">AI Forgery Detection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Computer vision models detect font kerning inconsistencies, seal alterations, pixel resampling, and noise frequency anomalies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                Neural Image Forensics
              </div>
            </div>

            {/* Pillar 5: Database Verification */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Pillar 5</div>
                <h4 className="text-base font-bold text-white mb-2 font-['Space_Grotesk']">Institution Database</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time synchronization with accredited registrar databases ensuring degree status is active and not revoked.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                Live Registrar Sync
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
