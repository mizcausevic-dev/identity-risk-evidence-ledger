import type { IdentityRiskEvidenceExport } from "../types.js";

export const sampleIdentityRiskEvidence: IdentityRiskEvidenceExport = {
  snapshots: [
    {
      id: "entra-privileged-access",
      name: "Entra privileged access",
      scope: "IDENTITY_LAYER",
      riskStatus: "CRITICAL",
      snapshotStatus: "CURRENT",
      reviewPath: "roles/reviews/mfa",
      owner: "Identity operations lead",
      exposedAccountScore: 76,
      collectedAt: "2026-05-31T07:00:00Z"
    },
    {
      id: "okta-lifecycle-admin",
      name: "Okta lifecycle admin",
      scope: "DIRECTORY_LAYER",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      reviewPath: "lifecycle/service-accounts",
      owner: "IAM engineering",
      exposedAccountScore: 63,
      collectedAt: "2026-05-31T07:00:00Z"
    },
    {
      id: "vendor-admin-footprint",
      name: "Vendor admin footprint",
      scope: "VENDOR_LAYER",
      riskStatus: "WATCH",
      snapshotStatus: "STALE",
      reviewPath: "vendors/contractors/external-admins",
      owner: "Security governance",
      exposedAccountScore: 58,
      collectedAt: "2026-05-27T07:00:00Z"
    }
  ],
  packets: [
    {
      id: "PKT-11",
      snapshotId: "entra-privileged-access",
      resourcePath: "global-admin-review-cycle",
      scope: "IDENTITY_LAYER",
      evidenceFamily: "PrivilegedAccess",
      status: "DEGRADED",
      expectedState: "time-bound privileged roles with current owner review",
      observedState: "standing admin assignments with unreviewed privileged role drift",
      riskWindowHours: 72,
      exposedAccounts: 19,
      blocksExecutiveReadiness: true,
      note: "Standing access weakens the board story around identity discipline."
    },
    {
      id: "PKT-18",
      snapshotId: "entra-privileged-access",
      resourcePath: "guest-b2b-collaboration-ring",
      scope: "IDENTITY_LAYER",
      evidenceFamily: "GuestExposure",
      status: "CHANGED",
      expectedState: "bounded guest groups with quarterly recertification",
      observedState: "guest sprawl across external users with unbounded guest permissions",
      riskWindowHours: 41,
      exposedAccounts: 67,
      blocksExecutiveReadiness: true,
      note: "External access is broad enough to complicate diligence narratives."
    },
    {
      id: "PKT-24",
      snapshotId: "okta-lifecycle-admin",
      resourcePath: "service-account-registry",
      scope: "DIRECTORY_LAYER",
      evidenceFamily: "ServiceAccountDrift",
      status: "DEGRADED",
      expectedState: "named owners and rotation evidence for nonhuman accounts",
      observedState: "ownerless service accounts with shared secret drift across critical integrations",
      riskWindowHours: 63,
      exposedAccounts: 28,
      blocksExecutiveReadiness: true,
      note: "Nonhuman identities are not traceable enough for investor diligence."
    },
    {
      id: "PKT-31",
      snapshotId: "entra-privileged-access",
      resourcePath: "admin-mfa-coverage",
      scope: "IDENTITY_LAYER",
      evidenceFamily: "MfaCoverage",
      status: "DEGRADED",
      expectedState: "MFA enforced for all privileged and emergency access paths",
      observedState: "mfa gap on legacy auth path with unprotected admins still visible",
      riskWindowHours: 88,
      exposedAccounts: 11,
      blocksExecutiveReadiness: true,
      note: "MFA language would be overstated in a board memo today."
    },
    {
      id: "PKT-37",
      snapshotId: "vendor-admin-footprint",
      resourcePath: "contractor-admin-evidence",
      scope: "VENDOR_LAYER",
      evidenceFamily: "VendorTrust",
      status: "CHANGED",
      expectedState: "documented admin access evidence for vendors and contractors",
      observedState: "missing evidence on vendor admin blind spot and unverified control attestations",
      riskWindowHours: 29,
      exposedAccounts: 14,
      blocksExecutiveReadiness: false,
      note: "The vendor trust story is incomplete even if direct risk is still moderate."
    },
    {
      id: "PKT-42",
      snapshotId: "okta-lifecycle-admin",
      resourcePath: "quarterly-certification-board-pack",
      scope: "BOARD_LAYER",
      evidenceFamily: "ReviewCoverage",
      status: "CHANGED",
      expectedState: "current certification evidence with owner, exception, and remediation lineage",
      observedState: "coverage gap with late attestation and manual certification stitching",
      riskWindowHours: 18,
      exposedAccounts: 7,
      blocksExecutiveReadiness: false,
      note: "The pack exists, but it is still too manual to be board-safe by default."
    }
  ]
};
