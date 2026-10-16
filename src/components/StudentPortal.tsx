import React, { useState, useEffect } from 'react';
import { 
  Award, QrCode, Download, Share2, ExternalLink, ShieldCheck, 
  CheckCircle2, Copy, FileText, Calendar, Building2, BookOpen, 
  Hash, Lock, Sparkles, Check, AlertTriangle
} from 'lucide-react';
import { Certificate } from '../types';
import { api } from '../services/api';
import { CertificateParchment } from './CertificateParchment';

interface StudentPortalProps {
  onVerifyCert: (certId: string) => void;
  onOpenReport?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  onVerifyCert,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'my_credentials' | 'preview'>('my_credentials');

  const [studentInfo] = useState({
    name: 'Kaviya Priya',
    registerNumber: '22IT101',
    email: 'kaviyapriya.it@gmail.com',
    institution: 'ABC Engineering College',
    department: 'Information Technology',
  });

  const loadStudentCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.getAllCertificates();
      if (res.certificates && res.certificates.length > 0) {
        // Filter or display student's certificates
        const studentCerts = res.certificates.filter(
          (c) =>
            c.registerNumber?.toLowerCase() === studentInfo.registerNumber.toLowerCase() ||
            c.studentName?.toLowerCase().includes('kaviya')
        );
        // If not found, show all as available or the sample
        const list = studentCerts.length > 0 ? studentCerts : res.certificates;
        setCertificates(list);
        setSelectedCert(list[0]);
      }
    } catch (err) {
      console.error('Failed to load student certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentCertificates();
  }, []);

  const handleCopyShareLink = (certId: string) => {
    const url = `${window.location.origin}/#verify?id=${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900 border border-sky-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-950/60">
            <div className="w-full h-full bg-[#020617] rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-['Space_Grotesk']">
                {studentInfo.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified Student Identity
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
              <span>Reg No: <strong className="text-white font-mono">{studentInfo.registerNumber}</strong></span>
              <span>•</span>
              <span>{studentInfo.institution}</span>
              <span>•</span>
              <span>{studentInfo.department}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('my_credentials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my_credentials'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            My Digital Credentials ({certificates.length})
          </button>
          {selectedCert && (
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Parchment View
            </button>
          )}
        </div>
      </div>

      {activeTab === 'preview' && selectedCert ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveTab('my_credentials')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              ← Back to Credentials List
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyShareLink(selectedCert.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLink ? 'Link Copied!' : 'Share Public Verify Link'}
              </button>
              <button
                onClick={() => onVerifyCert(selectedCert.id)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Consensus Audit
              </button>
            </div>
          </div>
          <CertificateParchment cert={selectedCert} />
        </div>
      ) : (
        /* Credentials Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Certificates List (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Issued Degree & Transcripts
              </h3>
              <span className="text-xs text-slate-400">
                Anchored to EduChain & Registrar PKI
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center rounded-3xl bg-[#090e1a] border border-slate-800 text-slate-400 text-xs animate-pulse">
                Loading encrypted student credentials...
              </div>
            ) : certificates.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#090e1a] border border-slate-800 text-slate-400 text-xs">
                No certificates currently found under this registration number.
              </div>
            ) : (
              certificates.map((cert) => (
                <div
                  key={cert.id}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                    selectedCert?.id === cert.id
                      ? 'bg-[#0b1329] border-sky-500/50 shadow-xl shadow-sky-950/30 ring-1 ring-sky-500/30'
                      : 'bg-[#090e1a]/95 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-950/60 text-sky-300 border border-sky-500/30 font-mono">
                          {cert.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cert.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                        }`}>
                          {cert.status === 'active' ? 'Active & Verified' : 'Revoked'}
                        </span>
                        <span className="text-xs text-slate-400">Class of {cert.graduationYear}</span>
                      </div>

                      <h4 className="text-lg font-bold text-white font-['Space_Grotesk']">
                        {cert.course}
                      </h4>
                      <p className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {cert.institution}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                        <span>CGPA: <strong className="text-emerald-400">{cert.cgpaOrGrade}</strong></span>
                        <span>•</span>
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCert(cert);
                          setActiveTab('preview');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Parchment
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onVerifyCert(cert.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                        Run Audit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Certificate Deep Inspector Sidebar */}
          {selectedCert && (
            <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-sky-400" />
                  Official Verification QR & Proof
                </h3>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center text-center shadow-inner">
                {selectedCert.qrCodeUrl ? (
                  <img
                    src={selectedCert.qrCodeUrl}
                    alt="Certificate QR Verification"
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-slate-800 text-xs font-mono">
                    Generating QR...
                  </div>
                )}
                <p className="text-[10px] text-slate-700 font-mono mt-2 font-bold">
                  {selectedCert.id}
                </p>
                <p className="text-[9px] text-slate-500">
                  Scan to verify on TrustLink Ledger
                </p>
              </div>

              {/* Cryptographic Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    SHA-256 Digest
                  </span>
                  <div className="font-mono text-[11px] text-sky-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all select-all mt-1">
                    {selectedCert.blockchainHash}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Digital Signature (ECDSA)
                  </span>
                  <div className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 break-all select-all mt-1">
                    {selectedCert.digitalSignature}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Block Height
                  </span>
                  <p className="text-white font-mono font-bold mt-0.5">
                    EduChain #{selectedCert.blockNumber}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleCopyShareLink(selectedCert.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Copied to Clipboard!' : 'Copy Verification URL'}
                </button>

                <button
                  onClick={() => onVerifyCert(selectedCert.id)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-950/50 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify on Consensus Engine
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
