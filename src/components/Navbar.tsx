import React from 'react';
import { Shield, Award, QrCode, Cpu, Link2, Building2, Briefcase, History, Lock, Sun, Moon, Sparkles, CheckCircle2, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onSelectPreset: (scenario: 'genuine' | 'suspicious' | 'invalid') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  isDarkMode,
  setIsDarkMode,
  onSelectPreset,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const roles: { key: UserRole; label: string; icon: any }[] = [
    { key: 'student', label: 'Student', icon: Award },
    { key: 'institution', label: 'Institution', icon: Building2 },
    { key: 'employer', label: 'Employer / University', icon: Briefcase },
    { key: 'admin', label: 'Admin', icon: Shield },
  ];

  const currentRoleObj = roles.find((r) => r.key === userRole) || roles[0];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 border-slate-800/80 bg-[#020617]/90 text-white">
      {/* Top Notification / Demo quick bar */}
      <div className="bg-[#040817]/90 border-b border-slate-800/70 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-500/20">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Demo Verification Mode
            </span>
            <span className="hidden sm:inline text-slate-400">
              Quick test scenarios:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="demo-genuine-btn"
              onClick={() => onSelectPreset('genuine')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all cursor-pointer shadow-xs"
              title="Test with Kaviya Priya (22IT101) - 99.2% Genuine"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Genuine (Kaviya Priya)
            </button>
            <button
              id="demo-suspicious-btn"
              onClick={() => onSelectPreset('suspicious')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 transition-all cursor-pointer shadow-xs"
              title="Test with Tampered Font/Seal - 68.4% Suspicious"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Suspicious (Tampered)
            </button>
            <button
              id="demo-invalid-btn"
              onClick={() => onSelectPreset('invalid')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40 transition-all cursor-pointer shadow-xs"
              title="Test with Hash Mismatch / Revoked - Invalid"
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              Invalid (Revoked/Fake)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo & Brand */}
        <div 
          id="brand-logo"
          onClick={() => setActiveTab('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-sky-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center border border-white/5">
              <Shield className="w-6 h-6 text-sky-400" />
            </div>
            <Award className="w-3.5 h-3.5 text-sky-300 absolute -bottom-1 -right-1 bg-[#020617] rounded-full p-0.5 border border-slate-800" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
                TRUST<span className="text-sky-400">LINK</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 tracking-wider uppercase">
                EduSec
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Academic Certificate Authenticity Validator
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            id="nav-tab-landing"
            onClick={() => setActiveTab('landing')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'landing'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Home
          </button>
          <button
            id="nav-tab-verify"
            onClick={() => setActiveTab('verify')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'verify' || activeTab === 'result'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            Verify
          </button>
          <button
            id="nav-tab-student"
            onClick={() => {
              setUserRole('student');
              setActiveTab('student');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'student'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Student
          </button>
          <button
            id="nav-tab-institution"
            onClick={() => {
              setUserRole('institution');
              setActiveTab('institution');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'institution'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            Institution
          </button>
          <button
            id="nav-tab-employer"
            onClick={() => {
              setUserRole('employer');
              setActiveTab('employer');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'employer'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            Employer
          </button>
          <button
            id="nav-tab-admin"
            onClick={() => {
              setUserRole('admin');
              setActiveTab('admin');
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'admin'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Admin
          </button>
          <button
            id="nav-tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'ai'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            AI Forensics
          </button>
          <button
            id="nav-tab-blockchain"
            onClick={() => setActiveTab('blockchain')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'blockchain'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            Ledger
          </button>
          <button
            id="nav-tab-history"
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'history'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            History
          </button>
          <button
            id="nav-tab-security"
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'security'
                ? 'text-sky-400 bg-slate-800/70 border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Security
          </button>
        </nav>

        {/* Right side controls: Role Switcher & Action */}
        <div className="flex items-center gap-3">
          {/* User Role Selector Dropdown */}
          <div className="relative">
            <button
              id="user-role-menu-button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-all cursor-pointer"
            >
              <currentRoleObj.icon className="w-3.5 h-3.5 text-sky-400" />
              <span>Role: <strong className="text-white">{currentRoleObj.label}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                id="role-dropdown-menu"
                className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-800 bg-[#090e1a] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setUserRole(r.key);
                      setRoleDropdownOpen(false);
                      if (r.key === 'institution') setActiveTab('institution');
                      else if (r.key === 'employer') setActiveTab('employer');
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      userRole === r.key
                        ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <r.icon className="w-4 h-4 text-sky-400" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Launch Verify CTA */}
          <button
            id="quick-verify-cta"
            onClick={() => setActiveTab('verify')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-950/50 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Verify Certificate
          </button>
        </div>
      </div>
    </header>
  );
};
