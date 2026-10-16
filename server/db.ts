import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import crypto from 'crypto';
import QRCode from 'qrcode';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase for backend
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

export interface CertificateRecord {
  id: string;
  certificateId: string;
  studentName: string;
  registerNumber: string;
  studentEmail?: string;
  institution: string;
  institutionCode: string;
  course: string;
  degree: string;
  department?: string;
  eventName?: string;
  cgpaOrGrade: string;
  graduationYear: number;
  issueDate: string;
  certificateType: string;
  source?: 'TRUSTLINK_NATIVE' | 'LEGACY_REGISTERED' | 'EXTERNAL_UNREGISTERED';
  status: 'active' | 'revoked';
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  digitalSignature: string;
  issuerPublicKey: string;
  qrCodeUrl?: string;
  documentUrl?: string;
  issuedBy?: string;
  registeredBy?: string;
  registrationNotes?: string;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationLogRecord {
  verificationId: string;
  certificateId: string;
  studentName: string;
  institution: string;
  course: string;
  certificateType?: string;
  eventName?: string;
  date: string;
  timestamp: string;
  status: 'VERIFIED' | 'REVOKED' | 'INVALID' | 'SUSPICIOUS' | 'NOT_REGISTERED' | 'UNVERIFIABLE' | 'NEEDS_MANUAL_REVIEW' | 'NOT VERIFIED';
  overallStatus: 'VERIFIED' | 'REVOKED' | 'INVALID' | 'SUSPICIOUS' | 'NOT_REGISTERED' | 'UNVERIFIABLE' | 'NEEDS_MANUAL_REVIEW' | 'NOT VERIFIED';
  verificationLevel?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIABLE';
  genuinenessScore: number;
  verifiedByRole: string;
  verifierEmail?: string;
  verificationMethod?: string;
  evidenceAvailable?: string[];
  evidenceMissing?: string[];
  qrStatus?: string;
  digitalSignatureStatus?: string;
  hashStatus?: string;
  aiSummary?: string;
}

export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  website: string;
  issuerPublicKey: string;
  verified: boolean;
  createdAt: string;
}

// Compute deterministic SHA-256 hash
export function computeCertHash(cert: {
  id: string;
  studentName: string;
  registerNumber: string;
  institution: string;
  course: string;
  graduationYear: number | string;
}): string {
  const norm = (s: string | number | undefined) => String(s || '').trim().toLowerCase();
  const payload = `${norm(cert.id)}|${norm(cert.studentName)}|${norm(cert.registerNumber)}|${norm(cert.institution)}|${norm(cert.course)}|${norm(cert.graduationYear)}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// Generate digital signature
export function generateDigitalSignature(payload: string, privateKeySecret: string = 'trustlink-root-authority-key-2026'): string {
  return '0x' + crypto.createHmac('sha256', privateKeySecret).update(payload).digest('hex');
}

// Helper to seed initial sample records if collection is completely fresh
export async function seedInitialFirestoreData() {
  try {
    const certsCol = collection(db, 'certificates');
    const existingSnap = await getDocs(query(certsCol, limit(1)));
    if (!existingSnap.empty) {
      console.log('Firestore already contains certificate records. Skipping seeding.');
      return;
    }

    console.log('Seeding initial institutional certificates into Firestore...');

    const sampleCerts: Partial<CertificateRecord>[] = [
      {
        id: 'CERT-2026-IT-101',
        certificateId: 'CERT-2026-IT-101',
        studentName: 'Kaviya Priya',
        registerNumber: '22IT101',
        studentEmail: 'kaviyapriya.it@gmail.com',
        institution: 'ABC Engineering College',
        institutionCode: 'ABCEC-6001',
        course: 'B.Tech Information Technology',
        degree: 'Bachelor of Technology',
        department: 'Information Technology',
        cgpaOrGrade: '8.94 (First Class with Distinction)',
        graduationYear: 2026,
        issueDate: '2026-05-20',
        certificateType: 'Degree Certificate',
        status: 'active',
        blockNumber: 4892104,
        transactionId: '0x8f3c71b96a92e10a5611cf098192db87d3a014e7cf4120bf485a39cb2e77b102',
        issuerPublicKey: '0x04bf129881cae94d88e04523910cbf90872ef784a9c80',
        createdAt: new Date('2026-05-20T14:30:00Z').toISOString(),
        updatedAt: new Date('2026-05-20T14:30:00Z').toISOString(),
      },
      {
        id: 'CERT-2025-CS-409',
        certificateId: 'CERT-2025-CS-409',
        studentName: 'Arjun Verma',
        registerNumber: '21CS409',
        studentEmail: 'arjun.verma21@mit.edu',
        institution: 'Metro Institute of Technology',
        institutionCode: 'MIT-9042',
        course: 'M.Tech Computer Science',
        degree: 'Master of Technology',
        department: 'Computer Science and Engineering',
        cgpaOrGrade: '8.20 (First Class)',
        graduationYear: 2025,
        issueDate: '2025-06-15',
        certificateType: 'Postgraduate Degree',
        status: 'active',
        blockNumber: 4421098,
        transactionId: '0x3b1189ac014fe89230571d791b5894ca1320efb07894318c502bfa780194bc32',
        issuerPublicKey: '0x04a9182bc19409e801bfe041920acbf89012e89',
        createdAt: new Date('2025-06-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2025-06-15T10:00:00Z').toISOString(),
      },
      {
        id: 'CERT-2024-ME-999',
        certificateId: 'CERT-2024-ME-999',
        studentName: 'Vikram R.',
        registerNumber: '20ME999',
        studentEmail: 'vikram.r20@nce.edu',
        institution: 'National College of Engineering',
        institutionCode: 'NCE-1002',
        course: 'B.E. Mechanical Engineering',
        degree: 'Bachelor of Engineering',
        department: 'Mechanical Engineering',
        cgpaOrGrade: '6.80',
        graduationYear: 2024,
        issueDate: '2024-04-10',
        certificateType: 'Degree Certificate',
        status: 'revoked',
        blockNumber: 3982145,
        transactionId: '0x1928301829384710293847102938471029384710293847102938471029384710',
        issuerPublicKey: '0x00000000000000000000000000000000000000',
        revokedAt: new Date('2025-01-15T09:00:00Z').toISOString(),
        revokedBy: 'Registrar, National College of Engineering',
        revocationReason: 'Academic misconduct disciplinary action - grade falsification attempt',
        createdAt: new Date('2024-04-10T11:00:00Z').toISOString(),
        updatedAt: new Date('2025-01-15T09:00:00Z').toISOString(),
      }
    ];

    for (const item of sampleCerts) {
      const hash = computeCertHash({
        id: item.id!,
        studentName: item.studentName!,
        registerNumber: item.registerNumber!,
        institution: item.institution!,
        course: item.course!,
        graduationYear: item.graduationYear!,
      });
      const blockchainHash = '0x' + hash;
      const digitalSignature = generateDigitalSignature(blockchainHash);

      const qrPayload = JSON.stringify({
        trustlink: true,
        certificateId: item.id,
        studentName: item.studentName,
        registerNumber: item.registerNumber,
        institution: item.institution,
        hash: blockchainHash,
        verifyUrl: `https://trustlink.edu/verify/${item.id}`,
      });

      const qrCodeUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
        color: { dark: '#0369a1', light: '#ffffff' },
      });

      const fullRecord: CertificateRecord = {
        ...(item as any),
        blockchainHash,
        digitalSignature,
        qrCodeUrl,
      };

      await setDoc(doc(db, 'certificates', item.id!), fullRecord);
    }

    // Seed initial institutions
    const institutions: InstitutionRecord[] = [
      {
        id: 'ABCEC-6001',
        name: 'ABC Engineering College',
        code: 'ABCEC-6001',
        contactEmail: 'registrar@abcec.edu',
        website: 'https://abcec.edu',
        issuerPublicKey: '0x04bf129881cae94d88e04523910cbf90872ef784a9c80',
        verified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'MIT-9042',
        name: 'Metro Institute of Technology',
        code: 'MIT-9042',
        contactEmail: 'verifications@mit.edu',
        website: 'https://mit.edu',
        issuerPublicKey: '0x04a9182bc19409e801bfe041920acbf89012e89',
        verified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'NCE-1002',
        name: 'National College of Engineering',
        code: 'NCE-1002',
        contactEmail: 'admin@nce.edu',
        website: 'https://nce.edu',
        issuerPublicKey: '0x049281a8c9103e91820bc019280ab481920acbf',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const inst of institutions) {
      await setDoc(doc(db, 'institutions', inst.id), inst);
    }

    // Seed initial verification history
    const initialHistory: VerificationLogRecord[] = [
      {
        verificationId: 'VFY-2026-99210',
        certificateId: 'CERT-2026-IT-101',
        studentName: 'Kaviya Priya',
        institution: 'ABC Engineering College',
        course: 'B.Tech Information Technology',
        date: '2026-09-04 08:23 UTC',
        timestamp: new Date().toISOString(),
        status: 'VERIFIED',
        overallStatus: 'VERIFIED',
        genuinenessScore: 99.2,
        verifiedByRole: 'Employer (TechCorp Inc.)',
        verificationMethod: 'QR & Digital Seal Verification',
        qrStatus: 'VALID ✅',
        digitalSignatureStatus: 'VALID ✅',
        hashStatus: 'HASH MATCHED ✅',
        aiSummary: 'All security guilloche patterns, fonts, and institutional registry hashes match.',
      },
      {
        verificationId: 'VFY-2026-99184',
        certificateId: 'CERT-2025-CS-409',
        studentName: 'Arjun Verma (Tampered copy)',
        institution: 'Metro Institute of Technology',
        course: 'M.Tech Computer Science',
        date: '2026-09-03 16:40 UTC',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUSPICIOUS',
        overallStatus: 'SUSPICIOUS',
        genuinenessScore: 68.4,
        verifiedByRole: 'University Admissions',
        verificationMethod: 'AI Document Forensic Scan',
        qrStatus: 'VALID ✅',
        digitalSignatureStatus: 'VALID ✅',
        hashStatus: 'HASH MATCHED ✅',
        aiSummary: 'Detected minor font baseline misalignment in CGPA field.',
      },
      {
        verificationId: 'VFY-2026-98912',
        certificateId: 'CERT-2024-ME-999',
        studentName: 'Vikram R.',
        institution: 'National College of Engineering',
        course: 'B.E. Mechanical Engineering',
        date: '2026-09-02 11:15 UTC',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'REVOKED',
        overallStatus: 'REVOKED',
        genuinenessScore: 0.0,
        verifiedByRole: 'Authorized Organization',
        verificationMethod: 'Institutional Registry Check',
        qrStatus: 'VALID ✅',
        digitalSignatureStatus: 'REVOKED ❌',
        hashStatus: 'REVOKED IN LEDGER ❌',
        aiSummary: 'Certificate was officially revoked due to disciplinary action.',
      },
    ];

    for (const h of initialHistory) {
      await setDoc(doc(db, 'verification_history', h.verificationId), h);
    }

    console.log('Seeding initial Firestore database completed successfully!');
  } catch (err) {
    console.error('Error during initial Firestore seeding:', err);
  }
}

// Database Operations

export async function getCertificateById(id: string): Promise<CertificateRecord | null> {
  if (!id) return null;
  const cleanId = id.trim();
  const certRef = doc(db, 'certificates', cleanId);
  const snap = await getDoc(certRef);
  if (snap.exists()) {
    return snap.data() as CertificateRecord;
  }

  // Also query case-insensitively or by certificateId field if not found by doc id
  const certsCol = collection(db, 'certificates');
  const q = query(certsCol, where('certificateId', '==', cleanId));
  const querySnap = await getDocs(q);
  if (!querySnap.empty) {
    return querySnap.docs[0].data() as CertificateRecord;
  }
  return null;
}

export async function findCertificateByDetails(details: {
  studentName?: string;
  registerNumber?: string;
  institution?: string;
  course?: string;
}): Promise<CertificateRecord | null> {
  const certsCol = collection(db, 'certificates');
  const snap = await getDocs(certsCol);

  const norm = (str?: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const targetReg = norm(details.registerNumber);
  const targetName = norm(details.studentName);

  for (const docSnap of snap.docs) {
    const cert = docSnap.data() as CertificateRecord;
    const certReg = norm(cert.registerNumber);
    const certName = norm(cert.studentName);

    if (targetReg && certReg && targetReg === certReg) {
      return cert;
    }
    if (targetName && certName && (certName.includes(targetName) || targetName.includes(certName))) {
      return cert;
    }
  }
  return null;
}

export async function getAllCertificates(): Promise<CertificateRecord[]> {
  const certsCol = collection(db, 'certificates');
  const snap = await getDocs(certsCol);
  return snap.docs.map((d) => d.data() as CertificateRecord);
}

export async function createCertificateInDb(certData: {
  certificateId?: string;
  studentName: string;
  registerNumber: string;
  studentEmail?: string;
  institution: string;
  institutionCode?: string;
  course: string;
  degree?: string;
  department?: string;
  eventName?: string;
  cgpaOrGrade?: string;
  graduationYear?: number;
  issueDate?: string;
  certificateType?: string;
  source?: 'TRUSTLINK_NATIVE' | 'LEGACY_REGISTERED' | 'EXTERNAL_UNREGISTERED';
  issuedBy?: string;
  documentUrl?: string;
}): Promise<CertificateRecord> {
  const id = certData.certificateId || `TL-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const graduationYear = certData.graduationYear || new Date().getFullYear();
  const issueDate = certData.issueDate || new Date().toISOString().split('T')[0];
  const institutionCode = certData.institutionCode || 'INST-' + Math.floor(1000 + Math.random() * 9000);
  const degree = certData.degree || 'Bachelor Degree';
  const cgpaOrGrade = certData.cgpaOrGrade || '8.50';
  const certificateType = certData.certificateType || 'Degree Certificate';
  const source = certData.source || 'TRUSTLINK_NATIVE';

  const hash = computeCertHash({
    id,
    studentName: certData.studentName,
    registerNumber: certData.registerNumber,
    institution: certData.institution,
    course: certData.course,
    graduationYear,
  });

  const blockchainHash = '0x' + hash;
  const digitalSignature = generateDigitalSignature(blockchainHash);
  const blockNumber = Math.floor(4800000 + Math.random() * 200000);
  const transactionId = '0x' + crypto.randomBytes(32).toString('hex');
  const issuerPublicKey = '0x' + crypto.randomBytes(24).toString('hex');

  const qrPayload = JSON.stringify({
    trustlink: true,
    certificateId: id,
    studentName: certData.studentName,
    registerNumber: certData.registerNumber,
    institution: certData.institution,
    hash: blockchainHash,
    verifyUrl: `https://trustlink.edu/verify/${id}`,
  });

  const qrCodeUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
    color: { dark: '#0369a1', light: '#ffffff' },
  });

  const record: CertificateRecord = {
    id,
    certificateId: id,
    studentName: certData.studentName,
    registerNumber: certData.registerNumber,
    studentEmail: certData.studentEmail || '',
    institution: certData.institution,
    institutionCode,
    course: certData.course,
    degree,
    department: certData.department || '',
    eventName: certData.eventName || '',
    cgpaOrGrade,
    graduationYear,
    issueDate,
    certificateType,
    source,
    status: 'active',
    blockchainHash,
    transactionId,
    blockNumber,
    digitalSignature,
    issuerPublicKey,
    qrCodeUrl,
    documentUrl: certData.documentUrl || '',
    issuedBy: certData.issuedBy || 'Institutional Registrar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'certificates', id), record);

  // Log audit
  await logAuditTrail({
    action: 'ISSUE_CERTIFICATE',
    entityType: 'certificate',
    entityId: id,
    actorRole: 'institution',
    actorEmail: certData.issuedBy || 'registrar@institution.edu',
    details: `Issued ${certificateType} (${source}) for ${certData.studentName} (${certData.registerNumber})`,
  });

  return record;
}

export async function registerLegacyCertificateInDb(legacyData: {
  studentName: string;
  registerNumber?: string;
  institution: string;
  institutionCode?: string;
  course?: string;
  degree?: string;
  department?: string;
  eventName?: string;
  certificateType: string;
  issueDate?: string;
  graduationYear?: number;
  cgpaOrGrade?: string;
  registeredBy: string;
  registrationNotes?: string;
  documentUrl?: string;
}): Promise<CertificateRecord> {
  const yearStr = legacyData.issueDate ? legacyData.issueDate.split('-')[0] : String(new Date().getFullYear());
  const id = `TL-LEGACY-${yearStr}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const graduationYear = legacyData.graduationYear || Number(yearStr) || new Date().getFullYear();
  const issueDate = legacyData.issueDate || `${yearStr}-01-01`;
  const institutionCode = legacyData.institutionCode || 'INST-' + Math.floor(1000 + Math.random() * 9000);
  const registerNumber = legacyData.registerNumber || 'LEGACY-' + Math.floor(10000 + Math.random() * 90000);
  const course = legacyData.course || legacyData.eventName || legacyData.certificateType;

  const hash = computeCertHash({
    id,
    studentName: legacyData.studentName,
    registerNumber,
    institution: legacyData.institution,
    course,
    graduationYear,
  });

  const blockchainHash = '0x' + hash;
  const digitalSignature = generateDigitalSignature(blockchainHash);
  const blockNumber = Math.floor(4800000 + Math.random() * 200000);
  const transactionId = '0x' + crypto.randomBytes(32).toString('hex');
  const issuerPublicKey = '0x' + crypto.randomBytes(24).toString('hex');

  const qrPayload = JSON.stringify({
    trustlink: true,
    certificateId: id,
    source: 'LEGACY_REGISTERED',
    studentName: legacyData.studentName,
    registerNumber,
    institution: legacyData.institution,
    certificateType: legacyData.certificateType,
    hash: blockchainHash,
    verifyUrl: `https://trustlink.edu/verify/${id}`,
  });

  const qrCodeUrl = await QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
    color: { dark: '#0284c7', light: '#ffffff' },
  });

  const record: CertificateRecord = {
    id,
    certificateId: id,
    studentName: legacyData.studentName,
    registerNumber,
    institution: legacyData.institution,
    institutionCode,
    course,
    degree: legacyData.degree || legacyData.certificateType,
    department: legacyData.department || '',
    eventName: legacyData.eventName || '',
    cgpaOrGrade: legacyData.cgpaOrGrade || 'N/A',
    graduationYear,
    issueDate,
    certificateType: legacyData.certificateType,
    source: 'LEGACY_REGISTERED',
    status: 'active',
    blockchainHash,
    transactionId,
    blockNumber,
    digitalSignature,
    issuerPublicKey,
    qrCodeUrl,
    documentUrl: legacyData.documentUrl || '',
    registeredBy: legacyData.registeredBy,
    registrationNotes: legacyData.registrationNotes || 'Legacy certificate verified and registered into TrustLink registry by authorized institution registrar.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'certificates', id), record);

  await logAuditTrail({
    action: 'REGISTER_LEGACY_CERTIFICATE',
    entityType: 'certificate',
    entityId: id,
    actorRole: 'institution',
    actorEmail: legacyData.registeredBy,
    details: `Registered legacy certificate (${legacyData.certificateType}) for ${legacyData.studentName} issued by ${legacyData.institution}`,
  });

  return record;
}

export async function revokeCertificateInDb(id: string, reason: string, revokedBy: string): Promise<CertificateRecord> {
  const cert = await getCertificateById(id);
  if (!cert) {
    throw new Error('Certificate not found');
  }

  const revokedAt = new Date().toISOString();
  const updatedCert: CertificateRecord = {
    ...cert,
    status: 'revoked',
    revokedAt,
    revokedBy: revokedBy || 'Authorized Official',
    revocationReason: reason || 'Revoked by Issuing Institution',
    updatedAt: revokedAt,
  };

  await setDoc(doc(db, 'certificates', id), updatedCert);

  // Log audit
  await logAuditTrail({
    action: 'REVOKE_CERTIFICATE',
    entityType: 'certificate',
    entityId: id,
    actorRole: 'institution',
    actorEmail: revokedBy || 'admin@institution.edu',
    details: `Certificate revoked. Reason: ${reason}`,
  });

  return updatedCert;
}

export async function logVerificationEvent(event: Omit<VerificationLogRecord, 'verificationId' | 'date' | 'timestamp'> & { verificationId?: string }): Promise<VerificationLogRecord> {
  const verificationId = event.verificationId || `VFY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const date = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  const record: VerificationLogRecord = {
    ...event,
    verificationId,
    date,
    timestamp: now.toISOString(),
  };

  await setDoc(doc(db, 'verification_history', verificationId), record);
  return record;
}

export async function getVerificationHistoryList(params?: {
  status?: string;
  search?: string;
  institution?: string;
  limitCount?: number;
}): Promise<VerificationLogRecord[]> {
  const col = collection(db, 'verification_history');
  const snap = await getDocs(col);
  let list = snap.docs.map((d) => d.data() as VerificationLogRecord);

  // Sort by timestamp descending
  list.sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());

  if (params?.status && params.status !== 'all') {
    list = list.filter((item) => item.status?.toUpperCase() === params.status?.toUpperCase() || item.overallStatus?.toUpperCase() === params.status?.toUpperCase());
  }

  if (params?.search) {
    const s = params.search.toLowerCase();
    list = list.filter((item) =>
      item.studentName?.toLowerCase().includes(s) ||
      item.certificateId?.toLowerCase().includes(s) ||
      item.institution?.toLowerCase().includes(s) ||
      item.course?.toLowerCase().includes(s)
    );
  }

  if (params?.institution) {
    const inst = params.institution.toLowerCase();
    list = list.filter((item) => item.institution?.toLowerCase().includes(inst));
  }

  if (params?.limitCount) {
    list = list.slice(0, params.limitCount);
  }

  return list;
}

export async function logAuditTrail(audit: {
  action: string;
  entityType: string;
  entityId: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  details: string;
}) {
  const logId = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  await setDoc(doc(db, 'audit_logs', logId), {
    ...audit,
    logId,
    timestamp: new Date().toISOString(),
  });
}

export async function getSystemStats() {
  const certs = await getAllCertificates();
  const history = await getVerificationHistoryList();

  const totalCertificates = certs.length;
  const activeCertificates = certs.filter((c) => c.status === 'active').length;
  const revokedCertificates = certs.filter((c) => c.status === 'revoked').length;

  const totalVerifications = history.length;
  const verifiedCount = history.filter((h) => h.status === 'VERIFIED' || h.overallStatus === 'VERIFIED').length;
  const suspiciousCount = history.filter((h) => h.status === 'SUSPICIOUS' || h.overallStatus === 'SUSPICIOUS').length;
  const invalidCount = history.filter((h) => h.status === 'INVALID' || h.overallStatus === 'INVALID' || h.status === 'REVOKED' || h.overallStatus === 'REVOKED').length;

  const successRate = totalVerifications > 0 ? ((verifiedCount / totalVerifications) * 100).toFixed(1) : '99.2';

  return {
    totalCertificates,
    activeCertificates,
    revokedCertificates,
    totalVerifications,
    verifiedCount,
    suspiciousCount,
    invalidCount,
    successRate: `${successRate}%`,
    averageVerificationTime: '1.2s',
    ledgerBlockHeight: 4892104 + totalCertificates,
    lastBlockTime: new Date().toISOString(),
  };
}
