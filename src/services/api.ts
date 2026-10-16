import { Certificate, VerificationResult, VerificationHistoryItem, UserSession, UserRole } from '../types';

export class ApiError extends Error {
  status: number;
  errorType?: string;

  constructor(message: string, status: number, errorType?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorType = errorType;
  }
}

export const api = {
  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async uploadCertificate(formData: {
    filename?: string;
    fileSize?: string;
    fileType?: string;
    demoModeTarget?: string;
    customCertId?: string;
    contentBase64?: string;
  }) {
    const res = await fetch('/api/certificates/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.error || 'Upload failed', res.status, err.errorType);
    }
    return res.json();
  },

  async verifyDocument(payload: {
    fileBase64?: string;
    filename?: string;
    fileType?: string;
    fileSize?: string;
    clientDecodedQr?: string | null;
    isDemoMode?: boolean;
    simulatedScenario?: 'genuine' | 'suspicious' | 'invalid' | 'not_registered' | 'legacy_registered' | 'custom';
    certificateId?: string;
    userRole?: string;
  }): Promise<{ success: boolean; result: VerificationResult; error?: string }> {
    const res = await fetch('/api/certificates/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err.error || 'Verification failed', res.status, err.errorType);
    }
    return res.json();
  },

  async verifyCertificate(payload: {
    certificateId?: string;
    simulatedScenario?: string;
    userRole?: string;
    isDemoMode?: boolean;
  }): Promise<{ success: boolean; result: VerificationResult }> {
    const res = await fetch('/api/certificates/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },

  async scanQr(qrPayload: string) {
    const res = await fetch('/api/certificates/scan-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrPayload }),
    });
    if (!res.ok) throw new Error('QR Scan failed');
    return res.json();
  },

  async getCertificate(id: string): Promise<{ success: boolean; certificate: Certificate }> {
    const res = await fetch(`/api/certificates/${id}`);
    if (!res.ok) throw new Error('Certificate not found');
    return res.json();
  },

  async getAllCertificates(): Promise<{ success: boolean; certificates: Certificate[] }> {
    const res = await fetch('/api/certificates');
    if (!res.ok) throw new Error('Failed to fetch certificates');
    return res.json();
  },

  async generateCertificate(certData: {
    studentName: string;
    registerNumber: string;
    institution: string;
    institutionCode?: string;
    course: string;
    degree?: string;
    cgpaOrGrade?: string;
    graduationYear?: number;
  }): Promise<{ success: boolean; certificate: Certificate; message: string }> {
    const res = await fetch('/api/certificates/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certData),
    });
    if (!res.ok) throw new Error('Failed to generate certificate');
    return res.json();
  },

  async revokeCertificate(id: string) {
    const res = await fetch(`/api/certificates/${id}/revoke`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to revoke certificate');
    return res.json();
  },

  async getHistory(params?: { status?: string; search?: string; institution?: string }): Promise<{
    success: boolean;
    total: number;
    items: VerificationHistoryItem[];
  }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.institution) query.set('institution', params.institution);

    const res = await fetch(`/api/verification-history?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async login(role: UserRole, email?: string): Promise<{ success: boolean; session: UserSession }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async runAiAnalysis(certificateId: string, scenario?: string) {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId, scenario }),
    });
    if (!res.ok) throw new Error('AI analysis failed');
    return res.json();
  },

  async verifyBlockchain(certificateId: string) {
    const res = await fetch('/api/blockchain/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certificateId }),
    });
    if (!res.ok) throw new Error('Blockchain verify failed');
    return res.json();
  },
};
