import { analyze } from "../analyze.js";
import { sampleIdentityRiskEvidence } from "../data/sampleIdentityRiskEvidence.js";

const report = analyze(sampleIdentityRiskEvidence, { now: "2026-05-31T08:00:00Z" });

export function summary() {
  const highFindings = report.findingsList.filter((item) => item.severity === "high").length;
  return {
    systems: report.systems,
    currentSnapshots: report.currentSnapshots,
    packets: report.packets,
    blockingPackets: report.blockingPackets,
    exposedAccounts: report.exposedAccounts,
    evidenceScore: report.evidenceScore,
    highFindings,
    recommendation:
      "Tighten privileged access review, guest exposure, service-account ownership, and MFA coverage before presenting identity posture as diligence-ready."
  };
}

export function identityLane() {
  return [
    {
      lane: "Privileged access lane",
      owner: "Identity operations lead",
      status: "red",
      relatedFindings: 2,
      focus: "Reduce standing admin exposure and move role reviews back onto a current cadence.",
      nextAction: "Publish a role reduction memo and exception path for emergency access.",
      note: "Privileged access is the first board-level trust signal to harden."
    },
    {
      lane: "Guest exposure lane",
      owner: "Security governance",
      status: "red",
      relatedFindings: 1,
      focus: "Bound external collaboration rights and document the recertification path.",
      nextAction: "Collapse stale guest groups and tie owners back to real business sponsors.",
      note: "Guest sprawl is visible enough to weaken the investor story fast."
    },
    {
      lane: "Service account lane",
      owner: "IAM engineering",
      status: "red",
      relatedFindings: 1,
      focus: "Attach named owners, rotation evidence, and review lineage to nonhuman identities.",
      nextAction: "Retire shared secrets and create a clean nonhuman identity registry.",
      note: "Ownerless service accounts create hidden risk and audit drag."
    },
    {
      lane: "Board evidence lane",
      owner: "Security governance",
      status: "yellow",
      relatedFindings: 2,
      focus: "Move certification evidence and vendor admin proof onto one governed narrative path.",
      nextAction: "Replace stitched attestations with one current evidence packet.",
      note: "Leadership needs a cleaner memo than manual screenshots and review exports."
    }
  ];
}

export function riskEvidence() {
  const order = { high: 0, medium: 1, low: 2, info: 3 } as const;
  return report.findingsList
    .map((finding) => ({
      ...finding,
      owner:
        finding.scope === "IDENTITY_LAYER"
          ? "Identity operations lead"
          : finding.scope === "DIRECTORY_LAYER"
            ? "IAM engineering"
            : "Security governance"
    }))
    .sort((a, b) => order[a.severity] - order[b.severity] || a.code.localeCompare(b.code));
}

export function boardMemo() {
  return [
    {
      packetId: "IRL-11",
      lane: "Privileged access",
      completenessScore: 58,
      status: "red",
      blocker: "Standing admin assignments remain visible and the exception path is not tightly bounded.",
      owner: "Identity operations lead",
      decisionNote: "The board can fund access reduction and automation if the owner map is attached to the memo.",
      launchWindowHours: 72
    },
    {
      packetId: "IRL-18",
      lane: "Guest exposure",
      completenessScore: 64,
      status: "red",
      blocker: "Guest collaboration rights are broader than the current diligence story implies.",
      owner: "Security governance",
      decisionNote: "External access can be defended only after stale guest groups and orphaned sponsors are removed.",
      launchWindowHours: 96
    },
    {
      packetId: "IRL-24",
      lane: "Service accounts",
      completenessScore: 61,
      status: "red",
      blocker: "Ownerless nonhuman identities and shared secret drift remain unresolved.",
      owner: "IAM engineering",
      decisionNote: "This is an invest-now lane because the control gap is material and the fix path is concrete.",
      launchWindowHours: 84
    },
    {
      packetId: "IRL-31",
      lane: "Board evidence",
      completenessScore: 73,
      status: "yellow",
      blocker: "Certification evidence still depends on manual stitching and stale vendor-admin proof.",
      owner: "Security governance",
      decisionNote: "Leadership can tell a stronger story once review coverage and vendor trust are on one governed path.",
      launchWindowHours: 48
    }
  ];
}

export function verification() {
  return [
    "Synthetic sample data only - no live tenant credentials, directory exports, or privileged sessions are shipped.",
    "Identity findings come from modeled review packets, not hidden production admin data.",
    "The ledger is read-only and built for executive review, board memo prep, and diligence packaging.",
    "Every score and finding is reproducible from the exported identity-risk packets.",
    "Board-facing conclusions stay bounded to the synthetic evidence shown in this repo."
  ];
}

export function payload() {
  return {
    generatedAt: report.generatedAt,
    summary: summary(),
    identityLane: identityLane(),
    riskEvidence: riskEvidence(),
    boardMemo: boardMemo(),
    verification: verification(),
    sample: sampleIdentityRiskEvidence
  };
}
