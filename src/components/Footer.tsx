import React from 'react';
import { Shield, Award, Sparkles, Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNav: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNav }) => {
  return (
    <footer className="bg-[#020617] border-t border-slate-800 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-950/50">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-['Space_Grotesk'] tracking-tight">
                TRUST<span className="text-sky-400">LINK</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Academic Certificate Authenticity Validator. Built for Smart Education & Cybersecurity to instantly verify university credentials with QR codes, digital signatures, blockchain hashing, and AI forgery detection.
            </p>
            <div className="text-[11px] text-sky-400 font-semibold italic">
              “Verify. Trust. Authenticate.”
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Features
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNav('verify')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  Certificate Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNav('ai')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  AI Forgery Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onNav('blockchain')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  EduChain Blockchain
                </button>
              </li>
              <li>
                <button onClick={() => onNav('history')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  Verification History
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Portals & Governance
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNav('institution')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  Institution Registrar Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNav('employer')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  Employer & HR Verifier
                </button>
              </li>
              <li>
                <button onClick={() => onNav('security')} className="hover:text-sky-300 transition-colors cursor-pointer">
                  Security & Student Privacy
                </button>
              </li>
              <li className="pt-1 text-[11px] text-slate-500 font-mono">
                Consortium Version: 2.5.0-L2
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} TrustLink Academic Integrity Consortium. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>EduChain Consortium L2</span>
            <span>•</span>
            <span>Zero-Knowledge Authenticity</span>
            <span>•</span>
            <span>ISO 27001 Certified Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
