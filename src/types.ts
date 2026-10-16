export type VerificationStatus =
  | 'VERIFIED'
  | 'REVOKED'
  | 'INVALID'
  | 'SUSPICIOUS'
  | 'NOT_REGISTERED'
  | 'UNVERIFIABLE'
  | 'NEEDS_MANUAL_REVIEW'
  | 'EXPIRED'
  | 'BLOCKCHAIN_NOT_CONFIGURED'
  | 'NOT VERIFIED' // backward compatibility alias
  | 'ERROR'
  | 'PROCESSING';

export type VerificationConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIABLE';

export type CertificateSource = 'TRUSTLINK_NATIVE' | 'LEGACY_REGISTERED' | 'EXTERNAL_UNREGISTERED';

export type UniversalDocumentType =
  | 'ACADEMIC_CERTIFICATE'
  | 'DEGREE_CERTIFICATE'
  | 'DIPLOMA'
  | 'MARKSHEET'
  | 'TRANSCRIPT'
  | 'INTERNSHIP_CERTIFICATE'
  | 'COURSE_CERTIFICATE'
  | 'TRAINING_CERTIFICATE'
  | 'PARTICIPATION_CERTIFICATE'
  | 'HACKATHON_CERTIFICATE'
  | 'ACHIEVEMENT_CERTIFICATE'
  | 'EXPERIENCE_LETTER'
  | 'OFFER_LETTER'
  | 'APPOINTMENT_LETTER'
  | 'EMPLOYMENT_DOCUMENT'
  | 'INVOICE'
  | 'RECEIPT'
  | 'AGREEMENT'
  | 'CONTRACT'
  | 'LICENSE'
  | 'PERMIT'
  | 'OFFICIAL_LETTER'
  | 'OTHER'
  | 'UNKNOWN_DOCUMENT';

export type DocumentCategory =
  | 'Academic & Educational'
  | 'Employment & Career'
  | 'Commercial & Financial'
  | 'Legal & Contractual'
  | 'Government & Official'
  | 'Other';

export type CertificateType = UniversalDocumentType | string;

export type UserRole = 'student' | 'institution' | 'employer' | 'admin';

export interface AcademicCertificateData {
  studentName: string;
  registerNumber: string;
  institution: string;
  institutionCode?: string;
  course: string;
  degree?: string;
  department?: string;
  eventName?: string;
  cgpaOrGrade?: string;
  graduationYear?: number | string;
  issueDate?: string;
}

export interface MarksheetSubject {
  code?: string;
  name: string;
  maxMarks?: number;
  obtainedMarks: number | string;
  grade?: string;
  status?: string;
}

export interface MarksheetData {
  studentName: string;
  registerNumber: string;
  institution: string;
  semester?: string;
  academicYear?: string;
  subjects: MarksheetSubject[];
  totalMarks?: number | string;
  maxTotalMarks?: number | string;
  percentage?: number | string;
  cgpa?: string;
  resultStatus?: 'PASS' | 'FAIL' | 'DISTINCTION' | string;
}

export interface TranscriptCourse {
  code: string;
  title: string;
  credits: number;
  grade: string;
  points?: number;
}

export interface TranscriptSemester {
  semesterName: string;
  gpa: number;
  courses: TranscriptCourse[];
}

export interface TranscriptData {
  studentName: string;
  registerNumber: string;
  institution: string;
  program: string;
  gpa?: number | string;
  cgpa?: string;
  totalCredits?: number;
  semesters?: TranscriptSemester[];
}

export interface ExperienceLetterData {
  employeeName: string;
  companyName: string;
  designation: string;
  department?: string;
  employeeId?: string;
  joiningDate: string;
  relievingDate: string;
  employmentDuration?: string;
  employmentType?: string; // 'Full-Time' | 'Part-Time' | 'Contract'
  referenceNumber?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  conductSummary?: string;
}

export interface OfferLetterData {
  candidateName: string;
  companyName: string;
  position: string;
  joiningDate: string;
  compensation?: string;
  offerDate: string;
  validUntil?: string;
  offerReferenceNumber?: string;
  reportingManager?: string;
  workLocation?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  billerName: string;
  billerTaxId?: string;
  billerAddress?: string;
  clientName: string;
  clientTaxId?: string;
  clientAddress?: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  totalAmount: number;
  paymentStatus?: 'PAID' | 'DUE' | 'OVERDUE' | string;
}

export interface ReceiptData {
  receiptNumber: string;
  merchantName: string;
  merchantAddress?: string;
  customerName?: string;
  transactionDate: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  itemsDescription?: string;
  authCode?: string;
}

export interface AgreementData {
  agreementTitle: string;
  agreementNumber?: string;
  partyOne: string;
  partyTwo: string;
  effectiveDate: string;
  expiryDate?: string;
  jurisdiction?: string;
  governingLaw?: string;
  keyTerms?: string[];
  terminationClause?: string;
}

export interface LicensePermitData {
  holderName: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseType: string;
  issueDate: string;
  expiryDate?: string;
  validityStatus: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'REVOKED' | string;
  scopeOrRestrictions?: string;
  category?: string;
}

export interface OfficialLetterData {
  recipientName: string;
  issuingAuthority: string;
  subject: string;
  letterReference: string;
  date: string;
  summary: string;
  officialDesignation?: string;
}

export interface Certificate {
  id: string;
  certificateId: string;
  studentName: string;
  registerNumber: string;
  institution: string;
  institutionCode: string;
  course: string;
  degree: string;
  department?: string;
  eventName?: string;
  cgpaOrGrade: string;
  graduationYear: number;
  issueDate: string;
  certificateType: CertificateType;
  source?: CertificateSource;
  status: 'active' | 'revoked' | 'expired';
  blockchainHash: string;
  transactionId: string;
  blockNumber: number;
  digitalSignature: string;
  issuerPublicKey: string;
  qrCodeUrl?: string;
  documentUrl?: string;
  issuedBy?: string;
  revokedAt?: string;
  revocationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UniversalDocument {
  id: string;
  documentId: string;
  documentType: UniversalDocumentType;
  category: DocumentCategory;
  title: string;
  issuer: string;
  issuerCode?: string;
  issuerCategory?: string;
  recipientName: string;
  recipientIdentifier?: string;
  recipientEmail?: string;
  issueDate: string;
  expiryDate?: string | null;
  isExpired?: boolean;
  status: 'active' | 'revoked' | 'expired';
  source: CertificateSource;
  documentHash: string;
  digitalSignature: string;
  issuerPublicKey: string;
  qrCodeUrl?: string;
  qrPayload?: string;
  documentUrl?: string;
  issuedBy: string;
  registeredBy?: string;
  registrationNotes?: string;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
  extractedData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationCheck {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'info';
  label: string;
  details: string;
  confidence?: number;
}

export interface AiForgeryMetrics {
  genuinenessScore: number;
  documentStructure: 'Authentic' | 'Suspicious' | 'Irregular';
  fontConsistency: 'Passed' | 'Warning' | 'Failed';
  sealLogoAnalysis: 'Passed' | 'Warning' | 'Failed';
  textTampering: 'Not Detected' | 'Possible Tampering' | 'Tampering Detected';
  imageManipulation: 'Not Detected' | 'Inconsistent Noise' | 'Artifacts Detected';
  metadataAnalysis: 'Authentic' | 'Incomplete' | 'Tampered';
  layoutAnalysisScore: number;
  textConsistencyScore: number;
  fontAnalysisScore: number;
  logoSealScore: number;
  manipulationDetectionScore: number;
  metadataScore: number;
  summary: string;
  detectedAnomalies: string[];
  aiAnalysisAvailable?: boolean;
  observations?: string[];
  limitations?: string[];
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedDocumentType?: string;
  typeConfidence?: number;
}

export interface BlockchainVerificationInfo {
  status: string;
  network: string;
  contractAddress: string;
  blockNumber: number;
  transactionId: string;
  certificateHash: string;
  calculatedHash: string;
  timestamp: string;
  validatorNodes: number;
  merkleRoot: string;
  isAnchored?: boolean;
  timeline: {
    step: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface VerificationResult {
  verificationId: string;
  certificateId: string;
  documentId?: string;
  timestamp: string;
  overallStatus: VerificationStatus;
  verificationLevel: VerificationConfidenceLevel;
  sourceStatus: CertificateSource;
  certificateType: CertificateType;
  documentType?: UniversalDocumentType;
  documentTypeLabel?: string;
  documentCategory?: DocumentCategory;
  documentTypeConfidence?: number;
  title?: string;
  eventName?: string;
  genuinenessScore: number;
  evidenceScore?: number;
  studentName: string;
  recipientName?: string;
  registerNumber: string;
  recipientIdentifier?: string;
  institution: string;
  issuer?: string;
  issuerCategory?: string;
  course: string;
  graduationYear: number | string;
  degree?: string;
  department?: string;
  issueDate?: string;
  expiryDate?: string;
  isExpired?: boolean;
  cgpaOrGrade?: string;
  otherDetails?: string;
  isDemoData: boolean;
  demoLabel?: string;
  isRegisteredInTrustLink: boolean;
  manualReviewRecommended: boolean;
  evidenceAvailable: string[];
  evidenceMissing: string[];
  qrStatus: string;
  qrDetails: string;
  digitalSignatureStatus: string;
  digitalSignatureDetails: string;
  hashStatus?: string;
  blockchainInfo: BlockchainVerificationInfo;
  aiMetrics: AiForgeryMetrics;
  checks: VerificationCheck[];
  reasons: string[];
  recommendation: string;
  extractedFields?: Record<string, any>;
  typeSpecificData?: {
    certificate?: AcademicCertificateData;
    marksheet?: MarksheetData;
    transcript?: TranscriptData;
    experience?: ExperienceLetterData;
    offer?: OfferLetterData;
    invoice?: InvoiceData;
    receipt?: ReceiptData;
    agreement?: AgreementData;
    license?: LicensePermitData;
    officialLetter?: OfficialLetterData;
  };
  fileInfo?: {
    filename: string;
    fileSize: string;
    fileType: string;
    fileHash?: string;
  };
  ocrSuccess?: boolean;
  ocrErrorMessage?: string;
}

export interface VerificationHistoryItem {
  verificationId: string;
  certificateId: string;
  documentId?: string;
  documentType?: string;
  title?: string;
  studentName: string;
  recipientName?: string;
  institution: string;
  issuer?: string;
  course: string;
  certificateType?: string;
  date: string;
  status: VerificationStatus;
  overallStatus?: VerificationStatus;
  verificationLevel?: VerificationConfidenceLevel;
  genuinenessScore: number;
  evidenceScore?: number;
  verifiedByRole: string;
}

export interface ManualReviewRecord {
  reviewId: string;
  documentId?: string;
  documentType: string;
  title?: string;
  issuer?: string;
  recipientName?: string;
  requesterEmail: string;
  requesterRole: string;
  reason: string;
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';
  assignedReviewer?: string;
  reviewerNotes?: string;
  verificationSnapshot?: Partial<VerificationResult>;
  submittedAt: string;
  resolvedAt?: string;
}

export interface BatchVerificationItem {
  id: string;
  filename: string;
  fileSize: string;
  fileType: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: VerificationResult;
  error?: string;
}

export interface UserSession {
  role: UserRole;
  name: string;
  organization?: string;
  email: string;
  token: string;
}
