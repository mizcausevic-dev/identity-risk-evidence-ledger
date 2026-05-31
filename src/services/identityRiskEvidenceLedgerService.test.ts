import { describe, expect, it } from "vitest";

import { boardMemo, identityLane, payload, riskEvidence, summary, verification } from "./identityRiskEvidenceLedgerService.js";

describe("identityRiskEvidenceLedgerService", () => {
  it("returns summary metrics", () => {
    expect(summary().systems).toBe(3);
    expect(summary().exposedAccounts).toBeGreaterThan(0);
  });

  it("returns one identity-lane item per executive lane", () => {
    expect(identityLane()).toHaveLength(4);
  });

  it("sorts high findings first", () => {
    const findings = riskEvidence();
    expect(findings[0]?.severity).toBe("high");
  });

  it("returns board memo packets", () => {
    expect(boardMemo()).toHaveLength(4);
  });

  it("returns verification claims and payload", () => {
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
