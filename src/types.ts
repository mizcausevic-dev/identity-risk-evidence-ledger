export type ScopeKind =
  | "IDENTITY_LAYER"
  | "DIRECTORY_LAYER"
  | "APP_LAYER"
  | "VENDOR_LAYER"
  | "BOARD_LAYER";

export type RiskHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type PacketStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type EvidenceFamily =
  | "PrivilegedAccess"
  | "GuestExposure"
  | "ReviewCoverage"
  | "ServiceAccountDrift"
  | "MfaCoverage"
  | "VendorTrust"
  | "LifecycleControl"
  | "BoardReporting";

export interface EvidenceSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  riskStatus: RiskHealth;
  snapshotStatus: SnapshotStatus;
  reviewPath: string;
  owner: string;
  exposedAccountScore: number;
  collectedAt: string;
}

export interface IdentityRiskPacket {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  evidenceFamily: EvidenceFamily;
  status: PacketStatus;
  expectedState: string;
  observedState: string;
  riskWindowHours: number;
  exposedAccounts: number;
  blocksExecutiveReadiness?: boolean;
  note?: string;
}

export interface IdentityRiskEvidenceExport {
  snapshots?: EvidenceSnapshot[];
  packets?: IdentityRiskPacket[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-evidence-snapshot"
  | "stale-evidence-snapshot"
  | "privileged-access-unreviewed"
  | "guest-access-unbounded"
  | "service-account-ownerless"
  | "mfa-gap-exposed"
  | "vendor-trust-evidence-missing"
  | "review-coverage-gap"
  | "long-lived-risk-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  evidenceFamily?: EvidenceFamily;
}

export interface PostureReport {
  generatedAt: string;
  systems: number;
  currentSnapshots: number;
  packets: number;
  blockingPackets: number;
  criticalPackets: number;
  privilegedPackets: number;
  guestPackets: number;
  evidenceScore: number;
  exposedAccounts: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  stalePacketAfterHours?: number;
}
