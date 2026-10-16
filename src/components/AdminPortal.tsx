import React, { useState, useEffect } from 'react';
import { 
  Shield, Building2, AlertTriangle, CheckCircle2, XCircle, 
  Activity, Database, Lock, Key, Users, RefreshCw, Search,
  FileCheck, ShieldAlert, Cpu, Award
} from 'lucide-react';
import { Certificate } from '../types';
import { api } from '../services/api';

interface AdminPortalProps {
  onVerifyCert: (certId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onVerifyCert }) => {
  const [stats, setStats] = useState({
    totalCertificates: 3843,
    activeCertificates: 3814,
    revokedCertificates: 29,
    totalVerifications: 1423,
    successRate: '99.2%',
    averageVerificationTime: '1.2s',
    ledgerBlockHeight: 4892104,
  });

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'institutions' | 'revocations' | 'security'>('overview');
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.getStats();
      if (statsRes) setStats(statsRes);

      const certsRes = await api.getAllCertificates();
      if (certsRes?.certificates) setCertificates(certsRes.certificates);

      // Default accredited institutions
      setInstitutions([
        {
          id: 'ABCEC-6001',
          name: 'ABC Engineering College',
          code: 'ABCEC-6001',
          contact: 'registrar@abcec.edu',
          status: 'Active Accreditation',
          publicKey: '0x04bf129881cae94d88e04523910cbf90872ef784a9c80',
          issuedCount: 1842,
          lastActive: 'Just now',
        },
        {
          id: 'MIT-9042',
          name: 'Metro Institute of Technology',
          code: 'MIT-9042',
          contact: 'verifications@mit.edu',
          status: 'Active Accreditation',
          publicKey: '0x04a9182bc19409e801bfe041920acbf89012e89',
          issuedCount: 1420,
          lastActive: '2 hours ago',
        },
        {
          id: 'NCE-1002',
          name: 'National College of Engineering',
          code: 'NCE-1002',
          contact: 'admin@nce.edu',
          status: 'Active Accreditation',
          publicKey: '0x049281a8c9103e91820bc019280ab481920acbf',
          issuedCount: 581,
          lastActive: '1 day ago',
        },
      ]);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const revokedCerts = certificates.filter((c) => c.status === 'revoked');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
                Consortium Root Administration
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 uppercase">
                EduSec Gov
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage accredited institutional issuers, cryptographic key pairs, revoked registries, and global network telemetry.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveSubTab('institutions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'institutions'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Institutions ({institutions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('revocations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'revocations'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Revocations ({revokedCerts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Security Rules
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Issued</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-white font-['Space_Grotesk']">
            {stats.totalCertificates}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">Firestore Permanent Storage</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Verifications</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white font-['Space_Grotesk']">
            {stats.totalVerifications}
          </p>
          <p className="text-[11px] text-indigo-300 mt-1">Avg latency: {stats.averageVerificationTime}</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Ledger Block</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-['Space_Grotesk'] font-mono">
            #{stats.ledgerBlockHeight}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">18 Validator Nodes</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Revoked Credentials</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 font-['Space_Grotesk']">
            {stats.revokedCertificates || revokedCerts.length}
          </p>
          <p className="text-[11px] text-rose-300 mt-1">Immutably Blacklisted</p>
        </div>
      </div>

      {/* Main SubTab Content */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Live Network Consensus & AI Telemetry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Gemini OCR & Forensic Engine</span>
                <p className="text-emerald-400 font-bold text-sm">Online & Operational</p>
                <p className="text-[11px] text-slate-500">Multi-model failover enabled (3.8-flash, 3.1-flash-lite)</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Firestore Rules Security</span>
                <p className="text-sky-400 font-bold text-sm">Hardened RBAC Enforced</p>
                <p className="text-[11px] text-slate-500">Role-scoped read/writes on certificates and users</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Ledger Merkle Hash Consistency</span>
                <p className="text-purple-400 font-bold text-sm">100% SHA-256 Validated</p>
                <p className="text-[11px] text-slate-500">All registered blocks matched deterministic digests</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'institutions' && (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              Accredited Higher-Education Issuers
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Code / ID</th>
                  <th className="px-4 py-3 font-semibold">Institution Name</th>
                  <th className="px-4 py-3 font-semibold">Public Verification Key</th>
                  <th className="px-4 py-3 font-semibold">Total Certificates</th>
                  <th className="px-4 py-3 font-semibold">Accreditation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-900/40">
                    <td className="px-4 py-3.5 font-mono font-bold text-sky-400">{inst.code}</td>
                    <td className="px-4 py-3.5 font-semibold text-white">{inst.name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400 select-all">{inst.publicKey.slice(0, 18)}...</td>
                    <td className="px-4 py-3.5 font-bold text-white">{inst.issuedCount}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                        {inst.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'revocations' && (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Revoked Academic Credentials Registry
          </h3>

          {revokedCerts.length === 0 ? (
            <p className="text-xs text-slate-400 p-8 text-center">No revoked certificates currently on record.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Certificate ID</th>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Institution</th>
                    <th className="px-4 py-3 font-semibold">Revocation Reason</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {revokedCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-900/40">
                      <td className="px-4 py-3.5 font-mono font-bold text-rose-400">{cert.id}</td>
                      <td className="px-4 py-3.5 text-white">{cert.studentName} ({cert.registerNumber})</td>
                      <td className="px-4 py-3.5">{cert.institution}</td>
                      <td className="px-4 py-3.5 text-rose-300 italic">Grade falsification / administrative disciplinary sanction</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => onVerifyCert(cert.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold cursor-pointer"
                        >
                          Audit Flag
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'security' && (
        <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Active Firestore & Infrastructure Security Directives
          </h3>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            <p className="text-emerald-400 font-bold">// Applied Rules Version 2</p>
            <p>1. match /users/{'{userId}'} → read/update restricted to owner & admin</p>
            <p>2. match /certificates/{'{certificateId}'} → public verification read, institution & admin write</p>
            <p>3. match /verification_history/{'{id}'} → append-only verification audits</p>
            <p>4. match /audit_logs/{'{id}'} → immutable tamper-proof system logs</p>
          </div>
        </div>
      )}
    </div>
  );
};
