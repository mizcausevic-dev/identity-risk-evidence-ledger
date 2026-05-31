import type { EvidenceSnapshot, Finding, IdentityRiskEvidenceExport, PostureOptions, PostureReport } from "./types.js";

function isCurrent(snapshot: EvidenceSnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: IdentityRiskEvidenceExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const stalePacketAfterHours = options.stalePacketAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const packets = payload.packets ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-evidence-snapshot",
      severity: "high",
      message: "No current identity-risk evidence snapshot is available for executive review.",
      subject: "evidence-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-evidence-snapshot",
        severity: snapshot.riskStatus === "CRITICAL" ? "high" : "medium",
        message: `Evidence snapshot for "${snapshot.name}" is stale and should not anchor a board memo without refresh.`,
        subject: snapshot.id,
        subjectName: snapshot.reviewPath,
        scope: snapshot.scope
      });
    }
  }

  for (const packet of packets) {
    const observed = packet.observedState.toLowerCase();

    if (
      packet.evidenceFamily === "PrivilegedAccess" &&
      includesAny(observed, ["unreviewed", "standing admin", "global admin", "privileged role drift"])
    ) {
      findingsList.push({
        code: "privileged-access-unreviewed",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `Privileged access on "${packet.resourcePath}" is not review-safe enough for board or diligence use.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (
      packet.evidenceFamily === "GuestExposure" &&
      includesAny(observed, ["guest sprawl", "external users", "b2b drift", "unbounded guest"])
    ) {
      findingsList.push({
        code: "guest-access-unbounded",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `Guest access on "${packet.resourcePath}" is too open to support a clean investor narrative.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (
      packet.evidenceFamily === "ServiceAccountDrift" &&
      includesAny(observed, ["ownerless", "shared secret", "orphaned account", "nonhuman drift"])
    ) {
      findingsList.push({
        code: "service-account-ownerless",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `Service-account evidence on "${packet.resourcePath}" is weak enough to create hidden identity risk.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (
      packet.evidenceFamily === "MfaCoverage" &&
      includesAny(observed, ["mfa gap", "legacy auth", "password only", "unprotected admins"])
    ) {
      findingsList.push({
        code: "mfa-gap-exposed",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `MFA coverage on "${packet.resourcePath}" is weaker than the board story suggests.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (
      packet.evidenceFamily === "VendorTrust" &&
      includesAny(observed, ["missing evidence", "vendor admin blind spot", "contractor access", "unverified control"])
    ) {
      findingsList.push({
        code: "vendor-trust-evidence-missing",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `Vendor trust evidence on "${packet.resourcePath}" is too thin for diligence-ready identity claims.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (
      packet.evidenceFamily === "ReviewCoverage" &&
      includesAny(observed, ["coverage gap", "late attestation", "ownerless review", "manual certification"])
    ) {
      findingsList.push({
        code: "review-coverage-gap",
        severity: packet.blocksExecutiveReadiness ? "high" : "medium",
        message: `Review coverage on "${packet.resourcePath}" is too incomplete to support executive signoff.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }

    if (packet.riskWindowHours > stalePacketAfterHours) {
      findingsList.push({
        code: "long-lived-risk-window",
        severity: packet.riskWindowHours > stalePacketAfterHours * 2 ? "medium" : "low",
        message: `Identity-risk packet on "${packet.resourcePath}" has remained open for ${packet.riskWindowHours} hours.`,
        subject: packet.id,
        subjectName: packet.resourcePath,
        scope: packet.scope,
        evidenceFamily: packet.evidenceFamily
      });
    }
  }

  const blockingPackets = packets.filter((packet) => packet.blocksExecutiveReadiness).length;
  const criticalPackets = packets.filter((packet) => packet.status === "DEGRADED").length;
  const privilegedPackets = packets.filter((packet) => packet.evidenceFamily === "PrivilegedAccess").length;
  const guestPackets = packets.filter((packet) => packet.evidenceFamily === "GuestExposure").length;
  const exposedAccounts = packets.reduce((sum, packet) => sum + packet.exposedAccounts, 0);
  const avgExposure =
    snapshots.length > 0 ? snapshots.reduce((sum, snapshot) => sum + snapshot.exposedAccountScore, 0) / snapshots.length : 100;
  const evidencePenalty = blockingPackets * 6 + findingsList.filter((item) => item.severity === "high").length * 4;
  const evidenceScore = Math.max(0, Math.round(100 - avgExposure / 2 - evidencePenalty));
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    systems: snapshots.length,
    currentSnapshots,
    packets: packets.length,
    blockingPackets,
    criticalPackets,
    privilegedPackets,
    guestPackets,
    evidenceScore,
    exposedAccounts,
    findingsList,
    ok
  };
}
