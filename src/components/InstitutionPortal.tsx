import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, QrCode, Search, ShieldAlert, Award, 
  CheckCircle2, RefreshCw, KeyRound, Link2, Eye, Trash2, 
  AlertCircle, ExternalLink, Download 
} from 'lucide-react';
import { Certificate } from '../types';
import { api } from '../services/api';

interface InstitutionPortalProps {
  onVerifyGeneratedCert: (certId: string) => void;
}

export const InstitutionPortal: React.FC<InstitutionPortalProps> = ({
  onVerifyGeneratedCert,
}) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState({
    totalCertificates: 3843,
    verifiedCertificates: 3814,
    revokedCertificates: 29,
    verificationRequests: 1423,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<Certificate | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [certToRevoke, setCertToRevoke] = useState<string | null>(null);

  // Form inputs for new certificate issuance
  const [formData, setFormData] = useState({
    studentName: '',
    registerNumber: '',
    institution: 'ABC Engineering College',
    course: 'B.Tech Artificial Intelligence & Data Science',
    degree: 'Bachelor of Technology',
    cgpaOrGrade: '8.85 (First Class with Distinction)',
    graduationYear: 2026,
  });

  const loadData = async () => {
    try {
      const statsRes = await api.getStats();
      setStats(statsRes);
      const certsRes = await api.getAllCertificates();
      setCertificates(certsRes.certificates);
    } catch (err) {
      console.error('Failed to load institution data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.registerNumber) return;

    setLoading(true);
    try {
      const res = await api.generateCertificate(formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        studentName: '',
        registerNumber: '',
        institution: 'ABC Engineering College',
        course: 'B.Tech Artificial Intelligence & Data Science',
        degree: 'Bachelor of Technology',
        cgpaOrGrade: '8.85 (First Class with Distinction)',
        graduationYear: 2026,
      });
      await loadData();
      setSelectedCertForPreview(res.certificate);
      setNotification({ message: `Certificate ${res.certificate.id} issued and anchored to EduChain ledger!`, type: 'success' });
    } catch (err: any) {
      setNotification({ message: 'Error creating certificate: ' + (err.message || 'Unknown error'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = (id: string) => {
    setCertToRevoke(id);
  };

  const executeRevoke = async () => {
    if (!certToRevoke) return;
    const targetId = certToRevoke;
    try {
      await api.revokeCertificate(targetId);
      await loadData();
      setNotification({ message: `Certificate ${targetId} revoked successfully on the blockchain.`, type: 'success' });
    } catch (err: any) {
      setNotification({ message: 'Revocation error: ' + (err.message || 'Unknown error'), type: 'error' });
    } finally {
      setCertToRevoke(null);
    }
  };

  const filteredCerts = certificates.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Institution Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                ABC Engineering College
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 uppercase">
                Accredited Registrar
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Institution Portal • Office of Registrar & Examinations • Node ID: #ABCEC-NODE-01
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Issue New Academic Certificate
        </button>
      </div>

      {/* In-app Notification Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-xs font-semibold backdrop-blur-md animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30'
              : 'bg-rose-950/30 text-rose-300 border-rose-500/40 shadow-rose-950/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white ml-3 p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Certificates
          </span>
          <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">
            {stats.totalCertificates}
          </span>
          <span className="text-[11px] text-sky-400 block mt-1">Issued & Hashed</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Verified Authentic
          </span>
          <span className="text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
            {stats.verifiedCertificates}
          </span>
          <span className="text-[11px] text-emerald-300 block mt-1">99.2% Healthy Status</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Revoked Certificates
          </span>
          <span className="text-3xl font-extrabold text-rose-400 font-['Space_Grotesk']">
            {stats.revokedCertificates}
          </span>
          <span className="text-[11px] text-rose-300 block mt-1">Flagged on Ledger</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090e1a]/95 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Verification Requests
          </span>
          <span className="text-3xl font-extrabold text-indigo-400 font-['Space_Grotesk']">
            {stats.verificationRequests}
          </span>
          <span className="text-[11px] text-indigo-300 block mt-1">By Employers & Univs</span>
        </div>
      </div>

      {/* Issued Certificates Table & Search */}
      <div className="rounded-3xl border border-slate-800 bg-[#090e1a]/95 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Issued Academic Certificates
            </h3>
            <p className="text-xs text-slate-400">
              Live records anchored with digital signatures and EduChain blockchain blocks
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, ID, or course..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
            />
          </div>
        </div>

        {/* Certificates Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Certificate ID</th>
                <th className="pb-3 px-3">Student Name</th>
                <th className="pb-3 px-3">Register No</th>
                <th className="pb-3 px-3">Course / Degree</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-sky-300">
                    {cert.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {cert.studentName}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {cert.registerNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-300 truncate max-w-xs">
                    {cert.course} ({cert.graduationYear})
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        cert.status === 'active'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {cert.status === 'active' ? 'Active ✅' : 'Revoked ❌'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedCertForPreview(cert)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-medium cursor-pointer"
                    >
                      View QR / Details
                    </button>
                    <button
                      onClick={() => onVerifyGeneratedCert(cert.id)}
                      className="px-2.5 py-1 rounded-lg bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-500/20 text-xs font-medium cursor-pointer"
                    >
                      Run Verification
                    </button>
                    {cert.status === 'active' && (
                      <button
                        onClick={() => handleRevoke(cert.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/20 text-xs font-medium cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue New Certificate */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-[#090e1a] text-white p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Space_Grotesk']">
                    Issue Academic Certificate
                  </h3>
                  <p className="text-xs text-slate-400">
                    Instantly hashes, digitally signs, and writes to EduChain blockchain
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCertificate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Rahul Sundaram"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Register / Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.registerNumber}
                    onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                    placeholder="e.g. 22AI105"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issuing Institution</label>
                <input
                  type="text"
                  readOnly
                  value={formData.institution}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-400 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course / Specialization</label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. B.Tech Information Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CGPA / Grade</label>
                  <input
                    type="text"
                    value={formData.cgpaOrGrade}
                    onChange={(e) => setFormData({ ...formData, cgpaOrGrade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-sky-400 outline-hidden"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-200 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Issuance automatically binds a 2048-bit digital signature and commits hash to EduChain Block.</span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold cursor-pointer flex items-center gap-2 shadow-md shadow-sky-950/50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate & Anchor to Blockchain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Certificate QR and Security Footprint */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#090e1a] text-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold font-['Space_Grotesk']">
                Certificate Credentials: {selectedCertForPreview.id}
              </h3>
              <button
                onClick={() => setSelectedCertForPreview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              {selectedCertForPreview.qrCodeUrl && (
                <div className="flex flex-col items-center">
                  <img
                    src={selectedCertForPreview.qrCodeUrl}
                    alt="Certificate QR"
                    className="w-32 h-32 rounded-xl bg-white p-2 border border-slate-700 shadow-md"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">Dynamic QR</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400">Student:</span>{' '}
                  <strong className="text-white">{selectedCertForPreview.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Reg No:</span>{' '}
                  <span className="font-mono text-sky-300">{selectedCertForPreview.registerNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400">Course:</span>{' '}
                  <span className="text-slate-200">{selectedCertForPreview.course}</span>
                </div>
                <div>
                  <span className="text-slate-400">Graduation Year:</span>{' '}
                  <span className="text-slate-200">{selectedCertForPreview.graduationYear}</span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>{' '}
                  <span className="font-bold text-emerald-400 uppercase">{selectedCertForPreview.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] truncate">
                <span className="text-slate-500 block text-[10px]">Blockchain Hash:</span>
                <span className="text-sky-400">{selectedCertForPreview.blockchainHash}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] truncate">
                <span className="text-slate-500 block text-[10px]">Digital Signature:</span>
                <span className="text-indigo-400">{selectedCertForPreview.digitalSignature}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCertForPreview(null);
                  onVerifyGeneratedCert(selectedCertForPreview.id);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs cursor-pointer text-center shadow-md shadow-sky-950/50"
              >
                Validate Authenticity Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {certToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#090e1a] border border-rose-500/30 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Confirm Immutable Revocation
                </h3>
                <p className="text-xs text-slate-400">
                  Target Certificate: <span className="font-mono text-rose-300 font-semibold">{certToRevoke}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to formally <strong className="text-rose-400">REVOKE</strong> this certificate on the EduChain consortium ledger? This state change will be signed by your node and is permanently recorded on-chain.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCertToRevoke(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeRevoke}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/50 cursor-pointer transition-colors"
              >
                Confirm Blockchain Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
