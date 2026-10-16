import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { VerifySection, VerificationRequestOptions } from './components/VerifySection';
import { ResultDashboard } from './components/ResultDashboard';
import { AiAnalysisView } from './components/AiAnalysisView';
import { BlockchainView } from './components/BlockchainView';
import { InstitutionPortal } from './components/InstitutionPortal';
import { EmployerPortal } from './components/EmployerPortal';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { VerificationHistoryView } from './components/VerificationHistoryView';
import { SecurityPrivacyView } from './components/SecurityPrivacyView';
import { VerificationReportModal } from './components/VerificationReportModal';
import { VerificationPipelineModal } from './components/VerificationPipelineModal';
import { QrScannerModal } from './components/QrScannerModal';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { VerificationResult, VerificationHistoryItem, UserRole } from './types';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modals
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Active Verification State
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Async server state during pipeline
  const [isServerReady, setIsServerReady] = useState(true);
  const [serverResultHolder, setServerResultHolder] = useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Load initial history & stats
  const fetchHistory = async () => {
    try {
      const res = await api.getHistory();
      setHistory(res.items);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Preset quick triggers
  const handleSelectPreset = (scenario: 'genuine' | 'suspicious' | 'invalid') => {
    startVerificationPipeline({
      isDemoMode: true,
      demoScenario: scenario,
    });
  };

  // Start the 8-step verification pipeline with async server analysis
  const startVerificationPipeline = async (options: VerificationRequestOptions) => {
    setVerificationError(null);
    setServerResultHolder(null);
    setIsServerReady(false);
    setIsPipelineModalOpen(true);

    try {
      const res = await api.verifyDocument({
        fileBase64: options.fileBase64,
        filename: options.filename,
        fileType: options.fileType,
        fileSize: options.fileSize,
        clientDecodedQr: options.clientDecodedQr,
        certificateId: options.customId,
        isDemoMode: options.isDemoMode,
        simulatedScenario: options.demoScenario,
        userRole: userRole.toUpperCase(),
      });

      if (res.success && res.result) {
        setServerResultHolder(res.result);
        setIsServerReady(true);
      } else {
        throw new Error(res.error || 'Verification analysis failed.');
      }
    } catch (err: any) {
      console.error('Document verification error:', err);
      let msg = err.message || 'Failed to complete document analysis';
      if (
        err.status === 429 ||
        err.errorType === 'GEMINI_QUOTA_EXCEEDED' ||
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED')
      ) {
        msg = 'AI analysis is temporarily unavailable because the Gemini API quota has been reached. Please try again later.';
      } else if (
        err.status === 503 ||
        err.errorType === 'AI_TEMPORARILY_UNAVAILABLE' ||
        msg.includes('503') ||
        msg.includes('temporarily unavailable') ||
        msg.includes('high demand')
      ) {
        msg = 'AI analysis is temporarily unavailable. Please try again later.';
      } else if (err.status === 401 || err.errorType === 'INVALID_API_KEY') {
        msg = 'Gemini API key is invalid or not configured. Please check your settings.';
      } else if (err.status === 413 || err.errorType === 'FILE_TOO_LARGE') {
        msg = 'File size exceeds the 10 MB limit. Please upload a smaller certificate document.';
      } else if (err.status === 400 && err.errorType === 'UNSUPPORTED_FILE_TYPE') {
        msg = 'Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG certificate.';
      }
      setVerificationError(msg);
      setIsPipelineModalOpen(false);
      setIsServerReady(true);
      showToast(msg, 'error');
    }
  };

  // Called when the 8-step animation finishes
  const handlePipelineCompleted = async () => {
    setIsPipelineModalOpen(false);

    if (serverResultHolder) {
      setCurrentResult(serverResultHolder);
      setActiveTab('result');
      await fetchHistory();

      const status = serverResultHolder.overallStatus;
      if (status === 'VERIFIED') {
        showToast('Certificate verified authentic on EduChain ledger! (99.2% Genuine)', 'success');
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#22d3ee', '#3b82f6', '#10b981', '#6366f1'],
          });
        } catch (e) {
          // Ignore if canvas unavailable
        }
      } else if (status === 'SUSPICIOUS') {
        showToast('Warning: Certificate flagged with suspicious formatting anomalies.', 'warning');
      } else if (status === 'TAMPERED') {
        showToast('Alert: Document shows visual or digital tampering.', 'warning');
      } else if (status === 'REVOKED') {
        showToast('Alert: Certificate has been revoked by the issuing institution.', 'error');
      } else if (status === 'NOT VERIFIED') {
        showToast('Notice: Certificate record not found in institutional ledger.', 'info');
      } else {
        showToast('Alert: Certificate is invalid or revoked. Hash mismatch.', 'error');
      }
    }
  };

  const handleQrScanComplete = (scannedCertId: string) => {
    setIsQrScannerOpen(false);
    showToast(`QR Code decoded: ${scannedCertId}`, 'info');
    startVerificationPipeline({
      isDemoMode: false,
      customId: scannedCertId,
      clientDecodedQr: scannedCertId,
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-sky-500/20 selection:text-sky-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-slate-900/95 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 text-amber-300 border-amber-500/40 shadow-amber-950/40'
                : toast.type === 'error'
                ? 'bg-slate-900/95 text-rose-300 border-rose-500/40 shadow-rose-950/40'
                : 'bg-slate-900/95 text-sky-300 border-sky-500/40 shadow-sky-950/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer ml-2 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingHero
            onStartVerification={() => setActiveTab('verify')}
            onExploreAi={() => setActiveTab('ai')}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {activeTab === 'verify' && (
          <VerifySection
            onStartVerification={startVerificationPipeline}
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
            errorMessage={verificationError}
            onClearError={() => setVerificationError(null)}
          />
        )}

        {activeTab === 'result' && currentResult && (
          <ResultDashboard
            result={currentResult}
            onReset={() => setActiveTab('verify')}
            onOpenReport={() => setIsReportModalOpen(true)}
            onOpenAiForensics={() => setActiveTab('ai')}
            onOpenBlockchain={() => setActiveTab('blockchain')}
          />
        )}

        {activeTab === 'ai' && (
          <AiAnalysisView
            metrics={
              currentResult?.aiMetrics || {
                genuinenessScore: 99.2,
                documentStructure: 'Authentic',
                fontConsistency: 'Passed',
                sealLogoAnalysis: 'Passed',
                textTampering: 'Not Detected',
                imageManipulation: 'Not Detected',
                metadataAnalysis: 'Authentic',
                layoutAnalysisScore: 99.4,
                textConsistencyScore: 99.8,
                fontAnalysisScore: 98.9,
                logoSealScore: 99.1,
                manipulationDetectionScore: 99.7,
                metadataScore: 99.0,
                summary:
                  'The uploaded certificate shows no significant signs of digital manipulation based on the available analysis. All vector anchors, security guilloche patterns, and institutional micro-seals match original vector templates.',
                detectedAnomalies: [],
              }
            }
            studentName={currentResult?.studentName || 'Kaviya Priya'}
            certificateId={currentResult?.certificateId || 'CERT-2026-IT-101'}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainView
            blockchainInfo={
              currentResult?.blockchainInfo || {
                status: 'HASH MATCHED ✅',
                network: 'EduChain Consortium Ledger (Mainnet L2)',
                contractAddress: '0x71C9F59436270E45e75B1d0Fe7c71dD8E7b53a0C',
                blockNumber: 4892104,
                transactionId:
                  '0x8f3c71b96a92e10a5611cf098192db87d3a014e7cf4120bf485a39cb2e77b102',
                certificateHash:
                  '0x9c41a209bca710e289f81a17cb0912ef84a10c81290bbce89104fa28910bf1a2',
                calculatedHash:
                  '0x9c41a209bca710e289f81a17cb0912ef84a10c81290bbce89104fa28910bf1a2',
                timestamp: '2026-05-20 14:32:10 UTC',
                validatorNodes: 18,
                merkleRoot: '0x9ef01a8843918002cf9810a9b83a0091ff78201a098cb',
                timeline: [
                  {
                    step: 'Certificate Created',
                    description: 'Issued by ABC Engineering College Registrar',
                    timestamp: '2026-05-20 14:30:00 UTC',
                    completed: true,
                  },
                  {
                    step: 'Hash Generated',
                    description: 'SHA-256 Digest calculated from diploma metadata',
                    timestamp: '2026-05-20 14:31:02 UTC',
                    completed: true,
                  },
                  {
                    step: 'Hash Stored',
                    description: 'Committed to Block #4892104 with 18 validator sign-offs',
                    timestamp: '2026-05-20 14:32:10 UTC',
                    completed: true,
                  },
                  {
                    step: 'Certificate Verified',
                    description: 'Verified on TrustLink network. Hash matches on-chain record',
                    timestamp: '2026-09-04 08:23:00 UTC',
                    completed: true,
                  },
                ],
              }
            }
            certificateId={currentResult?.certificateId || 'CERT-2026-IT-101'}
            studentName={currentResult?.studentName || 'Kaviya Priya'}
          />
        )}

        {activeTab === 'student' && (
          <StudentPortal
            onVerifyCert={(certId) =>
              startVerificationPipeline({ isDemoMode: false, customId: certId })
            }
          />
        )}

        {activeTab === 'institution' && (
          <InstitutionPortal
            onVerifyGeneratedCert={(certId) =>
              startVerificationPipeline({ isDemoMode: false, customId: certId })
            }
          />
        )}

        {activeTab === 'employer' && (
          <EmployerPortal
            onVerifyId={(certId) =>
              startVerificationPipeline({ isDemoMode: false, customId: certId })
            }
            onOpenScanner={() => setIsQrScannerOpen(true)}
            onOpenReport={() => {
              if (currentResult) setIsReportModalOpen(true);
              else handleSelectPreset('genuine');
            }}
            history={history}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            onVerifyCert={(certId) =>
              startVerificationPipeline({ isDemoMode: false, customId: certId })
            }
          />
        )}

        {activeTab === 'history' && (
          <VerificationHistoryView
            history={history}
            onSelectVerification={(certId) =>
              startVerificationPipeline({ isDemoMode: false, customId: certId })
            }
            onOpenReport={() => {
              if (currentResult) setIsReportModalOpen(true);
              else handleSelectPreset('genuine');
            }}
          />
        )}

        {activeTab === 'security' && <SecurityPrivacyView />}
      </main>

      {/* Footer */}
      <Footer onNav={(tab) => setActiveTab(tab)} />

      {/* 8-Step Verification Pipeline Animation Modal */}
      <VerificationPipelineModal
        isOpen={isPipelineModalOpen}
        onComplete={handlePipelineCompleted}
        isServerReady={isServerReady}
      />

      {/* QR Code Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanComplete={handleQrScanComplete}
      />

      {/* Printable & Downloadable Official Audit Report Modal */}
      {currentResult && (
        <VerificationReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          result={currentResult}
        />
      )}
    </div>
  );
}
